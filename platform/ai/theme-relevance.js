// ---------------------------------------------------------------------------
// theme-relevance.js — the THEME GATE (SYSTEM PATCH: Campaign Theme Coherence).
//
// VERIFIED PRODUCT != CAMPAIGN-RELEVANT PRODUCT. Passing the DATA GATE
// (platform/ai/copy.js curate() — real, active, priced, imaged, linked) is
// necessary but not sufficient. A product must also support the resolved
// campaign's CampaignThemePackage before it belongs in that campaign's send.
//
// Never backfills a short-count selection with unrelated-but-verified products.
// ---------------------------------------------------------------------------

'use strict';

const HERO_ASSET_REQUIRED = 'HERO_ASSET_REQUIRED';
const INSUFFICIENT_THEME_RELEVANT_PRODUCTS = 'INSUFFICIENT_THEME_RELEVANT_PRODUCTS';

function normalize(s) {
  return String(s == null ? '' : s).toLowerCase().trim();
}

// A generic short word ("new", "sale", "item") is too weak to be a meaningful
// name/description signal on its own — require a minimum length before a term
// can drive a match.
const MIN_TERM_LEN = 4;

// The theme's accepted category/family labels. `categoryFamilies` lets a broad
// Weekly theme span more than one BigCommerce category (e.g. "Access & Crowd
// Control" spanning both "Expandable Barriers" and "Crowd Control Stanchions");
// when absent, the single declared topicCategory is the only family.
function acceptedFamilies(themePkg) {
  if (Array.isArray(themePkg.categoryFamilies) && themePkg.categoryFamilies.length) {
    return themePkg.categoryFamilies.filter(Boolean);
  }
  return [themePkg.topicCategory].filter(Boolean);
}

// The theme's sections. A section groups one or more category families under a
// heading a product can be logically assigned to. Without explicit sections,
// there is one implicit section covering every accepted family.
function resolveSections(themePkg) {
  if (Array.isArray(themePkg.sections) && themePkg.sections.length) return themePkg.sections;
  const families = acceptedFamilies(themePkg);
  return families.length ? [{ title: themePkg.topicCategory || themePkg.campaignName || 'Featured', categoryFamilies: families }] : [];
}

// The verified product's own BigCommerce category/category-path, when the
// caller supplies one. `desc` is the field curation already populates with the
// resolved BigCommerce category label (platform/integrations/bigcommerce/adapter.js
// enrich()), so it is the reliable fallback when a richer field isn't present.
function categoryLabelOf(product) {
  return (product && (product.category || product.categoryPath || product.desc)) || '';
}

// A separate free-text description field, when the caller supplies one.
// Falls back to `desc` (today's only text BigCommerce enrichment carries) so
// this degrades gracefully without a schema change.
function descriptionTextOf(product) {
  return (product && (product.description || product.desc)) || '';
}

// STRONGEST signal: the product's own category/family matches an accepted family.
function categoryFamilyMatch(product, families) {
  const cat = normalize(categoryLabelOf(product));
  if (!cat) return false;
  return families.some((f) => {
    const nf = normalize(f);
    return nf && (cat === nf || cat.includes(nf) || nf.includes(cat));
  });
}

// STRONG signal: the product NAME itself names an accepted family or a
// meaningful (non-generic) theme search term.
function productNameMatch(product, families, searchTerms) {
  const name = normalize(product && product.name);
  if (!name) return false;
  const terms = [...families, ...(searchTerms || [])].map(normalize).filter((t) => t.length >= MIN_TERM_LEN);
  return terms.some((t) => name.includes(t));
}

// SUPPORTING signal only: a description/search-term keyword overlap. On its
// own it can confirm relevance only when the category is unknown/blank — it
// must never override a category that IS present and confirmed to be a
// different family (a single generic keyword cannot rescue a wrong-category
// product).
function descriptionSupportMatch(product, searchTerms) {
  const desc = normalize(descriptionTextOf(product));
  if (!desc) return false;
  return (searchTerms || []).some((t) => t && t.length >= MIN_TERM_LEN && desc.includes(t));
}

