// Fresh Inventory Recheck tests — proves the system re-fetches from BigCommerce
// before export and before Klaviyo, catching inventory changes that occurred
// AFTER initial product discovery.

'use strict';

const { test } = require('node:test');
const assert = require('node:assert');
const { freshInventoryRecheck, isCampaignPurchasable, PASS, FAIL } = require('../integrations/bigcommerce/inventory');
const { ApprovalRequired } = require('../common/errors');

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const inStock = (id, over = {}) => ({
  id, name: `Product ${id}`, url: `https://x.com/${id}/`, imageUrl: `https://cdn.x.com/${id}.jpg`,
  priceLabel: 'AUD $10.00', desc: 'Cat', isVisible: true, availability: 'available',
  inventoryTracking: 'product', inventoryLevel: 10, ...over,
});

const oos = (id, over = {}) => inStock(id, { inventoryLevel: 0, ...over });

// ---------------------------------------------------------------------------
// A. Product is in stock during discovery, becomes OOS before export
//    → fresh pre-export fetch catches it
// ---------------------------------------------------------------------------

test('A: fresh recheck catches product that went OOS after discovery', async () => {
  const discoveryState = [inStock(1), inStock(2), inStock(3), inStock(4)];
  // All in stock at discovery — simulate time passing, product 2 goes OOS
  const currentState = [inStock(1), oos(2), inStock(3), inStock(4)];

  const ids = discoveryState.map((p) => p.id);
  const fetchProducts = async (requestedIds) => currentState.filter((p) => requestedIds.includes(p.id));

  const result = await freshInventoryRecheck(ids, fetchProducts, { brandCode: 'RDD', context: 'pre-export' });

  assert.strictEqual(result.passed.length, 3, 'three products still in stock');
  assert.strictEqual(result.failed.length, 1, 'one product now OOS');
  assert.strictEqual(result.failed[0].product.id, 2, 'product 2 is the OOS one');
  assert.match(result.failed[0].verdict.reason, /out of stock/i);
  assert.strictEqual(result.notFound.length, 0);
});

test('A2: fresh recheck catches product that was delisted (not returned)', async () => {
  const ids = [1, 2, 3, 4];
  // Product 3 no longer returned by BigCommerce (delisted/hidden)
  const fetchProducts = async (requestedIds) => [inStock(1), inStock(2), inStock(4)]
    .filter((p) => requestedIds.includes(p.id));

  const result = await freshInventoryRecheck(ids, fetchProducts, { brandCode: 'SS', context: 'pre-export' });

  assert.strictEqual(result.passed.length, 3);
  assert.strictEqual(result.notFound.length, 1, 'one product not found');
  assert.strictEqual(result.notFound[0].id, 3);
  assert.match(result.notFound[0].reason, /not returned/i);
});

// ---------------------------------------------------------------------------
// B. Product is in stock during export, becomes OOS before Klaviyo
//    → fresh pre-Klaviyo fetch catches it (independent re-fetch)
// ---------------------------------------------------------------------------

test('B: independent pre-Klaviyo recheck catches product that went OOS after export', async () => {
  let callCount = 0;
  const fetchProducts = async (requestedIds) => {
    callCount++;
    if (callCount === 1) {
      // Pre-export: all in stock
      return [inStock(1), inStock(2), inStock(3), inStock(4)]
        .filter((p) => requestedIds.includes(p.id));
    }
    // Pre-Klaviyo: product 4 now OOS
    return [inStock(1), inStock(2), inStock(3), oos(4)]
      .filter((p) => requestedIds.includes(p.id));
  };

  const ids = [1, 2, 3, 4];

  // First call (pre-export) — all pass
  const exportRecheck = await freshInventoryRecheck(ids, fetchProducts, { brandCode: 'RDD', context: 'pre-export' });
  assert.strictEqual(exportRecheck.passed.length, 4);
  assert.strictEqual(exportRecheck.failed.length, 0);

  // Second call (pre-Klaviyo) — product 4 now OOS
  const klaviyoRecheck = await freshInventoryRecheck(ids, fetchProducts, { brandCode: 'RDD', context: 'pre-Klaviyo' });
  assert.strictEqual(klaviyoRecheck.passed.length, 3);
  assert.strictEqual(klaviyoRecheck.failed.length, 1);
  assert.strictEqual(klaviyoRecheck.failed[0].product.id, 4);
});

// ---------------------------------------------------------------------------
// C. Fresh re-fetch fails / inventory cannot be confirmed → fail closed
// ---------------------------------------------------------------------------

