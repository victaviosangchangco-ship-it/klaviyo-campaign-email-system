// Weekly Hero Banner Resolution + Promotion/Coupon Resolution (SYSTEM PATCH:
// Weekly Hero + Promotion + Draft Lifecycle). Offline — real RDD brand config
// (no network) + real Components/ templates; no BigCommerce/Klaviyo/Lark calls.

'use strict';

const { test } = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const os = require('os');
const path = require('path');

const { requireWeeklyHero, assertHeroMatchesTheme, HERO_ASSET_REQUIRED } = require('../ai/theme-relevance');
const { buildCampaignThemePackage } = require('../workflow/campaign-theme-package');
const { buildPackage } = require('../ai/copy');
const { renderWeekly } = require('../render/renderer');
const { checkThemeCoherence } = require('../qa/theme-coherence');
const { loadCampaignHero, loadBrandConfig, REPO_ROOT } = require('../common/config');

const CAMPAIGN = {
  campaign_id: 'RDD-2026-39',
  brand: 'RDD',
  cadence: 'weekly',
  topic_category_slug: 'promotional-sale',
  campaign_name: 'Spring Refresh Sale – Acrylic Displays 15% Off',
  topic_category: 'Acrylic Displays',
  subject_line: 'Refresh Your Displays This Spring',
  key_topic: '15% off selected acrylic display products.',
  promotion: { code: 'SPRING15', text: '15% off acrylic displays' },
};
const themePkg = buildCampaignThemePackage(CAMPAIGN);

// ── 1-3. requireWeeklyHero (unit level) ─────────────────────────────────────

test('1. exact campaign hero (matching campaignId) is accepted', () => {
  const hero = { url: 'https://assets-rdd.vercel.app/hero-banners/rdd-2026-39.png', alt: 'Acrylic displays', height: 300, campaignId: 'RDD-2026-39' };
  assert.doesNotThrow(() => requireWeeklyHero(hero, themePkg));
});

test('2. an unrelated historical campaign hero is REJECTED (never borrowed)', () => {
  const historicalHero = { url: 'https://assets-rdd.vercel.app/hero-banners/rdd-2026-w38-evergreen-display-solutions-hero-v2.png', alt: 'Display solutions', height: 300, campaignId: 'RDD-2026-W38' };
  assert.throws(() => requireWeeklyHero(historicalHero, themePkg), (err) => err.code === HERO_ASSET_REQUIRED);
  // Changing only the alt text must not make it valid (never "fixed" this way).
  const relabeled = { ...historicalHero, alt: 'Acrylic Displays' };
  assert.throws(() => requireWeeklyHero(relabeled, themePkg), (err) => err.code === HERO_ASSET_REQUIRED);
});

test('3. no hero at all → HERO_ASSET_REQUIRED, reporting campaign_id + theme + contract reference', () => {
  assert.throws(
    () => requireWeeklyHero(null, themePkg),
    (err) => {
      assert.strictEqual(err.code, HERO_ASSET_REQUIRED);
      assert.match(err.message, /RDD-2026-39/);
      assert.match(err.message, /Acrylic Displays/);
      assert.match(err.message, /hero-contract\.md/);
      return true;
    }
  );
});

test('4. text-only fallback cannot silently satisfy a required Weekly hero (requireWeeklyHero vs assertHeroMatchesTheme)', () => {
  // assertHeroMatchesTheme (identity-only, still used by content-override reuse)
  // legitimately no-ops on a missing hero — that contract is unchanged...
  assert.doesNotThrow(() => assertHeroMatchesTheme(null, themePkg));
  // ...but requireWeeklyHero (used for calendar-driven Weekly generation) does NOT
  // accept that same silent fallback — absence itself is a blocker.
  assert.throws(() => requireWeeklyHero(null, themePkg), (err) => err.code === HERO_ASSET_REQUIRED);
});

test('loadCampaignHero: an undeclared campaign_id returns null (the real, production registry today)', () => {
  // config/campaign-heroes.json ships empty — proves RDD-2026-39 genuinely has no
  // declared hero right now, i.e. a real run WILL block (not a test-only scenario).
  assert.strictEqual(loadCampaignHero('RDD-2026-39', { repoRoot: REPO_ROOT }), null);
});

