// FINAL MVP orchestrator — offline tests with an injected stub pipeline + mock
// Klaviyo services. No network, no key. Proves composition, the QA gate, the
// create-or-reuse rule, and that nothing is ever sent.

'use strict';

const { test } = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const os = require('os');
const path = require('path');

const { runLiveCampaign } = require('../workflow/live-orchestrator');
const { QaBlocker, ApprovalRequired } = require('../common/errors');

const CAMPAIGN = {
  campaign_id: 'RDD-2026-W33', brand: 'RDD', topic_category_slug: 'weekly', campaign_name: 'Workspace Weekly',
  topic_category: 'Workspace', subject_line: 'Subj', preview_text: 'Prev',
  send_date: '2026-08-13', send_time: '10:00', promotion: null, segment: null, list: 'Email List',
};

// Write a temp Output package so readApprovedOutput (real) succeeds.
function stubPipelineResult(qaPass = true) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'orch-'));
  const id = 'RDD-2026-W33';
  fs.writeFileSync(path.join(dir, `${id}.html`), '<html><body>ok</body></html>');
  fs.writeFileSync(path.join(dir, `${id}-package.json`), JSON.stringify({ campaignId: id, qa: { pass: qaPass ? 12 : 3, blocker: qaPass ? 0 : 2, warn: 0 } }));
  return {
    campaignId: id,
    qa: { pass: qaPass, counts: { blocker: qaPass ? 0 : 2, warn: 0, pass: 12 } },
    exportResult: { paths: { html: path.join(dir, `${id}.html`) } },
    mode: 'sandbox', pkg: {}, rendered: {}, slot: {},
  };
}

function baseDeps(overrides = {}) {
  const calls = { createDraft: 0, attach: 0, estimate: 0, updateMeta: 0, rename: 0 };
  const deps = {
    skipGuard: true,
    klaviyoConfig: { hasApiKey: true, apiKeyEnvVar: 'K', envPath: 'x', sender: {} },
    client: {},
    sender: { fromEmail: 'hello@rdd.com.au', fromLabel: 'RDD', source: 'test' },
    calendarService: {
      listCampaigns: async () => [CAMPAIGN],
      getCampaignById: async (id) => (id === CAMPAIGN.campaign_id ? CAMPAIGN : null),
      getCampaignByWeek: async () => CAMPAIGN,
      getNextCampaign: async () => CAMPAIGN,
    },
    listService: { resolveByName: async (n) => (n === 'Email List' ? { id: 'L1', name: 'Email List' } : null) },
    segmentService: { resolveByName: async () => null },
    draftService: {
      findDraftForCampaign: async () => null,
      createDraftForWeek: async () => { calls.createDraft++; return { campaignId: 'DRAFT_NEW' }; },
      updateDraftMessageMetadata: async () => { calls.updateMeta++; return { ok: true }; },
      updateCampaignName: async () => { calls.rename++; return { ok: true }; },
    },
    templateService: {
      attachHtmlToCampaign: async ({ campaignId }) => {
        calls.attach++;
        return { campaignId, templateId: 'T1', templateCreated: true, verified: true, htmlLength: 100, campaignUrl: `https://k/campaign/${campaignId}/wizard`, templateUrl: 'https://k/email-editor/T1/edit' };
      },
    },
    estimator: { estimate: async () => { calls.estimate++; return { available: true, count: 8421, status: 'complete' }; } },
    runPipeline: async () => stubPipelineResult(true),
    ...overrides,
  };
  deps._calls = calls;
  return deps;
}

const ctx = {
  repoRoot: process.cwd(),
  brand: { code: 'RDD', identity: { displayName: { value: 'Retail Display Direct' } } },
  platformConfig: {}, calendarConfig: {}, logger: null,
  options: {}, runId: 't', generatedAt: 't',
};

test('happy path: creates a draft, uploads HTML, estimates, summarizes — nothing sent', async () => {
  const deps = baseDeps();
  const r = await runLiveCampaign(ctx, deps);
  assert.strictEqual(r.klaviyo.draftId, 'DRAFT_NEW');
  assert.strictEqual(r.klaviyo.reused, false);
  assert.strictEqual(r.klaviyo.templateId, 'T1');
  assert.strictEqual(r.klaviyo.htmlVerified, true);
  assert.deepStrictEqual(r.klaviyo.audience.list, { id: 'L1', name: 'Email List' });
  assert.strictEqual(r.klaviyo.recipientEstimate.count, 8421);
  assert.strictEqual(r.klaviyo.sendStatus, 'NOT_APPROVED_TO_SEND');
  assert.strictEqual(deps._calls.attach, 1);
});

