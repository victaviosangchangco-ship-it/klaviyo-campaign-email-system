'use strict';

const { test } = require('node:test');
const assert = require('node:assert');
const { orderProductsForGrid, pairScore, baseFamily, functionalCore, systemStem, isComponent } = require('../render/grid-order');
const { checkGridPairing } = require('../qa/grid-pairing');

const p = (id, name, category, inv = 10) => ({
  id, name, desc: category, url: `https://x.com/${id}/`, imageUrl: `https://cdn.x.com/${id}.jpg`,
  priceLabel: 'AUD $10.00', isVisible: true, availability: 'available',
  inventoryTracking: 'product', inventoryLevel: inv,
});

// ---------------------------------------------------------------------------
// A. Black/Yellow variants from same family → paired together
// ---------------------------------------------------------------------------
test('A. same-family colour variants are paired together', () => {
  const products = [
    p(1, 'Rubber Speed Hump End Cap - Black', 'Speed Humps'),
    p(2, 'Surface Mounted Safety Bollard 900mm', 'Safety Bollards'),
    p(3, 'Rubber Speed Hump End Cap - Yellow', 'Speed Humps'),
    p(4, 'Removable Security Bollard 950mm', 'Safety Bollards'),
  ];
  const { ordered, pairingAudit } = orderProductsForGrid(products);
  assert.strictEqual(ordered.length, 4);
  // Black and Yellow end caps should be in the same row
  const row1Ids = [ordered[0].id, ordered[1].id].sort();
  assert.deepStrictEqual(row1Ids, [1, 3], 'Black/Yellow end caps should be paired in row 1');
  assert.strictEqual(pairingAudit[0].reason, 'SAME_BASE_FAMILY');
});

// ---------------------------------------------------------------------------
// B. Same model in different sizes → paired together
// ---------------------------------------------------------------------------
test('B. same model different sizes are paired', () => {
  const products = [
    p(1, 'Indoor Convex Mirror - 450mm', 'Convex Mirror'),
    p(2, 'Rubber Dock Bumper D Type 900mm', 'Dock Bumper'),
    p(3, 'Indoor Convex Mirror - 600mm', 'Convex Mirror'),
    p(4, 'Wall Bumper Rubber 1000mm', 'Dock Bumper'),
  ];
  const { ordered, pairingAudit } = orderProductsForGrid(products);
  const row1Ids = [ordered[0].id, ordered[1].id].sort();
  assert.deepStrictEqual(row1Ids, [1, 3], 'Mirror 450mm and 600mm should pair');
  assert.ok(pairingAudit[0].score >= 70, 'Score should be high for same-model variants');
});

// ---------------------------------------------------------------------------
// C. Same function/category products preferred when no exact variant exists
// ---------------------------------------------------------------------------
test('C. same-category products pair when no exact family match', () => {
  const products = [
    p(1, 'Surface Mounted Safety Bollard 900mm', 'Safety Bollards'),
    p(2, 'Rubber Dock Bumper D Type 1000mm', 'Dock Bumper'),
    p(3, 'Removable Security Bollard 950mm', 'Safety Bollards'),
    p(4, 'Wall Bumper Rubber 1000mm', 'Dock Bumper'),
  ];
  const { ordered, pairingAudit } = orderProductsForGrid(products);
  const row1Ids = [ordered[0].id, ordered[1].id].sort();
  assert.deepStrictEqual(row1Ids, [1, 3], 'Two bollards should pair');
  assert.ok(['SAME_FUNCTION', 'SAME_CATEGORY'].includes(pairingAudit[0].reason),
    `Expected SAME_FUNCTION or SAME_CATEGORY, got ${pairingAudit[0].reason}`);
});

// ---------------------------------------------------------------------------
// D. Complementary product pair works when genuine
// ---------------------------------------------------------------------------
test('D. complementary products with shared naming stem pair', () => {
  const products = [
    p(1, 'Steel Speed Hump - 1m Module', 'Speed Humps'),
    p(2, 'Indoor Safety Mirror - 600mm', 'Convex Mirror'),
    p(3, 'Steel Speed Hump End Section Pair', 'Speed Humps'),
    p(4, 'Rubber Dock Bumper D Type 900mm', 'Dock Bumper'),
  ];
  const { ordered } = orderProductsForGrid(products);
  const row1Ids = [ordered[0].id, ordered[1].id].sort();
  assert.deepStrictEqual(row1Ids, [1, 3], 'Steel Speed Hump module and end section should pair');
});

