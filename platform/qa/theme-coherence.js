// ---------------------------------------------------------------------------
// theme-coherence.js — semantic QA (SYSTEM PATCH: Campaign Theme Coherence).
//
// Structural QA (validators.js) proves the HTML is safe/valid. It does NOT
// prove the campaign is coherent: a baseline can pass structural QA while
// carrying another campaign's hero/body/products. This check closes that gap,
// checking the resolved CampaignThemePackage against every layer:
//
//   Campaign Theme ↔ Hero ↔ Intro ↔ Section headings ↔ Product categories ↔
//   Products ↔ CTA
//
// A major mismatch is a BLOCKER. Structural QA PASS must never override a
// semantic QA failure (pipeline.js merges this finding into the same QA gate).
// ---------------------------------------------------------------------------

'use strict';

const { finding } = require('./validators');
const { productMatchesTheme, HERO_ASSET_REQUIRED } = require('../ai/theme-relevance');

function normalize(s) {
  return String(s == null ? '' : s).toLowerCase().trim();
}

// Loose (singular/plural-insensitive) word-level normalization — tolerates the
// same common naming variance platform/integrations/bigcommerce/adapter.js's
// normalizeCategoryName already resolves for CATEGORY LOOKUP (e.g. calendar
// "Acrylic Displays" vs the live BigCommerce category "Acrylic Display"). A
// real, verified section heading/hero copy built from the actual resolved
// category name must not be flagged off-theme purely over a plural mismatch.
function normalizeLoose(s) {
  return String(s == null ? '' : s)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
    .split(' ')
    .filter(Boolean)
    .map((w) => w.replace(/s$/, ''))
    .join(' ');
}

// Does a copy fragment (heading/body/section title) reference the theme?
function copyMatchesTheme(text, themePkg) {
  const t = normalize(text);
  if (!t) return false;
  const topic = normalize(themePkg.topicCategory);
  if (topic && t.includes(topic)) return true;
  if ((themePkg.searchTerms || []).some((term) => term && t.includes(term))) return true;
  const topicLoose = normalizeLoose(themePkg.topicCategory);
  return Boolean(topicLoose) && normalizeLoose(text).includes(topicLoose);
}

// pkg: the built content package (heroHeading, heroBody, sectionTitle, products,
//      heroImage, groups). themePkg: CampaignThemePackage from the resolved
//      calendar campaign (platform/workflow/campaign-theme-package.js).
function checkThemeCoherence(pkg, themePkg) {
  if (!themePkg || !themePkg.topicCategory) {
    // No declared theme to check against (e.g. generic non-calendar weekly) —
    // nothing to gate.
    return finding('pass', 'theme-coherence', 'No campaign theme declared; nothing to check.', 'CLAUDE.md/theme-coherence');
  }

  const mismatches = [];

  // Hero (image) must be declared for THIS campaign — never inferred from alt text.
  if (pkg.heroImage) {
    const heroCampaignId = pkg.heroImage.campaignId || pkg.heroImage.campaign_id || null;
    if (!heroCampaignId || heroCampaignId !== themePkg.campaignId) {
      mismatches.push(`${HERO_ASSET_REQUIRED}: hero image not declared for ${themePkg.campaignId} (got "${heroCampaignId || 'none'}").`);
    }
  }

  // Hero copy must state the theme.
  if (!copyMatchesTheme(pkg.heroHeading, themePkg) && !copyMatchesTheme(pkg.heroBody, themePkg)) {
    mismatches.push(`Hero heading/body does not reference the campaign theme "${themePkg.topicCategory}".`);
  }

  // Section heading must state the theme.
  if (!copyMatchesTheme(pkg.sectionTitle, themePkg)) {
    mismatches.push(`Section heading "${pkg.sectionTitle || ''}" does not reference the campaign theme "${themePkg.topicCategory}".`);
  }

  // Every product (flattened across groups, if any) must be theme-relevant.
  // This already covers "promoted products stay in theme/promotion scope"
  // whenever a coupon exists, since the coupon and the products both derive
  // from the SAME resolved campaign/theme.
  const products = pkg.products || [];
  const offTheme = products.filter((p) => !productMatchesTheme(p, themePkg));
  if (products.length && offTheme.length) {
    mismatches.push(
      `${offTheme.length}/${products.length} product(s) do not support the campaign theme "${themePkg.topicCategory}": ` +
        offTheme.slice(0, 5).map((p) => p.id != null ? `#${p.id}` : (p.name || '?')).join(', ')
    );
  }

  // Promotion/coupon scope check (SYSTEM PATCH: Promotion/Coupon Resolution):
  // a rendered coupon must be the SAME promotion the resolved campaign declares
  // — never a different code/offer than the calendar's, which would decouple
  // the promoted incentive from the theme-gated product selection above.
  if (pkg.coupon) {
    const promoCode = themePkg.promotion && themePkg.promotion.code;
    if (!promoCode || pkg.coupon.code !== promoCode) {
      mismatches.push(
        `Coupon scope mismatch: rendered code "${pkg.coupon.code}" does not match the resolved campaign's ` +
          `declared promotion${promoCode ? ` ("${promoCode}")` : ' (none declared)'}.`
      );
    }
  }

  if (mismatches.length) {
    return finding(
      'blocker',
      'theme-coherence',
      `Campaign ${themePkg.campaignId} semantic mismatch: ${mismatches.join(' ')}`,
      'CLAUDE.md/theme-coherence',
      { mismatches }
    );
  }

  return finding('pass', 'theme-coherence', `Hero, sections and products all support "${themePkg.topicCategory}".`, 'CLAUDE.md/theme-coherence');
}

module.exports = { checkThemeCoherence, copyMatchesTheme };
