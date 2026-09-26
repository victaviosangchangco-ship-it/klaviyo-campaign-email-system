// Curation Ranking + Quality-Weighted Category Allocation — regression tests.
//
// Bug this fixes (v1): curate() picked `kept.slice(0, count)` with no ranking.
// Bug this fixes (v2): equal round-robin gave shallow categories too many slots,
// forcing thin-stock products while deeper categories had strong candidates left.
//
// Fix: platform/ai/copy.js's depth-weighted allocation — each approved category
// gets a minimum of 1 slot, then remaining slots are distributed proportionally
// to each category's quality depth (complete-tier candidates weighted by stock
// health, primary category weighted 3x). Categories with more strong standalone
// products get more slots; shallow categories stop receiving slots before weak
// leftovers are forced in.

'use strict';

const { test } = require('node:test');
const assert = require('node:assert');
const { classifyProduct, selectBalanced, curate, curateWithAudit } = require('../ai/copy');
const { checkCurationBalance } = require('../qa/curation-balance');
const { ApprovalRequired } = require('../common/errors');

const p = (id, name, category, inv, over = {}) => ({
  id, name, desc: category, url: `https://x.com/${id}/`, imageUrl: `https://cdn.x.com/${id}.jpg`,
  priceLabel: 'AUD $10.00', isVisible: true, availability: 'available',
  inventoryTracking: 'product', inventoryLevel: inv, ...over,
});

// ---------------------------------------------------------------------------
// classifyProduct — explicit, auditable name-pattern fallback
// ---------------------------------------------------------------------------
test('classifyProduct: standalone units are "complete" with an explicit reason', () => {
  const c = classifyProduct({ name: 'Steel Speed Hump- 1m Module' });
  assert.strictEqual(c.tier, 'complete');
  assert.match(c.reason, /no accessory\/component name pattern matched/);
});

test('classifyProduct: end caps are "accessory"', () => {
  assert.strictEqual(classifyProduct({ name: 'Steel Speed Hump- End Cap Black' }).tier, 'accessory');
  assert.strictEqual(classifyProduct({ name: 'Convex Mirror Wall Attachment Small' }).tier, 'accessory');
});

test('classifyProduct: end sections are "component" (not accessory, not complete)', () => {
  assert.strictEqual(classifyProduct({ name: 'Traffic Calming Rubber Speed Hump- End Section Pair' }).tier, 'component');
});

// ---------------------------------------------------------------------------
// A. Every approved category receives meaningful representation when possible.
// ---------------------------------------------------------------------------
test('A: every approved category with valid candidates gets at least one slot', () => {
  const pool = [
    ...Array.from({ length: 9 }, (_, i) => p(100 + i, `Speed Hump Item ${i}`, 'Speed Humps', 20)),
    ...Array.from({ length: 9 }, (_, i) => p(200 + i, `Bollard Item ${i}`, 'Safety Bollards', 20)),
    p(300, 'Rubber Dock Bumper D Type', 'Dock Bumper', 23),
    p(301, 'Indoor Safety Mirror', 'Convex Mirror', 43),
  ];
  const { categoryStats } = selectBalanced(pool, {
    count: 18, categoryOrder: ['Speed Humps', 'Safety Bollards', 'Dock Bumper', 'Convex Mirror'],
  });
  for (const stat of categoryStats) {
    assert.ok(stat.selectedCount >= 1, `${stat.category} must receive at least one slot`);
  }
});

// ---------------------------------------------------------------------------
// B. Category allocation does NOT have to be equal — depth-weighted.
// ---------------------------------------------------------------------------
test('B: deeper categories receive more slots than shallow ones', () => {
  const pool = [
    // Deep category: 10 complete products
    ...Array.from({ length: 10 }, (_, i) => p(100 + i, `Bollard ${i}`, 'Safety Bollards', 20 + i)),
    // Shallow category: 2 complete products
    p(200, 'Mirror A', 'Convex Mirror', 30),
    p(201, 'Mirror B', 'Convex Mirror', 25),
  ];
  const { categoryStats } = selectBalanced(pool, {
    count: 10, categoryOrder: ['Safety Bollards', 'Convex Mirror'],
  });
  const byCat = Object.fromEntries(categoryStats.map((c) => [c.category, c.selectedCount]));
  assert.ok(byCat['Safety Bollards'] > byCat['Convex Mirror'],
    `deeper category (${byCat['Safety Bollards']}) should get more slots than shallow (${byCat['Convex Mirror']})`);
});