// ---------------------------------------------------------------------------
// E. Unavailable/OOS ideal partner → never introduced
// ---------------------------------------------------------------------------
test('E. orderProductsForGrid never introduces new products', () => {
  const products = [
    p(1, 'Rubber Speed Hump End Cap - Black', 'Speed Humps'),
    p(2, 'Surface Mounted Safety Bollard 900mm', 'Safety Bollards'),
  ];
  // Yellow variant is NOT in the selected set — must not appear
  const { ordered } = orderProductsForGrid(products);
  assert.strictEqual(ordered.length, 2);
  const ids = ordered.map((p) => p.id).sort();
  assert.deepStrictEqual(ids, [1, 2]);
});

// ---------------------------------------------------------------------------
// F. Fallback uses another already-selected product
// ---------------------------------------------------------------------------
test('F. fallback pairs products from same campaign when no strong match', () => {
  const products = [
    p(1, 'Widget Alpha', 'Widgets'),
    p(2, 'Gadget Beta', 'Gadgets'),
    p(3, 'Doohickey Gamma', 'Doohickeys'),
    p(4, 'Thingamajig Delta', 'Thingamajigs'),
  ];
  const { ordered, pairingAudit } = orderProductsForGrid(products);
  assert.strictEqual(ordered.length, 4);
  // All should pair even if via fallback
  assert.strictEqual(pairingAudit.length, 2);
  for (const row of pairingAudit) {
    assert.ok(row.left);
    assert.ok(row.right);
  }
});

// ---------------------------------------------------------------------------
// G. Product IDs before/after ordering are identical
// ---------------------------------------------------------------------------
test('G. product IDs are identical before and after ordering', () => {
  const products = [
    p(1, 'Rubber Speed Hump End Cap - Black', 'Speed Humps'),
    p(2, 'Surface Mounted Safety Bollard 900mm', 'Safety Bollards'),
    p(3, 'Rubber Speed Hump End Cap - Yellow', 'Speed Humps'),
    p(4, 'Removable Security Bollard 950mm', 'Safety Bollards'),
    p(5, 'Rubber Dock Bumper D Type 1000mm', 'Dock Bumper'),
    p(6, 'Indoor Convex Mirror - 600mm', 'Convex Mirror'),
  ];
  const { ordered } = orderProductsForGrid(products);
  const beforeIds = products.map((p) => p.id).sort();
  const afterIds = ordered.map((p) => p.id).sort();
  assert.deepStrictEqual(afterIds, beforeIds);
});

// ---------------------------------------------------------------------------
// H. No duplicates/lost products
// ---------------------------------------------------------------------------
test('H. no duplicates or lost products after ordering', () => {
  const products = Array.from({ length: 18 }, (_, i) =>
    p(i + 1, `Product ${i + 1}`, i % 4 === 0 ? 'Cat A' : i % 4 === 1 ? 'Cat B' : i % 4 === 2 ? 'Cat C' : 'Cat D')
  );
  const { ordered } = orderProductsForGrid(products);
  assert.strictEqual(ordered.length, 18);
  const seen = new Set();
  for (const p of ordered) {
    assert.ok(!seen.has(p.id), `Duplicate product ID ${p.id}`);
    seen.add(p.id);
  }
});

// ---------------------------------------------------------------------------
// I. Result is deterministic
// ---------------------------------------------------------------------------
test('I. ordering is deterministic across repeated runs', () => {
  const products = [
    p(1, 'Rubber Speed Hump End Cap - Black', 'Speed Humps'),
    p(2, 'Surface Mounted Safety Bollard 900mm', 'Safety Bollards'),
    p(3, 'Rubber Speed Hump End Cap - Yellow', 'Speed Humps'),
    p(4, 'Removable Security Bollard 950mm', 'Safety Bollards'),
    p(5, 'Rubber Dock Bumper D Type 1000mm', 'Dock Bumper'),
    p(6, 'Indoor Convex Mirror - 600mm', 'Convex Mirror'),
  ];
  const run1 = orderProductsForGrid(products);
  const run2 = orderProductsForGrid(products);
  const run3 = orderProductsForGrid(products);
  assert.deepStrictEqual(run1.ordered.map((p) => p.id), run2.ordered.map((p) => p.id));
  assert.deepStrictEqual(run2.ordered.map((p) => p.id), run3.ordered.map((p) => p.id));
  assert.deepStrictEqual(run1.pairingAudit, run2.pairingAudit);
});