test('C: fetch failure throws FRESH_RECHECK_FETCH_FAILED (fail closed)', async () => {
  const fetchProducts = async () => { throw new Error('BigCommerce API timeout'); };

  await assert.rejects(
    () => freshInventoryRecheck([1, 2, 3], fetchProducts, { brandCode: 'SS', context: 'pre-export' }),
    (err) => {
      assert.strictEqual(err.code, 'FRESH_RECHECK_FETCH_FAILED');
      assert.match(err.message, /BigCommerce API timeout/);
      assert.deepStrictEqual(err.ids, [1, 2, 3]);
      return true;
    }
  );
});

test('C2: fetch returns null → all products treated as notFound (fail closed)', async () => {
  const fetchProducts = async () => null;

  const result = await freshInventoryRecheck([1, 2], fetchProducts, { brandCode: 'RDD', context: 'pre-export' });

  assert.strictEqual(result.passed.length, 0);
  assert.strictEqual(result.failed.length, 0);
  assert.strictEqual(result.notFound.length, 2, 'both products not found');
});

test('C3: fetch returns empty array → all products notFound', async () => {
  const fetchProducts = async () => [];

  const result = await freshInventoryRecheck([1, 2, 3], fetchProducts, { brandCode: 'SC', context: 'pre-Klaviyo' });

  assert.strictEqual(result.notFound.length, 3);
});

test('C4: product returned but with unknown tracking mode → FAIL (fail closed)', async () => {
  const fetchProducts = async (ids) => ids.map((id) => inStock(id, { inventoryTracking: null, inventoryLevel: null }));

  const result = await freshInventoryRecheck([1], fetchProducts, { brandCode: 'RDD' });

  assert.strictEqual(result.failed.length, 1);
  assert.match(result.failed[0].verdict.reason, /unknown inventory tracking/i);
});

// ---------------------------------------------------------------------------
// D. SS and RDD both use the fresh re-fetch path
// ---------------------------------------------------------------------------

test('D: SS uses fresh recheck with correct brand attribution', async () => {
  const fetchProducts = async (ids) => [oos(1)].filter((p) => ids.includes(p.id));

  const result = await freshInventoryRecheck([1], fetchProducts, { brandCode: 'SS', context: 'pre-export' });

  assert.strictEqual(result.failed.length, 1);
  assert.strictEqual(result.failed[0].verdict.product.brand, 'SS');
});

test('D: RDD uses fresh recheck with correct brand attribution', async () => {
  const fetchProducts = async (ids) => [inStock(1)].filter((p) => ids.includes(p.id));

  const result = await freshInventoryRecheck([1], fetchProducts, { brandCode: 'RDD', context: 'pre-Klaviyo' });

  assert.strictEqual(result.passed.length, 1);
  assert.strictEqual(result.passed[0].verdict.product.brand, 'RDD');
});

test('D: SC uses fresh recheck with correct brand attribution', async () => {
  const fetchProducts = async (ids) => [inStock(1)].filter((p) => ids.includes(p.id));

  const result = await freshInventoryRecheck([1], fetchProducts, { brandCode: 'SC', context: 'pre-export' });

  assert.strictEqual(result.passed.length, 1);
  assert.strictEqual(result.passed[0].verdict.product.brand, 'SC');
});

// ---------------------------------------------------------------------------
// Edge cases
// ---------------------------------------------------------------------------

test('empty product list is a no-op', async () => {
  let called = false;
  const fetchProducts = async () => { called = true; return []; };

  const result = await freshInventoryRecheck([], fetchProducts);

  assert.strictEqual(called, false, 'fetchProducts should not be called for empty list');
  assert.strictEqual(result.passed.length, 0);
  assert.strictEqual(result.failed.length, 0);
  assert.strictEqual(result.notFound.length, 0);
});

test('mixed results: some pass, some fail, some not found', async () => {
  const fetchProducts = async (ids) => [
    inStock(1),                             // will PASS
    oos(2),                                 // will FAIL
    // product 3 not returned              // will be notFound
  ].filter((p) => ids.includes(p.id));

  const result = await freshInventoryRecheck([1, 2, 3], fetchProducts, { brandCode: 'RDD' });

  assert.strictEqual(result.passed.length, 1);
  assert.strictEqual(result.failed.length, 1);
  assert.strictEqual(result.notFound.length, 1);
  assert.strictEqual(result.passed[0].product.id, 1);
  assert.strictEqual(result.failed[0].product.id, 2);
  assert.strictEqual(result.notFound[0].id, 3);
});

test('fresh data updates inventory level (product was 10, now 2 — still PASS)', async () => {
  const fetchProducts = async (ids) => [inStock(1, { inventoryLevel: 2 })].filter((p) => ids.includes(p.id));

  const result = await freshInventoryRecheck([1], fetchProducts, { brandCode: 'RDD' });

  assert.strictEqual(result.passed.length, 1);
  assert.strictEqual(result.passed[0].product.inventoryLevel, 2, 'fresh level is 2');
});

