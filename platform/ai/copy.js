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
const { isCampaignPurchasable, PASS } = require('../integrations/bigcommerce/inventory');
const { orderProductsForGrid } = require('../render/grid-order');

// Keep only products that pass the verification-relevant checks (CLAUDE.md
// §5.1 — visible, purchasable, priced, with an image and a URL) AND the
// fail-closed inventory safety gate. Shared by curate() and curateWithAudit()
// so the actual filter logic lives in exactly one place.
function verifiedOnly(products) {
  return products.filter((p) => {
    if (!p) return false;
    const v = isCampaignPurchasable(p);
    return v.status === PASS;
  });
}

function assertMinimum(kept, min) {
  if (kept.length < min) {
    throw new ApprovalRequired(
      `Only ${kept.length} verified product(s) available (minimum ${min}). ` +
        `The engine will not fabricate products to hit the count (CLAUDE.md §5.1) — ` +
        `connect more categories or confirm the selection.`,
      { verified: kept.length, min }
    );
  }
}

// ---------------------------------------------------------------------------
// SYSTEM PATCH: Curation Ranking + Category Balancing.
//
// Problem this fixes: the previous selection was `kept.slice(0, count)` — the
// first N verified candidates in raw category-resolution order. For a
// multi-category campaign that meant the FIRST one or two categories could
// consume the entire product count before a later, equally-approved
// supporting category was ever touched (SS-2026-36: 9 Speed Humps + 9 Safety
// Bollards, 0 Dock Bumpers, 0 Convex Mirrors — despite all four being
// Calendar-approved). It also had no concept of "this SKU is the standalone
// product" vs "this SKU is a replacement end-cap for it", so an
// accessory-only line could dominate a category over the complete unit it
// belongs to.
//
// Fix, in two parts:
//   1. classifyProduct() — ranks a product standalone/complete > functional
//      component > accessory/replacement/end-cap. NO STRUCTURED SIGNAL EXISTS
//      for this in the live catalog (verified directly against BigCommerce's
//      custom_fields/type/sku for real SKUs — e.g. product 605 "Steel Speed
//      Hump- 1m Module" carries only Material/Size/Weight custom fields, no
//      product-type/accessory flag). Every real store category also assigns
//      products to the PARENT id directly (subcategories like "Fold Down
//      Bollard" exist as navigation only, never as a product's actual
//      category), so category id is not a usable signal either. The fallback
//      is therefore an EXPLICIT, auditable name-pattern match (never a silent
//      heuristic) — every classification carries its exact matched pattern
//      (or "no pattern matched") as `reason`, so it can be reviewed per product.
//   2. selectBalanced() — groups verified candidates by category (each
//      product's real resolved category, `.desc`), orders the groups by the
//      Calendar's own product_categories order (campaign intent: first =
//      primary, rest = approved supporting), ranks each group by tier then by
//      healthier stock (a low-stock product never loses to a same-tier
//      higher-stock one; but tier always wins over stock, so a low-stock
//      complete/primary-theme unit is never displaced by a well-stocked
//      accessory), then fills the requiredCount via ROUND-ROBIN across groups
//      in that order — so no single category can exhaust the count while a
//      later approved category still holds valid, unused candidates.
//
// Both are pure and independently testable (platform/tests/
// required-product-count.test.js / curation-balance.test.js), and reused by
// EVERY calendar-driven campaign — nothing here is SS-2026-36-specific.
// ---------------------------------------------------------------------------

const TIER_RANK = { complete: 0, component: 1, accessory: 2 };

// Fallback-only, explicit, auditable name-pattern classification (see header
// comment — no structured product-type field exists in this catalog).
const ACCESSORY_PATTERNS = [
  { re: /\bend\s*caps?\b/i, label: 'end cap' },
  { re: /\bwall\s*(attachment|bracket|mount)s?\b/i, label: 'wall attachment/bracket' },
  { re: /\bbase\s*for\b/i, label: 'replacement base' },
  { re: /\breplacement\b/i, label: 'replacement part' },
  { re: /\bspare\s*part\b/i, label: 'spare part' },
];
const COMPONENT_PATTERNS = [
  { re: /\bend\s*sections?\b/i, label: 'end section' },
  { re: /\bextension\s*(piece|section)?\b/i, label: 'extension piece' },
  { re: /\bconnector\b/i, label: 'connector' },
];

function classifyProduct(product) {
  const name = String((product && product.name) || '');
  for (const { re, label } of ACCESSORY_PATTERNS) {
    if (re.test(name)) {
      return { tier: 'accessory', reason: `name matches accessory pattern "${label}" (fallback: no structured product-type field in this catalog)` };
    }
  }
  for (const { re, label } of COMPONENT_PATTERNS) {
    if (re.test(name)) {
      return { tier: 'component', reason: `name matches component pattern "${label}"` };
    }
  }
  return { tier: 'complete', reason: 'no accessory/component name pattern matched — treated as a standalone product' };
}

