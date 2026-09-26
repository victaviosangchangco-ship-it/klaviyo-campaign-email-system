// ---------------------------------------------------------------------------
// run.js — the Automation Engine (Architecture V2 §2.1).
//
// Owns the run lifecycle: boot config + logging, build the run context, invoke
// the Workflow Engine, handle the typed error taxonomy, flush the audit log,
// and print the "ready for review" summary. It is thin — no business logic.
// ---------------------------------------------------------------------------

'use strict';

const path = require('path');
const config = require('../common/config');
const { Logger } = require('../common/logger');
const { generateWeeklyCampaign } = require('../workflow/campaign-generator');
const { runLiveCampaign } = require('../workflow/live-orchestrator');
const {
  PlatformError,
  ConfigError,
  IntegrationError,
  RenderError,
  ApprovalRequired,
} = require('../common/errors');

// Compact, sortable run id. (Date is fine in normal Node code.)
function makeRunId(brandCode) {
  const ts = new Date().toISOString().replace(/[-:]/g, '').replace(/\..+/, '').replace('T', '-');
  return `${brandCode}-weekly-${ts}`;
}

async function createCampaign(options = {}) {
  const brandCode = String(options.brand || 'RDD').toUpperCase();
  const generatedAt = new Date().toISOString();
  const runId = makeRunId(brandCode);

  const platformConfig = config.loadPlatformConfig();
  const logger = new Logger({
    runId,
    level: options.debug ? 'debug' : platformConfig.logging.level,
    logDir: path.join(config.REPO_ROOT, platformConfig.paths.logs),
    writeRunLog: platformConfig.logging.writeRunLog,
  });

  // eslint-disable-next-line no-console
  console.log(`\n══════════════════════════════════════════════════════════════`);
  // eslint-disable-next-line no-console
  console.log(` Automation Engine · run ${runId}`);
  // eslint-disable-next-line no-console
  console.log(`══════════════════════════════════════════════════════════════`);

  try {
    logger.step(0, `Boot — brand ${brandCode}, type weekly, source ${options.source || 'live'}`);
    const brand = config.loadBrandConfig(brandCode);
    const calendarConfig = config.loadContentCalendar();
    logger.info(`Loaded brand config (${brand.identity.displayName.value}) and content calendar.`);
    logger.info('Governing rules: CLAUDE.md + BRD (read as the AI Decision Engine grounding).');

    const ctx = {
      repoRoot: config.REPO_ROOT,
      brand,
      platformConfig,
      calendarConfig,
      logger,
      options: {
        source: options.source || 'live',
        fixturePath: options.fixturePath || null,
        verifyLinks: options.verifyLinks || platformConfig.qa.verifyLinksDefault,
        dryRun: options.dryRun || false,
        week: options.week || null,
        campaign: options.campaign || null,
        // DEFAULT is live Lark (SYSTEM PATCH: Stale Calendar Guard). `--calendar json`
        // opts into the generated-runtime-JSON fallback explicitly.
        calendarSource: options.calendarSource || 'lark',
        allowStaleCalendar: options.allowStaleCalendar || false,
        segment: options.segment || null,
        list: options.list || null,
        date: options.date || new Date(),
      },
      runId,
      generatedAt,
    };

    // Every generation path is campaign-aware (SYSTEM PATCH: Safe One-Command
    // Routing): plain `create` resolves the exact calendar campaign and runs the
    // pipeline with it attached (generateWeeklyCampaign — CampaignThemePackage/
    // theme relevance always engage); `--klaviyo` runs the FINAL MVP orchestrator
    // (same campaign resolution, plus the Klaviyo draft steps). Neither path can
    // reach the pipeline without a resolved campaign.
    const result = options.klaviyo ? await runLiveCampaign(ctx) : await generateWeeklyCampaign(ctx);

    const logFile = logger.flush();
    printSummary({ result, runId, logFile });
    return { ok: true, ...result, runId };
  } catch (err) {
    logger.error(err instanceof PlatformError ? `${err.name}: ${err.message}` : `Unexpected: ${err.stack || err.message}`);
    logger.flush();
    printError(err);
    // Non-zero exit for CLI, but return a structured result for programmatic callers.
    if (require.main !== module && !options._throw) {
      return { ok: false, error: { name: err.name, message: err.message } };
    }
    throw err;
  }
}

