#!/usr/bin/env node
// ---------------------------------------------------------------------------
// sync-campaign-draft.js — calendar-independent Campaign HTML → Template →
// EXISTING Draft synchroniser.
//
//   LOCAL Campaign Output HTML  ->  resolve brand's Klaviyo account
//     ->  UPSERT template "Automation: <campaign_id>" (create/update, ID stable)
//     ->  FIND the EXISTING Draft for <campaign_id> (boundary-safe name match)
//     ->  GUARD: exactly one match AND status === "Draft"  (else STOP)
//     ->  attach the HTML template to that Draft's message  (+ refresh subject/preview)
//     ->  re-fetch + verify  ->  report.
//
// Mirrors the Flow project's proven pattern (deterministic name -> upsert ->
// verify -> stop) and REUSES the existing Campaign services — it rebuilds nothing:
//   • template upsert/assign  : template-service.attachHtmlToCampaign
//   • draft dedup match       : draft-campaign-service.campaignIdMatchesName
//   • subject/preview refresh : draft-campaign-service.updateDraftMessageMetadata
//   • HTML↔campaign_id map    : common/config.loadApprovedHtml
//   • sender/account          : klaviyo/config + common/env  (per-brand key)
//
// STRICTLY UPDATE-ONLY. It NEVER: creates a campaign/draft, sends, schedules,
// publishes, activates, changes audience/recipients, or changes timing. No
// send/schedule endpoint is referenced (the safety.js guard scans this file).
// If no Draft exists → STOP. If >1 Draft matches → STOP. If the matched campaign
// is not a Draft (Sent/Scheduled/Sending/…) → STOP without modifying anything.
//
// CLI:
//   node platform/integrations/klaviyo/sync-campaign-draft.js \
//        --brand SC --campaign SC-2026-LAUNCH-everyday-mobility-accessories [--file <path>] [--dry-run]
// ---------------------------------------------------------------------------

'use strict';

const path = require('path');
const fs = require('fs');
const { REPO_ROOT, loadApprovedHtml } = require('../../common/config');
const { ConfigError, PlatformError, ApprovalRequired } = require('../../common/errors');
const { loadKlaviyoConfig } = require('./config');
const { parseEnvFile, resolveVar } = require('../../common/env');
const { KlaviyoClient } = require('./client');
const { createTemplateService, templateNameFor } = require('./template-service');
const { createDraftCampaignService, campaignIdMatchesName, campaignUrl } = require('./draft-campaign-service');

// Minimal stubs so createDraftCampaignService() passes its constructor validation.
// We only call updateDraftMessageMetadata(), which uses the client alone — these
// stubs are never invoked.
const METADATA_STUBS = {
  calendarService: { getNextCampaign: async () => null, getCampaignByWeek: async () => null, listCampaigns: async () => [] },
  listService: { resolveByName: async () => null },
  segmentService: { resolveByName: async () => null },
};

function brandPrefixOf(campaignId) {
  const m = String(campaignId || '').match(/^([A-Za-z]+)-/);
  return m ? m[1].toUpperCase() : null;
}

// Read ALL email campaigns (name,status) with pagination — so we can distinguish
// "no match", "match but not Draft", and "multiple Draft matches" precisely.
async function listEmailCampaigns(client) {
  const flt = encodeURIComponent("equals(messages.channel,'email')");
  let url = `/campaigns/?filter=${flt}&sort=-created_at&fields[campaign]=name,status`;
  const out = [];
  let guard = 0;
  while (url && guard++ < 40) {
    const json = await client.get(url);
    if (json && Array.isArray(json.data)) out.push(...json.data);
    const next = json && json.links && json.links.next;
    url = next ? next.replace(/^https:\/\/a\.klaviyo\.com\/api/, '') : null;
  }
  return out;
}

// Resolve the HTML source: explicit --file wins; else config/approved-html.json.
function resolveHtmlSource({ campaignId, filePath, repoRoot }) {
  if (filePath) {
    const abs = path.isAbsolute(filePath) ? filePath : path.join(repoRoot, filePath);
    if (!fs.existsSync(abs)) throw new ConfigError(`--file not found: ${abs}`, { path: abs });
    return { abs, html: fs.readFileSync(abs, 'utf8'), subject: null, previewText: null, source: `--file (${path.relative(repoRoot, abs).split(path.sep).join('/')})` };
  }
  const appr = loadApprovedHtml(campaignId, { repoRoot });
  if (!appr) {
    throw new ApprovalRequired(
      `No --file given and no config/approved-html.json entry for "${campaignId}". ` +
        'Register the Output HTML there or pass --file <path>. Nothing changed.'
    );
  }
  if (!fs.existsSync(appr.htmlPath)) {
    throw new ConfigError(`approved-html.json points at a missing file for "${campaignId}": ${appr.htmlRel}`, { path: appr.htmlPath });
  }
  return { abs: appr.htmlPath, html: fs.readFileSync(appr.htmlPath, 'utf8'), subject: appr.subject, previewText: appr.previewText, source: `approved-html.json (${appr.htmlRel})` };
}