// Score a category's quality depth for proportional slot allocation. Only
// complete/component candidates contribute (accessories add no depth); a
// "strong" candidate (inv >= STRONG_INV_THRESHOLD) scores more than a weak one.
const STRONG_INV_THRESHOLD = 2;
const PRIMARY_DEPTH_WEIGHT = 3;

function scoreCategoryDepth(rankedList) {
  let score = 0;
  for (const entry of rankedList) {
    const inv = Number(entry.product.inventoryLevel) || 0;
    const strong = inv >= STRONG_INV_THRESHOLD;
    if (entry.tier === 'complete') score += strong ? 3 : 1;
    else if (entry.tier === 'component') score += strong ? 1.5 : 0.5;
  }
  return score;
}

// Group verified candidates by category → rank each group (tier, then stock
// desc) → allocate slots by category quality/depth rather than equal round-robin
// → fill each category's allocated slots from its best candidates.
// Returns { selected, audit, categoryStats } — never mutates input.
function selectBalanced(kept, { count, categoryOrder }) {
  const byCategory = new Map();
  for (const p of kept) {
    const cat = (p && p.desc) || '';
    if (!byCategory.has(cat)) byCategory.set(cat, []);
    byCategory.get(cat).push(p);
  }

  const orderedCats = [
    ...categoryOrder.filter((c) => byCategory.has(c)),
    ...[...byCategory.keys()].filter((c) => !categoryOrder.includes(c)),
  ];

  const ranked = new Map();
  for (const cat of orderedCats) {
    const list = byCategory.get(cat).map((product) => ({ product, ...classifyProduct(product) }));
    list.sort((a, b) => {
      if (TIER_RANK[a.tier] !== TIER_RANK[b.tier]) return TIER_RANK[a.tier] - TIER_RANK[b.tier];
      return (Number(b.product.inventoryLevel) || 0) - (Number(a.product.inventoryLevel) || 0);
    });
    ranked.set(cat, list);
  }

  // Score each category's quality depth; primary gets a weight multiplier.
  const scores = new Map();
  for (let i = 0; i < orderedCats.length; i++) {
    const cat = orderedCats[i];
    const raw = scoreCategoryDepth(ranked.get(cat));
    scores.set(cat, i === 0 ? raw * PRIMARY_DEPTH_WEIGHT : raw);
  }

  // Allocate: minimum 1 slot per category, remainder by depth weight.
  const allocation = new Map();
  let used = 0;
  for (const cat of orderedCats) {
    const min = Math.min(1, ranked.get(cat).length);
    allocation.set(cat, min);
    used += min;
  }

  let remaining = Math.max(0, count - used);
  const totalScore = [...scores.values()].reduce((a, b) => a + b, 0);

  if (remaining > 0 && totalScore > 0) {
    const rawAllocs = orderedCats.map((cat) => {
      const maxExtra = ranked.get(cat).length - allocation.get(cat);
      const raw = remaining * scores.get(cat) / totalScore;
      return { cat, raw, floor: Math.min(Math.floor(raw), maxExtra), maxExtra };
    });

    let floorSum = rawAllocs.reduce((s, a) => s + a.floor, 0);
    let surplus = remaining - floorSum;

    const byRemainder = rawAllocs
      .filter((a) => a.floor < a.maxExtra)
      .sort((a, b) => (b.raw - b.floor) - (a.raw - a.floor));

    for (const a of byRemainder) {
      if (surplus <= 0) break;
      a.floor += 1;
      surplus -= 1;
    }

    for (const a of rawAllocs) {
      allocation.set(a.cat, allocation.get(a.cat) + a.floor);
    }
  }

  // Fill each category's allocated slots from its ranked candidates.
  const selected = [];
  const audit = [];

  for (let i = 0; i < orderedCats.length; i++) {
    const cat = orderedCats[i];
    const list = ranked.get(cat);
    const slots = allocation.get(cat);
    const role = i === 0 ? 'primary' : 'supporting';

    for (let j = 0; j < slots && j < list.length; j++) {
      const entry = list[j];
      selected.push(entry.product);
      audit.push({
        id: entry.product.id,
        name: entry.product.name,
        category: cat,
        role,
        tier: entry.tier,
        stock: entry.product.inventoryLevel != null ? Number(entry.product.inventoryLevel) : null,
        reason: entry.reason,
        rankWithinCategory: j + 1,
      });
    }
  }

  const categoryStats = orderedCats.map((cat, i) => ({
    category: cat,
    role: i === 0 ? 'primary' : 'supporting',
    candidateCount: ranked.get(cat).length,
    selectedCount: allocation.get(cat),
    depthScore: scores.get(cat),
  }));

  return { selected, audit, categoryStats };
}

