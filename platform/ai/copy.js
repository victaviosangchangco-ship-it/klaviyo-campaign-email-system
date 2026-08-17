// ---------------------------------------------------------------------------
// copy.js — AI Decision Engine, MVP implementation (Architecture V2 §2.4).
//
// Responsibilities: curate the verified product set, and produce the campaign
// COPY package (subject, preheader, hero, intro, section framing, CTA).
//
// ─────────────────────────────────────────────────────────────────────────
//  LLM SEAM (documented, deliberate):
//  In the MVP this module is DETERMINISTIC — copy is composed from real,
//  verified inputs (brand facts + the categories actually present in the
//  curated set). This keeps the demo repeatable and golden-file testable.
//  Architecture V2 §2.4 designates this module as the point where a Claude
//  Agent SDK call is later swapped in for richer copy/curation. The function
//  boundary (buildPackage → {package}) does not change when that happens.
// ─────────────────────────────────────────────────────────────────────────
//
// It NEVER invents product data. It only WRITES SENTENCES around facts that are
// already verified, and it obeys the copy rules that apply to a Weekly:
//   - no em dashes / dash interruptions in intro copy (CLAUDE.md §6.2),
//   - one primary CTA to a real destination (§6.2/§6.7),
//   - factual framing only (in stock / ships Australia-wide are grounded in the
//     curated set + brand trust config).
// ---------------------------------------------------------------------------

'use strict';

const { ApprovalRequired } = require('../common/errors');

// Curate: keep only products that pass the verification-relevant checks
// (CLAUDE.md §5.1 — visible, purchasable, priced, with an image and a URL).
function curate(products, { count, min }) {
  const kept = products.filter(
    (p) =>
      p &&
      p.isVisible !== false &&
      p.availability !== 'disabled' &&
      p.priceLabel && // price > 0 (formatAud returned a label)
      p.imageUrl &&
      p.url
  );

  if (kept.length < min) {
    throw new ApprovalRequired(
      `Only ${kept.length} verified product(s) available (minimum ${min}). ` +
        `The engine will not fabricate products to hit the count (CLAUDE.md §5.1) — ` +
        `connect more categories or confirm the selection.`,
      { verified: kept.length, min }
    );
  }

  // take up to `count`, then trim to an even number for a clean 2-col grid
  let selected = kept.slice(0, count);
  if (selected.length % 2 !== 0) selected = selected.slice(0, selected.length - 1);
  return selected;
}

// The top distinct category labels present in the curated set (factual).
function topCategories(products, n = 3) {
  const counts = new Map();
  for (const p of products) {
    const label = (p.desc || '').trim();
    if (label) counts.set(label, (counts.get(label) || 0) + 1);
  }
  return [...counts.entries()].sort((a, b) => b[1] - a[1]).slice(0, n).map(([label]) => label);
}

// Join a list into readable prose: ["A","B","C"] -> "A, B and C".
function humanList(items) {
  if (items.length <= 1) return items[0] || '';
  return `${items.slice(0, -1).join(', ')} and ${items[items.length - 1]}`;
}

// Ensure a fragment ends as a sentence (for clean concatenation).
function ensureSentence(s) {
  const t = String(s == null ? '' : s).trim().replace(/\s+/g, ' ');
  if (!t) return '';
  return /[.!?]$/.test(t) ? t : `${t}.`;
}

// Cap to a preheader-friendly length on a word boundary (adds an ellipsis).
function capPreview(s, max = 150) {
  const t = String(s == null ? '' : s).trim().replace(/\s+/g, ' ');
  if (t.length <= max) return t;
  return `${t.slice(0, max - 1).replace(/[\s,;:.–—-]+\S*$/, '').trim()}…`;
}