// ---------------------------------------------------------------------------
// C. Deeper category with stronger standalone inventory receives more slots.
// ---------------------------------------------------------------------------
test('C: a category with many strong complete products gets proportionally more slots', () => {
  const pool = [
    // Primary: 2 complete + 4 accessories
    p(1, 'Speed Hump Module A', 'Speed Humps', 38),
    p(2, 'Speed Hump Module B', 'Speed Humps', 2),
    ...Array.from({ length: 4 }, (_, i) => p(10 + i, `Speed Hump End Cap ${i}`, 'Speed Humps', 50 + i)),
    // Supporting: 12 complete, all healthy stock
    ...Array.from({ length: 12 }, (_, i) => p(100 + i, `Bollard ${i}`, 'Safety Bollards', 20 + i * 5)),
    // Supporting: 3 complete
    ...Array.from({ length: 3 }, (_, i) => p(200 + i, `Dock Bumper ${i}`, 'Dock Bumper', 10 + i)),
  ];
  const { categoryStats } = selectBalanced(pool, {
    count: 14, categoryOrder: ['Speed Humps', 'Safety Bollards', 'Dock Bumper'],
  });
  const byCat = Object.fromEntries(categoryStats.map((c) => [c.category, c.selectedCount]));
  assert.ok(byCat['Safety Bollards'] >= byCat['Speed Humps'],
    `Bollards (${byCat['Safety Bollards']}) should get at least as many slots as primary Speed Humps (${byCat['Speed Humps']}) given 12 vs 2 complete candidates`);
  assert.ok(byCat['Safety Bollards'] > byCat['Dock Bumper'],
    `Bollards (${byCat['Safety Bollards']}) should get more than Dock Bumper (${byCat['Dock Bumper']})`);
});

// ---------------------------------------------------------------------------
// D. Shallow category stops receiving slots before weak/thin leftovers forced.
// ---------------------------------------------------------------------------
test('D: a shallow category does not receive more slots than its strong candidates', () => {
  const pool = [
    // Deep: 8 complete, healthy stock
    ...Array.from({ length: 8 }, (_, i) => p(100 + i, `Bollard ${i}`, 'Safety Bollards', 30 + i)),
    // Shallow: 1 complete, rest are accessories/thin
    p(200, 'Mirror Large', 'Convex Mirror', 40),
    p(201, 'Mirror Wall Attachment Small', 'Convex Mirror', 50), // accessory
    p(202, 'Mirror Wall Attachment Large', 'Convex Mirror', 30), // accessory
  ];
  const { selected, categoryStats } = selectBalanced(pool, {
    count: 8, categoryOrder: ['Safety Bollards', 'Convex Mirror'],
  });
  const byCat = Object.fromEntries(categoryStats.map((c) => [c.category, c.selectedCount]));
  // Convex Mirror should not get 4 (= 8/2) equal-share slots — that would
  // force 3 accessories when Bollards has 8 strong complete candidates.
  assert.ok(byCat['Convex Mirror'] <= 3,
    `shallow Convex Mirror (${byCat['Convex Mirror']}) should not get equal share when depth is low`);
  assert.ok(byCat['Safety Bollards'] >= 5,
    `deep Safety Bollards (${byCat['Safety Bollards']}) should get the majority`);
});