test('loadCampaignHero: a declared entry resolves url/alt/height/link; an entry without a url is ignored', () => {
  const repoRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'hero-cfg-'));
  fs.mkdirSync(path.join(repoRoot, 'config'), { recursive: true });
  fs.writeFileSync(
    path.join(repoRoot, 'config', 'campaign-heroes.json'),
    JSON.stringify({ campaigns: { 'RDD-2026-39': { url: 'https://assets-rdd.vercel.app/hero.png', alt: 'A', height: 300 }, 'RDD-2026-40': { alt: 'no url' } } })
  );
  const declared = loadCampaignHero('RDD-2026-39', { repoRoot });
  assert.strictEqual(declared.url, 'https://assets-rdd.vercel.app/hero.png');
  assert.strictEqual(declared.height, 300);
  assert.strictEqual(loadCampaignHero('RDD-2026-40', { repoRoot }), null, 'an entry missing url is treated as not declared');
});

// ── 5-7. Promotion / coupon rendering ───────────────────────────────────────

const brand = loadBrandConfig('RDD');
const category = { name: 'Acrylic Display', url: 'https://www.retaildisplaydirect.com.au/acrylic-display/' };
const products = [
  { id: 1, name: 'DL Acrylic Brochure Holder', desc: 'Acrylic Display', url: 'https://x/1', imageUrl: 'https://x/1.jpg', priceLabel: 'AUD $5.24', isVisible: true, availability: 'available', inventoryTracking: 'product', inventoryLevel: 10 },
  { id: 2, name: 'A5 Acrylic Sign Holder', desc: 'Acrylic Display', url: 'https://x/2', imageUrl: 'https://x/2.jpg', priceLabel: 'AUD $3.73', isVisible: true, availability: 'available', inventoryTracking: 'product', inventoryLevel: 10 },
  { id: 3, name: 'A4 Acrylic Brochure Holder', desc: 'Acrylic Display', url: 'https://x/3', imageUrl: 'https://x/3.jpg', priceLabel: 'AUD $8.15', isVisible: true, availability: 'available', inventoryTracking: 'product', inventoryLevel: 10 },
  { id: 4, name: 'DL Acrylic Menu Holder', desc: 'Acrylic Display', url: 'https://x/4', imageUrl: 'https://x/4.jpg', priceLabel: 'AUD $2.27', isVisible: true, availability: 'available', inventoryTracking: 'product', inventoryLevel: 10 },
];

function renderFor(campaign) {
  const pkg = buildPackage({ brand, slot: { isoWeek: '2026-W38' }, products, config: {}, campaign, category });
  const rendered = renderWeekly({ repoRoot: REPO_ROOT, brand, pkg });
  return { pkg, html: rendered.html };
}

test('5. promotion=null → no coupon (pkg.coupon is null, and no coupon markup is rendered)', () => {
  const { pkg, html } = renderFor({ ...CAMPAIGN, promotion: null });
  assert.strictEqual(pkg.coupon, null);
  assert.ok(!/<span class="coupon-code"/.test(html), 'no coupon code chip rendered (base-head.html\'s shared .coupon-code CSS rule is always present, so we assert on the element, not the class name)');
  assert.ok(!/\[\[COUPON_/.test(html), 'no unresolved COUPON tokens either');
});

test('6. a real promotion/code renders the approved coupon treatment (real code + offer, no invention)', () => {
  const { pkg, html } = renderFor(CAMPAIGN); // promotion = SPRING15 / 15% off acrylic displays
  assert.deepStrictEqual(pkg.coupon, {
    code: 'SPRING15',
    offerText: '15% off acrylic displays',
    ctaLabel: 'Shop Now',
    ctaUrl: category.url,
  });
  assert.ok(html.includes('SPRING15'), 'the real code is rendered');
  assert.ok(html.includes('15% off acrylic displays'), 'the real offer text is rendered');
  assert.ok(/<span class="coupon-code"[^>]*>SPRING15<\/span>/.test(html), 'the approved coupon component markup is present with the real code');
  // The coupon CTA points at the SAME verified category page as the rest of the send —
  // never an unrelated/fabricated promo landing page.
  assert.ok(html.includes(category.url));
});

test('7. promotion scope: a coupon code that does not match the resolved campaign promotion is a semantic-QA blocker', () => {
  const pkgOk = { products, sectionTitle: 'Acrylic Display', heroHeading: 'Spring Refresh Sale – Acrylic Displays 15% Off', heroBody: '15% off selected acrylic display products.', coupon: { code: 'SPRING15' } };
  const okFinding = checkThemeCoherence(pkgOk, themePkg);
  assert.strictEqual(okFinding.severity, 'pass');

  const pkgMismatch = { ...pkgOk, coupon: { code: 'SUMMER20' } };
  const badFinding = checkThemeCoherence(pkgMismatch, themePkg);
  assert.strictEqual(badFinding.severity, 'blocker');
  assert.match(badFinding.message, /Coupon scope mismatch/);
});