// Generate a campaign-specific Preview Text (email preheader). CLAUDE.md §6.24:
// every Weekly Campaign MUST have a non-empty, campaign-specific preview text.
// Source priority:
//   1. a valid calendar preview_text → use it verbatim (never invented).
//   2. otherwise GENERATE one from the same verified context used to build the
//      email — subject-aware (complements, never repeats), type-aware, and always
//      accurate (only real key_topic / promotion / theme / product-count; no fake
//      offers, urgency, or fabricated benefits).
function generatePreviewText({ campaign = {}, category = null, count = 0 } = {}) {
  const provided = typeof campaign.preview_text === 'string' ? campaign.preview_text.trim() : '';
  if (provided) return provided; // (1) calendar wins

  // (2) generate — factual inputs only
  const theme = (category && category.name) || campaign.topic_category || 'the range';
  const key = campaign.key_topic ? String(campaign.key_topic).trim().replace(/\s+/g, ' ') : '';
  const promo = campaign.promotion && (campaign.promotion.text || campaign.promotion.code)
    ? String(campaign.promotion.text || campaign.promotion.code).trim()
    : '';
  const type = String(campaign.campaign_type || '').toLowerCase();
  const nItems = count > 0 ? `${count} ` : '';
  const ship = 'in stock now and ready to ship Australia-wide';

  // promotional families: lead with the REAL offer when one exists (never fake it)
  if (/promotional|clearance|gift|eofy|sale|category-spotlight|awareness/.test(type) && promo) {
    return capPreview(`${ensureSentence(promo)} Shop ${theme}, ${ship}.`);
  }
  // insight / educational / newsletter / story / launch: curiosity + usefulness
  if (/insight|educational|newsletter|story|launch|announcement/.test(type)) {
    if (key) return capPreview(`${ensureSentence(key)} Compare ${nItems}${theme} options, ${ship}.`);
    return capPreview(`A practical guide to ${theme}. Compare ${nItems}options, ${ship}.`);
  }
  // weekly / product-led default: highlight the real theme + range
  if (key) return capPreview(`${ensureSentence(key)} Explore ${nItems}${theme} picks, ${ship}.`);
  return capPreview(`Fresh ${theme} picks, ${ship}.`);
}

// Copy driven by a calendar campaign record (the calendar is the source of truth).
// Uses the record's subject/name/key_topic/type verbatim — it NEVER invents these,
// and only writes the surrounding factual product-facing sentences. Themed to the
// campaign's category so the email reads as one coherent message (CLAUDE.md §5.2).
function buildCalendarPackage({ brand, campaign, category, selected }) {
  const n = selected.length;
  const catLabel = (category && category.name) || campaign.topic_category || 'the range';
  const allProductsUrl = brand.identity.allProductsUrl.value;

  return {
    // subject comes straight from the calendar (do not invent — user rule)
    subject: campaign.subject_line || `${brand.identity.displayName.value}: ${catLabel}`,
    // preview: calendar preview if valid, else generated campaign-specific (§6.24)
    preheader: generatePreviewText({ campaign, category, count: n }),
    eyebrow: String(campaign.campaign_type_label || 'This Week').toUpperCase(),
    // one introduction only (§5.2): the hero states the theme…
    heroHeading: campaign.campaign_name || `This Week: ${catLabel}`,
    heroBody: campaign.key_topic || `A focused selection of ${catLabel}, in stock now and ready to ship across Australia.`,
    // …and the intro paragraphs SUPPORT it without restating the theme (§5.2)
    introParas: [
      `Browse the ${catLabel} range below. Every product is in stock and ready to ship across Australia.`,
      'Each item links straight to its live product page.',
    ],
    sectionTitle: catLabel,
    sectionSubtitle: `${n} products, in stock now`,
    badgeText: 'In Stock',
    ctaLabel: 'Explore the Range',
    // CTA → the live category page when resolved, else the safe all-products page (§6.7)
    ctaUrl: (category && category.url) || allProductsUrl,
    products: selected,
    _decision: {
      candidateSource: `calendar:${campaign.campaign_id}`,
      category: catLabel,
      verifiedCount: n,
      subjectFrom: 'calendar.subject_line',
      generatedBy: 'calendar-driven (LLM seam: platform/ai/copy.js buildCalendarPackage)',
    },
  };
}

