// Multi-Category Resolver (SYSTEM PATCH, 2026-09). The calendar's
// product_categories sometimes names more than one category for a single
// campaign, comma-separated (e.g. RDD-45 "Rope Barriers and Posts,
// Retractable Barriers and Posts, Expandable Barriers"; SS-48 "Statutory
// Safety Signs, Tactile Indicators, Anti-Slip Stair Nosing"). Before this
// patch, resolveCategoryByName tried to match the WHOLE comma-joined string
// as one category name — which can never match a real BigCommerce category —
// so every multi-category campaign threw "Category not found" and the run
// stopped (2026-09 audit finding, Phase 12). These tests cover
// splitCategoryNames (pure) and resolveMultiCategoryProducts (bc-injected,
// same offline pattern as discoverThemeCandidates).

'use strict';

const { test } = require('node:test');
const assert = require('node:assert');

const { splitCategoryNames, resolveMultiCategoryProducts } = require('../integrations/bigcommerce/adapter');
const { IntegrationError } = require('../common/errors');

// --- splitCategoryNames (pure) ----------------------------------------------

test('splitCategoryNames: single category → one part, unchanged', () => {
  assert.deepStrictEqual(splitCategoryNames('Acrylic Displays'), ['Acrylic Displays']);
});

test('splitCategoryNames: comma-separated → multiple trimmed parts', () => {
  assert.deepStrictEqual(
    splitCategoryNames('Rope Barriers and Posts, Retractable Barriers and Posts, Expandable Barriers'),
    ['Rope Barriers and Posts', 'Retractable Barriers and Posts', 'Expandable Barriers']
  );
});

test('splitCategoryNames: tolerates ragged whitespace and empty segments', () => {
  assert.deepStrictEqual(splitCategoryNames('  A ,B,, C  ,'), ['A', 'B', 'C']);
});

test('splitCategoryNames: a slash is NOT a delimiter — kept as part of one literal name', () => {
  // Only comma is used as a delimiter (confirmed against the live calendars —
  // no slash-delimited product_categories value has been observed). A name
  // that happens to contain a slash is passed through as ONE category name.
  assert.deepStrictEqual(splitCategoryNames('Bollards, Vehicle & Parking Protection'), ['Bollards', 'Vehicle & Parking Protection']);
  assert.deepStrictEqual(splitCategoryNames('Signage/Display'), ['Signage/Display']);
});

test('splitCategoryNames: null/empty → empty array', () => {
  assert.deepStrictEqual(splitCategoryNames(null), []);
  assert.deepStrictEqual(splitCategoryNames(''), []);
  assert.deepStrictEqual(splitCategoryNames('   '), []);
});

// --- resolveMultiCategoryProducts (bc-injected, offline) --------------------

const prod = (id, name, categoryId) => ({ id, name, url: `https://x/${id}`, imageUrl: `https://x/${id}.jpg`, price: '10.00', salePrice: null, isVisible: true, availability: 'available', inventoryTracking: 'product', inventoryLevel: 10, _cat: categoryId });

function fakeBc() {
  const categories = [
    { id: 501, name: 'Rope Barriers and Posts' },
    { id: 499, name: 'Retractable Barriers and Posts' },
    { id: 556, name: 'Expandable Barriers' },
  ];
  const byCategory = {
    501: [prod(1, 'Rope Barrier Post', 501), prod(2, 'Rope Barrier Kit', 501)],
    499: [prod(3, 'Retractable Belt Barrier', 499)],
    556: [prod(1, 'Rope Barrier Post', 556)], // SAME product id as in 501 — must be deduped, not double-counted
  };
  return {
    resolveCategory: async (name) => categories.find((c) => c.name === name) || null,
    getAllCategories: async () => categories,
    getProductsByCategoryId: async (id) => byCategory[id] || [],
    buildUrl: (custom, fallback) => `https://retaildisplaydirect.com.au${fallback}`,
  };
}

test('resolveMultiCategoryProducts: single category resolves exactly as before (one category, its own products)', async () => {
  const bc = fakeBc();
  const result = await resolveMultiCategoryProducts(bc, 'Rope Barriers and Posts', { count: 24, brandCode: 'RDD' });
  assert.strictEqual(result.category.name, 'Rope Barriers and Posts');
  assert.strictEqual(result.category.id, 501);
  assert.strictEqual(result.category.ids, undefined, 'single-category result carries no .ids array');
  assert.strictEqual(result.products.length, 2);
});

test('resolveMultiCategoryProducts: multi-category merges + dedupes products by id across all resolved categories', async () => {
  const bc = fakeBc();
  const result = await resolveMultiCategoryProducts(
    bc,
    'Rope Barriers and Posts, Retractable Barriers and Posts, Expandable Barriers',
    { count: 24, brandCode: 'RDD' }
  );
  assert.strictEqual(result.category.name, 'Rope Barriers and Posts, Retractable Barriers and Posts, Expandable Barriers');
  assert.deepStrictEqual(result.category.ids, [501, 499, 556]);
  // 4 raw items across 3 categories, but product id 1 appears in BOTH 501 and 556 →
  // deduped to 3 distinct products, not double-counted.
  assert.strictEqual(result.products.length, 3);
  const ids = result.products.map((p) => p.id).sort();
  assert.deepStrictEqual(ids, [1, 2, 3]);
});

test('resolveMultiCategoryProducts: every part invalid → IntegrationError naming the whole value', async () => {
  const bc = fakeBc();
  await assert.rejects(
    () => resolveMultiCategoryProducts(bc, 'Nonexistent Category', { count: 24, brandCode: 'RDD' }),
    (err) => err instanceof IntegrationError && /not found/.test(err.message)
  );
});

test('resolveMultiCategoryProducts: PARTIALLY valid list → IntegrationError naming exactly the unresolved part(s), never silently drops it', async () => {
  const bc = fakeBc();
  await assert.rejects(
    () => resolveMultiCategoryProducts(bc, 'Rope Barriers and Posts, Nonexistent Category', { count: 24, brandCode: 'RDD' }),
    (err) =>
      err instanceof IntegrationError &&
      /PARTIALLY resolvable/.test(err.message) &&
      /"Nonexistent Category"/.test(err.message) &&
      /"Rope Barriers and Posts"/.test(err.message)
  );
});