test('create-or-reuse: an existing draft is REUSED (no duplicate create)', async () => {
  const deps = baseDeps({
    draftService: {
      findDraftForCampaign: async () => ({ id: 'DRAFT_EXISTING', name: 'DEMO — RDD-2026-W33 …' }),
      createDraftForWeek: async () => { throw new Error('must not create when one exists'); },
      updateDraftMessageMetadata: async () => ({ ok: true }),
    },
  });
  const r = await runLiveCampaign(ctx, deps);
  assert.strictEqual(r.klaviyo.draftId, 'DRAFT_EXISTING');
  assert.strictEqual(r.klaviyo.reused, true);
  assert.strictEqual(deps._calls.createDraft, 0);
  assert.strictEqual(deps._calls.attach, 1); // HTML still attached to the reused draft
});

// Patch-on-reuse (§6.24): reusing a draft refreshes subject + preview WITHOUT
// creating a duplicate and WITHOUT changing the HTML/template behaviour.
function reuseDeps(campaign, pkgPreheader, capture) {
  return baseDeps({
    calendarService: {
      listCampaigns: async () => [campaign],
      getCampaignById: async (id) => (id === campaign.campaign_id ? campaign : null),
      getCampaignByWeek: async () => campaign,
      getNextCampaign: async () => campaign,
    },
    runPipeline: async () => ({ ...stubPipelineResult(true), pkg: { preheader: pkgPreheader } }),
    draftService: {
      findDraftForCampaign: async () => ({ id: 'DRAFT_EXISTING', name: `DEMO — ${campaign.campaign_id} …` }),
      createDraftForWeek: async () => { throw new Error('DUPLICATE: must not create when one exists'); },
      updateDraftMessageMetadata: async (args) => { Object.assign(capture, args); return { ok: true }; },
      updateCampaignName: async (id, name) => { capture.renamedTo = name; return { ok: true }; },
    },
  });
}

test('reuse patches the GENERATED preview when the calendar had none; no duplicate; HTML unchanged', async () => {
  const capture = {};
  const noPreview = { ...CAMPAIGN, preview_text: null };
  const deps = reuseDeps(noPreview, 'Improve workplace slip prevention. Compare 14 options, in stock now.', capture);
  const r = await runLiveCampaign({ ...ctx, options: { campaign: 'RDD-2026-W33' } }, deps);
  assert.strictEqual(r.klaviyo.reused, true);
  assert.strictEqual(deps._calls.createDraft, 0);            // no duplicate created
  assert.strictEqual(deps._calls.attach, 1);                 // HTML/template behaviour unchanged
  assert.strictEqual(capture.campaignId, 'DRAFT_EXISTING');
  assert.strictEqual(capture.subject, CAMPAIGN.subject_line);
  assert.strictEqual(capture.previewText, 'Improve workplace slip prevention. Compare 14 options, in stock now.');
});

test('reuse renames the draft to a non-DEMO name that still contains the campaign_id', async () => {
  const capture = {};
  const deps = reuseDeps({ ...CAMPAIGN, preview_text: null }, 'gen preview', capture);
  await runLiveCampaign({ ...ctx, options: { campaign: 'RDD-2026-W33' } }, deps);
  assert.ok(capture.renamedTo, 'a rename was issued');
  assert.ok(!/DEMO/i.test(capture.renamedTo), 'the new name is not labeled DEMO');
  assert.ok(capture.renamedTo.includes('RDD-2026-W33'), 'the new name keeps the campaign_id (no-duplicate lookup)');
});

test('create passes a non-DEMO draft name that contains the campaign_id', async () => {
  let created = null;
  const c = { ...CAMPAIGN, preview_text: null };
  const deps = baseDeps({
    calendarService: {
      listCampaigns: async () => [c], getCampaignById: async (id) => (id === c.campaign_id ? c : null),
      getCampaignByWeek: async () => c, getNextCampaign: async () => c,
    },
    runPipeline: async () => ({ ...stubPipelineResult(true), pkg: { preheader: 'gen', subject: 'Set Up a Healthier Study Space for the Whole Family' } }),
    draftService: {
      findDraftForCampaign: async () => null,
      createDraftForWeek: async (args) => { created = args; return { campaignId: 'DRAFT_NEW' }; },
      updateDraftMessageMetadata: async () => ({ ok: true }),
      updateCampaignName: async () => ({ ok: true }),
    },
  });
  await runLiveCampaign({ ...ctx, options: { campaign: 'RDD-2026-W33' } }, deps);
  assert.ok(created && created.name, 'a name was supplied at create');
  assert.ok(!/DEMO/i.test(created.name));
  assert.ok(created.name.includes('RDD-2026-W33'));
});

