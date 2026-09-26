// Unit tests for Campaign Theme Coherence (SYSTEM PATCH).

'use strict';

const { test } = require('node:test');
const assert = require('node:assert');
const { buildCampaignThemePackage } = require('../workflow/campaign-theme-package');
const { filterThemeRelevant, assertHeroMatchesTheme, productMatchesTheme, HERO_ASSET_REQUIRED } = require('../ai/theme-relevance');
const { checkThemeCoherence } = require('../qa/theme-coherence');

const campaign = {
  campaign_id: 'RDD-2026-38',
  brand: 'RDD',
  topic_category_slug: 'product-insights',
  campaign_name: 'Smarter Access Control with Expandable Barriers',
  topic_category: 'Expandable Barriers',
  subject_line: 'Create Flexible Spaces with Expandable Barriers',
  key_topic: 'Flexible crowd management solutions.',
};

const prod = (id, desc) => ({ id, desc, name: `P${id}`, url: `https://x/${id}`, imageUrl: `https://x/${id}.jpg`, priceLabel: 'AUD $10.00' });

test('buildCampaignThemePackage: exact campaign id is not treated as an ISO week', () => {
  const pkg = buildCampaignThemePackage(campaign);
  assert.strictEqual(pkg.campaignId, 'RDD-2026-38');
  assert.ok(!('isoWeek' in pkg), 'no ISO week field should be inferred from the campaign_id suffix');
});

test('relevant product accepted', () => {
  const pkg = buildCampaignThemePackage(campaign);
  assert.strictEqual(productMatchesTheme(prod(1, 'Expandable Barriers'), pkg), true);
});

test('unrelated valid product rejected', () => {
  const pkg = buildCampaignThemePackage(campaign);
  assert.strictEqual(productMatchesTheme(prod(2, 'Display Solutions'), pkg), false);
});

test('no unrelated backfill: filterThemeRelevant drops off-theme products rather than keeping them', () => {
  const pkg = buildCampaignThemePackage(campaign);
  const pool = [prod(1, 'Expandable Barriers'), prod(2, 'Display Solutions'), prod(3, 'Expandable Barriers')];
  const kept = filterThemeRelevant(pool, pkg);
  assert.deepStrictEqual(kept.map((p) => p.id), [1, 3]);
});

test('matching hero accepted', () => {
  const heroImage = { campaignId: 'RDD-2026-38', url: 'https://x/hero.jpg', alt: 'Expandable barriers' };
  assert.doesNotThrow(() => assertHeroMatchesTheme(heroImage, { campaignId: 'RDD-2026-38' }));
});

test('mismatched hero blocked with HERO_ASSET_REQUIRED', () => {
  const heroImage = { campaignId: 'RDD-2026-37', url: 'https://x/hero.jpg', alt: 'Expandable barriers' };
  try {
    assertHeroMatchesTheme(heroImage, { campaignId: 'RDD-2026-38' });
    assert.fail('expected a throw');
  } catch (err) {
    assert.strictEqual(err.code, HERO_ASSET_REQUIRED);
  }
});

test('alt-text change does not make a mismatched hero valid', () => {
  // Same wrong-campaign hero, alt text rewritten to describe the CORRECT theme —
  // must still block, because the check is structural (campaignId), not textual.
  const heroImage = { campaignId: 'RDD-2026-37', url: 'https://x/hero.jpg', alt: 'Expandable Barriers hero' };
  assert.throws(() => assertHeroMatchesTheme(heroImage, { campaignId: 'RDD-2026-38' }), /HERO_ASSET_REQUIRED/);
});

test('baseline structure reusable without baseline campaign content: no heroImage means no gate (text-only hero)', () => {
  assert.doesNotThrow(() => assertHeroMatchesTheme(null, { campaignId: 'RDD-2026-38' }));
});

test('coherent theme/sections/products passes semantic QA', () => {
  const themePkg = buildCampaignThemePackage(campaign);
  const pkg = {
    heroHeading: 'Smarter Access Control with Expandable Barriers',
    heroBody: 'Flexible crowd management solutions.',
    sectionTitle: 'Expandable Barriers',
    products: [prod(1, 'Expandable Barriers'), prod(2, 'Expandable Barriers')],
  };
  const result = checkThemeCoherence(pkg, themePkg);
  assert.strictEqual(result.severity, 'pass');
});

test('semantic mismatch blocks Draft: wrong hero + off-theme products fail even though structural QA could pass', () => {
  const themePkg = buildCampaignThemePackage(campaign);
  const pkg = {
    heroHeading: 'Display Solutions for Every Space', // W38's real defect: another campaign's hero copy
    heroBody: 'Modern display stands and signage.',
    sectionTitle: 'Display Solutions',
    heroImage: { campaignId: 'RDD-2026-DISPLAY', url: 'https://x/hero.jpg', alt: 'Display solutions' },
    products: [prod(1, 'Display Solutions'), prod(2, 'Display Solutions')],
  };
  const result = checkThemeCoherence(pkg, themePkg);
  assert.strictEqual(result.severity, 'blocker');
  assert.ok(result.message.includes('RDD-2026-38'));
});