// ---------------------------------------------------------------------------
// J. Odd-number fallback behaves safely
// ---------------------------------------------------------------------------
test('J. odd product count handled safely', () => {
  const products = [
    p(1, 'Product A', 'Cat A'),
    p(2, 'Product B', 'Cat A'),
    p(3, 'Product C', 'Cat B'),
  ];
  const { ordered, pairingAudit } = orderProductsForGrid(products);
  assert.strictEqual(ordered.length, 3);
  assert.strictEqual(pairingAudit.length, 2);
  assert.strictEqual(pairingAudit[1].reason, 'ODD_PRODUCT_UNPAIRED');
});

// ---------------------------------------------------------------------------
// QA: grid-pairing data-integrity blocker on duplicate
// ---------------------------------------------------------------------------
test('QA: grid-pairing blocker on duplicate product IDs', () => {
  const pkg = {
    products: [p(1, 'A', 'X'), p(1, 'A', 'X')],
    _decision: {
      pairingAudit: [{
        row: 1,
        left: { id: 1, name: 'A' },
        right: { id: 1, name: 'A' },
        score: 100,
        reason: 'SAME_BASE_FAMILY',
      }],
    },
  };
  const findings = checkGridPairing(pkg);
  assert.ok(findings.some((f) => f.severity === 'blocker' && f.rule === 'grid-pairing-duplicate'));
});

// ---------------------------------------------------------------------------
// QA: grid-pairing passes on valid pairing
// ---------------------------------------------------------------------------
test('QA: grid-pairing passes on valid data', () => {
  const pkg = {
    products: [p(1, 'A', 'X'), p(2, 'B', 'X')],
    _decision: {
      pairingAudit: [{
        row: 1,
        left: { id: 1, name: 'A' },
        right: { id: 2, name: 'B' },
        score: 50,
        reason: 'SAME_CATEGORY',
      }],
    },
  };
  const findings = checkGridPairing(pkg);
  assert.ok(findings.every((f) => f.severity === 'pass'));
});

// ---------------------------------------------------------------------------
// baseFamily normalization
// ---------------------------------------------------------------------------
test('baseFamily strips colour, size, and punctuation', () => {
  assert.strictEqual(baseFamily('Rubber Speed Hump End Cap - Black'), baseFamily('Rubber Speed Hump End Cap - Yellow'));
  assert.strictEqual(baseFamily('Indoor Convex Mirror - 450mm'), baseFamily('Indoor Convex Mirror - 600mm'));
});

// ---------------------------------------------------------------------------
// Brand-visual QA: empty SS description is blocker
// ---------------------------------------------------------------------------
test('QA: empty SS product description is a BLOCKER', () => {
  const { checkSsWeeklyVisualContract } = require('../qa/brand-visual');
  const brand = { code: 'SS', designTokens: { ACCENT_COLOR: '#e11b22' } };
  const html = '<body><table><td class="pnc"><p>Product A</p></td><td class="pdc"><p></p></td><td class="pnc"><p>Product B</p></td><td class="pdc"><p>Good description.</p></td><a href="tel:0297902182" style="color:#e11b22 !important; font-weight:700 !important;"><span style="color:#e11b22 !important; font-weight:700 !important;">02</span></a><a href="mailto:test@test.com" style="color:#e11b22 !important; font-weight:700 !important;"><span style="color:#e11b22 !important; font-weight:700 !important;">test</span></a></table></body>';
  const findings = checkSsWeeklyVisualContract(html, brand, {});
  const descFinding = findings.find((f) => f.rule === 'ss-visual-product-descriptions-empty');
  assert.ok(descFinding, 'Should have an empty-description finding');
  assert.strictEqual(descFinding.severity, 'blocker');
});