// Evaluate one product against one set of accepted families, in priority
// order: category/family (strongest) → product name (strong) → description /
// search-term overlap (supporting-only, and only when the category is blank
// or itself matches — never lets a keyword override a confirmed-wrong category).
function matchFamilies(product, families, searchTerms) {
  if (!families.length) return null;
  if (categoryFamilyMatch(product, families)) return 'category';
  if (productNameMatch(product, families, searchTerms)) return 'name';

  const cat = normalize(categoryLabelOf(product));
  const categoryKnownAndWrong = cat && !categoryFamilyMatch(product, families);
  if (categoryKnownAndWrong) return null;

  return descriptionSupportMatch(product, searchTerms) ? 'description' : null;
}

// A product is theme-relevant when it matches at least one accepted family by
// category, name, or (supporting-only) description/search-term overlap.
function productMatchesTheme(product, themePkg) {
  if (!product || !themePkg) return false;
  const families = acceptedFamilies(themePkg);
  return matchFamilies(product, families, themePkg.searchTerms) !== null;
}

// Which theme section (if any) a product logically belongs under. Returns the
// section object, or null when the product cannot be assigned anywhere. A
// product must be section-assignable, not merely "theme-adjacent", to be used.
function assignSection(product, themePkg) {
  if (!product || !themePkg) return null;
  for (const section of resolveSections(themePkg)) {
    const families = section.categoryFamilies && section.categoryFamilies.length
      ? section.categoryFamilies
      : acceptedFamilies(themePkg);
    if (matchFamilies(product, families, themePkg.searchTerms)) return section;
  }
  return null;
}

// Keep only products that are both theme-relevant AND assignable to a real
// campaign section. If the package declares no theme, every verified product
// passes (nothing to gate against). Never backfills with unassignable products.
function filterThemeRelevant(products, themePkg) {
  if (!themePkg || !resolveSections(themePkg).length) return products;
  return (products || []).filter((p) => assignSection(p, themePkg) !== null);
}

// Hero selection must use the SAME CampaignThemePackage. An approved baseline
// supplies hero STRUCTURE only — campaign-specific artwork must be declared for
// THIS campaign, identified structurally (heroImage.campaignId), never inferred
// or "fixed" by editing alt text. Missing/mismatched declaration blocks.
function assertHeroMatchesTheme(heroImage, themePkg) {
  if (!heroImage) return; // text-only hero — no artwork to mismatch
  if (!themePkg || !themePkg.campaignId) {
    throw new Error(`${HERO_ASSET_REQUIRED}: no resolved CampaignThemePackage to validate the hero against.`);
  }
  const heroCampaignId = heroImage.campaignId || heroImage.campaign_id || null;
  if (!heroCampaignId || heroCampaignId !== themePkg.campaignId) {
    const err = new Error(
      `${HERO_ASSET_REQUIRED}: hero image is not declared for ${themePkg.campaignId} ` +
        `(hero.campaignId=${heroCampaignId || 'none'}). Source campaign-specific artwork for this campaign ` +
        `rather than reusing another campaign's baked hero.`
    );
    err.code = HERO_ASSET_REQUIRED;
    throw err;
  }
}

// Weekly-specific: a calendar-driven Weekly campaign REQUIRES a declared,
// campaign-specific hero — unlike assertHeroMatchesTheme (identity check only;
// no-ops when heroImage is absent, which content-override reuse still relies
// on), this treats ABSENCE itself as a blocker (SYSTEM PATCH: Weekly Hero
// Banner Resolution). Never silently falls back to a text-only hero, never
// borrows another campaign's artwork, never generates an image. The identity
// check still runs first, so a MISMATCHED hero is reported as clearly as a
// MISSING one.
function requireWeeklyHero(heroImage, themePkg) {
  assertHeroMatchesTheme(heroImage, themePkg);
  if (!heroImage) {
    const err = new Error(
      `${HERO_ASSET_REQUIRED}: campaign_id=${themePkg && themePkg.campaignId} theme="${themePkg && themePkg.topicCategory}" — ` +
        `no verified hero banner is declared for this exact campaign in config/campaign-heroes.json. Weekly campaigns ` +
        `require a campaign-specific hero (never a historical campaign's artwork, never auto-generated, never a silent ` +
        `text-only fallback). Expected hero intent: artwork that states the "${themePkg && themePkg.topicCategory}" theme, ` +
        `assembled per Standards/hero-contract.md (edge-to-edge inside the 600px container, max-width:600px, real ` +
        `pixel width/height attributes — see Components/hero-image.html). Declare the approved asset for ` +
        `${themePkg && themePkg.campaignId} in config/campaign-heroes.json once artwork exists, or STOP and request it.`
    );
    err.code = HERO_ASSET_REQUIRED;
    throw err;
  }
}