function printSummary({ result, runId, logFile }) {
  const { campaignId, pkg, qa, exportResult, linkResults } = result;
  const rel = exportResult.manifest.files;
  // eslint-disable-next-line no-console
  console.log(`\n──────────────────────────────────────────────────────────────`);
  console.log(` ✔ CAMPAIGN PACKAGE READY FOR REVIEW — ${campaignId}`);
  console.log(`──────────────────────────────────────────────────────────────`);
  console.log(` Subject      : ${pkg.subject}`);
  console.log(` Preview text : ${pkg.preheader}`);
  console.log(` Products     : ${pkg.products.length} (verified, in stock, priced)`);
  console.log(` QA           : ${qa.pass ? 'PASS ✅' : `❌ ${qa.counts.blocker} blocker(s)`}  ` +
              `(${qa.counts.blocker} blocker · ${qa.counts.warn} warn · ${qa.counts.pass} pass)`);
  console.log(` Links        : ${linkResults ? `${linkResults.filter((r) => r.ok).length}/${linkResults.length} HTTP 200` : 'not verified (run --verify-links)'}`);
  console.log(`\n Package (mode: ${result.mode}):`);
  console.log(`   • HTML        ${rel.html}`);
  console.log(`   • Draft       ${rel.draft}`);
  console.log(`   • Products    ${rel.products_json}`);
  console.log(`   •             ${rel.products_csv}`);
  console.log(`   • QA report   ${rel.qa_report}`);
  console.log(`   • Manifest    ${path.relative(config.REPO_ROOT, exportResult.paths.manifest)}`);
  if (logFile) console.log(`   • Run log     ${path.relative(config.REPO_ROOT, logFile)}`);

  if (result.klaviyo) {
    const k = result.klaviyo;
    const est = k.recipientEstimate && k.recipientEstimate.available ? `~${k.recipientEstimate.count}` : 'unavailable';
    const aud = [k.audience.list && `list:${k.audience.list.name}`, k.audience.segment && `segment:${k.audience.segment.name}`].filter(Boolean).join(' + ') || '(none)';
    console.log(`\n Klaviyo DRAFT (${k.reused ? 'reused' : 'created'} — nothing sent):`);
    console.log(`   • Campaign ID   ${k.draftId}`);
    console.log(`   • Campaign URL  ${k.campaignUrl}`);
    console.log(`   • Template ID   ${k.templateId} (${k.templateCreated ? 'created' : 'updated — no duplicate'})`);
    const cs = k.creativeSource || {};
    console.log(`   • Creative      ${cs.kind === 'approved' ? `APPROVED file (verbatim) — ${cs.path}` : 'regenerated by pipeline'}`);
    console.log(`   • HTML attached ${k.htmlVerified ? 'YES' : 'NO'} (${k.htmlBytes} bytes)`);
    console.log(`   • Audience      ${aud}`);
    console.log(`   • Recipients    ${est}`);
    console.log(`   • Sender        ${k.sender.fromEmail} (${k.sender.source})`);
    console.log(`\n Send status  : ${k.sendStatus} — human review + approval required before sending.`);
  } else {
    console.log(`\n Send status  : NOT APPROVED TO SEND — preview only (CLAUDE.md §4.1/§9).`);
    console.log(`                Klaviyo draft creation is opt-in via --klaviyo (the FINAL MVP).`);
  }
  console.log(`──────────────────────────────────────────────────────────────\n`);
}

function printError(err) {
  const hints = {
    ConfigError: 'Check config/ files and the brand config.',
    IntegrationError: 'Check Brands/<CODE>/.env + token scope (python Brands/RDD/integration/verify.py), or use --source snapshot.',
    RenderError: 'A required brand fact / token is missing — the engine STOPS rather than invent it (CLAUDE.md §5).',
    ApprovalRequired: 'A human decision is required before this run can continue.',
  };
  // eslint-disable-next-line no-console
  console.error(`\n──────────────────────────────────────────────────────────────`);
  console.error(` ✗ RUN HALTED — ${err.name || 'Error'}`);
  console.error(`──────────────────────────────────────────────────────────────`);
  console.error(` ${err.message}`);
  if (hints[err.name]) console.error(`\n Hint: ${hints[err.name]}`);
  console.error(`──────────────────────────────────────────────────────────────\n`);
}

module.exports = { createCampaign };