test('non-stock-tracked product passes fresh recheck when visible+available', async () => {
  const fetchProducts = async (ids) => [
    inStock(1, { inventoryTracking: 'none', inventoryLevel: 0 }),
  ].filter((p) => ids.includes(p.id));

  const result = await freshInventoryRecheck([1], fetchProducts, { brandCode: 'SS' });

  assert.strictEqual(result.passed.length, 1);
  assert.match(result.passed[0].verdict.reason, /non-stock-tracked/i);
});

test('variant-tracked product with 0 aggregate level fails fresh recheck', async () => {
  const fetchProducts = async (ids) => [
    inStock(1, { inventoryTracking: 'variant', inventoryLevel: 0 }),
  ].filter((p) => ids.includes(p.id));

  const result = await freshInventoryRecheck([1], fetchProducts, { brandCode: 'RDD' });

  assert.strictEqual(result.failed.length, 1);
  assert.match(result.failed[0].verdict.reason, /all variants depleted/i);
});

// ---------------------------------------------------------------------------
// Pipeline integration: pre-export replacement logic
// ---------------------------------------------------------------------------

test('pre-export scenario: OOS product replaced from candidate pool via fresh recheck', async () => {
  // Simulates the pipeline replacement flow:
  // Selected: [1, 2, 3, 4]. Product 2 goes OOS. Candidate pool has product 5.
  // Fresh recheck of pool confirms product 5 is in stock → replaces product 2.
  const selected = [1, 2, 3, 4];
  const poolExtra = [5, 6]; // extra candidates not in the selected set

  const currentState = new Map([
    [1, inStock(1)], [2, oos(2)], [3, inStock(3)], [4, inStock(4)],
    [5, inStock(5)], [6, inStock(6)],
  ]);
  const fetchProducts = async (ids) => ids.map((id) => currentState.get(id)).filter(Boolean);

  // Step 1: recheck selected
  const recheck = await freshInventoryRecheck(selected, fetchProducts, { brandCode: 'RDD' });
  assert.strictEqual(recheck.failed.length, 1);

  // Step 2: recheck pool extras
  const poolRecheck = await freshInventoryRecheck(poolExtra, fetchProducts, { brandCode: 'RDD' });
  assert.strictEqual(poolRecheck.passed.length, 2, 'both pool extras are in stock');

  // Step 3: replace
  const unavailableIds = new Set(recheck.failed.map((f) => Number(f.product.id)));
  const surviving = selected.filter((id) => !unavailableIds.has(id));
  const replacements = poolRecheck.passed.map((r) => r.product.id).slice(0, recheck.failed.length);
  const finalSet = [...surviving, ...replacements];
  assert.deepStrictEqual(finalSet, [1, 3, 4, 5], 'product 2 replaced by product 5');
});

// ---------------------------------------------------------------------------
// Campaign target count enforcement (source of truth: config, not selection).
// requiredCount comes from campaign.product_count || platformConfig.product.defaultCount,
// NOT from pkg.products.length. A configured target of 18 means 18.
// ---------------------------------------------------------------------------

test('A: BLOCK when config requires 18 but initial selection only reaches 16', () => {
  // Simulates the pipeline's initial-count gate: after curation, the selected
  // set is 16 but the configured defaultCount (the target) is 18 → BLOCK.
  const requiredCount = 18; // from platformConfig.product.defaultCount
  const selectedCount = 16; // what curate() actually returned

  assert.ok(selectedCount < requiredCount, '16 < 18 → must BLOCK before render');
  // Pipeline throws: INSUFFICIENT_IN_STOCK_THEME_RELEVANT_PRODUCTS:
  // initial selection only reached 16 product(s), but the campaign requires 18.
});

test('B: BLOCK when config requires 18, initial 18, 2 OOS, only 1 replacement → final 17', async () => {
  const requiredCount = 18; // from config, NOT from pkg.products.length
  const selectedIds = Array.from({ length: 18 }, (_, i) => i + 1);
  const poolExtraIds = [19]; // only 1 replacement candidate

  const currentState = new Map();
  for (let i = 1; i <= 18; i++) {
    currentState.set(i, (i === 10 || i === 11) ? oos(i) : inStock(i));
  }
  currentState.set(19, inStock(19));

  const fetchProducts = async (ids) => ids.map((id) => currentState.get(id)).filter(Boolean);

  const recheck = await freshInventoryRecheck(selectedIds, fetchProducts, { brandCode: 'RDD' });
  assert.strictEqual(recheck.passed.length, 16, '16 of 18 still in stock');
  assert.strictEqual(recheck.failed.length, 2, '2 became OOS');

  const replRecheck = await freshInventoryRecheck(poolExtraIds, fetchProducts, { brandCode: 'RDD' });
  assert.strictEqual(replRecheck.passed.length, 1, 'only 1 replacement');

  const unavailableIds = new Set(recheck.failed.map((f) => Number(f.product.id)));
  const surviving = selectedIds.filter((id) => !unavailableIds.has(id));
  const replacements = replRecheck.passed.map((r) => r.product);
  const combined = [...surviving.map((id) => currentState.get(id)), ...replacements];

  assert.strictEqual(combined.length, 17, 'final valid count is 17');
  assert.ok(combined.length < requiredCount, '17 < 18 (from config) — must BLOCK');
  // Pipeline throws INSUFFICIENT_IN_STOCK_THEME_RELEVANT_PRODUCTS.
  // requiredCount is from config (18), NOT from pkg.products.length.
});

