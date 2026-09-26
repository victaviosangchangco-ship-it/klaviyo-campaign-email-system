// ---------------------------------------------------------------------------
// inventory-safety.test.js — Fail-Closed Inventory Safety Gate tests.
//
// Proves the 14 required scenarios (A-N) from the Inventory Safety spec:
//   A. in-stock + relevant + correct storefront → accepted
//   B. out-of-stock + relevant → rejected
//   C. unknown/unresolved stock state → rejected
//   D. wrong-brand / wrong-storefront → rejected (tested in bigcommerce-isolation)
//   E. in-stock but off-theme → rejected (tested in theme-relevance-hardening)
//   F. Hero product out of stock → generation blocked
//   G. 18 requested but only 14 valid → generation blocked, not padded
//   H. product goes OOS after discovery but before HTML export → blocked
//   I. product goes OOS after local approval but before Klaviyo sync → blocked
//   J. variant-tracked product with no purchasable variant → rejected
//   K. non-stock-tracked purchasable product → handled correctly
//   L. SS inventory safety → verified through shared pipeline
//   M. RDD inventory safety → verified through shared pipeline
//   N. SC uses same pipeline → same rules apply
// ---------------------------------------------------------------------------

'use strict';

const { test } = require('node:test');
const assert = require('node:assert');

const {
  isCampaignPurchasable,
  filterPurchasable,
  assertAllPurchasable,
  PASS,
  FAIL,
} = require('../integrations/bigcommerce/inventory');

const { curate } = require('../ai/copy');
const { checkProductInventory } = require('../qa/validators');

// --- helper: build a product with overrides --------------------------------
function makeProduct(overrides = {}) {
  return {
    id: 100,
    name: 'Test Product',
    url: 'https://www.example.com.au/test-product/',
    imageUrl: 'https://cdn.example.com/test.jpg',
    price: 99.00,
    salePrice: null,
    priceLabel: 'AUD $99.00',
    desc: 'Test Category',
    isVisible: true,
    availability: 'available',
    inventoryTracking: 'product',
    inventoryLevel: 10,
    dateModified: '2026-09-20T00:00:00Z',
    ...overrides,
  };
}

// ===========================================================================
// A. in-stock + relevant + correct storefront → accepted
// ===========================================================================
test('A: in-stock, visible, available, product-tracked product → PASS', () => {
  const v = isCampaignPurchasable(makeProduct(), { brandCode: 'RDD' });
  assert.strictEqual(v.status, PASS);
  assert.ok(v.reason.includes('in stock'));
});

test('A: in-stock variant-tracked product → PASS', () => {
  const v = isCampaignPurchasable(makeProduct({ inventoryTracking: 'variant', inventoryLevel: 25 }));
  assert.strictEqual(v.status, PASS);
  assert.ok(v.reason.includes('variant'));
});

// ===========================================================================
// B. out-of-stock + relevant → rejected
// ===========================================================================
test('B: product-tracked, inventoryLevel=0 → FAIL', () => {
  const v = isCampaignPurchasable(makeProduct({ inventoryLevel: 0 }));
  assert.strictEqual(v.status, FAIL);
  assert.ok(v.reason.includes('out of stock'));
});

test('B: product-tracked, inventoryLevel=-3 → FAIL', () => {
  const v = isCampaignPurchasable(makeProduct({ inventoryLevel: -3 }));
  assert.strictEqual(v.status, FAIL);
  assert.ok(v.reason.includes('out of stock'));
});

// ===========================================================================
// C. unknown/unresolved stock state → rejected (fail closed)
// ===========================================================================
test('C: inventoryTracking=null → FAIL (unknown tracking mode)', () => {
  const v = isCampaignPurchasable(makeProduct({ inventoryTracking: null }));
  assert.strictEqual(v.status, FAIL);
  assert.ok(v.reason.includes('unknown'));
});

test('C: inventoryTracking=undefined → FAIL', () => {
  const p = makeProduct();
  delete p.inventoryTracking;
  const v = isCampaignPurchasable(p);
  assert.strictEqual(v.status, FAIL);
});

test('C: inventoryTracking="product" but inventoryLevel=null → FAIL (unresolved)', () => {
  const v = isCampaignPurchasable(makeProduct({ inventoryLevel: null }));
  assert.strictEqual(v.status, FAIL);
  assert.ok(v.reason.includes('unresolved'));
});

test('C: inventoryTracking="product" but inventoryLevel=undefined → FAIL', () => {
  const p = makeProduct();
  delete p.inventoryLevel;
  const v = isCampaignPurchasable(p);
  assert.strictEqual(v.status, FAIL);
});

test('C: inventoryTracking="variant" but inventoryLevel=NaN → FAIL', () => {
  const v = isCampaignPurchasable(makeProduct({ inventoryTracking: 'variant', inventoryLevel: NaN }));
  assert.strictEqual(v.status, FAIL);
  assert.ok(v.reason.includes('unresolved'));
});

