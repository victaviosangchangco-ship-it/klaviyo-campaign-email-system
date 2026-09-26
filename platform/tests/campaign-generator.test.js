// Canonical campaign-aware generation path (SYSTEM PATCH: Safe One-Command
// Routing). Root cause: the plain `create` CLI path used to call
// runWeeklyPipeline() directly without ever resolving a calendar campaign, so
// CampaignThemePackage/theme-relevance never engaged (RDD-2026-39 validation).
//
// These tests prove:
//   1. plain create (generateWeeklyCampaign) cannot bypass campaign resolution
//   2. live-orchestrator and the plain-create path share ONE resolver/pipeline-
//      runner implementation (no duplicated generation logic)
//   3. an unresolved campaign id never reaches the pipeline (no generic content)

'use strict';

const { test } = require('node:test');
const assert = require('node:assert');

const fs = require('fs');
const os = require('os');
const path = require('path');

const { generateWeeklyCampaign, resolveCalendarCampaign, runResolvedWeeklyPipeline } = require('../workflow/campaign-generator');
const liveOrchestrator = require('../workflow/live-orchestrator');
const { ApprovalRequired } = require('../common/errors');

const CAMPAIGN = {
  campaign_id: 'RDD-2026-39',
  brand: 'RDD',
  cadence: 'weekly',
  topic_category_slug: 'promotional-sale',
  campaign_name: 'Spring Refresh Sale – Acrylic Displays 15% Off',
  topic_category: 'Acrylic Displays',
  subject_line: 'Refresh Your Displays This Spring',
  key_topic: '15% off selected acrylic display products.',
  promotion: { code: 'SPRING15', text: '15% off acrylic displays' },
  send_date: '2026-09-17',
};

function fakeCalendarService(campaigns) {
  return {
    listCampaigns: async ({ brand } = {}) => campaigns.filter((c) => !brand || c.brand === brand),
    getCampaignById: async (id) => campaigns.find((c) => c.campaign_id === id) || null,
    getNextCampaign: async ({ brand } = {}) => campaigns.find((c) => !brand || c.brand === brand) || null,
  };
}

const baseCtx = () => ({
  repoRoot: process.cwd(),
  brand: { code: 'RDD' },
  platformConfig: {},
  calendarConfig: {},
  logger: { info() {}, warn() {}, error() {}, step() {} },
  options: {},
  runId: 't',
  generatedAt: 't',
});

test('1. generateWeeklyCampaign (plain `create`) resolves the exact campaign and attaches it to the pipeline call', async () => {
  const calendarService = fakeCalendarService([CAMPAIGN]);
  let capturedOptions = null;
  const runPipeline = async (ctx) => {
    capturedOptions = ctx.options;
    return { campaignId: ctx.options.calendarCampaign.campaign_id, pkg: { products: [] }, qa: { pass: true, counts: {} }, exportResult: { paths: {} }, mode: 'sandbox' };
  };
  const ctx = { ...baseCtx(), options: { campaign: 'RDD-2026-39' } };
  const result = await generateWeeklyCampaign(ctx, { calendarService, runPipeline });

  assert.ok(capturedOptions, 'the pipeline was invoked');
  assert.strictEqual(capturedOptions.calendarCampaign.campaign_id, 'RDD-2026-39');
  assert.strictEqual(capturedOptions.calendarCampaign.topic_category, 'Acrylic Displays');
  assert.strictEqual(result.campaign.campaign_id, 'RDD-2026-39');
});

test('1b. generateWeeklyCampaign NEVER calls the pipeline without a resolved campaign', async () => {
  const calendarService = fakeCalendarService([]); // nothing on the calendar
  let pipelineCalled = false;
  const runPipeline = async () => { pipelineCalled = true; return {}; };
  const ctx = { ...baseCtx(), options: { campaign: 'RDD-2026-99' } };

  await assert.rejects(() => generateWeeklyCampaign(ctx, { calendarService, runPipeline }), ApprovalRequired);
  assert.strictEqual(pipelineCalled, false, 'the pipeline must not run for an unresolved campaign');
});

