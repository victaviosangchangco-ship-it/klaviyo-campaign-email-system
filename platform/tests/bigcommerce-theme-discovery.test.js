// Verified fallback product discovery for a themed campaign whose EXACT
// resolved category currently holds too few (or zero) live products
// (RDD-2026-39 validation: "Acrylic Displays" resolved correctly but the
// category had 0 products). Offline, no network — a fake `bc` client plays
// the BigCommerce client role (same pattern as bigcommerce-isolation.test.js's
// resolveCategoryByName tests).
//
// Discovery order under test (never reordered, never skipped):
//   1. exact resolved category   2. child categories   3. name-matched
//   categories   4. catalog keyword search.
// filterThemeRelevant / resolveThemeRelevantProducts remain the sole authority
// on which discovered candidates actually qualify — discovery only widens the
// pool, it never grants relevance itself.

'use strict';

const { test } = require('node:test');
const assert = require('node:assert');

const { discoverThemeCandidates } = require('../integrations/bigcommerce/adapter');
const { resolveThemeRelevantProducts, filterThemeRelevant } = require('../ai/theme-relevance');
const { buildCampaignThemePackage } = require('../workflow/campaign-theme-package');
const { IntegrationError } = require('../common/errors');

const CAMPAIGN = {
  campaign_id: 'RDD-2026-39',
  brand: 'RDD',
  topic_category_slug: 'promotional-sale',
  campaign_name: 'Spring Refresh Sale – Acrylic Displays 15% Off',
  topic_category: 'Acrylic Displays',
  subject_line: 'Refresh Your Displays This Spring',
  key_topic: '15% off selected acrylic display products.',
  promotion: { code: 'SPRING15', text: '15% off acrylic displays' },
};
const themePkg = buildCampaignThemePackage(CAMPAIGN);

const prod = (id, name) => ({ id, name, url: `https://x/${id}`, imageUrl: `https://x/${id}.jpg`, price: '10.00', salePrice: null, isVisible: true, availability: 'available', inventoryTracking: 'product', inventoryLevel: 10 });

// A fake catalog: the exact category (515, Acrylic Display) is EMPTY. A child
// category (Acrylic Countertop Displays) has one relevant product. A sibling
// category matched purely by NAME (Acrylic Sign Holders) has another. A
// keyword search surfaces one more relevant hit PLUS one unrelated product
// that must be rejected by the relevance gate downstream.
function fakeBc({ withSearch = true } = {}) {
  const categories = [
    { id: 515, name: 'Acrylic Display', parent_id: 0 },
    { id: 520, name: 'Acrylic Countertop Displays', parent_id: 515 }, // child
    { id: 530, name: 'Acrylic Sign Holders', parent_id: 0 },          // name-match only
    { id: 540, name: 'Ergonomic Office Chairs', parent_id: 0 },       // unrelated, must never be pulled in
  ];
  const byCategory = {
    515: [],
    520: [prod(1, 'Acrylic Countertop Riser')],
    530: [prod(2, 'Acrylic Sign Holder A5')],
  };
  const bc = {
    resolveCategory: async (name) => categories.find((c) => c.name === name) || null,
    getAllCategories: async () => categories,
    getProductsByCategoryId: async (id) => byCategory[id] || [],
    buildUrl: (custom, fallback) => `https://retaildisplaydirect.com.au${fallback}`,
  };
  if (withSearch) {
    bc.searchProducts = async (term) => {
      if (/acrylic/i.test(term)) return [prod(3, 'Acrylic Displays Stand'), prod(4, 'Ergonomic Office Chair')]; // one relevant (name matches the family phrase), one not
      return [];
    };
  }
  return bc;
}

test('4. empty exact category triggers verified fallback discovery (tier 2: child category)', async () => {
  const bc = fakeBc({ withSearch: false });
  const result = await discoverThemeCandidates(bc, { themePkg, count: 10 });
  assert.strictEqual(result.tiers.exact, 0, 'the exact category really is empty');
  assert.ok(result.tiers.children >= 1, 'the child category contributed at least one candidate');
  assert.ok(result.products.some((p) => p.id === 1), 'the child-category product is in the pool');
});