test('C: inventoryTracking="mystery" → FAIL (unknown mode)', () => {
  const v = isCampaignPurchasable(makeProduct({ inventoryTracking: 'mystery' }));
  assert.strictEqual(v.status, FAIL);
  assert.ok(v.reason.includes('unknown'));
});

// ===========================================================================
// D. wrong-brand / wrong-storefront → rejected
// (structural brand isolation is covered by bigcommerce-isolation.test.js;
//  here we verify the audit trail carries the brand code)
// ===========================================================================
test('D: verdict audit trail carries brand code', () => {
  const v = isCampaignPurchasable(makeProduct(), { brandCode: 'SS', storeDomain: 'https://safetysector.com.au' });
  assert.strictEqual(v.product.brand, 'SS');
  assert.strictEqual(v.product.storeDomain, 'https://safetysector.com.au');
});

// ===========================================================================
// F. Hero product out of stock → generation blocked
// ===========================================================================
test('F: hero product OOS triggers blocker', () => {
  const heroProduct = makeProduct({ id: 1379, name: 'Hero Display', inventoryLevel: 0 });
  const v = isCampaignPurchasable(heroProduct);
  assert.strictEqual(v.status, FAIL);
  assert.ok(v.reason.includes('out of stock'));
});

// ===========================================================================
// G. 18 requested but only 14 valid → generation blocked, not padded
// ===========================================================================
test('G: curate() throws when fewer than min products pass inventory gate', () => {
  const products = [];
  for (let i = 0; i < 14; i++) products.push(makeProduct({ id: i + 1 }));
  // Add 4 OOS products — total 18 but only 14 purchasable
  for (let i = 15; i <= 18; i++) products.push(makeProduct({ id: i, inventoryLevel: 0 }));

  // min=16 means the curate gate should throw (only 14 pass)
  assert.throws(
    () => curate(products, { count: 18, min: 16 }),
    (err) => err.message.includes('14 verified product(s)')
  );
});

test('G: curate() succeeds when enough products pass inventory gate', () => {
  const products = [];
  for (let i = 0; i < 18; i++) products.push(makeProduct({ id: i + 1 }));
  const selected = curate(products, { count: 18, min: 4 });
  assert.strictEqual(selected.length, 18);
});

// ===========================================================================
// H. product goes OOS after discovery but before HTML export → blocked
// ===========================================================================
test('H: assertAllPurchasable blocks when a product is OOS', () => {
  const products = [
    makeProduct({ id: 1 }),
    makeProduct({ id: 2, inventoryLevel: 0 }), // went OOS
    makeProduct({ id: 3 }),
  ];
  assert.throws(
    () => assertAllPurchasable(products, { context: 'pre-render test', brandCode: 'SS' }),
    (err) => err.code === 'INVENTORY_SAFETY_BLOCK' && err.rejected.length === 1
  );
});

test('H: assertAllPurchasable passes when all products are purchasable', () => {
  const products = [makeProduct({ id: 1 }), makeProduct({ id: 2 }), makeProduct({ id: 3 })];
  assert.doesNotThrow(() => assertAllPurchasable(products, { context: 'test', brandCode: 'RDD' }));
});

// ===========================================================================
// I. product goes OOS after approval but before Klaviyo sync → blocked
// (uses the same assertAllPurchasable — the orchestrator calls it before Klaviyo)
// ===========================================================================
test('I: pre-Klaviyo check blocks on OOS product', () => {
  const products = [
    makeProduct({ id: 10, inventoryLevel: 5 }),
    makeProduct({ id: 11, inventoryLevel: 0 }),
  ];
  assert.throws(
    () => assertAllPurchasable(products, { context: 'pre-Klaviyo test', brandCode: 'RDD' }),
    (err) => err.code === 'INVENTORY_SAFETY_BLOCK'
  );
});

// ===========================================================================
// J. variant-tracked product with no purchasable variant → rejected
// ===========================================================================
test('J: variant-tracked, aggregate inventoryLevel=0 → FAIL', () => {
  const v = isCampaignPurchasable(makeProduct({ inventoryTracking: 'variant', inventoryLevel: 0 }));
  assert.strictEqual(v.status, FAIL);
  assert.ok(v.reason.includes('all variants depleted'));
});

test('J: variant-tracked, aggregate inventoryLevel=-1 → FAIL', () => {
  const v = isCampaignPurchasable(makeProduct({ inventoryTracking: 'variant', inventoryLevel: -1 }));
  assert.strictEqual(v.status, FAIL);
});

// ===========================================================================
// K. non-stock-tracked purchasable product → handled correctly
// ===========================================================================
test('K: inventoryTracking="none", visible, available → PASS', () => {
  const v = isCampaignPurchasable(makeProduct({ inventoryTracking: 'none', inventoryLevel: 0 }));
  assert.strictEqual(v.status, PASS);
  assert.ok(v.reason.includes('non-stock-tracked'));
});