// Build a package from an approved CONTENT OVERRIDE (a specific hero image, grouped
// multi-category product selection, and AUTHORED copy). The copy is passed through
// verbatim (already written to the rules: NO DASH §6.2, no invented claims, §6.24
// preview present); products are the VERIFIED live items the pipeline resolved by id.
// Never fabricates data — it only assembles what was verified + what was authored.
function buildOverridePackage({ brand, plan, groups }) {
  const allProducts = groups.flatMap((g) => g.products);
  const cta = plan.cta_primary || {};
  const closing = plan.cta_closing || null;
  return {
    subject: plan.subject,
    preheader: plan.preview_text,
    eyebrow: plan.eyebrow || '',
    heroHeading: plan.hero_heading,
    heroBody: plan.hero_body || '',
    introParas: Array.isArray(plan.intro_paras) ? plan.intro_paras.slice(0, 2) : [],
    heroImage: plan.hero_image || null, // { url, alt, height, link }
    ctaLabel: cta.label || 'Shop the Range',
    ctaUrl: cta.url || brand.identity.allProductsUrl.value,
    closingCtaLabel: closing ? closing.label : null,
    closingCtaUrl: closing ? closing.url : null,
    sectionTitle: groups[0] ? groups[0].title : '',
    sectionSubtitle: '',
    badgeText: 'In Stock',
    groups, // [{ title, subtitle, badge, products:[…] }]
    products: allProducts, // flattened, for QA / exports / meta
    _decision: {
      candidateSource: `override:${plan.campaign_id}`,
      groups: groups.map((g) => ({ title: g.title, count: g.products.length })),
      verifiedCount: allProducts.length,
      subjectFrom: 'content-override (authored)',
      generatedBy: 'content-override (platform/ai/copy.js buildOverridePackage)',
    },
  };
}

function buildPackage({ brand, slot, products, config, campaign = null, category = null }) {
  const count = (config && config.product && config.product.defaultCount) || 16;
  const min = (config && config.product && config.product.minCount) || 4;

  const selected = curate(products, { count, min });

  // Calendar-driven path: the campaign record governs the copy + theme.
  if (campaign) return buildCalendarPackage({ brand, campaign, category, selected });

  // Generic weekly path (unchanged — byte-identical output, golden-test safe).
  const cats = topCategories(selected, 3);
  const catPhrase = cats.length ? humanList(cats) : 'this week’s range';
  const displayName = brand.identity.displayName.value;
  const n = selected.length;

  // --- copy (deterministic; grounded in verified facts; no em dashes §6.2) ---
  const pkg = {
    subject: `This week at ${displayName}: ${cats[0] || 'featured picks'} & more`,
    preheader: `${n} featured products, in stock now and ready to ship Australia-wide.`,
    eyebrow: 'THIS WEEK’S PICKS',
    heroHeading: 'This Week’s Featured Range',
    heroBody: `A hand-picked selection of ${catPhrase}, in stock now and ready to ship across Australia.`,
    introParas: [
      'Every product below is live, in stock and links straight to its page.',
      'Browse this week’s selection and find what fits your space.',
    ],
    sectionTitle: 'Featured This Week',
    sectionSubtitle: `${n} products, in stock now`,
    badgeText: 'In Stock',
    ctaLabel: 'Shop the Range',
    ctaUrl: brand.identity.allProductsUrl.value,
    products: selected,
    // provenance for the audit trail / QA report
    _decision: {
      candidateCount: products.length,
      verifiedCount: selected.length,
      categories: cats,
      slot: { type: slot.type, isoWeek: slot.isoWeek, synthesized: !!slot.synthesized },
      generatedBy: 'deterministic-mvp (LLM seam: platform/ai/copy.js buildPackage)',
    },
  };

  return pkg;
}

module.exports = { buildPackage, buildOverridePackage, curate, topCategories, humanList, generatePreviewText };
