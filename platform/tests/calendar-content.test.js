// Calendar-driven content wiring — buildPackage honours the calendar record
// (subject/name/key_topic/category, no invention) and getCategoryProducts keeps
// products to the named category only. Offline; a temp fixture for the filter test.

'use strict';

const { test } = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const os = require('os');
const path = require('path');

const { buildPackage } = require('../ai/copy');
const { createProductSource } = require('../integrations/bigcommerce/adapter');

const BRAND = {
  code: 'RDD',
  identity: {
    displayName: { value: 'Retail Display Direct' },
    allProductsUrl: { value: 'https://www.retaildisplaydirect.com.au/products/' },
  },
};

// Four verified in-category products (curate needs >= min 4).
function stairNosingProducts() {
  return Array.from({ length: 6 }, (_, i) => ({
    id: 100 + i,
    name: `Anti-Slip Stair Nosing ${i + 1}`,
    url: `https://www.retaildisplaydirect.com.au/anti-slip-stair-nosing-${i + 1}/`,
    imageUrl: `https://cdn.example.com/asn-${i + 1}.jpg`,
    priceLabel: `AUD $${(20 + i).toFixed(2)}`,
    desc: 'Anti-Slip Stair Nosing',
    isVisible: true,
    availability: 'available',
    inventoryTracking: 'product',
    inventoryLevel: 10,
  }));
}

const CAMPAIGN = {
  campaign_id: 'RDD-2026-35',
  brand: 'RDD',
  topic_category_slug: 'product-insights',
  campaign_type_label: 'Product insights',
  campaign_name: 'Reduce Slip Risks with Anti-Slip Stair Nosing',
  topic_category: 'Anti-Slip Stair Nosing',
  subject_line: 'Slips Cost More Than You Think – Anti-Slip Stair Nosing Guide',
  preview_text: null,
  key_topic: 'Improve workplace slip prevention.',
  promotion: null,
  segment: 'RDD - Active Subscribers',
};

test('buildPackage (calendar-driven): uses the record verbatim, never invents subject', () => {
  const category = { id: 42, name: 'Anti-Slip Stair Nosing', url: 'https://www.retaildisplaydirect.com.au/anti-slip-stair-nosing/' };
  const pkg = buildPackage({
    brand: BRAND, slot: { isoWeek: '2026-W33', type: 'weekly' },
    products: stairNosingProducts(), config: { product: { defaultCount: 16, minCount: 4 } },
    campaign: CAMPAIGN, category,
  });

  // subject is the calendar's, exactly (no invention)
  assert.strictEqual(pkg.subject, CAMPAIGN.subject_line);
  // preview is generated (§6.24) since preview_text is null: campaign-specific,
  // anchored on the real key_topic, and NOT a copy of the subject line
  assert.ok(pkg.preheader && pkg.preheader.length > 0);
  assert.notStrictEqual(pkg.preheader, pkg.subject);
  assert.match(pkg.preheader, /Improve workplace slip prevention/i);
  // hero + section reflect the campaign + its category
  assert.strictEqual(pkg.heroHeading, CAMPAIGN.campaign_name);
  assert.strictEqual(pkg.heroBody, CAMPAIGN.key_topic);
  assert.strictEqual(pkg.eyebrow, 'PRODUCT INSIGHTS');
  assert.strictEqual(pkg.sectionTitle, 'Anti-Slip Stair Nosing');
  // CTA points at the live category page, not a generic fallback
  assert.strictEqual(pkg.ctaUrl, category.url);
  // every product carried through is in-theme
  assert.ok(pkg.products.length >= 4);
  assert.ok(pkg.products.every((p) => p.desc === 'Anti-Slip Stair Nosing'));
  // no em/en dash interruption in body copy (§6.2): hero + intro
  const body = [pkg.heroBody, ...pkg.introParas].join(' ');
  assert.ok(!/\s[–—]\s/.test(body), 'body copy must not use spaced en/em dashes');
});

test('buildPackage (calendar-driven): CTA falls back to all-products when no category url', () => {
  const pkg = buildPackage({
    brand: BRAND, slot: { isoWeek: '2026-W33', type: 'weekly' },
    products: stairNosingProducts(), config: { product: { defaultCount: 16, minCount: 4 } },
    campaign: CAMPAIGN, category: { id: 42, name: 'Anti-Slip Stair Nosing', url: null },
  });
  assert.strictEqual(pkg.ctaUrl, BRAND.identity.allProductsUrl.value);
});

test('getCategoryProducts (fixture mode): keeps only products in the named category', async () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'catprod-'));
  const fixture = path.join(dir, 'pool.json');
  const pool = [
    ...stairNosingProducts(),
    { id: 1, name: 'Safety Bollard', desc: 'Safety Bollards', url: 'u', imageUrl: 'i', priceLabel: 'AUD $99.00', isVisible: true },
    { id: 2, name: 'Wheel Chock', desc: 'Rubber Wheel Chocks', url: 'u', imageUrl: 'i', priceLabel: 'AUD $30.00', isVisible: true },
  ];
  fs.writeFileSync(fixture, JSON.stringify(pool));

  const noop = { info() {}, warn() {}, debug() {} };
  const source = createProductSource({ repoRoot: dir, brand: BRAND, logger: noop, cacheDir: path.join(dir, 'cache') });
  const res = await source.getCategoryProducts({ categoryName: 'Anti-Slip Stair Nosing', source: 'fixture', fixturePath: fixture });

  assert.strictEqual(res.category.name, 'Anti-Slip Stair Nosing');
  assert.ok(res.products.length === 6, `expected 6 stair-nosing products, got ${res.products.length}`);
  assert.ok(res.products.every((p) => p.desc === 'Anti-Slip Stair Nosing'), 'no unrelated categories mixed in');
});
