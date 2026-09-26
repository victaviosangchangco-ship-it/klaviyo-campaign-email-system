// Unit tests for the AI Decision Engine (curation safety, CLAUDE.md §5.1).

'use strict';

const { test } = require('node:test');
const assert = require('node:assert');
const { curate } = require('../ai/copy');
const { ApprovalRequired } = require('../common/errors');

const ok = (id, over = {}) => ({
  id, name: `P${id}`, url: `https://x.com/${id}/`, imageUrl: `https://cdn.x.com/${id}.jpg`,
  priceLabel: 'AUD $10.00', desc: 'Cat', isVisible: true, availability: 'available',
  inventoryTracking: 'product', inventoryLevel: 10, ...over,
});

test('drops hidden, disabled, unpriced, imageless and urless products (§5.1)', () => {
  const pool = [
    ok(1), ok(2), ok(3), ok(4),
    ok(5, { isVisible: false }),
    ok(6, { availability: 'disabled' }),
    ok(7, { priceLabel: null }),
    ok(8, { imageUrl: '' }),
    ok(9, { url: '' }),
  ];
  const kept = curate(pool, { count: 16, min: 4 });
  assert.strictEqual(kept.length, 4);
  assert.deepStrictEqual(kept.map((p) => p.id), [1, 2, 3, 4]);
});

test('trims to an even count for a clean 2-col grid (§6.9)', () => {
  const pool = [ok(1), ok(2), ok(3), ok(4), ok(5)];
  assert.strictEqual(curate(pool, { count: 16, min: 4 }).length, 4);
});

test('caps at the requested count', () => {
  const pool = Array.from({ length: 30 }, (_, i) => ok(i + 1));
  assert.strictEqual(curate(pool, { count: 16, min: 4 }).length, 16);
});

test('throws ApprovalRequired rather than fabricate when too few verified (§5.1)', () => {
  const pool = [ok(1), ok(2)];
  assert.throws(() => curate(pool, { count: 16, min: 4 }), ApprovalRequired);
});