// Core, dependency-injectable so tests run offline (pass `client` and/or `html`).
async function syncCampaignDraft({
  brand,
  campaignId,
  filePath = null,
  html = null,
  subject = null,
  previewText = null,
  client = null,
  repoRoot = REPO_ROOT,
  logger = null,
  dryRun = false,
  clientFactory = null,
} = {}) {
  const code = String(brand || '').toUpperCase().trim();
  if (!code) throw new ConfigError('sync requires --brand.');
  if (!campaignId) throw new ConfigError('sync requires --campaign <campaign_id>.');

  // Brand isolation: the campaign_id prefix must match the requested brand, so a
  // cross-brand id can never be pushed to the wrong account.
  const idBrand = brandPrefixOf(campaignId);
  if (idBrand && idBrand !== code) {
    throw new ConfigError(`campaign_id "${campaignId}" is brand ${idBrand}, not ${code} — refusing cross-brand sync.`, { brand: code, idBrand });
  }

  const cfg = loadKlaviyoConfig(code); // throws for an unknown brand

  // Build the brand's own client (unless one is injected for tests).
  if (!client) {
    if (!cfg.hasApiKey) {
      throw new ConfigError(`Klaviyo API key not set for ${code} (${cfg.apiKeyEnvVar} in ${cfg.envPath}).`, { envVar: cfg.apiKeyEnvVar });
    }
    const apiKey = resolveVar(parseEnvFile(cfg.envPath ? path.join(repoRoot, cfg.envPath) : null), cfg.apiKeyEnvVar);
    client = clientFactory
      ? clientFactory({ apiBaseUrl: cfg.apiBaseUrl, revision: cfg.revision, apiKey, logger })
      : new KlaviyoClient({ apiBaseUrl: cfg.apiBaseUrl, revision: cfg.revision, apiKey, logger, timeoutMs: 30000 });
  }

  // Resolve the HTML (unless injected).
  let src;
  if (html != null) {
    src = { abs: filePath || '(injected)', html, subject, previewText, source: 'injected' };
  } else {
    src = resolveHtmlSource({ campaignId, filePath, repoRoot });
    if (subject != null) src.subject = subject;
    if (previewText != null) src.previewText = previewText;
  }
  if (!src.html || !src.html.trim()) throw new ConfigError('Campaign HTML is empty — refusing to sync.');

  // Identify the EXISTING draft with precise STOP conditions.
  const camps = await listEmailCampaigns(client);
  const matches = camps.filter((c) => c && c.attributes && campaignIdMatchesName(c.attributes.name, campaignId));
  const drafts = matches.filter((c) => c.attributes.status === 'Draft');

  if (matches.length === 0) {
    throw new ApprovalRequired(
      `No existing Klaviyo campaign found for "${campaignId}" in the ${code} account. ` +
        'This command updates an EXISTING Draft only — it will not create one. Nothing changed.'
    );
  }
  if (drafts.length === 0) {
    const statuses = [...new Set(matches.map((c) => c.attributes.status))].join(', ');
    throw new ApprovalRequired(
      `Found ${matches.length} campaign(s) matching "${campaignId}" but NONE are Draft (status: ${statuses}). ` +
        'Refusing to modify a Sent/Scheduled/Sending campaign. Nothing changed.'
    );
  }
  if (drafts.length > 1) {
    throw new ApprovalRequired(
      `AMBIGUOUS: ${drafts.length} Draft campaigns match "${campaignId}" (${drafts.map((d) => d.id).join(', ')}). ` +
        'Refusing to guess which to update. Resolve the duplicate in Klaviyo, then re-run. Nothing changed.'
    );
  }
  const draftId = drafts[0].id;

  // Defensive re-read of the single target's status right before any write.
  const pre = await client.get(`/campaigns/${encodeURIComponent(draftId)}/?fields[campaign]=name,status`);
  const preStatus = pre && pre.data && pre.data.attributes && pre.data.attributes.status;
  if (preStatus !== 'Draft') {
    throw new ApprovalRequired(`Campaign ${draftId} status is "${preStatus}", not Draft — refusing to modify. Nothing changed.`);
  }

  if (dryRun) {
    return {
      ok: true, dryRun: true, brand: code, campaignId, draftId, draftName: pre.data.attributes.name,
      status: preStatus, htmlBytes: src.html.length, htmlSource: src.source,
      templateName: templateNameFor(campaignId),
      wouldRefreshSubject: src.subject || null, wouldRefreshPreview: src.previewText || null,
      note: 'DRY RUN — nothing written.',
    };
  }

  // 1) Upsert template (create/update, ID stable) + assign to the draft message.
  const templateService = createTemplateService({ client, logger });
  const attach = await templateService.attachHtmlToCampaign({
    campaignId: draftId,
    templateName: templateNameFor(campaignId),
    html: src.html,
  });

  // 2) Refresh subject/preview ONLY when supplied (never sender/audience/schedule).
  let meta = null;
  if (src.subject != null || src.previewText != null) {
    const draftService = createDraftCampaignService({ client, ...METADATA_STUBS, logger });
    meta = await draftService.updateDraftMessageMetadata({ campaignId: draftId, subject: src.subject, previewText: src.previewText });
  }

  // 3) Verify-after-write (never trust a 2xx alone).
  const v = await client.get(`/campaigns/${encodeURIComponent(draftId)}/?fields[campaign]=name,status,audiences`);
  const va = (v && v.data && v.data.attributes) || {};
  const camps2 = await listEmailCampaigns(client);
  const dupCount = camps2.filter((c) => c.attributes && c.attributes.status === 'Draft' && campaignIdMatchesName(c.attributes.name, campaignId)).length;
  const noSchedule = !('send_strategy' in va && va.send_strategy);
  const verified = va.status === 'Draft' && attach.verified === true && dupCount === 1 && noSchedule;

  return {
    ok: verified,
    brand: code,
    campaignId,
    draftId,
    draftName: va.name,
    status: va.status,
    templateName: templateNameFor(campaignId),
    assignedTemplateId: attach.assignedTemplateId,
    htmlBytes: attach.htmlLength,
    htmlSource: src.source,
    subjectRefreshed: meta ? meta.subject : null,
    previewRefreshed: meta ? meta.previewText : null,
    audienceIncluded: va.audiences ? va.audiences.included : null, // reported, NEVER modified
    duplicateDraftCount: dupCount,
    noSchedule,
    verified,
    url: campaignUrl(draftId),
    sendStatus: 'NOT_APPROVED_TO_SEND',
  };
}

