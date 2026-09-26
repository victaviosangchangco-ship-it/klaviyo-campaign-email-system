// ---------------------------------------------------------------------------
// live-orchestrator.js — the FINAL MVP: one workflow, every module (Sprint 10).
//
// Turns a single instruction ("Create this week's RDD campaign") into a
// review-ready Klaviyo DRAFT with HTML attached, by composing the modules built
// across the whole project — REUSING them, never re-implementing:
//
//   Content Calendar Service → pick the campaign
//   Automation pipeline (BigCommerce → AI copy → Renderer → QA → Export)  [steps 1-5]
//   QA gate (approved-output)                                             [step 5]
//   List + Segment Services → resolve audience                            [steps 6-7]
//   Draft Campaign Service → create OR REUSE the draft                    [step 8]
//   Template Service → upload/update HTML + attach                        [steps 9-10]
//   Recipient Estimator → best-effort estimate                           [step 11]
//   Summary                                                               [step 12]
//
// SAFETY: never sends, never schedules, never publishes. Re-asserts the no-send
// guard. Enforces the QA gate (no HTML reaches Klaviyo unless QA passed). Every
// result is NOT_APPROVED_TO_SEND.
//
// Dependency-injected (`deps`) so it is unit-testable offline: tests inject a
// stub pipeline + mock Klaviyo services; production builds them from config+key.
// ---------------------------------------------------------------------------

'use strict';

const path = require('path');
const fs = require('fs');
const { resolveCalendarCampaign, buildCalendarService, runResolvedWeeklyPipeline } = require('./campaign-generator');
const { loadApprovedHtml } = require('../common/config');
const { generatePreviewText } = require('../ai/copy');
const validators = require('../qa/validators');
const qaReport = require('../qa/report');
const { loadKlaviyoConfig } = require('../integrations/klaviyo/config');
const { parseEnvFile, resolveVar } = require('../common/env');
const { KlaviyoClient } = require('../integrations/klaviyo/client');
const { createListService } = require('../integrations/klaviyo/list-service');
const { createSegmentService } = require('../integrations/klaviyo/segment-service');
const { createDraftCampaignService, resolveSender } = require('../integrations/klaviyo/draft-campaign-service');
const { createTemplateService, templateNameFor } = require('../integrations/klaviyo/template-service');
const { createRecipientEstimator } = require('../integrations/klaviyo/recipient-estimation');
const { readApprovedOutput } = require('../integrations/klaviyo/approved-output');
const { isoWeekId } = require('../integrations/calendar/adapter');
const { guardKlaviyoDir } = require('../integrations/klaviyo/safety');
const { ApprovalRequired, ConfigError, QaBlocker } = require('../common/errors');
const { freshInventoryRecheck } = require('../integrations/bigcommerce/inventory');
const { createProductSource } = require('../integrations/bigcommerce/adapter');

// Campaign resolution (resolveCalendarCampaign) and the calendar-source
// selection (buildCalendarService) now live in ONE place — platform/workflow/
// campaign-generator.js — shared with the plain `create` CLI path (SYSTEM
// PATCH: Safe One-Command Routing). Re-exported below for existing callers.