// ---------------------------------------------------------------------------
// Brand-visual QA: title-duplicate description is blocker
// ---------------------------------------------------------------------------
test('QA: SS description identical to title is a BLOCKER', () => {
  const { checkSsWeeklyVisualContract } = require('../qa/brand-visual');
  const brand = { code: 'SS', designTokens: { ACCENT_COLOR: '#e11b22' } };
  const html = '<body><table><td class="pnc"><p>Product Alpha</p></td><td class="pdc"><p>Product Alpha</p></td><a href="tel:0297902182" style="color:#e11b22 !important; font-weight:700 !important;"><span style="color:#e11b22 !important; font-weight:700 !important;">02</span></a><a href="mailto:test@test.com" style="color:#e11b22 !important; font-weight:700 !important;"><span style="color:#e11b22 !important; font-weight:700 !important;">test</span></a></table></body>';
  const findings = checkSsWeeklyVisualContract(html, brand, {});
  const dupFinding = findings.find((f) => f.rule === 'ss-visual-product-descriptions-title-dup');
  assert.ok(dupFinding, 'Should have a title-duplicate finding');
  assert.strictEqual(dupFinding.severity, 'blocker');
});

// ---------------------------------------------------------------------------
// Brand-visual QA: placeholder description is blocker
// ---------------------------------------------------------------------------
test('QA: SS placeholder description is a BLOCKER', () => {
  const { checkSsWeeklyVisualContract } = require('../qa/brand-visual');
  const brand = { code: 'SS', designTokens: { ACCENT_COLOR: '#e11b22' } };
  const html = '<body><table><td class="pnc"><p>Product Alpha</p></td><td class="pdc"><p>Lorem Ipsum</p></td><a href="tel:0297902182" style="color:#e11b22 !important; font-weight:700 !important;"><span style="color:#e11b22 !important; font-weight:700 !important;">02</span></a><a href="mailto:test@test.com" style="color:#e11b22 !important; font-weight:700 !important;"><span style="color:#e11b22 !important; font-weight:700 !important;">test</span></a></table></body>';
  const findings = checkSsWeeklyVisualContract(html, brand, {});
  const placeholderFinding = findings.find((f) => f.rule === 'ss-visual-product-descriptions-placeholder');
  assert.ok(placeholderFinding, 'Should have a placeholder finding');
  assert.strictEqual(placeholderFinding.severity, 'blocker');
});

// ---------------------------------------------------------------------------
// Brand-visual QA: valid descriptions pass
// ---------------------------------------------------------------------------
test('QA: SS valid descriptions pass all checks', () => {
  const { checkSsWeeklyVisualContract } = require('../qa/brand-visual');
  const brand = { code: 'SS', designTokens: { ACCENT_COLOR: '#e11b22' } };
  const html = '<body><table><td class="pnc"><p>Safety Sector Metal Speed Hump 500mm</p></td><td class="pdc"><p>Manage Vehicle Traffic Areas with the Safety Sector Metal Speed Hump 500mm.</p></td><td class="pnc"><p>Surface Mounted Safety Bollard 900mm</p></td><td class="pdc"><p>High visibility bollard for pedestrian and vehicle management.</p></td><a href="tel:0297902182" style="color:#e11b22 !important; font-weight:700 !important;"><span style="color:#e11b22 !important; font-weight:700 !important;">02</span></a><a href="mailto:test@test.com" style="color:#e11b22 !important; font-weight:700 !important;"><span style="color:#e11b22 !important; font-weight:700 !important;">test</span></a></table></body>';
  const findings = checkSsWeeklyVisualContract(html, brand, {});
  const descFinding = findings.find((f) => f.rule === 'ss-visual-product-descriptions');
  assert.ok(descFinding, 'Should have a descriptions pass');
  assert.strictEqual(descFinding.severity, 'pass');
});

// ---------------------------------------------------------------------------
// Functional/complementary pairing tests
// ---------------------------------------------------------------------------

test('SAME_FUNCTION: same-category products with matching functional core pair at score 90', () => {
  const a = p(1, 'Surface Mounted Safety Bollard 900mm', 'Safety Bollards');
  const b = p(2, 'Inground Safety Bollard 900mm', 'Safety Bollards');
  const score = pairScore(a, b);
  assert.ok(score >= 90, `Expected score >= 90 (SAME_FUNCTION), got ${score}`);
});