// ---------------------------------------------------------------------------
// E. Primary category remains represented appropriately.
// ---------------------------------------------------------------------------
test('E: primary category gets meaningful representation even with shallow depth', () => {
  const pool = [
    p(1, 'Steel Speed Hump- 1m Module', 'Speed Humps', 2),
    p(2, 'Safety Sector Metal Speed Hump 500mm', 'Speed Humps', 38),
    p(3, 'Rubber Speed Hump End Cap- Black', 'Speed Humps', 129),
    ...Array.from({ length: 14 }, (_, i) => p(100 + i, `Bollard ${i}`, 'Safety Bollards', 20 + i * 3)),
  ];
  const { selected, categoryStats } = selectBalanced(pool, {
    count: 10, categoryOrder: ['Speed Humps', 'Safety Bollards'],
  });
  const byCat = Object.fromEntries(categoryStats.map((c) => [c.category, c.selectedCount]));
  // Primary must have at least 1 (minimum guarantee), and the primary weight
  // ensures it gets proportionally more than a supporting category with the
  // same raw depth. But it should not dominate when depth is shallow.
  assert.ok(byCat['Speed Humps'] >= 1, 'primary must have at least 1 slot');
  assert.ok(byCat['Speed Humps'] <= 5, 'primary with 2 complete + 1 accessory should not dominate');
  // The Steel Speed Hump (complete, inv=2) must be selected — it's the primary theme product.
  assert.ok(selected.some((s) => s.id === 1), 'thin-stock complete primary product must be selected');
});

// ---------------------------------------------------------------------------
// F. Exactly requiredCount products are produced.
// ---------------------------------------------------------------------------
test('F: exactly requiredCount products are produced when supply allows', () => {
  const pool = [
    ...Array.from({ length: 9 }, (_, i) => p(100 + i, `SH ${i}`, 'Speed Humps', 20)),
    ...Array.from({ length: 19 }, (_, i) => p(200 + i, `B ${i}`, 'Safety Bollards', 20)),
    ...Array.from({ length: 4 }, (_, i) => p(300 + i, `DB ${i}`, 'Dock Bumper', 20)),
    ...Array.from({ length: 5 }, (_, i) => p(400 + i, `CM ${i}`, 'Convex Mirror', 20)),
  ];
  const { selected } = selectBalanced(pool, {
    count: 18, categoryOrder: ['Speed Humps', 'Safety Bollards', 'Dock Bumper', 'Convex Mirror'],
  });
  assert.strictEqual(selected.length, 18);
});

// ---------------------------------------------------------------------------
// G. OOS/unavailable products still never enter.
// ---------------------------------------------------------------------------
test('G: an OOS product never enters the balanced selection', () => {
  const pool = [
    p(1, 'Steel Speed Hump- 1m Module', 'Speed Humps', 2),
    p(2, 'OOS Speed Hump', 'Speed Humps', 0, { availability: 'available' }),
    p(3, 'Surface Mounted Safety Bollard', 'Safety Bollards', 248),
  ];
  const selected = curate(pool, { count: 3, min: 1, categoryOrder: ['Speed Humps', 'Safety Bollards'] });
  assert.ok(!selected.some((x) => x.id === 2), 'OOS product must never be selected');
  assert.strictEqual(selected.length, 2);
});

test('G2: curateWithAudit throws (never fabricates) when fewer than min pass verification', () => {
  const pool = [p(1, 'A', 'Speed Humps', 0)];
  assert.throws(() => curateWithAudit(pool, { count: 4, min: 1, categoryOrder: ['Speed Humps'] }), ApprovalRequired);
});