// Apply the even-grid trim (§6.9) after either selection strategy.
function selectAndTrim(kept, { count, categoryOrder }) {
  let selected;
  let audit = [];
  let categoryStats = [];
  if (categoryOrder && categoryOrder.length) {
    ({ selected, audit, categoryStats } = selectBalanced(kept, { count, categoryOrder }));
  } else {
    selected = kept.slice(0, count);
  }
  if (selected.length % 2 !== 0) selected = selected.slice(0, selected.length - 1);
  const { ordered, pairingAudit } = orderProductsForGrid(selected);
  return { selected: ordered, audit, categoryStats, pairingAudit };
}

// Curate: the original, UNCHANGED external contract (returns a plain array;
// existing callers/tests are byte-for-byte unaffected when categoryOrder is
// omitted — it degenerates to the exact old `slice(0, count)` behavior).
function curate(products, { count, min, categoryOrder = null }) {
  const kept = verifiedOnly(products);
  assertMinimum(kept, min);
  return selectAndTrim(kept, { count, categoryOrder }).selected;
}

// Same selection as curate(), but also returns the per-product curation audit
// and per-category stats (used by the calendar-driven path so QA can see WHY
// each product was, or wasn't, chosen). Reuses the exact same verification
// gate as curate() — never a second, divergent filter.
function curateWithAudit(products, { count, min, categoryOrder = null }) {
  const kept = verifiedOnly(products);
  assertMinimum(kept, min);
  return selectAndTrim(kept, { count, categoryOrder });
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

// Calendar free-text fields (key_topic, notes) are PLANNING INPUT for whoever
// briefed the campaign — not display copy. A sentence written as an instruction
// to the campaign builder ("Promote the...", "Each item links...") must never
// reach the customer verbatim. This is a general detector (not overfit to exact
// calendar phrasing) for imperative, process-facing language: it matches on
// leading verbs/phrases that address the campaign/reader-as-marketer rather
// than the customer. When it fires, callers fall back to the existing
// verified-fact template sentence instead of inventing new copy.
const PLANNING_LANGUAGE_RE = /^(promote|highlight|showcase|feature|position|target|drive|push|market|advertise|announce|use this (campaign|email|send)|this (campaign|email|send) (should|will|must)|each item links|link[s]? straight|the (goal|aim|intent) (is|of this))\b/i;

function isPlanningLanguage(text) {
  const t = String(text == null ? '' : text).trim();
  return Boolean(t) && PLANNING_LANGUAGE_RE.test(t);
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
  const rawKey = campaign.key_topic ? String(campaign.key_topic).trim().replace(/\s+/g, ' ') : '';
  // Planning language ("Promote the...") is never surfaced as preview text —
  // fall back to the theme-only branches below instead of inventing anything.
  const key = rawKey && !isPlanningLanguage(rawKey) ? rawKey : '';
  const promo = campaign.promotion && (campaign.promotion.text || campaign.promotion.code)
    ? String(campaign.promotion.text || campaign.promotion.code).trim()
    : '';
  const type = String(campaign.topic_category_slug || '').toLowerCase();
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

  // campaign.key_topic is planning INPUT (what the campaign should promote),
  // not customer-facing copy — a sentence written as an instruction to the
  // builder ("Promote the...") must never render verbatim (CLAUDE.md §9).
  // When it reads as planning language, fall back to the same grounded,
  // verified-fact sentence already used when no key_topic is supplied at all.
  const rawKeyTopic = campaign.key_topic ? String(campaign.key_topic).trim().replace(/\s+/g, ' ') : '';
  const heroBodyFallback = `A focused selection of ${catLabel}, in stock now and ready to ship across Australia.`;
  const heroBody = rawKeyTopic && !isPlanningLanguage(rawKeyTopic) ? rawKeyTopic : heroBodyFallback;

  return {
    // subject comes straight from the calendar (do not invent — user rule)
    subject: campaign.subject_line || `${brand.identity.displayName.value}: ${catLabel}`,
    // preview: calendar preview if valid, else generated campaign-specific (§6.24)
    preheader: generatePreviewText({ campaign, category, count: n }),
    eyebrow: String(campaign.campaign_type_label || 'This Week').toUpperCase(),
    // one introduction only (§5.2): the hero states the theme…
    heroHeading: campaign.campaign_name || `This Week: ${catLabel}`,
    heroBody,
    // …and the intro paragraph SUPPORTS it without restating the theme (§5.2).
    // CLAUDE.md §9: intro copy is one short paragraph max — a second, process-
    // sounding line ("Each item links straight to its live product page.") was
    // previously hardcoded here; removed rather than shown to customers.
    introParas: [
      `Browse the ${catLabel} range below. Every product is in stock and ready to ship across Australia.`,
    ],
    sectionTitle: catLabel,
    sectionSubtitle: `${n} products, in stock now`,
    badgeText: 'In Stock',
    ctaLabel: 'Explore the Range',
    // CTA → the live category page when resolved, else the safe all-products page (§6.7)
    ctaUrl: (category && category.url) || allProductsUrl,
    products: selected,
    // Coupon/promo block (SYSTEM PATCH: Promotion/Coupon Resolution). The
    // calendar's promotion field is authoritative — never invented here, never
    // a different code/discount/expiry than the calendar declares. null
    // promotion (the common case) → null coupon → renderer omits the block
    // entirely (Standards/coupon-contract.md "Absent coupon"). The CTA reuses
    // the SAME verified category URL as the rest of the send, so the promoted
    // offer can never point at products outside the resolved theme/category.
    coupon: campaign.promotion && campaign.promotion.code && campaign.promotion.text
      ? {
          code: campaign.promotion.code,
          offerText: campaign.promotion.text,
          ctaLabel: 'Shop Now',
          ctaUrl: (category && category.url) || allProductsUrl,
        }
      : null,
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
    heroHeading: plan.hero_heading || '',
    heroBody: plan.hero_body || '',
    introParas: Array.isArray(plan.intro_paras) ? plan.intro_paras.slice(0, 2) : [],
    heroImage: plan.hero_image || null, // { url, alt, height, link }
    // The hero banner is a baked-message graphic (its own headline/CTA are
    // artwork, not HTML) — the separate text hero/intro/primary-CTA block below
    // it would only ever repeat what the image already shows (CLAUDE.md §9 "one
    // introduction... later sections support, not restate"), so renderer.js
    // skips rendering it. heroHeading/heroBody stay populated with real,
    // theme-referencing text ONLY so semantic QA (checkThemeCoherence) can still
    // confirm the hero supports the declared theme — it is never displayed.
    heroMessageBaked: Boolean(plan.hero_message_baked),
    // Primary CTA is OPTIONAL for an override (omit cta_primary entirely to skip
    // it) — e.g. when the hero banner already carries the message/CTA and the
    // approved flow goes straight into the first section heading (CLAUDE.md §9).
    // An override that DOES supply cta_primary is unaffected (unchanged behavior).
    ctaLabel: cta.label || null,
    ctaUrl: cta.label ? (cta.url || brand.identity.allProductsUrl.value) : null,
    closingCtaLabel: closing ? closing.label : null,
    closingCtaUrl: closing ? closing.url : null,
    // Optional — only consumed by a brand-specific closing-CTA panel (e.g.
    // Components/CTA-secondary.ss.html); the generic plain-button path ignores them.
    closingCtaHeadline: closing ? (closing.headline || closing.label) : null,
    closingCtaSubtext: closing ? (closing.subtext || '') : null,
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

function buildPackage({ brand, slot, products, config, campaign = null, category = null, targetCount = null }) {
  // targetCount is the pipeline's SINGLE resolved requiredCount (campaign >
  // brand > platform config priority — see pipeline.js's resolveRequiredProductCount).
  // Callers that don't pass it (generic/test paths) keep the old platform-config
  // fallback so existing behavior is unchanged.
  const count = targetCount || (config && config.product && config.product.defaultCount) || 16;
  const min = (config && config.product && config.product.minCount) || 4;

  // Category-balanced ranking only activates when a resolved category is
  // present (the calendar-driven path) — category.name carries the Calendar's
  // product_categories in its original, comma-separated intent order (primary
  // first). The generic/test path (category === null) is unaffected: it falls
  // straight through to the old slice(0, count) behavior.
  const categoryOrder = category && category.name
    ? String(category.name).split(',').map((s) => s.trim()).filter(Boolean)
    : null;

  const { selected, audit, categoryStats, pairingAudit } = curateWithAudit(products, { count, min, categoryOrder });

  // Calendar-driven path: the campaign record governs the copy + theme.
  if (campaign) {
    const pkg = buildCalendarPackage({ brand, campaign, category, selected });
    pkg._decision.curationAudit = audit;
    pkg._decision.categoryStats = categoryStats;
    pkg._decision.approvedCategories = categoryOrder || [];
    pkg._decision.pairingAudit = pairingAudit || [];
    return pkg;
  }

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
      pairingAudit: pairingAudit || [],
    },
  };

  return pkg;
}

module.exports = {
  buildPackage, buildOverridePackage, curate, curateWithAudit, classifyProduct, selectBalanced,
  topCategories, humanList, generatePreviewText, isPlanningLanguage,
};