// The GATE + FALLBACK decision, factored out of the pipeline so it is testable
// without BigCommerce/render/QA (SYSTEM PATCH: verified fallback discovery,
// RDD-2026-39). Never widens into unrelated products — `fetchFallback` only
// supplies MORE CANDIDATES (verified related-category + catalog-search data);
// filterThemeRelevant (the SAME deterministic gate, called again on the merged
// pool) remains the sole authority on which of them actually qualify.
//
//   candidates      - the exact-category verified product pool
//   themePkg        - the resolved CampaignThemePackage
//   min             - minimum theme-relevant products required
//   fetchFallback   - optional async () => { products } — the widened discovery
//                     tiers (child categories → name-matched categories →
//                     catalog keyword search), called ONLY if the exact
//                     category pool is insufficient
//   onFallback(n)   - optional callback, invoked with the pre-fallback
//                     theme-relevant count, right before fetchFallback runs
//
// Returns { candidates, themeRelevant } — `candidates` is the (possibly
// widened) full pool; `themeRelevant` is what actually passed the gate.
async function resolveThemeRelevantProducts({ candidates, themePkg, min, fetchFallback = null, onFallback = null }) {
  const pool = Array.isArray(candidates) ? candidates.slice() : [];
  let themeRelevant = filterThemeRelevant(pool, themePkg);

  if (themeRelevant.length < min && typeof fetchFallback === 'function') {
    if (typeof onFallback === 'function') onFallback(themeRelevant.length);
    const broadened = await fetchFallback();
    const broadenedProducts = (broadened && broadened.products) || broadened || [];
    const seen = new Set(pool.map((p) => p.id));
    for (const p of broadenedProducts) {
      if (seen.has(p.id)) continue;
      seen.add(p.id);
      pool.push(p);
    }

    // VERIFIED child categories (BigCommerce's own parent→child hierarchy, tier 2
    // of discoverThemeCandidates) are authoritative evidence that they belong to
    // the SAME theme family as the exact resolved category — a real, catalog-
    // verified relationship, not a guess. Promote them into themePkg.categoryFamilies
    // (mutating the SAME object the caller holds, so downstream semantic QA —
    // which reads this identical themePkg — stays consistent with this gate; no
    // "structural QA passed, semantic QA blocked the same products" contradiction).
    // Tier 3 (name-matched) / tier 4 (catalog search) category/product names are
    // NEVER promoted this way — they remain subject to the original, strict family
    // check (never widen "relevant" beyond a verified hierarchy relationship).
    const verifiedChildFamilies = (broadened && broadened.verifiedChildFamilies) || [];
    if (verifiedChildFamilies.length && themePkg) {
      const existing = new Set((acceptedFamilies(themePkg) || []).filter(Boolean));
      for (const f of verifiedChildFamilies) existing.add(f);
      themePkg.categoryFamilies = [...existing];
    }

    themeRelevant = filterThemeRelevant(pool, themePkg);
  }

  return { candidates: pool, themeRelevant };
}

module.exports = {
  productMatchesTheme,
  filterThemeRelevant,
  resolveThemeRelevantProducts,
  assignSection,
  resolveSections,
  assertHeroMatchesTheme,
  requireWeeklyHero,
  HERO_ASSET_REQUIRED,
  INSUFFICIENT_THEME_RELEVANT_PRODUCTS,
};