// ---------------------------------------------------------------------------
// H. SS-2026-36-shaped pool resolves close to the quality-approved mix.
// ---------------------------------------------------------------------------
test('H: SS-2026-36-shaped pool uses depth-weighted allocation, not equal round-robin', () => {
  const pool = [
    // Speed Humps (9): 2 complete, 1 component, 6 accessory
    p(605, 'Steel Speed Hump- 1m Module', 'Speed Humps', 2),
    p(913, 'Safety Sector Metal Speed Hump 500mm', 'Speed Humps', 38),
    p(682, 'Traffic Calming Rubber Speed Hump- End Section Pair', 'Speed Humps', 29),
    p(124, 'Speed Hump Polyethylene End Cap Yellow', 'Speed Humps', 8),
    p(125, 'Speed Hump Polyethylene End Cap Black', 'Speed Humps', 48),
    p(554, 'Rubber Speed Hump End Cap- Yellow', 'Speed Humps', 97),
    p(555, 'Rubber Speed Hump End Cap- Black', 'Speed Humps', 129),
    p(606, 'Steel Speed Hump- End Cap Black', 'Speed Humps', 30),
    p(607, 'Steel Speed Hump- End Cap Yellow', 'Speed Humps', 23),
    // Safety Bollards (18, all standalone/complete)
    ...[
      [112, 248], [113, 30], [114, 29], [116, 55], [117, 95], [119, 3], [120, 1], [121, 22], [122, 44],
      [551, 65], [552, 68], [596, 11], [598, 35], [599, 25], [600, 16], [601, 14], [602, 1], [545, 22],
    ].map(([id, inv]) => p(id, `Bollard ${id}`, 'Safety Bollards', inv)),
    // Dock Bumper (4, all standalone)
    p(675, 'Wall Bumper Rubber 1000mm', 'Dock Bumper', 14),
    p(676, 'Rubber Wall Guard Bumper 1000mm', 'Dock Bumper', 1),
    p(677, 'Rubber Dock Bumper D Type 900mm', 'Dock Bumper', 5),
    p(678, 'Rubber Dock Bumper D Type 1000mm', 'Dock Bumper', 23),
    // Convex Mirror (5): 3 complete, 2 accessory (wall-attachment brackets)
    p(517, 'Safety Convex Mirror Outdoor/Indoor 1000mm', 'Convex Mirror', 1),
    p(521, 'Indoor Convex Mirror- 450mm', 'Convex Mirror', 29),
    p(522, 'Indoor Safety Mirror- 600mm', 'Convex Mirror', 43),
    p(549, 'Convex Mirror Wall Attachment Small', 'Convex Mirror', 57),
    p(550, 'Convex Mirror Wall Attachment Large', 'Convex Mirror', 27),
  ];

  const { selected, audit, categoryStats } = selectBalanced(pool, {
    count: 18, categoryOrder: ['Speed Humps', 'Safety Bollards', 'Dock Bumper', 'Convex Mirror'],
  });

  assert.strictEqual(selected.length, 18);

  const byCat = Object.fromEntries(categoryStats.map((c) => [c.category, c.selectedCount]));

  // Every approved category represented.
  assert.ok(byCat['Speed Humps'] >= 1, 'Speed Humps must receive at least 1 slot');
  assert.ok(byCat['Safety Bollards'] >= 1, 'Safety Bollards must receive at least 1 slot');
  assert.ok(byCat['Dock Bumper'] >= 1, 'Dock Bumper must receive at least 1 slot');
  assert.ok(byCat['Convex Mirror'] >= 1, 'Convex Mirror must receive at least 1 slot');

  // Safety Bollards has far more strong candidates — it must get the most slots.
  assert.ok(byCat['Safety Bollards'] >= byCat['Speed Humps'],
    `Bollards (${byCat['Safety Bollards']}) should get at least as many as Speed Humps (${byCat['Speed Humps']})`);
  assert.ok(byCat['Safety Bollards'] > byCat['Dock Bumper'],
    `Bollards (${byCat['Safety Bollards']}) should get more than Dock Bumper (${byCat['Dock Bumper']})`);
  assert.ok(byCat['Safety Bollards'] > byCat['Convex Mirror'],
    `Bollards (${byCat['Safety Bollards']}) should get more than Convex Mirror (${byCat['Convex Mirror']})`);

  // Primary category must not be accessory-dominated.
  const primaryEntries = audit.filter((a) => a.role === 'primary');
  const accessoryInPrimary = primaryEntries.filter((a) => a.tier === 'accessory').length;
  assert.ok(accessoryInPrimary / primaryEntries.length <= 0.5, 'primary category must not be majority accessory-tier');

  // inv=1 supporting products (602, 120, 676, 517) should NOT be selected
  // when deeper categories have healthier alternatives.
  assert.ok(!selected.some((x) => x.id === 602), '602 (Bollard inv=1) should not be selected');
  assert.ok(!selected.some((x) => x.id === 120), '120 (Bollard inv=1) should not be selected');
  assert.ok(!selected.some((x) => x.id === 676), '676 (Dock Bumper inv=1) should not be selected');

  // Depth scores must be present on categoryStats.
  for (const stat of categoryStats) {
    assert.ok(stat.depthScore != null, `${stat.category} must have a depthScore`);
    assert.ok(stat.depthScore > 0, `${stat.category} must have a positive depthScore`);
  }
});

