// Preview Text is mandatory + auto-generated (CLAUDE.md §6.24). Offline/pure:
// generation source-priority + type-awareness, calendar-service extras passthrough,
// buildCalendarPackage wiring, and the Klaviyo draft payload carrying the preview.

'use strict';

const { test } = require('node:test');
const assert = require('node:assert');

const { generatePreviewText, buildPackage } = require('../ai/copy');
const { normalizeCampaign } = require('../integrations/calendar/calendar-service');
const { buildCampaignPayload, createDraftCampaignService } = require('../integrations/klaviyo/draft-campaign-service');

const RDD35 = {
  campaign_id: 'RDD-2026-35',
  brand: 'RDD',
  campaign_type: 'product-insights',
  campaign_name: 'Reduce Slip Risks with Anti-Slip Stair Nosing',
  topic_category: 'Anti-Slip Stair Nosing',
  subject_line: 'Slips Cost More Than You Think – Anti-Slip Stair Nosing Guide',
  preview_text: null,
  key_topic: 'Improve workplace slip prevention.',
  promotion: null,
};
const CATEGORY = { id: 548, name: 'Anti Slip Stair Nosings', url: 'https://x/anti-slip-stair-nosings/' };

// 1. Calendar preview_text exists → preserved verbatim.
test('generatePreviewText: valid calendar preview_text is preserved verbatim', () => {
  const c = { ...RDD35, preview_text: 'Grip that lasts. See our stair-safety picks.' };
  assert.strictEqual(generatePreviewText({ campaign: c, category: CATEGORY, count: 14 }), 'Grip that lasts. See our stair-safety picks.');
});

// 2 & 3. Missing / empty → generated (non-empty, campaign-specific).
test('generatePreviewText: null preview_text → generated, campaign-specific', () => {
  const pv = generatePreviewText({ campaign: RDD35, category: CATEGORY, count: 14 });
  assert.ok(pv && pv.length > 0, 'must not be empty');
  assert.notStrictEqual(pv, RDD35.subject_line, 'must not just repeat the subject');
  assert.match(pv, /slip prevention/i, 'uses the real key_topic');
  assert.match(pv, /Anti Slip Stair Nosings/, 'names the actual theme/category');
  assert.match(pv, /14/, 'reflects the real product count');
  assert.ok(!/\s[–—]\s/.test(pv), 'no spaced en/em dash (§6.2)');
});

test('generatePreviewText: empty-string preview_text → generated (treated as missing)', () => {
  const pv = generatePreviewText({ campaign: { ...RDD35, preview_text: '   ' }, category: CATEGORY, count: 14 });
  assert.ok(pv.length > 0 && pv !== RDD35.subject_line);
  assert.match(pv, /slip prevention/i);
});

// 4. Type-aware: a real promotion is surfaced; no promo is never faked.
test('generatePreviewText: promotional type surfaces the REAL offer, never a fake one', () => {
  const promo = generatePreviewText({
    campaign: { campaign_type: 'promotional-sale', topic_category: 'Wheel Chocks', promotion: { code: 'CHOCK10', text: '10% off wheel chocks' }, preview_text: null },
    category: { name: 'Rubber Wheel Chocks' }, count: 8,
  });
  assert.match(promo, /10% off wheel chocks/i, 'uses the actual promo text');

  const noPromo = generatePreviewText({
    campaign: { campaign_type: 'promotional-sale', topic_category: 'Wheel Chocks', promotion: null, preview_text: null },
    category: { name: 'Rubber Wheel Chocks' }, count: 8,
  });
  assert.ok(!/%|off|sale|discount/i.test(noPromo), 'no fabricated discount when there is no promotion');
});

// calendar-service now preserves planning extras (so generation can use key_topic),
// while the 12 core fields are still guaranteed.
test('normalizeCampaign preserves planning extras but always guarantees the 12 core', () => {
  const c = normalizeCampaign({ campaign_id: 'RDD-2026-35', brand: 'RDD', key_topic: 'Improve workplace slip prevention.', tone: 'safety-focused' });
  assert.strictEqual(c.key_topic, 'Improve workplace slip prevention.');
  assert.strictEqual(c.tone, 'safety-focused');
  assert.strictEqual(c.subject_line, null); // core field still present, null-filled
  // a row with no extras still yields exactly the 12 core keys (content-calendar.json shape)
  const bare = normalizeCampaign({ campaign_id: 'X', brand: 'RDD' });
  assert.strictEqual(Object.keys(bare).length, 12);
});