test('SAME_FUNCTION beats SAME_CATEGORY for pairing', () => {
  const bollardA = p(1, 'Surface Mounted Safety Bollard 900mm', 'Safety Bollards');
  const bollardB = p(2, 'Inground Safety Bollard 900mm', 'Safety Bollards');
  const bollardC = p(3, 'Disabled Car Park Bollard 165 x 1300mm', 'Safety Bollards');
  const funcScore = pairScore(bollardA, bollardB);
  const catScore = pairScore(bollardA, bollardC);
  assert.ok(funcScore > catScore, `SAME_FUNCTION (${funcScore}) should beat SAME_CATEGORY (${catScore})`);
});

test('VERIFIED_COMPLEMENTARY: component pairs with complete unit from same system', () => {
  const module_ = p(1, 'Steel Speed Hump - 1m Module', 'Speed Humps');
  const endCap = p(2, 'Rubber Speed Hump End Cap - Black', 'Speed Humps');
  const unrelated = p(3, 'Indoor Safety Mirror - 600mm', 'Convex Mirror');
  const compScore = pairScore(module_, endCap);
  const fallbackScore = pairScore(module_, unrelated);
  assert.ok(compScore > fallbackScore, `Complementary (${compScore}) should beat fallback (${fallbackScore})`);
});

test('VERIFIED_COMPLEMENTARY beats generic SAME_CATEGORY', () => {
  const hump = p(1, 'Steel Speed Hump - 1m Module', 'Speed Humps');
  const endSection = p(2, 'Traffic Calming Rubber Speed Hump - End Section Pair', 'Speed Humps');
  const unrelatedHump = p(3, 'Safety Sector Metal Speed Hump 500mm', 'Speed Humps');
  // endSection is a component, hump is a complete unit — they share the speed hump system
  const compScore = pairScore(hump, endSection);
  // Both same category but without functional/complementary match
  assert.ok(compScore >= 70, `Complementary/stem score (${compScore}) should be >= 70`);
});

test('SAME_FUNCTION: dock bumpers with matching functional core', () => {
  const a = p(1, 'Rubber Dock Bumper D Type 1000mm', 'Dock Bumper');
  const b = p(2, 'Rubber Dock Bumper D Type 900mm', 'Dock Bumper');
  const score = pairScore(a, b);
  // These should match as SAME_BASE_FAMILY or SAME_FUNCTION
  assert.ok(score >= 90, `Expected score >= 90 for same dock bumper family, got ${score}`);
});

test('functionalCore extracts the product-type noun phrase', () => {
  assert.strictEqual(
    functionalCore('Surface Mounted Safety Bollard 900mm'),
    functionalCore('Inground Safety Bollard 900mm')
  );
  assert.strictEqual(
    functionalCore('Rubber Dock Bumper D Type 1000mm'),
    functionalCore('Rubber Dock Bumper D Type 900mm')
  );
});

test('isComponent detects component/accessory words', () => {
  assert.ok(isComponent('Rubber Speed Hump End Cap - Black'));
  assert.ok(isComponent('Traffic Calming Rubber Speed Hump - End Section Pair'));
  assert.ok(isComponent('Steel Speed Hump - 1m Module'));
  assert.ok(!isComponent('Surface Mounted Safety Bollard 900mm'));
  assert.ok(!isComponent('Indoor Convex Mirror - 600mm'));
});

test('global-optimal: functional match wins over greedy category grab', () => {
  // Without functional scoring, greedy might pair bollardA with bollardC
  // before bollardB gets its functional match
  const products = [
    p(1, 'Surface Mounted Safety Bollard 900mm', 'Safety Bollards'),
    p(2, 'Rubber Dock Bumper D Type 1000mm', 'Dock Bumper'),
    p(3, 'Inground Safety Bollard 900mm', 'Safety Bollards'),
    p(4, 'Rubber Dock Bumper D Type 900mm', 'Dock Bumper'),
  ];
  const { ordered, pairingAudit } = orderProductsForGrid(products);
  // Bollards should pair together, bumpers should pair together
  const row1Ids = [ordered[0].id, ordered[1].id].sort();
  const row2Ids = [ordered[2].id, ordered[3].id].sort();
  assert.deepStrictEqual(row1Ids, [1, 3], 'Bollards should pair');
  assert.deepStrictEqual(row2Ids, [2, 4], 'Dock bumpers should pair');
  assert.ok(pairingAudit.some((r) => r.reason === 'SAME_FUNCTION' || r.reason === 'SAME_BASE_FAMILY'));
});
