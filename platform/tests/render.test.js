// Golden-file + structural tests for the Rendering Engine.
// Run: npm test   (node --test)
//
// The golden file proves the renderer is DETERMINISTIC: the same brand config +
// the same product fixture must produce byte-identical HTML. If an intentional
// change alters output, regenerate the golden (see the note at the bottom) and
// review the diff — that review is the point.

'use strict';

const { test } = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const path = require('path');

const { loadBrandConfig, loadPlatformConfig, REPO_ROOT } = require('../common/config');
const { buildPackage } = require('../ai/copy');
const { renderWeekly } = require('../render/renderer');

const FIXTURE = path.join(__dirname, 'fixtures', 'rdd-products.sample.json');
const GOLDEN = path.join(__dirname, 'golden', 'RDD-weekly.golden.html');

function renderFromFixture() {
  const brand = loadBrandConfig('RDD');
  const cfg = loadPlatformConfig();
  const products = JSON.parse(fs.readFileSync(FIXTURE, 'utf8'));
  const pkg = buildPackage({ brand, slot: { type: 'weekly', isoWeek: '2026-W32', synthesized: true }, products, config: cfg });
  return { ...renderWeekly({ repoRoot: REPO_ROOT, brand, pkg }), pkg };
}

test('renders byte-identical to the golden file (determinism)', () => {
  const { html } = renderFromFixture();
  const golden = fs.readFileSync(GOLDEN, 'utf8');
  assert.strictEqual(html, golden, 'Render drifted from golden. Review the diff, then regenerate the golden if the change is intended.');
});

test('no unresolved [[TOKEN]] survives', () => {
  const { html } = renderFromFixture();
  assert.strictEqual(/\[\[[A-Z0-9_]+\]\]/.test(html), false);
});

test('document is well-formed enough for email (doctype, html, title)', () => {
  const { html } = renderFromFixture();
  assert.match(html, /<!DOCTYPE/i);
  assert.match(html, /<\/html>/i);
  assert.match(html, /<title>[^<]+<\/title>/i);
});

test('MSO conditionals are preserved; descriptive comments are stripped', () => {
  const { html } = renderFromFixture();
  assert.match(html, /\[if mso\]/, 'MSO conditional must survive');
  assert.strictEqual(/Purpose:|BRD mapping|MIGRATION NOTES/.test(html), false, 'component doc-comments must be stripped');
});

test('curated products render (8 verified from the 10-item fixture)', () => {
  const { html, meta, pkg } = renderFromFixture();
  assert.strictEqual(pkg.products.length, 8, 'hidden + OOS fixture items must be excluded');
  assert.strictEqual(meta.rows, 4, '8 products → 4 rows of 2');
  assert.strictEqual(html.includes('HIDDEN'), false, 'hidden product must not appear');
  assert.strictEqual(html.includes('OUT OF STOCK'), false, 'OOS product must not appear');
});

test('Klaviyo Liquid passes through untouched', () => {
  const { html } = renderFromFixture();
  assert.match(html, /\{% unsubscribe_link %\}/);
});