test('K: inventoryTracking="none" but not visible → FAIL', () => {
  const v = isCampaignPurchasable(makeProduct({ inventoryTracking: 'none', isVisible: false }));
  assert.strictEqual(v.status, FAIL);
  assert.ok(v.reason.includes('not visible'));
});

test('K: inventoryTracking="none" but disabled → FAIL', () => {
  const v = isCampaignPurchasable(makeProduct({ inventoryTracking: 'none', availability: 'disabled' }));
  assert.strictEqual(v.status, FAIL);
  assert.ok(v.reason.includes('disabled'));
});

// ===========================================================================
// L/M/N. SS, RDD, SC all use the same shared pipeline (same isCampaignPurchasable)
// ===========================================================================
for (const brandCode of ['SS', 'RDD', 'SC']) {
  test(`${brandCode}: OOS product rejected through the shared pipeline`, () => {
    const v = isCampaignPurchasable(makeProduct({ inventoryLevel: 0 }), { brandCode });
    assert.strictEqual(v.status, FAIL);
  });

  test(`${brandCode}: in-stock product accepted through the shared pipeline`, () => {
    const v = isCampaignPurchasable(makeProduct({ inventoryLevel: 5 }), { brandCode });
    assert.strictEqual(v.status, PASS);
  });
}

// ===========================================================================
// filterPurchasable bulk operation
// ===========================================================================
test('filterPurchasable separates accepted from rejected correctly', () => {
  const products = [
    makeProduct({ id: 1, inventoryLevel: 10 }),
    makeProduct({ id: 2, inventoryLevel: 0 }),
    makeProduct({ id: 3, inventoryTracking: 'none' }),
    makeProduct({ id: 4, isVisible: false }),
    makeProduct({ id: 5, inventoryTracking: null }),
  ];
  const { accepted, rejected } = filterPurchasable(products);
  assert.strictEqual(accepted.length, 2); // id 1 (product-tracked in stock) + id 3 (none)
  assert.strictEqual(rejected.length, 3); // id 2 (OOS) + id 4 (not visible) + id 5 (unknown tracking)
  assert.deepStrictEqual(accepted.map((a) => a.product.id), [1, 3]);
});

// ===========================================================================
// QA validator: checkProductInventory
// ===========================================================================
test('QA: checkProductInventory returns PASS when all products purchasable', () => {
  const products = [makeProduct({ id: 1 }), makeProduct({ id: 2 })];
  const f = checkProductInventory(products, { brandCode: 'SS' });
  assert.strictEqual(f.severity, 'pass');
  assert.strictEqual(f.rule, 'product-inventory-current');
});

test('QA: checkProductInventory returns BLOCKER when any product is OOS', () => {
  const products = [makeProduct({ id: 1 }), makeProduct({ id: 2, inventoryLevel: 0 })];
  const f = checkProductInventory(products, { brandCode: 'RDD' });
  assert.strictEqual(f.severity, 'blocker');
  assert.strictEqual(f.rule, 'product-inventory-current');
  assert.ok(f.failures.length === 1);
});

test('QA: checkProductInventory returns PASS for empty product list (approved-attach)', () => {
  const f = checkProductInventory([], { brandCode: 'SS' });
  assert.strictEqual(f.severity, 'pass');
});

// ===========================================================================
// Edge cases: null product, missing fields
// ===========================================================================
test('null product → FAIL', () => {
  const v = isCampaignPurchasable(null);
  assert.strictEqual(v.status, FAIL);
});

test('product missing priceLabel → FAIL', () => {
  const v = isCampaignPurchasable(makeProduct({ priceLabel: null }));
  assert.strictEqual(v.status, FAIL);
  assert.ok(v.reason.includes('price'));
});

test('product missing imageUrl → FAIL', () => {
  const v = isCampaignPurchasable(makeProduct({ imageUrl: '' }));
  assert.strictEqual(v.status, FAIL);
  assert.ok(v.reason.includes('image'));
});

test('product missing url → FAIL', () => {
  const v = isCampaignPurchasable(makeProduct({ url: '' }));
  assert.strictEqual(v.status, FAIL);
  assert.ok(v.reason.includes('URL'));
});

// ===========================================================================
// Audit trail: verdict product structure
// ===========================================================================
test('verdict carries full audit fields', () => {
  const v = isCampaignPurchasable(makeProduct({ id: 42, name: 'Audit Product' }), {
    brandCode: 'SS',
    storeDomain: 'https://safetysector.com.au',
  });
  assert.strictEqual(v.product.id, 42);
  assert.strictEqual(v.product.name, 'Audit Product');
  assert.strictEqual(v.product.brand, 'SS');
  assert.strictEqual(v.product.storeDomain, 'https://safetysector.com.au');
  assert.ok(v.product.verifiedAt);
  assert.ok(v.product.inventoryTracking !== undefined);
  assert.ok(v.product.inventoryLevel !== undefined);
  assert.ok(v.product.availability !== undefined);
  assert.ok(v.product.isVisible !== undefined);
});