test('5. a relevant product in another valid (name-matched) related category can be discovered', async () => {
  const bc = fakeBc({ withSearch: false });
  const result = await discoverThemeCandidates(bc, { themePkg, count: 10 });
  assert.ok(result.tiers.nameMatch >= 1, 'the name-matched sibling category contributed a candidate');
  assert.ok(result.products.some((p) => p.id === 2), 'the name-matched-category product is in the pool');
  // The unrelated category (Ergonomic Office Chairs) must never be queried/pulled in by tiers 2/3.
  assert.ok(!result.products.some((p) => p.name === 'Ergonomic Office Chair'), 'unrelated category never contributes via tiers 1-3');
});

test('6. an unrelated catalog-search (tier 4) result is REJECTED by the relevance gate', async () => {
  const bc = fakeBc({ withSearch: true });
  const result = await discoverThemeCandidates(bc, { themePkg, count: 10 });
  assert.ok(result.tiers.search >= 1, 'tier 4 (catalog search) ran and contributed candidates');
  // Both the relevant and the unrelated search hit are present in the RAW pool...
  assert.ok(result.products.some((p) => p.name === 'Acrylic Displays Stand'));
  assert.ok(result.products.some((p) => p.name === 'Ergonomic Office Chair'));
  // ...but the deterministic relevance gate keeps only the relevant one.
  const relevant = filterThemeRelevant(result.products, themePkg);
  assert.ok(relevant.some((p) => p.name === 'Acrylic Displays Stand'));
  assert.ok(!relevant.some((p) => p.name === 'Ergonomic Office Chair'), 'the relevance gate is authoritative, never bypassed by a broader search hit');
});

test('7. zero relevant results after full fallback produces INSUFFICIENT_THEME_RELEVANT_PRODUCTS (via resolveThemeRelevantProducts)', async () => {
  // A catalog where NOTHING — at any tier — supports the theme.
  const bc = {
    resolveCategory: async () => ({ id: 515, name: 'Acrylic Display' }),
    getAllCategories: async () => [
      { id: 515, name: 'Acrylic Display', parent_id: 0 },
      { id: 540, name: 'Ergonomic Office Chairs', parent_id: 0 },
    ],
    getProductsByCategoryId: async (id) => (id === 540 ? [prod(9, 'Ergonomic Office Chair')] : []),
    buildUrl: () => 'https://retaildisplaydirect.com.au/acrylic-display/',
    searchProducts: async () => [prod(10, 'Ergonomic Office Chair Pro')],
  };
  const min = 4;
  const gated = await resolveThemeRelevantProducts({
    candidates: [],
    themePkg,
    min,
    fetchFallback: () => discoverThemeCandidates(bc, { themePkg, count: 10 }),
  });
  assert.strictEqual(gated.themeRelevant.length, 0, 'nothing at any tier supports the theme');
  assert.ok(gated.themeRelevant.length < min, 'this is exactly the condition pipeline.js uses to throw INSUFFICIENT_THEME_RELEVANT_PRODUCTS');
});

test('8. promotional campaign safety: the SPRING15 promotion never widens product scope beyond the theme', async () => {
  // RDD-2026-39 has a real promotion (SPRING15 / "15% off acrylic displays"), but
  // discovery/relevance must be driven ENTIRELY by topicCategory/searchTerms —
  // a product must never be admitted merely because a promotion exists.
  assert.ok(themePkg.promotion, 'the theme package does carry the promotion (for copy), but...');
  const candidates = [
    prod(1, 'Acrylic Countertop Riser'),      // on-theme
    { ...prod(2, 'Clearance Office Chair'), desc: 'Clearance' }, // "on sale" in spirit, but NOT acrylic
  ];
  candidates[0].desc = 'Acrylic Display';
  const relevant = filterThemeRelevant(candidates, themePkg);
  assert.strictEqual(relevant.length, 1);
  assert.strictEqual(relevant[0].id, 1, 'only the on-theme product survives, regardless of the promotion being present');
});

test('category genuinely not found (no name-fallback possible) still stops rather than substitutes', async () => {
  const bc = {
    resolveCategory: async () => null,
    getAllCategories: async () => [],
  };
  await assert.rejects(() => discoverThemeCandidates(bc, { themePkg: { topicCategory: 'Nonexistent Category', searchTerms: [] } }), IntegrationError);
});