async function runLiveCampaign(ctx, deps = {}) {
  const { repoRoot, brand, platformConfig, logger, options } = ctx;

  // Safety guard first (may be skipped only when tests inject services).
  if (!deps.skipGuard) guardKlaviyoDir(repoRoot);

  // --- build (or accept injected) Klaviyo services --------------------------
  let { client, calendarService, listService, segmentService, draftService, templateService, estimator, sender, klaviyoConfig } = deps;

  if (!klaviyoConfig) klaviyoConfig = loadKlaviyoConfig(brand.code, { repoRoot });
  if (!client) {
    if (!klaviyoConfig.hasApiKey) {
      throw new ApprovalRequired(`${klaviyoConfig.apiKeyEnvVar} is not set in ${klaviyoConfig.envPath}. Cannot reach Klaviyo.`);
    }
    const fileEnv = parseEnvFile(path.join(repoRoot, klaviyoConfig.envPath));
    client = new KlaviyoClient({ apiBaseUrl: klaviyoConfig.apiBaseUrl, revision: klaviyoConfig.revision, apiKey: resolveVar(fileEnv, klaviyoConfig.apiKeyEnvVar) });
  }
  // Calendar source. DEFAULT (SYSTEM PATCH: Stale Calendar Guard, 2026-09):
  // live Lark Base API (read-only) — the generated runtime JSON is an EXPLICIT
  // fallback only (`--calendar json`), guarded against silent staleness
  // (json-provider.js STALE_BLOCK_DAYS). Selection logic lives in
  // campaign-generator.js (shared with the plain `create` path).
  if (!calendarService) {
    calendarService = buildCalendarService({ repoRoot, brand, platformConfig, options, logger });
  }
  listService = listService || createListService({ client, logger });
  segmentService = segmentService || createSegmentService({ client, logger });
  draftService = draftService || createDraftCampaignService({ client, calendarService, listService, segmentService, logger });
  templateService = templateService || createTemplateService({ client, logger });
  estimator = estimator || createRecipientEstimator({ client, logger });

  const step = (n, msg) => (logger && logger.step ? logger.step(n, msg) : logger && logger.info && logger.info(`[${n}] ${msg}`));

  // --- 1-2. read the Content Calendar + resolve the campaign ----------------
  step(1, 'Read the Content Calendar + resolve the campaign');
  const now = options.date instanceof Date ? options.date : new Date();
  const campaign = await resolveCalendarCampaign({
    calendarService,
    brandCode: brand.code,
    campaignId: options.campaign || null,
    week: options.week || null,
    now,
  });
  const calWeek = isoWeekId(new Date(campaign.send_date));
  logger && logger.info && logger.info(`Campaign: ${campaign.campaign_id} (${calWeek}) — "${campaign.subject_line}"`);

  // Run-scoped audience override (does NOT edit the calendar/XLSX). Used when the
  // calendar's planned list/segment name does not exist in the Klaviyo account and
  // the operator maps it to a real audience for this run (--segment / --list).
  const effectiveCampaign = { ...campaign };
  if (options.segment != null) effectiveCampaign.segment = options.segment;
  if (options.list != null) effectiveCampaign.list = options.list;
  if (options.segment != null || options.list != null) {
    logger && logger.info && logger.info(
      `Audience override (run-scoped; calendar unchanged): list=${effectiveCampaign.list || 'none'}, segment=${effectiveCampaign.segment || 'none'}.`
    );
  }

  // --- 3-5. obtain the review-ready HTML ------------------------------------
  // Two modes, chosen per campaign and gated on config/approved-html.json:
  //   • APPROVED-ATTACH — when the campaign has a registered, human-approved Output
  //     HTML, attach THAT creative verbatim (no regeneration of a different one).
  //     The pipeline is not run; the approved file is QA-validated with the SAME
  //     validators before it is allowed through the gate. (RDD & unlisted campaigns
  //     never enter this branch.)
  //   • REGENERATE (default, unchanged) — REUSE the pipeline to build+QA+export.
  const resolveApprovedHtml = deps.loadApprovedHtml || loadApprovedHtml;
  const approvedAttach = resolveApprovedHtml(campaign.campaign_id, { repoRoot });

  let pipelineResult;
  let approved;
  if (approvedAttach) {
    step(3, `Attach APPROVED creative (verbatim) — ${approvedAttach.htmlRel} (no regeneration)`);
    if (!fs.existsSync(approvedAttach.htmlPath)) {
      throw new ApprovalRequired(
        `Approved HTML for ${campaign.campaign_id} is registered in config/approved-html.json but the file is missing: ${approvedAttach.htmlRel}.`
      );
    }
    const approvedHtml = fs.readFileSync(approvedAttach.htmlPath, 'utf8');

    // QA GATE — the approved file must pass the SAME validators (never attach a
    // blocker-level creative, even a human-approved one).
    const findings = validators.runAll(approvedHtml, { platformConfig });
    const qaApproved = qaReport.summarize(findings);
    logger && logger.info && logger.info(
      `Approved creative QA: ${qaApproved.pass ? 'PASS' : 'BLOCKERS'} — ${qaApproved.counts.blocker} blocker · ${qaApproved.counts.warn} warn · ${qaApproved.counts.pass} pass (${Buffer.byteLength(approvedHtml, 'utf8')} bytes).`
    );
    if (!qaApproved.pass) {
      throw new QaBlocker(
        `Approved HTML ${approvedAttach.htmlRel} has ${qaApproved.counts.blocker} QA blocker(s); refusing to attach. Fix the approved file first.`,
        { campaignId: campaign.campaign_id }
      );
    }

    // Subject + preview to MATCH the approved creative: registry first, then the
    // calendar row, then auto-generated (CLAUDE.md §6.24). Put them on a synthetic
    // pkg so the shared tail (steps 6-12) is byte-for-byte unchanged.
    const subject = approvedAttach.subject || campaign.subject_line || null;
    const preview =
      approvedAttach.previewText ||
      (typeof campaign.preview_text === 'string' && campaign.preview_text.trim()) ||
      generatePreviewText({ campaign });

    approved = { html: approvedHtml };
    pipelineResult = {
      campaignId: campaign.campaign_id,
      pkg: { subject, preheader: preview, products: [] },
      qa: { pass: true, counts: qaApproved.counts, blockers: [] },
      linkResults: null,
      mode: 'approved-attach',
      creativeSource: { kind: 'approved', path: approvedAttach.htmlRel },
      exportResult: {
        manifest: { files: { html: approvedAttach.htmlRel, draft: approvedAttach.htmlRel, products_json: '—', products_csv: '—', qa_report: '—' } },
        paths: { manifest: approvedAttach.htmlPath, html: approvedAttach.htmlPath },
      },
    };
  } else {
    // Drive generation off the calendar campaign's week so the generated id equals
    // the calendar campaign_id (coherent end-to-end). Reuses the SAME
    // resolved-campaign pipeline invocation as the plain `create` path
    // (campaign-generator.js) — no second implementation of "run the pipeline
    // for a resolved campaign".
    pipelineResult = await runResolvedWeeklyPipeline({ ctx, campaign, runPipeline: deps.runPipeline });

    // --- 5. QA GATE — never bypass ------------------------------------------
    if (!pipelineResult.qa || !pipelineResult.qa.pass) {
      throw new QaBlocker(
        `QA did not pass for ${pipelineResult.campaignId} (${pipelineResult.qa ? pipelineResult.qa.counts.blocker : '?'} blocker(s)). ` +
          `Refusing to touch Klaviyo — fix blockers first.`,
        { campaignId: pipelineResult.campaignId }
      );
    }
    // Read back the approved HTML from wherever the pipeline wrote it (reuse approved-output).
    const outputDir = path.dirname(pipelineResult.exportResult.paths.html);
    approved = readApprovedOutput({ outputDir, campaignId: pipelineResult.campaignId });
    const er = pipelineResult.exportResult || {};
    pipelineResult.creativeSource = { kind: 'regenerated', path: (er.manifest && er.manifest.files && er.manifest.files.html) || null };
  }

  // Guarantee a non-empty, campaign-specific Preview Text on the Klaviyo draft
  // (CLAUDE.md §6.24). Priority: for an APPROVED-attach campaign the registry
  // preview is authoritative (it matches the approved creative, like its subject);
  // otherwise the calendar's preview if valid, else the generated preheader from
  // the SAME content package that produced the HTML. The calendar source is never
  // modified — this only populates the draft payload.
  const registryPreview = (approvedAttach && typeof approvedAttach.previewText === 'string' && approvedAttach.previewText.trim()) || '';
  const calPreview = typeof campaign.preview_text === 'string' ? campaign.preview_text.trim() : '';
  const generatedPreview = (pipelineResult.pkg && pipelineResult.pkg.preheader) || '';
  effectiveCampaign.preview_text = registryPreview || calPreview || generatedPreview || null;
  if (!effectiveCampaign.preview_text) {
    throw new ApprovalRequired(`No preview text could be resolved or generated for ${campaign.campaign_id}. Refusing to draft an email with an empty preheader (CLAUDE.md §6.24).`);
  }
  const previewSource = registryPreview ? 'approved-registry' : calPreview ? 'calendar' : 'generated';
  logger && logger.info && logger.info(`Preview text (${previewSource}): "${effectiveCampaign.preview_text}"`);

  // The draft subject uses the SAME subject the HTML was built with (pkg.subject):
  // for a content override / generated copy this is the authored subject, not the
  // (now superseded) calendar subject line. Non-override campaigns are unchanged
  // (pkg.subject equals the calendar subject there).
  if (pipelineResult.pkg && pipelineResult.pkg.subject) {
    effectiveCampaign.subject_line = pipelineResult.pkg.subject;
    logger && logger.info && logger.info(`Subject: "${effectiveCampaign.subject_line}"`);
  }

  // --- PRE-KLAVIYO FRESH INVENTORY RECHECK ------------------------------------
  // Re-fetch every product from BigCommerce by ID to verify CURRENT stock state.
  // Does NOT reuse the pre-export snapshot — a second, independent live fetch.
  if (pipelineResult.pkg && pipelineResult.pkg.products && pipelineResult.pkg.products.length) {
    const fetchProducts = deps.fetchProducts || ((ids) => {
      const src = createProductSource({
        repoRoot, brand, logger,
        cacheDir: path.join(repoRoot, platformConfig.paths.cache),
      });
      return src.getProductsByIds(ids, { source: 'live' });
    });
    try {
      const recheck = await freshInventoryRecheck(
        pipelineResult.pkg.products.map((p) => p.id), fetchProducts,
        { brandCode: brand.code, context: `pre-Klaviyo ${campaign.campaign_id}` }
      );
      const unavailable = [
        ...recheck.failed.map((f) => ({ id: Number(f.product.id), reason: f.verdict.reason })),
        ...recheck.notFound,
      ];
      if (unavailable.length) {
        throw new ApprovalRequired(
          `PRE_KLAVIYO_INVENTORY_BLOCK: ${unavailable.length} product(s) are no longer purchasable ` +
          `(fresh BigCommerce re-fetch). Refusing to create/update Klaviyo draft for ${campaign.campaign_id}.\n` +
          unavailable.map((u) => `  [${u.id}] ${u.reason}`).join('\n')
        );
      }
      logger && logger.info && logger.info('Pre-Klaviyo fresh inventory recheck: all products confirmed purchasable (fresh BigCommerce data).');
    } catch (err) {
      if (err.code === 'FRESH_RECHECK_FETCH_FAILED') {
        throw new ApprovalRequired(
          `PRE_KLAVIYO_INVENTORY_BLOCK (fetch failed): could not verify inventory — refusing to draft. ${err.message}`
        );
      }
      if (err instanceof ApprovalRequired) throw err;
      throw err;
    }
  }

  // --- 6-7. resolve the audience (for the summary; also validated at draft) --
  step(6, 'Resolve audience (List + Segment)');
  const list = effectiveCampaign.list ? await listService.resolveByName(effectiveCampaign.list) : null;
  const segment = effectiveCampaign.segment ? await segmentService.resolveByName(effectiveCampaign.segment) : null;

  // --- 8. create OR REUSE the draft (no duplicates) -------------------------
  step(8, 'Create or reuse the Draft campaign');
  if (!sender) sender = await resolveSender(klaviyoConfig, client);
  if (!sender.fromEmail) throw new ConfigError('No verified sender (from_email) in config or the account default.');

  // A real (non-DEMO) draft name that still contains the campaign_id so the
  // no-duplicate lookup keeps matching it. Internal name only (not customer copy).
  const draftName = `${campaign.campaign_id}: ${effectiveCampaign.subject_line}`;

  const existing = await draftService.findDraftForCampaign(campaign.campaign_id);
  let draftId;
  let reused;
  if (existing) {
    draftId = existing.id;
    reused = true;
    logger && logger.info && logger.info(`Reusing existing draft ${draftId} ("${existing.name}") — no duplicate.`);
    // Patch-on-reuse: create sets subject + preview at build time, so reuse must
    // too — otherwise a re-run keeps a stale/empty preheader (CLAUDE.md §6.24).
    // Metadata only: the HTML template is still (re)attached in step 9 below.
    if (typeof draftService.updateDraftMessageMetadata === 'function') {
      await draftService.updateDraftMessageMetadata({
        campaignId: draftId,
        subject: effectiveCampaign.subject_line,
        previewText: effectiveCampaign.preview_text,
        // Correct the brand sender + reply-to on the reused draft too (§13.4), so a
        // re-push fixes a draft first created under the account-default sender.
        fromEmail: sender.fromEmail,
        fromLabel: sender.fromLabel,
        replyToEmail: sender.replyToEmail,
      });
      logger && logger.info && logger.info('Refreshed reused draft subject + preview + sender (metadata only; no duplicate).');
    }
    // Correct the campaign NAME too (a reused draft may carry an old placeholder /
    // "DEMO —" name from when it was first created).
    if (typeof draftService.updateCampaignName === 'function') {
      await draftService.updateCampaignName(draftId, draftName);
    }
    // Ensure "Include tracking parameters" (UTM) is on for the reused draft (§13.4).
    if (typeof draftService.updateCampaignTracking === 'function') {
      try { await draftService.updateCampaignTracking(draftId); }
      catch (e) { logger && logger.warn && logger.warn(`tracking_options update skipped: ${e.message}`); }
    }
  } else {
    const created = await draftService.createDraftForWeek({ brand: brand.code, week: calWeek, sender, campaign: effectiveCampaign, name: draftName });
    draftId = created.campaignId;
    reused = false;
    logger && logger.info && logger.info(`Created draft ${draftId}.`);
  }

  // --- 9-10. upload/update HTML template + attach ---------------------------
  step(9, 'Upload/update HTML template + attach to the draft');
  const attach = await templateService.attachHtmlToCampaign({
    campaignId: draftId,
    templateName: templateNameFor(campaign.campaign_id),
    html: approved.html,
  });

  // --- 11. recipient estimate (best-effort) ---------------------------------
  step(11, 'Retrieve recipient estimate (best-effort)');
  const estimate = await estimator.estimate(draftId);

  // --- 12. summary ----------------------------------------------------------
  step(12, 'Produce final review summary');
  const klaviyo = {
    calendarCampaignId: campaign.campaign_id,
    draftId,
    reused,
    campaignUrl: attach.campaignUrl,
    templateId: attach.templateId,
    templateUrl: attach.templateUrl,
    templateCreated: attach.templateCreated,
    htmlVerified: attach.verified,
    htmlBytes: attach.htmlLength,
    creativeSource: pipelineResult.creativeSource || { kind: 'regenerated', path: null },
    audience: {
      list: list ? { id: list.id, name: list.name } : null,
      segment: segment ? { id: segment.id, name: segment.name } : null,
    },
    recipientEstimate: estimate,
    sender: { fromEmail: sender.fromEmail, fromLabel: sender.fromLabel, source: sender.source },
    sendStatus: 'NOT_APPROVED_TO_SEND',
  };

  // `campaign` (the resolved calendar record) is attached for reporting only —
  // every gate above already ran against it; this adds no new behavior.
  return { ...pipelineResult, campaign, klaviyo };
}

module.exports = { runLiveCampaign, resolveCalendarCampaign };