test('reuse preserves a valid calendar preview_text (priority 1) on the patch', async () => {
  const capture = {};
  const withPreview = { ...CAMPAIGN, preview_text: 'Grip that lasts. See our stair-safety picks.' };
  const deps = reuseDeps(withPreview, 'GENERATED — should NOT be used', capture);
  await runLiveCampaign({ ...ctx, options: { campaign: 'RDD-2026-W33' } }, deps);
  assert.strictEqual(capture.previewText, 'Grip that lasts. See our stair-safety picks.');
});

test('QA gate: a build with blockers NEVER reaches Klaviyo', async () => {
  const deps = baseDeps({ runPipeline: async () => stubPipelineResult(false) });
  await assert.rejects(() => runLiveCampaign(ctx, deps), QaBlocker);
  assert.strictEqual(deps._calls.createDraft, 0);
  assert.strictEqual(deps._calls.attach, 0);
  assert.strictEqual(deps._calls.estimate, 0);
});

test('no calendar campaign → ApprovalRequired (never reaches the pipeline write side)', async () => {
  const deps = baseDeps({
    calendarService: { listCampaigns: async () => [], getCampaignById: async () => null, getCampaignByWeek: async () => null, getNextCampaign: async () => null },
  });
  await assert.rejects(() => runLiveCampaign(ctx, deps), ApprovalRequired);
  assert.strictEqual(deps._calls.attach, 0);
});

test('preview text: when the calendar has none, the GENERATED preheader reaches the draft (§6.24)', async () => {
  let captured = null;
  const noPreview = { ...CAMPAIGN, preview_text: null };
  const deps = baseDeps({
    calendarService: {
      listCampaigns: async () => [noPreview],
      getCampaignById: async (id) => (id === noPreview.campaign_id ? noPreview : null),
      getCampaignByWeek: async () => noPreview,
      getNextCampaign: async () => noPreview,
    },
    runPipeline: async () => ({ ...stubPipelineResult(true), pkg: { preheader: 'Improve workplace slip prevention. Compare 14 options, in stock now.' } }),
    draftService: {
      findDraftForCampaign: async () => null,
      createDraftForWeek: async (args) => { captured = args; return { campaignId: 'DRAFT_NEW' }; },
    },
  });
  await runLiveCampaign({ ...ctx, options: { campaign: 'RDD-2026-W33' } }, deps);
  assert.strictEqual(captured.campaign.preview_text, 'Improve workplace slip prevention. Compare 14 options, in stock now.');
});

test('preview text: a valid calendar preview_text is used unchanged (§6.24 priority 1)', async () => {
  let captured = null;
  const withPreview = { ...CAMPAIGN, preview_text: 'Grip that lasts. See our stair-safety picks.' };
  const deps = baseDeps({
    calendarService: {
      listCampaigns: async () => [withPreview],
      getCampaignById: async (id) => (id === withPreview.campaign_id ? withPreview : null),
      getCampaignByWeek: async () => withPreview,
      getNextCampaign: async () => withPreview,
    },
    runPipeline: async () => ({ ...stubPipelineResult(true), pkg: { preheader: 'GENERATED — should NOT be used' } }),
    draftService: {
      findDraftForCampaign: async () => null,
      createDraftForWeek: async (args) => { captured = args; return { campaignId: 'DRAFT_NEW' }; },
    },
  });
  await runLiveCampaign({ ...ctx, options: { campaign: 'RDD-2026-W33' } }, deps);
  assert.strictEqual(captured.campaign.preview_text, 'Grip that lasts. See our stair-safety picks.');
});

test('a missing sender is a hard stop before any draft', async () => {
  const deps = baseDeps({ sender: { fromEmail: null } });
  await assert.rejects(() => runLiveCampaign(ctx, deps));
  assert.strictEqual(deps._calls.attach, 0);
});

