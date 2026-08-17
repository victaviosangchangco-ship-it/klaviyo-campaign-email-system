#!/usr/bin/env node
// ---------------------------------------------------------------------------
// verify-html-upload.js — live HTML upload + template assignment (Sprint 9).
//
// Reads a QA-approved campaign package from an Output folder, uploads its HTML as
// a Klaviyo template, attaches the template to an existing DRAFT campaign, and
// reads back to confirm the draft now carries the HTML. It NEVER sends, schedules
// or publishes. Re-asserts the no-send guard first.
//
// Inputs (all optional — auto-detected when omitted):
//   --brand RDD
//   --output-campaign <id>   which Output package to use (default: newest approved export)
//   --output-dir <path>      Output folder (default: runtime/exports/<id>/Output)
//   --draft-id <klaviyoId>   the draft campaign to attach to (default: newest "DEMO —" draft)
//
// Usage:  node platform/integrations/klaviyo/verify-html-upload.js --brand RDD
// ---------------------------------------------------------------------------

'use strict';

const fs = require('fs');
const path = require('path');
const { REPO_ROOT } = require('../../common/config');
const { loadKlaviyoConfig } = require('./config');
const { parseEnvFile, resolveVar } = require('../../common/env');
const { KlaviyoClient } = require('./client');
const { createTemplateService, templateNameFor } = require('./template-service');
const { readApprovedOutput } = require('./approved-output');
const { guardKlaviyoDir } = require('./safety');

function argValue(flag, fallback) {
  const i = process.argv.indexOf(flag);
  return i >= 0 && process.argv[i + 1] ? process.argv[i + 1] : fallback;
}

// Find the newest export dir under runtime/exports that has an Output/<id>.html.
function findNewestApprovedExport(repoRoot) {
  const root = path.join(repoRoot, 'runtime', 'exports');
  if (!fs.existsSync(root)) return null;
  const candidates = [];
  for (const entry of fs.readdirSync(root, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;
    const id = entry.name;
    const html = path.join(root, id, 'Output', `${id}.html`);
    if (fs.existsSync(html)) candidates.push({ id, outputDir: path.join(root, id, 'Output'), mtime: fs.statSync(html).mtimeMs });
  }
  candidates.sort((a, b) => b.mtime - a.mtime);
  return candidates[0] || null;
}

// Find the newest draft whose name starts with "DEMO —".
async function findLatestDemoDraft(client) {
  const filter = encodeURIComponent("equals(messages.channel,'email')");
  const json = await client.get(`/campaigns/?filter=${filter}&sort=-created_at&fields[campaign]=name,status`);
  const data = Array.isArray(json && json.data) ? json.data : [];
  const demo = data.find((c) => c.attributes && typeof c.attributes.name === 'string' && c.attributes.name.startsWith('DEMO —'));
  return demo ? demo.id : null;
}

async function main() {
  guardKlaviyoDir(REPO_ROOT); // safety first

  const brand = String(argValue('--brand', 'RDD')).toUpperCase();
  const cfg = loadKlaviyoConfig(brand);
  console.log('Brand        :', cfg.brand, '· revision', cfg.revision, '· key set:', cfg.hasApiKey ? 'yes' : 'NO');
  if (!cfg.hasApiKey) { console.error(`\nBLOCKED: ${cfg.apiKeyEnvVar} not set. No request made.`); process.exitCode = 2; return; }

  const fileEnv = parseEnvFile(path.join(REPO_ROOT, cfg.envPath));
  const client = new KlaviyoClient({ apiBaseUrl: cfg.apiBaseUrl, revision: cfg.revision, apiKey: resolveVar(fileEnv, cfg.apiKeyEnvVar) });
  const templates = createTemplateService({ client, logger: console });

  // 1-3. Locate + validate the QA-approved Output (HTML exists + QA PASS).
  let outputCampaign = argValue('--output-campaign', null);
  let outputDir = argValue('--output-dir', null);
  if (!outputCampaign || !outputDir) {
    const found = findNewestApprovedExport(REPO_ROOT);
    if (!found) { console.error('\nBLOCKED: no approved Output found under runtime/exports. Generate a campaign first.'); process.exitCode = 2; return; }
    outputCampaign = outputCampaign || found.id;
    outputDir = outputDir || found.outputDir;
  }
  console.log('Output pkg   :', outputCampaign, '·', path.relative(REPO_ROOT, outputDir));

  let approved;
  try {
    approved = readApprovedOutput({ outputDir, campaignId: outputCampaign });
  } catch (err) {
    console.error(`\nBLOCKED (${err.name}): ${err.message}`);
    process.exitCode = 2;
    return;
  }
  console.log('QA status    : PASS ·', approved.html.length, 'bytes of HTML');

  // Draft to attach to.
  let draftId = argValue('--draft-id', null);
  if (!draftId) {
    draftId = await findLatestDemoDraft(client);
    if (!draftId) { console.error('\nBLOCKED: no existing "DEMO —" draft found. Create one first (verify-draft-campaign.js).'); process.exitCode = 2; return; }
    console.log('Draft (auto) :', draftId);
  } else {
    console.log('Draft        :', draftId);
  }

  // 4-6. Upload template + assign + readback.
  console.log('\n--- uploading HTML + assigning template (draft only) ---');
  try {
    const r = await templates.attachHtmlToCampaign({
      campaignId: draftId,
      templateName: templateNameFor(outputCampaign),
      html: approved.html,
    });
    console.log('\n✅ HTML UPLOADED & ATTACHED (draft, not sent):');
    console.log('  Campaign ID  :', r.campaignId);
    console.log('  Template ID  :', r.templateId, `(${r.templateCreated ? 'created' : 'updated — no duplicate'})`);
    console.log('  Message ID   :', r.messageId);
    console.log('  HTML bytes   :', r.htmlLength);
    console.log('  Verified     :', r.verified ? 'YES (message links our template, html present)' : 'NO');
    console.log('  Send status  :', r.sendStatus);
    console.log('  Campaign URL :', r.campaignUrl);
    console.log('  Template URL :', r.templateUrl);
    process.exitCode = r.verified ? 0 : 1;
  } catch (err) {
    console.error(`\nHTML upload FAILED: ${err.name}: ${err.message}`);
    process.exitCode = 1;
  }
}

// exitCode + drain (never process.exit() — avoids the libuv teardown assertion).
main().catch((err) => {
  console.error(err.stack || err.message);
  process.exitCode = 1;
});