// 5. buildCalendarPackage puts the generated preview into pkg.preheader.
test('buildPackage (calendar-driven) sets a generated pkg.preheader when calendar preview is null', () => {
  const products = Array.from({ length: 14 }, (_, i) => ({
    id: i, name: `ASN ${i}`, url: 'u', imageUrl: 'i', priceLabel: 'AUD $30.00', desc: 'Anti Slip Stair Nosings', isVisible: true,
  }));
  const pkg = buildPackage({
    brand: { code: 'RDD', identity: { displayName: { value: 'RDD' }, allProductsUrl: { value: 'https://x/products/' } } },
    slot: { isoWeek: '2026-W33', type: 'weekly' }, products,
    config: { product: { defaultCount: 16, minCount: 4 } }, campaign: RDD35, category: CATEGORY,
  });
  assert.ok(pkg.preheader && pkg.preheader.length > 0);
  assert.notStrictEqual(pkg.preheader, pkg.subject);
  assert.match(pkg.preheader, /slip prevention/i);
});

// 6. The Klaviyo draft payload carries the preview into content.preview_text.
test('buildCampaignPayload routes previewText into the campaign-message content.preview_text', () => {
  const payload = buildCampaignPayload({
    name: 'DEMO — RDD-2026-35', includedAudienceIds: ['RJbEzz'], subject: 'S',
    previewText: 'Improve workplace slip prevention. Compare 14 options, in stock now.', fromEmail: 'a@b.com',
  });
  const content = payload.data.attributes['campaign-messages'].data[0].attributes.content;
  assert.strictEqual(content.preview_text, 'Improve workplace slip prevention. Compare 14 options, in stock now.');
});

// updateDraftMessageMetadata MERGES subject + preview into the message content and
// never clobbers the sender fields (from_email/from_label) already on the draft.
test('updateDraftMessageMetadata patches subject+preview and preserves sender fields', async () => {
  const patches = [];
  const client = {
    post: async () => ({}),
    patch: async (p, b) => { patches.push({ p, b }); return { data: { id: 'MSG1' } }; },
    get: async (p) => {
      if (p.includes('MSG1')) {
        return { data: { id: 'MSG1', attributes: { content: { from_email: 'hello@rdd.com.au', from_label: 'RDD', subject: 'old subject', preview_text: '' } } } };
      }
      return { data: [{ id: 'MSG1' }] }; // the campaign-messages collection
    },
  };
  const svc = createDraftCampaignService({
    client,
    calendarService: { getNextCampaign: async () => null },
    listService: { resolveByName: async () => null },
    segmentService: { resolveByName: async () => null },
  });
  const res = await svc.updateDraftMessageMetadata({ campaignId: 'CID', subject: 'New Subject', previewText: 'New Preview' });
  assert.strictEqual(res.messageId, 'MSG1');
  const content = patches[0].b.data.attributes.content;
  assert.strictEqual(content.subject, 'New Subject');
  assert.strictEqual(content.preview_text, 'New Preview');
  assert.strictEqual(content.from_email, 'hello@rdd.com.au'); // preserved (merge, not replace)
  assert.strictEqual(content.from_label, 'RDD');
});

test('updateCampaignName PATCHes the campaign name (draft rename)', async () => {
  const patches = [];
  const client = { post: async () => ({}), get: async () => ({ data: [] }), patch: async (p, b) => { patches.push({ p, b }); return { data: { id: 'CID' } }; } };
  const svc = createDraftCampaignService({
    client, calendarService: { getNextCampaign: async () => null },
    listService: { resolveByName: async () => null }, segmentService: { resolveByName: async () => null },
  });
  const res = await svc.updateCampaignName('CID', 'RDD-2026-35: Set Up a Healthier Study Space for the Whole Family');
  assert.strictEqual(res.name, 'RDD-2026-35: Set Up a Healthier Study Space for the Whole Family');
  assert.match(patches[0].p, /\/campaigns\/CID\//);
  assert.strictEqual(patches[0].b.data.attributes.name, 'RDD-2026-35: Set Up a Healthier Study Space for the Whole Family');
});