// ---------------------------------------------------------------------------
// Tier ranking within a category is preserved.
// ---------------------------------------------------------------------------
test('complete units rank ahead of accessories regardless of relative stock', () => {
  const pool = [
    p(1, 'Rubber Speed Hump End Cap- Black', 'Speed Humps', 129),
    p(2, 'Steel Speed Hump- 1m Module', 'Speed Humps', 2),
  ];
  const { audit } = selectBalanced(pool, { count: 2, categoryOrder: ['Speed Humps'] });
  assert.strictEqual(audit[0].id, 2, 'the complete unit is picked first despite lower stock');
  assert.strictEqual(audit[0].tier, 'complete');
  assert.strictEqual(audit[1].id, 1);
  assert.strictEqual(audit[1].tier, 'accessory');
});

test('within the same tier, healthier stock ranks first', () => {
  const pool = [
    p(1, '316 Stainless Steel Fixed Bollard', 'Safety Bollards', 44),
    p(2, 'Stainless Steel Security Bollard', 'Safety Bollards', 1),
  ];
  const { audit } = selectBalanced(pool, { count: 2, categoryOrder: ['Safety Bollards'] });
  assert.strictEqual(audit[0].id, 1, 'inv=44 ranks ahead of inv=1 when equally relevant/same tier');
  assert.strictEqual(audit[1].id, 2);
});

test('first Calendar category is always role=primary, the rest supporting', () => {
  const pool = [
    p(1, 'A', 'Speed Humps', 10),
    p(2, 'B', 'Safety Bollards', 10),
    p(3, 'C', 'Dock Bumper', 10),
  ];
  const { audit } = selectBalanced(pool, { count: 3, categoryOrder: ['Speed Humps', 'Safety Bollards', 'Dock Bumper'] });
  const roleByCat = Object.fromEntries(audit.map((a) => [a.category, a.role]));
  assert.strictEqual(roleByCat['Speed Humps'], 'primary');
  assert.strictEqual(roleByCat['Safety Bollards'], 'supporting');
  assert.strictEqual(roleByCat['Dock Bumper'], 'supporting');
});

// ---------------------------------------------------------------------------
// checkCurationBalance QA — warn-only, never a blocker
// ---------------------------------------------------------------------------
test('QA: warns when primary category is accessory-heavy', () => {
  const pkg = {
    _decision: {
      curationAudit: [
        { id: 1, category: 'Speed Humps', role: 'primary', tier: 'accessory' },
        { id: 2, category: 'Speed Humps', role: 'primary', tier: 'accessory' },
        { id: 3, category: 'Speed Humps', role: 'primary', tier: 'complete' },
      ],
      categoryStats: [{ category: 'Speed Humps', role: 'primary', candidateCount: 3, selectedCount: 3 }],
    },
  };
  const result = checkCurationBalance(pkg);
  assert.strictEqual(result.severity, 'warn');
  assert.match(result.message, /accessory-heavy/);
});

test('QA: warns when an approved supporting category with valid candidates is fully omitted', () => {
  const pkg = {
    _decision: {
      curationAudit: [{ id: 1, category: 'Speed Humps', role: 'primary', tier: 'complete' }],
      categoryStats: [
        { category: 'Speed Humps', role: 'primary', candidateCount: 1, selectedCount: 1 },
        { category: 'Dock Bumper', role: 'supporting', candidateCount: 4, selectedCount: 0 },
      ],
    },
  };
  const result = checkCurationBalance(pkg);
  assert.strictEqual(result.severity, 'warn');
  assert.match(result.message, /Dock Bumper/);
});

test('QA: a thin-stock but valid product never triggers a warning by itself', () => {
  const pkg = {
    _decision: {
      curationAudit: [{ id: 1, category: 'Speed Humps', role: 'primary', tier: 'complete', stock: 2 }],
      categoryStats: [{ category: 'Speed Humps', role: 'primary', candidateCount: 1, selectedCount: 1 }],
    },
  };
  assert.strictEqual(checkCurationBalance(pkg).severity, 'pass');
});

test('QA: no audit present (generic/override path) is a pass, not a violation', () => {
  assert.strictEqual(checkCurationBalance({ _decision: {} }).severity, 'pass');
  assert.strictEqual(checkCurationBalance({}).severity, 'pass');
});
