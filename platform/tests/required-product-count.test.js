// Required Product Count Unification — regression tests (SYSTEM PATCH).
//
// Bug: buildPackage()/curate() capped the curated selection at
// platformConfig.product.defaultCount (hardcoded fallback 16), completely
// independent of the brand's own configured target (SS/RDD = 18) and of the
// LATER required-count gate in pipeline.js (which already read the correct
// campaign > brand > platform priority chain). So an 18-product SS/RDD
// Weekly could never actually reach 18 even with dozens of valid candidates
// — curate() had already truncated to 16 before the real requirement was
// even checked.
//
// Fix: pipeline.js resolves requiredCount ONCE (resolveRequiredProductCount,
// exported from platform/workflow/pipeline.js) and threads that SAME value
// into buildPackage() as `targetCount`, into candidate-fetch sizing, and into
// the post-curation gate. These tests exercise the real exported functions —
// never a second, hand-copied resolution chain.

'use strict';

const { test } = require('node:test');
const assert = require('node:assert');
const { buildPackage } = require('../ai/copy');
const { resolveRequiredProductCount } = require('../workflow/pipeline');

const ok = (id, over = {}) => ({
  id, name: `P${id}`, url: `https://x.com/${id}/`, imageUrl: `https://cdn.x.com/${id}.jpg`,
  priceLabel: 'AUD $10.00', desc: 'Cat', isVisible: true, availability: 'available',
  inventoryTracking: 'product', inventoryLevel: 10, ...over,
});

const BRAND = {
  identity: {
    displayName: { value: 'Test Brand' },
    allProductsUrl: { value: 'https://x.com/products/' },
  },
};

const CAMPAIGN = { campaign_id: 'X-2026-1', topic_category: 'Widgets' };
const SLOT = { type: 'weekly', isoWeek: '2026-W01' };
const CATEGORY = { name: 'Widgets', url: 'https://x.com/widgets/' };

// ---------------------------------------------------------------------------
// A. SS Weekly, 30 valid candidates, target 18 → curate exactly 18, not 16
// ---------------------------------------------------------------------------
test('A: SS Weekly with 30 valid candidates curates exactly 18 (not the old 16 cap)', () => {
  const brand = { product: { defaultCount: 18 } };
  const platformConfig = { product: { defaultCount: 16 } };
  const requiredCount = resolveRequiredProductCount({ campaign: {}, brand, platformConfig });
  assert.strictEqual(requiredCount, 18);

  const candidates = Array.from({ length: 30 }, (_, i) => ok(i + 1));
  const pkg = buildPackage({
    brand: { ...BRAND, ...brand }, slot: SLOT, products: candidates,
    config: platformConfig, campaign: CAMPAIGN, category: CATEGORY, targetCount: requiredCount,
  });

  assert.strictEqual(pkg.products.length, 18, 'must reach the brand target of 18, not fall back to 16');
});

// ---------------------------------------------------------------------------
// B. RDD Weekly, 25 valid candidates, target 18 → curate exactly 18
// ---------------------------------------------------------------------------
test('B: RDD Weekly with 25 valid candidates curates exactly 18', () => {
  const brand = { product: { defaultCount: 18 } };
  const platformConfig = { product: { defaultCount: 16 } };
  const requiredCount = resolveRequiredProductCount({ campaign: {}, brand, platformConfig });
  assert.strictEqual(requiredCount, 18);

  const candidates = Array.from({ length: 25 }, (_, i) => ok(i + 1));
  const pkg = buildPackage({
    brand: { ...BRAND, ...brand }, slot: SLOT, products: candidates,
    config: platformConfig, campaign: CAMPAIGN, category: CATEGORY, targetCount: requiredCount,
  });

  assert.strictEqual(pkg.products.length, 18);
});

// ---------------------------------------------------------------------------
// C. campaign.product_count = 12 overrides brand default of 18
// ---------------------------------------------------------------------------
test('C: explicit campaign.product_count (12) overrides brand default (18)', () => {
  const campaign = { ...CAMPAIGN, product_count: 12 };
  const brand = { product: { defaultCount: 18 } };
  const platformConfig = { product: { defaultCount: 16 } };
  const requiredCount = resolveRequiredProductCount({ campaign, brand, platformConfig });
  assert.strictEqual(requiredCount, 12);

  const candidates = Array.from({ length: 20 }, (_, i) => ok(i + 1));
  const pkg = buildPackage({
    brand: { ...BRAND, ...brand }, slot: SLOT, products: candidates,
    config: platformConfig, campaign, category: CATEGORY, targetCount: requiredCount,
  });

  assert.strictEqual(pkg.products.length, 12, 'campaign-level override wins even though brand default is higher');
});

// ---------------------------------------------------------------------------
// D. SC (no brand product config) curates 16 where applicable
// ---------------------------------------------------------------------------
test('D: SC (no brand product config) curates the platform default of 16', () => {
  const brand = {}; // SC has no product section
  const platformConfig = { product: { defaultCount: 16 } };
  const requiredCount = resolveRequiredProductCount({ campaign: {}, brand, platformConfig });
  assert.strictEqual(requiredCount, 16);

  const candidates = Array.from({ length: 20 }, (_, i) => ok(i + 1));
  const pkg = buildPackage({
    brand: { ...BRAND, ...brand }, slot: SLOT, products: candidates,
    config: platformConfig, campaign: CAMPAIGN, category: CATEGORY, targetCount: requiredCount,
  });

  assert.strictEqual(pkg.products.length, 16);
});

// ---------------------------------------------------------------------------
// E. Only 17 valid candidates for an 18-product campaign → the target is
//    never silently lowered to what's available; the post-curation gate
//    (pipeline.js: `if (pkg.products.length < requiredCount)`) must BLOCK.
// ---------------------------------------------------------------------------
test('E: 17 valid candidates against an 18-product target — gate condition fires, no silent downgrade', () => {
  const brand = { product: { defaultCount: 18 } };
  const platformConfig = { product: { defaultCount: 16 } };
  const requiredCount = resolveRequiredProductCount({ campaign: {}, brand, platformConfig });
  assert.strictEqual(requiredCount, 18, 'the target itself must still read 18, never quietly 17');

  const candidates = Array.from({ length: 17 }, (_, i) => ok(i + 1));
  const pkg = buildPackage({
    brand: { ...BRAND, ...brand }, slot: SLOT, products: candidates,
    config: platformConfig, campaign: CAMPAIGN, category: CATEGORY, targetCount: requiredCount,
  });

  // curate()'s even-grid trim takes 17 down to 16 — still short of 18 either way.
  assert.ok(pkg.products.length < requiredCount, `${pkg.products.length} must be < ${requiredCount}`);
  // This is exactly pipeline.js's real (and only) gate condition — reproduced
  // here, not re-derived, to prove the run would throw ApprovalRequired rather
  // than silently export a short grid.
});
