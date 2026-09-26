// One-command production entry point (SYSTEM PATCH: Campaign ID → Hosted Hero
// → Klaviyo Draft). Offline — createCampaign is injected (mocked); the actual
// generation/QA/hero/Klaviyo mechanics it wraps are already covered by
// live-orchestrator.test.js, campaign-generator.test.js, hero-resolver.test.js
// and weekly-hero-and-promotion.test.js (never duplicated here).

'use strict';

const { test } = require('node:test');
const assert = require('node:assert');

const { parseCampaignIdFromText, generateFromNaturalCommand, formatShortSummary } = require('../engine/natural-generate');

// ── 1-4: exact campaign_id extraction, never an ISO-week guess ─────────────

test('1. natural command extracts the exact RDD campaign_id', () => {
  const parsed = parseCampaignIdFromText('Please generate this Weekly Campaign RDD-2026-14');
  assert.deepStrictEqual(parsed, { campaignId: 'RDD-2026-14', brand: 'RDD', year: '2026', seq: '14' });
});

test('2. natural command extracts the exact SS campaign_id', () => {
  const parsed = parseCampaignIdFromText('Please generate this Weekly Campaign SS-2026-14');
  assert.deepStrictEqual(parsed, { campaignId: 'SS-2026-14', brand: 'SS', year: '2026', seq: '14' });
});

test('3. natural command extracts the exact SC campaign_id', () => {
  const parsed = parseCampaignIdFromText('Please generate this Weekly Campaign SC-2026-14');
  assert.deepStrictEqual(parsed, { campaignId: 'SC-2026-14', brand: 'SC', year: '2026', seq: '14' });
});

test('4. the campaign_id determines brand without ever treating the suffix as an ISO week', () => {
  // "14" is campaign #14 — never "week 14" — and a "Wxx"-shaped phrase must not
  // be misparsed as if it were an exact campaign_id.
  assert.strictEqual(parseCampaignIdFromText('generate the RDD week 14 campaign'), null, 'no exact <CODE>-<YYYY>-<NN> present — never guessed from "week 14"');
  const parsed = parseCampaignIdFromText('Please generate this Weekly Campaign RDD-2026-14 for the spring range');
  assert.strictEqual(parsed.brand, 'RDD');
  assert.strictEqual(parsed.seq, '14');
  assert.ok(!('isoWeek' in parsed), 'no ISO week is ever derived from the sequence number');
});

test('unknown brand prefix is never guessed into a known brand', () => {
  assert.strictEqual(parseCampaignIdFromText('generate XYZ-2026-14'), null);
});

// ── dispatch: delegates ENTIRELY to createCampaign (no second generation path) ─

function fakeSuccess(overrides = {}) {
  return {
    ok: true,
    campaignId: 'RDD-2026-14',
    campaign: { campaign_id: 'RDD-2026-14', topic_category: 'Acrylic Displays' },
    pkg: { products: [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }], coupon: { code: 'SPRING15', offerText: '15% off acrylic displays' } },
    qa: { pass: true, counts: { blocker: 0, warn: 0, pass: 13 } },
    exportResult: { paths: { draft: 'Brands/RDD/Campaigns/Weekly/Draft/RDD-2026-14-draft-v1.html' } },
    klaviyo: { draftId: 'K123', reused: false, sendStatus: 'NOT_APPROVED_TO_SEND' },
    ...overrides,
  };
}

test('exact command → createCampaign called with brand/type/campaign derived from the id + klaviyo:true (no separate --brand/--type needed)', async () => {
  let captured = null;
  const createCampaign = async (opts) => { captured = opts; return fakeSuccess(); };
  await generateFromNaturalCommand('Please generate this Weekly Campaign RDD-2026-14', {}, { createCampaign });
  assert.strictEqual(captured.brand, 'RDD');
  assert.strictEqual(captured.type, 'weekly');
  assert.strictEqual(captured.campaign, 'RDD-2026-14');
  assert.strictEqual(captured.klaviyo, true, 'auto-enables the full Klaviyo pipeline — the SAME one --klaviyo already runs');
});

test('12. brand (and therefore the correct Klaviyo account) is selected from the campaign_id — SS vs SC vs RDD', async () => {
  for (const [phrase, brand] of [['generate RDD-2026-14', 'RDD'], ['generate SS-2026-14', 'SS'], ['generate SC-2026-14', 'SC']]) {
    let captured = null;
    const createCampaign = async (opts) => { captured = opts; return fakeSuccess({ campaignId: `${brand}-2026-14` }); };
    // eslint-disable-next-line no-await-in-loop
    await generateFromNaturalCommand(phrase, {}, { createCampaign });
    assert.strictEqual(captured.brand, brand);
  }
});