// ── Approved-creative attachment (opt-in per campaign) ─────────────────────
// When a campaign has a registered approved Output HTML, the orchestrator attaches
// THAT creative verbatim (no regeneration), keeps duplicate protection + audience
// + draft-only, and takes subject/preview from the registry.
const CLEAN_HTML =
  '<!DOCTYPE html><html><head><title>t</title></head><body>' +
  '<div style="display:none;max-height:0;mso-hide:all">preheader</div>' +
  '<a href="https://assets-ss-wheat.vercel.app/hero.png"><img src="https://cdn.example.com/a.jpg" width="188" height="188" /></a>' +
  '<a href="{% unsubscribe_link %}">Unsubscribe</a>' +
  '</body></html>';

function approvedFileDeps(overrides = {}) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'approved-'));
  const file = path.join(dir, 'SS-2026-W32.html');
  fs.writeFileSync(file, CLEAN_HTML);
  return baseDeps({
    // never call the pipeline in this mode — throwing proves it is skipped
    runPipeline: async () => { throw new Error('pipeline MUST NOT run for an approved-attach campaign'); },
    loadApprovedHtml: () => ({ htmlPath: file, htmlRel: 'Brands/SS/…/SS-2026-W32.html', subject: 'Fix it strong. Built to last.', previewText: 'Approved preview line.' }),
    ...overrides,
  });
}

test('approved-attach: attaches the approved creative verbatim, skips the pipeline, nothing sent', async () => {
  let created = null;
  const deps = approvedFileDeps({
    draftService: {
      findDraftForCampaign: async () => null,
      createDraftForWeek: async (args) => { created = args; return { campaignId: 'DRAFT_NEW' }; },
      updateDraftMessageMetadata: async () => ({ ok: true }),
      updateCampaignName: async () => ({ ok: true }),
    },
  });
  const r = await runLiveCampaign({ ...ctx, options: { campaign: 'RDD-2026-W33' } }, deps);
  assert.strictEqual(r.klaviyo.creativeSource.kind, 'approved');
  assert.strictEqual(r.klaviyo.sendStatus, 'NOT_APPROVED_TO_SEND');
  assert.strictEqual(deps._calls.attach, 1);
  // subject + preview come from the registry (match the approved creative)
  assert.strictEqual(created.campaign.subject_line, 'Fix it strong. Built to last.');
  assert.strictEqual(created.campaign.preview_text, 'Approved preview line.');
});

test('approved-attach: an existing draft is REUSED (no duplicate) with the approved creative', async () => {
  const deps = approvedFileDeps({
    draftService: {
      findDraftForCampaign: async () => ({ id: 'DRAFT_EXISTING', name: 'SS-2026-32: old' }),
      createDraftForWeek: async () => { throw new Error('must not create when one exists'); },
      updateDraftMessageMetadata: async () => ({ ok: true }),
      updateCampaignName: async () => ({ ok: true }),
    },
  });
  const r = await runLiveCampaign({ ...ctx, options: { campaign: 'RDD-2026-W33' } }, deps);
  assert.strictEqual(r.klaviyo.reused, true);
  assert.strictEqual(r.klaviyo.draftId, 'DRAFT_EXISTING');
  assert.strictEqual(deps._calls.createDraft, 0);
  assert.strictEqual(deps._calls.attach, 1);
  assert.strictEqual(r.klaviyo.creativeSource.kind, 'approved');
});

test('approved-attach: a registered file that fails QA is blocked before Klaviyo', async () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'approved-bad-'));
  const file = path.join(dir, 'bad.html');
  // an anchor with an empty href → bad-hrefs blocker (§6.7)
  fs.writeFileSync(file, '<!DOCTYPE html><html><head><title>t</title></head><body><a href="">x</a></body></html>');
  const deps = approvedFileDeps({
    loadApprovedHtml: () => ({ htmlPath: file, htmlRel: 'bad.html', subject: 'S', previewText: 'P' }),
  });
  await assert.rejects(() => runLiveCampaign({ ...ctx, options: { campaign: 'RDD-2026-W33' } }, deps), QaBlocker);
  assert.strictEqual(deps._calls.attach, 0);
  assert.strictEqual(deps._calls.createDraft, 0);
});

test('approved-attach: a registered-but-missing file is a hard stop (never invents)', async () => {
  const deps = approvedFileDeps({
    loadApprovedHtml: () => ({ htmlPath: path.join(os.tmpdir(), 'does-not-exist-xyz.html'), htmlRel: 'missing.html', subject: 'S', previewText: 'P' }),
  });
  await assert.rejects(() => runLiveCampaign({ ...ctx, options: { campaign: 'RDD-2026-W33' } }, deps), ApprovalRequired);
  assert.strictEqual(deps._calls.attach, 0);
});