// ── CLI ─────────────────────────────────────────────────────────────────────
function parseArgs(argv) {
  const o = { dryRun: false };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--brand') o.brand = argv[++i];
    else if (a === '--campaign') o.campaignId = argv[++i];
    else if (a === '--file') o.filePath = argv[++i];
    else if (a === '--subject') o.subject = argv[++i];
    else if (a === '--preview') o.previewText = argv[++i];
    else if (a === '--dry-run') o.dryRun = true;
    else if (a === '--help' || a === '-h') o.help = true;
  }
  return o;
}

function printHelp() {
  /* eslint-disable no-console */
  console.log(`Campaign → Klaviyo Template + EXISTING Draft synchroniser (UPDATE-ONLY).

Usage:
  node platform/integrations/klaviyo/sync-campaign-draft.js --brand <CODE> --campaign <campaign_id> [--file <path>] [--dry-run]

Safe by construction: updates the existing Draft only. Never creates a draft,
never sends/schedules/publishes, never changes audience. STOPS if no Draft, if
>1 Draft matches, or if the matched campaign is not a Draft.`);
  /* eslint-enable no-console */
}

async function main() {
  const o = parseArgs(process.argv.slice(2));
  if (o.help || !o.brand || !o.campaignId) { printHelp(); if (!o.help) process.exitCode = 2; return; }
  const r = await syncCampaignDraft(o);
  /* eslint-disable no-console */
  console.log('\nCampaign → Klaviyo sync');
  console.log('─'.repeat(60));
  console.log(`  brand           : ${r.brand}`);
  console.log(`  campaign_id     : ${r.campaignId}`);
  console.log(`  draft id        : ${r.draftId}`);
  console.log(`  draft name      : ${r.draftName}`);
  console.log(`  status          : ${r.status}`);
  console.log(`  html source     : ${r.htmlSource}`);
  if (r.dryRun) {
    console.log(`  template (plan) : ${r.templateName}`);
    console.log(`  html bytes      : ${r.htmlBytes}`);
    console.log('  DRY RUN — nothing written.');
  } else {
    console.log(`  template        : ${r.templateName} (assigned ${r.assignedTemplateId})`);
    console.log(`  html attached   : ${r.htmlBytes} bytes`);
    console.log(`  subject refresh : ${r.subjectRefreshed == null ? '(unchanged)' : r.subjectRefreshed}`);
    console.log(`  audience        : ${JSON.stringify(r.audienceIncluded)} (unchanged — never modified)`);
    console.log(`  duplicate drafts: ${r.duplicateDraftCount} (expect 1)`);
    console.log(`  scheduled/sent  : NO (${r.noSchedule ? 'no send_strategy' : 'WARNING: send_strategy present'})`);
    console.log(`  url             : ${r.url}`);
    console.log(`\n  RESULT: ${r.verified ? 'DRAFT UPDATED + VERIFIED (not scheduled/sent)' : 'CHECK FAILED — review above'}`);
    if (!r.verified) process.exitCode = 1;
  }
  console.log('─'.repeat(60));
  /* eslint-enable no-console */
}

if (require.main === module) {
  main().catch((err) => {
    /* eslint-disable no-console */
    if (err instanceof ApprovalRequired) console.error(`\nSTOP: ${err.message}\n`);
    else console.error(`\nERROR: ${err.name || 'Error'}: ${err.message}\n`);
    /* eslint-enable no-console */
    process.exitCode = 1;
  });
}

module.exports = { syncCampaignDraft, resolveHtmlSource, listEmailCampaigns, brandPrefixOf, parseArgs };