test('no exact campaign_id in the text → never dispatches to createCampaign (no guessing)', async () => {
  let called = false;
  const createCampaign = async () => { called = true; return fakeSuccess(); };
  const result = await generateFromNaturalCommand('please generate a weekly campaign', {}, { createCampaign });
  assert.strictEqual(called, false);
  assert.strictEqual(result.ok, false);
  assert.match(result.error.message, /No exact campaign_id/);
});

// ── success / blocker response shape (sections 6-7) ────────────────────────

test('7/16/17. a successful run formats a short PASS summary; NOT_APPROVED_TO_SEND status is reflected as "ready for review", never approved', async () => {
  const createCampaign = async () => fakeSuccess();
  const result = await generateFromNaturalCommand('Please generate this Weekly Campaign RDD-2026-14', {}, { createCampaign });
  const summary = formatShortSummary(result);
  assert.match(summary, /Campaign: RDD-2026-14/);
  assert.match(summary, /Theme: Acrylic Displays/);
  assert.match(summary, /Hero: verified \+ hosted/);
  assert.match(summary, /Products: 4 theme-relevant/);
  assert.match(summary, /Promotion: 15% off acrylic displays \(SPRING15\)/);
  assert.match(summary, /Semantic QA: PASS/);
  assert.match(summary, /Structural QA: PASS/);
  assert.match(summary, /Local Draft: Brands\/RDD\/Campaigns\/Weekly\/Draft\/RDD-2026-14-draft-v1\.html/);
  assert.match(summary, /Klaviyo Draft: created \(K123\)/);
  assert.match(summary, /Status: READY FOR HUMAN REVIEW/);
  assert.ok(!/approved to send/i.test(summary), 'never implies send-approval');
});

test('promotion=none is reported plainly when no coupon exists', async () => {
  const createCampaign = async () => fakeSuccess({ pkg: { products: [{ id: 1 }, { id: 2 }], coupon: null } });
  const result = await generateFromNaturalCommand('Please generate this Weekly Campaign RDD-2026-14', {}, { createCampaign });
  assert.match(formatShortSummary(result), /Promotion: none/);
});

test('13. an existing Draft being safely reused is reflected in the summary ("updated", not "created")', async () => {
  const createCampaign = async () => fakeSuccess({ klaviyo: { draftId: 'K999', reused: true, sendStatus: 'NOT_APPROVED_TO_SEND' } });
  const result = await generateFromNaturalCommand('Please generate this Weekly Campaign RDD-2026-14', {}, { createCampaign });
  assert.match(formatShortSummary(result), /Klaviyo Draft: updated \(K999\)/);
});

test('6/16. every upstream blocker (hero, theme, QA, ambiguity) results in a BLOCKED summary and zero Klaviyo dispatch beyond the single createCampaign call', async () => {
  const blockers = [
    { name: 'Error', message: 'HERO_ASSET_REQUIRED: campaign_id=RDD-2026-14 theme="Acrylic Displays" — no verified hero banner is declared…' },
    { name: 'Error', message: 'HERO_PUBLISH_REQUIRED: hero asset for RDD-2026-14 exists locally but is NOT yet live…' },
    { name: 'ApprovalRequired', message: 'INSUFFICIENT_THEME_RELEVANT_PRODUCTS: only 0 of 12 verified product(s)…' },
    { name: 'QaBlocker', message: 'QA did not pass for RDD-2026-14 (1 blocker(s)). Refusing to touch Klaviyo — fix blockers first.' },
    { name: 'ApprovalRequired', message: '2 RDD campaigns are planned for 2026-W38 (RDD-2026-14, RDD-2026-15). Pick one explicitly with --campaign <id>.' },
  ];
  for (const error of blockers) {
    let calls = 0;
    // eslint-disable-next-line no-loop-func
    const createCampaign = async () => { calls += 1; return { ok: false, error }; };
    // eslint-disable-next-line no-await-in-loop
    const result = await generateFromNaturalCommand('Please generate this Weekly Campaign RDD-2026-14', {}, { createCampaign });
    assert.strictEqual(calls, 1, 'createCampaign is invoked exactly once — no retry/second write attempt');
    const summary = formatShortSummary(result);
    assert.match(summary, /Status: BLOCKED/);
    assert.ok(summary.includes(error.message.split(':')[0]) || summary.includes(error.message), 'the specific blocker is surfaced, not swallowed');
  }
});

// ── 18: Draft/Output lifecycle is unaffected by this entry point ───────────

test("18. the natural-command path never mentions/implies writing Output/ — it only ever surfaces the Draft/ path", async () => {
  const createCampaign = async () => fakeSuccess();
  const result = await generateFromNaturalCommand('Please generate this Weekly Campaign RDD-2026-14', {}, { createCampaign });
  const summary = formatShortSummary(result);
  assert.ok(!/Output\//.test(summary), 'the short response never references Output/ (Draft-only lifecycle, unchanged from the prior patch)');
  assert.match(summary, /Local Draft: .*Draft\//);
});