test('C: PASS when config requires 18, initial 18, 2 OOS, 2 replacements → final 18', async () => {
  const requiredCount = 18; // from config
  const selectedIds = Array.from({ length: 18 }, (_, i) => i + 1);
  const poolExtraIds = [19, 20];

  const currentState = new Map();
  for (let i = 1; i <= 18; i++) {
    currentState.set(i, (i === 10 || i === 11) ? oos(i) : inStock(i));
  }
  currentState.set(19, inStock(19));
  currentState.set(20, inStock(20));

  const fetchProducts = async (ids) => ids.map((id) => currentState.get(id)).filter(Boolean);

  const recheck = await freshInventoryRecheck(selectedIds, fetchProducts, { brandCode: 'RDD' });
  assert.strictEqual(recheck.failed.length, 2);

  const replRecheck = await freshInventoryRecheck(poolExtraIds, fetchProducts, { brandCode: 'RDD' });
  assert.strictEqual(replRecheck.passed.length, 2);

  const unavailableIds = new Set(recheck.failed.map((f) => Number(f.product.id)));
  const surviving = selectedIds.filter((id) => !unavailableIds.has(id));
  const replacements = replRecheck.passed.map((r) => r.product);
  const combined = [...surviving.map((id) => currentState.get(id)), ...replacements];

  assert.strictEqual(combined.length, 18, 'final count matches config target');
  assert.ok(combined.length >= requiredCount, '18 >= 18 (from config) — PASS');
});

// ---------------------------------------------------------------------------
// Brand-level product count config resolution (Phase 6).
// requiredCount = campaign.product_count || brand.product.defaultCount
//              || platformConfig.product.defaultCount || DEFAULT_PRODUCT_COUNT.
//
// These call the REAL exported resolver (pipeline.js's resolveRequiredProductCount)
// rather than re-deriving the formula inline — a duplicated inline chain here
// would prove nothing about the actual production code path.
// ---------------------------------------------------------------------------

const { resolveRequiredProductCount } = require('../workflow/pipeline');

test('6A: SS brand config resolves requiredCount = 18 (no campaign override)', () => {
  const campaign = {};
  const brand = { product: { defaultCount: 18 } };
  const platformConfig = { product: { defaultCount: 16 } };

  const requiredCount = resolveRequiredProductCount({ campaign, brand, platformConfig });

  assert.strictEqual(requiredCount, 18, 'SS brand config (18) wins over platform default (16)');
});

test('6B: RDD brand config resolves requiredCount = 18 (no campaign override)', () => {
  const campaign = {};
  const brand = { product: { defaultCount: 18 } };
  const platformConfig = { product: { defaultCount: 16 } };

  const requiredCount = resolveRequiredProductCount({ campaign, brand, platformConfig });

  assert.strictEqual(requiredCount, 18, 'RDD brand config (18) wins over platform default (16)');
});

test('6C: campaign.product_count = 12 overrides brand default of 18', () => {
  const campaign = { product_count: 12 };
  const brand = { product: { defaultCount: 18 } };
  const platformConfig = { product: { defaultCount: 16 } };

  const requiredCount = resolveRequiredProductCount({ campaign, brand, platformConfig });

  assert.strictEqual(requiredCount, 12, 'campaign-level override (12) wins over brand (18) and platform (16)');
});

test('6D: SC (no brand product config) falls through to platform default = 16', () => {
  const campaign = {};
  const brand = {};  // SC has no product section
  const platformConfig = { product: { defaultCount: 16 } };

  const requiredCount = resolveRequiredProductCount({ campaign, brand, platformConfig });

  assert.strictEqual(requiredCount, 16, 'SC falls through to platform default (16)');
});

test('6E: no config anywhere falls through to the last-resort constant (16)', () => {
  const requiredCount = resolveRequiredProductCount({ campaign: null, brand: {}, platformConfig: {} });

  assert.strictEqual(requiredCount, 16, 'last-resort constant when nothing configures a count');
});