test('2. the plain-create path and the Klaviyo path share ONE resolveCalendarCampaign implementation', () => {
  // live-orchestrator re-exports the SAME function object from campaign-generator.js
  // (not a re-implementation) — this is the structural guarantee against a second,
  // unresolved generation path being (re)introduced.
  assert.strictEqual(liveOrchestrator.resolveCalendarCampaign, resolveCalendarCampaign);
});

test('2b. live-orchestrator regenerate branch runs the pipeline through runResolvedWeeklyPipeline (same helper)', async () => {
  const calendarService = fakeCalendarService([CAMPAIGN]);
  // readApprovedOutput (called after the pipeline runs) needs a real HTML +
  // manifest on disk — mirror the pattern live-orchestrator.test.js uses.
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'cg-'));
  const id = 'RDD-2026-39';
  fs.writeFileSync(path.join(dir, `${id}.html`), '<html><body>ok</body></html>');
  fs.writeFileSync(path.join(dir, `${id}-package.json`), JSON.stringify({ campaignId: id, qa: { pass: true, blocker: 0, warn: 0 } }));

  let capturedOptions = null;
  const runPipeline = async (ctx) => {
    capturedOptions = ctx.options;
    return {
      campaignId: ctx.options.calendarCampaign.campaign_id,
      pkg: { products: [], subject: 'S', preheader: 'P' },
      qa: { pass: true, counts: { blocker: 0, warn: 0, pass: 1 } },
      exportResult: { paths: { html: path.join(dir, `${id}.html`) }, manifest: { files: {} } },
      mode: 'pipeline',
    };
  };

  const deps = {
    skipGuard: true,
    calendarService,
    klaviyoConfig: { hasApiKey: true, apiKeyEnvVar: 'K', envPath: 'x', sender: {} },
    client: {},
    sender: { fromEmail: 'hello@rdd.com.au', fromLabel: 'RDD', source: 'test' },
    listService: { resolveByName: async () => null },
    segmentService: { resolveByName: async () => null },
    draftService: {
      findDraftForCampaign: async () => null,
      createDraftForWeek: async () => ({ campaignId: 'DRAFT_NEW' }),
      updateDraftMessageMetadata: async () => ({ ok: true }),
      updateCampaignName: async () => ({ ok: true }),
    },
    templateService: {
      attachHtmlToCampaign: async ({ campaignId }) => ({ campaignId, templateId: 'T1', templateCreated: true, verified: true, htmlLength: 10, campaignUrl: 'https://k/x', templateUrl: 'https://k/y' }),
    },
    estimator: { estimate: async () => ({ available: false }) },
    runPipeline,
    loadApprovedHtml: () => null, // force the regenerate branch (no approved-attach)
  };

  const ctx = { ...baseCtx(), options: { campaign: 'RDD-2026-39' } };
  await liveOrchestrator.runLiveCampaign(ctx, deps);
  assert.ok(capturedOptions, 'the pipeline was invoked via the shared runner');
  assert.strictEqual(capturedOptions.calendarCampaign.campaign_id, 'RDD-2026-39');
});

test('3. an unresolved campaign id STOPS rather than falling back to generic content (--campaign)', async () => {
  const calendarService = fakeCalendarService([CAMPAIGN]); // exists, but wrong id requested
  await assert.rejects(
    () => resolveCalendarCampaign({ calendarService, brandCode: 'RDD', campaignId: 'RDD-2026-DOES-NOT-EXIST' }),
    ApprovalRequired
  );
});

test('3b. no campaign anywhere on the calendar STOPS (no --campaign, no --week, nothing upcoming)', async () => {
  const calendarService = fakeCalendarService([]);
  await assert.rejects(
    () => resolveCalendarCampaign({ calendarService, brandCode: 'RDD', now: new Date('2026-09-17') }),
    ApprovalRequired
  );
});

test('runResolvedWeeklyPipeline always attaches calendarCampaign + the campaign send_date', async () => {
  let seen = null;
  const runPipeline = async (ctx) => { seen = ctx; return {}; };
  await runResolvedWeeklyPipeline({ ctx: baseCtx(), campaign: CAMPAIGN, runPipeline });
  assert.strictEqual(seen.options.calendarCampaign, CAMPAIGN);
  assert.strictEqual(seen.options.date.toISOString().slice(0, 10), '2026-09-17');
});
