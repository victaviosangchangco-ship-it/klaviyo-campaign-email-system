// ---------------------------------------------------------------------------
// renderer.js — the Rendering Engine (Architecture V2 §2.5, Phase 1).
//
// Consumes the [[TOKEN]] contract (Components/README) and produces a complete,
// email-safe Weekly HTML document by:
//   1. loading the EXISTING Weekly skeleton (Templates/Weekly/weekly-skeleton.html),
//   2. expanding each `<!-- ASSEMBLE: … -->` marker with the EXISTING component
//      (Components/*.html, Shared/Snippets/*.html) — never rebuilding markup,
//   3. injecting verified product data + brand tokens,
//   4. dropping optional elements whose data is unconfirmed (never inventing —
//      CLAUDE.md §5), and
//   5. stripping descriptive comments while preserving MSO conditionals (§8.3).
//
// It is deterministic: same brand config + same product set → byte-identical
// HTML (this is what makes golden-file tests possible).
// ---------------------------------------------------------------------------

'use strict';

const path = require('path');
const { readText, exists } = require('../common/fs-utils');
const { substitute, assertNoTokens, stripDescriptiveComments } = require('./tokens');
const { RenderError } = require('../common/errors');

// Resolve a repo-relative asset path used by an ASSEMBLE marker.
function load(repoRoot, relPath) {
  return readText(path.join(repoRoot, relPath));
}

// Brand-aware file selection: a brand whose APPROVED visual system genuinely
// diverges from the generic (RDD-modeled) components/skeleton gets its own
// "<name>.<code>.<ext>" file alongside the generic one; renderer.js loads it
// INSTEAD of the generic file when present, otherwise falls through unchanged.
// This is additive and file-existence-gated: a brand with no override file
// renders through the exact same code path as before (byte-identical,
// golden-test safe) — nothing here can change RDD/SC output. Introduced to fix
// the SS Weekly visual regression (CLAUDE.md §6.1/§6.20/§6.21): the shared
// components encode RDD's approved look (solid-colour header block, boxed
// button-style price, 4-across trust icons); SS's own approved system
// (SS-2026-W32/W36/W38) uses a white bordered header, plain-text accent-colour
// pricing and bordered 2x2 trust cards instead, so it needs its own files
// rather than a token tweak to a structurally different design.
function brandFile(repoRoot, genericPath, brand) {
  const code = brand && brand.code ? String(brand.code).toLowerCase() : '';
  if (!code) return genericPath;
  const dot = genericPath.lastIndexOf('.');
  const variantPath = `${genericPath.slice(0, dot)}.${code}${genericPath.slice(dot)}`;
  return exists(path.join(repoRoot, variantPath)) ? variantPath : genericPath;
}

// Load a component and make it substitution-ready: run optional-element removal
// FIRST (it anchors on the component's own doc comments), THEN strip descriptive
// comments (§8.3). Stripping before substitution is essential — the component
// doc-comments contain literal example tokens (e.g. [[GREETING]], [[FOOTER_DESCRIPTION]])
// that must NOT be treated as real slots. MSO conditionals are preserved by the
// stripper, so tokens inside [if mso]/[if !mso] blocks still substitute later.
function clean(repoRoot, relPath, optionalFn) {
  let raw = load(repoRoot, relPath);
  if (optionalFn) raw = optionalFn(raw);
  return stripDescriptiveComments(raw);
}

// Build the flat token map from brand design tokens + identity + logo.
function buildBrandTokens(brand) {
  const t = brand.designTokens;
  const id = brand.identity;
  const logo = brand.logo;
  return {
    // --- design tokens (verbatim) ---
    ...t,
    // --- identity / logo / footer facts ---
    LOGO_URL: logo.url.value,
    LOGO_DARK_URL: logo.darkUrl.value,
    LOGO_ALT: logo.alt,
    LOGO_WIDTH: logo.width,
    LOGO_HEIGHT: logo.height,
    LOGO_LINK_URL: id.website.value,
    HEADER_ALIGN: logo.align,
    HEADER_BG: t.ACCENT_COLOR, // approved RDD header is the orange bar (W31)
    COMPANY_NAME: id.companyName.value,
    COMPANY_ADDRESS: id.address.value,
    PRIVACY_URL: id.privacyUrl.value,
    FOOTER_LOGO_URL: logo.url.value,
    BRANDMARK_URL: logo.url.value,
    // Optional — only referenced by brand-specific override files (e.g. Components/
    // contact-block.html, footer.ss.html). null/undefined for a brand without these
    // facts is harmless: a token never appears in a generic component that a brand
    // without the fact never loads (brandFile() gates which file loads).
    COMPANY_PHONE_DISPLAY: (id.phone && id.phone.value) || null,
    COMPANY_PHONE_TEL: (id.phone && id.phone.value) ? `+61${String(id.phone.value).replace(/\D/g, '').replace(/^0/, '')}` : null,
    COMPANY_EMAIL: (id.email && id.email.value) || null,
    // Same names footer.html's own doc comment already documents (FACEBOOK_URL/
    // FB_ICON_URL/INSTAGRAM_URL/IG_ICON_URL) — reused rather than invented, even
    // though the generic footer.html's pruneFooter() strips that block before
    // substitution today, so these only ever reach a brand-specific footer file.
    FACEBOOK_URL: (brand.social && brand.social.facebookUrl && brand.social.facebookUrl.value) || null,
    FB_ICON_URL: (brand.social && brand.social.facebookIconUrl && brand.social.facebookIconUrl.value) || null,
    INSTAGRAM_URL: (brand.social && brand.social.instagramUrl && brand.social.instagramUrl.value) || null,
    IG_ICON_URL: (brand.social && brand.social.instagramIconUrl && brand.social.instagramIconUrl.value) || null,
    // alignment defaults for text sections
    HERO_ALIGN: 'left',
    INTRO_ALIGN: 'left',
  };
}

// Trust-strip tokens from brand.trust (4 items).
function buildTrustTokens(brand) {
  const trust = brand.trust || { title: '', items: [] };
  const map = { TRUST_TITLE: trust.title || '' };
  for (let i = 0; i < 4; i++) {
    const item = trust.items[i] || { glyph: '', label: '', sub: '' };
    map[`TRUST_${i + 1}_GLYPH`] = item.glyph || '';
    map[`TRUST_${i + 1}_LABEL`] = item.label || '';
    map[`TRUST_${i + 1}_SUB`] = item.sub || '';
  }
  return map;
}

// Size the bulletproof CTA to its label so Outlook (VML) and other clients agree
// on width (CTA.html note). Clamp to a sensible range.
function ctaWidthPx(label) {
  const w = Math.round(String(label).length * 9 + 72);
  return `${Math.min(320, Math.max(200, w))}px`;
}

// Escape a value destined for HTML text/attribute content. Product data comes
// from BigCommerce (external), so titles/descriptions are escaped defensively.
function esc(str) {
  return String(str == null ? '' : str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// Strip HTML tags and entities from a BigCommerce product description, returning
// a clean first sentence suitable for a product-card subtitle. Grounded in
// verified BigCommerce data (CLAUDE.md §5.1 — never invented).
function extractShortDesc(html) {
  if (!html) return '';
  const text = String(html)
    .replace(/<br\s*\/?>/gi, '. ')
    .replace(/<\/(?:p|div|li|h[1-6])>/gi, '. ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&#?\w+;/gi, '')
    .replace(/\.\s*\./g, '.')
    .replace(/\s+/g, ' ')
    .trim();
  if (!text || text.length < 4) return '';
  const sentenceMatch = text.match(/^(.{8,80}?[.!?])(?:\s|$)/);
  if (sentenceMatch) return sentenceMatch[1];
  if (text.length <= 60) return text.endsWith('.') ? text : `${text}.`;
  const capped = text.slice(0, 60).replace(/\s+\S*$/, '').trim();
  return capped ? `${capped}.` : '';
}

// SS Weekly reusable card description (CLAUDE.md §5.1 — never invent):
// Priority 1: extract from the product's own BigCommerce description field
//   (the actual product description from the live catalog — verified data).
// Priority 2: derive from the product name by stripping the category label
//   and keeping the differentiating remainder (legacy fallback).
// Returns '' when no safe, product-specific description can be produced.
function deriveSsCardDescription(product) {
  const rawDesc = (product && product.rawDescription) || '';
  if (rawDesc) {
    const extracted = extractShortDesc(rawDesc);
    if (extracted) {
      const nameNorm = String(product.name || '').trim().toLowerCase().replace(/[-–—]/g, ' ').replace(/\s+/g, ' ');
      if (extracted.toLowerCase().replace(/\.$/, '').trim() !== nameNorm) {
        return extracted;
      }
    }
  }
  const n = String((product && product.name) || '').trim();
  const cat = String((product && product.desc) || '').trim();
  if (!n || !cat) return '';
  const re = new RegExp(cat.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
  if (!re.test(n)) return '';
  let remainder = n
    .replace(re, ' ')
    .replace(/\s*[-–—:]\s+/g, ' ')
    .replace(/^[\s,&]+|[\s,&]+$/g, '')
    .replace(/\s{2,}/g, ' ')
    .trim();
  if (remainder.length < 4) return '';
  if (remainder.length > 60) remainder = `${remainder.slice(0, 60).replace(/\s+\S*$/, '')}…`;
  return remainder;
}

// Card display description, in priority order:
//   1. an authored override (product.cardDescription) — even an explicit ''
//      wins, since a human curator already made that call.
//   2. for SS: derive from BigCommerce description (primary) or product name
//      (fallback) — reusable for ANY SS Weekly build.
//   3. every other brand/path: unchanged — product.desc (category label).
function cardDescOf(product, brand) {
  if (product.cardDescription != null) return product.cardDescription;
  if (brand && brand.code === 'SS') return deriveSsCardDescription(product);
  return product.desc || '';
}

// Render one product-grid row (a pair of cards) from the existing component.
function renderProductRow(componentHtml, brandTokens, left, right, brand) {
  const map = {
    ...brandTokens,
    // grid price badge radius is the compact 4px, not the pill CTA radius
    BUTTON_RADIUS: brandTokens.BUTTON_RADIUS,
    PRODUCT_1_URL: left.url,
    PRODUCT_1_IMAGE_URL: left.imageUrl,
    PRODUCT_1_TITLE: esc(left.name),
    PRODUCT_1_DESC: esc(cardDescOf(left, brand)),
    PRODUCT_1_PRICE: esc(left.priceLabel),
    PRODUCT_1_IMAGE_W: left.imageW || 188,
    PRODUCT_1_IMAGE_H: left.imageH || 188,
    PRODUCT_2_URL: right.url,
    PRODUCT_2_IMAGE_URL: right.imageUrl,
    PRODUCT_2_TITLE: esc(right.name),
    PRODUCT_2_DESC: esc(cardDescOf(right, brand)),
    PRODUCT_2_PRICE: esc(right.priceLabel),
    PRODUCT_2_IMAGE_W: right.imageW || 188,
    PRODUCT_2_IMAGE_H: right.imageH || 188,
  };
  return substitute(componentHtml, map, { componentName: 'product-grid.html' });
}

// Optional-element removal on RAW component HTML, anchored on the component's
// own section comments/tokens (done BEFORE comment stripping). Removing an
// element entirely — never leaving an empty one — is required by §8.2.
function pruneIntro(raw, count = 2) {
  // Drop paragraph slots that have no copy so no empty <p> remains (§8.2). We ship
  // at most two paragraphs, so PARA_3 is always dropped; PARA_2 is dropped too when
  // the send supplies a single-paragraph intro (a short, scannable lead — §6.25).
  let out = raw.replace(/<p[^>]*>\s*\[\[INTRO_PARA_3\]\]\s*<\/p>/, '');
  if (count < 2) out = out.replace(/<p[^>]*>\s*\[\[INTRO_PARA_2\]\]\s*<\/p>/, '');
  return out;
}
// Optional-element removal for the coupon component: drop the eyebrow and/or
// fine-print lines when we have no real (non-invented) text for them, rather
// than leaving an empty <p> (§8.2). Never invent a marketing eyebrow or an
// expiry date the calendar didn't provide (Standards/coupon-contract.md).
function pruneCoupon(raw, { hasEyebrow, hasFinePrint }) {
  let out = raw;
  if (!hasEyebrow) out = out.replace(/<p[^>]*>\s*\[\[COUPON_EYEBROW\]\]\s*<\/p>\s*/, '');
  if (!hasFinePrint) out = out.replace(/<p[^>]*>\s*\[\[COUPON_FINEPRINT\]\]\s*<\/p>\s*/, '');
  return out;
}

function pruneFooter(raw) {
  // RDD social URLs + footer blurb are "To be confirmed" (RDD.md) — omit them
  // rather than invent (CLAUDE.md §5). Also drop the height-less footer logo img
  // (Apple Mail iOS needs width AND height, §6.6). Keep the mandatory compliance block.
  return raw
    .replace(/<img src="\[\[FOOTER_LOGO_URL\]\]"[\s\S]*?\/>/, '')
    .replace(/<!-- Social -->[\s\S]*?(?=<!-- Compliance)/, '');
}

// The single entry point: render a Weekly campaign HTML document.
function renderWeekly({ repoRoot, brand, pkg }) {
  if (!pkg || !Array.isArray(pkg.products)) {
    throw new RenderError('renderWeekly requires a package with a products array.');
  }
  // A campaign is either GROUPED (pkg.groups — multi-section, each an even 2-col
  // grid) or a single flat grid (pkg.products). The grouped path is additive; the
  // single-grid path below is byte-identical to before (golden-test safe).
  const grouped = Array.isArray(pkg.groups) && pkg.groups.length > 0;
  const products = grouped ? [] : pkg.products.slice(0, pkg.products.length - (pkg.products.length % 2));
  if (!grouped && products.length < 2) {
    throw new RenderError(
      `Not enough verified products to build a grid (${products.length}). ` +
        `The engine reports a blocker rather than fabricate products (CLAUDE.md §5.1).`,
      { count: products.length }
    );
  }
  if (grouped) {
    for (const g of pkg.groups) {
      if (!Array.isArray(g.products) || g.products.length < 2 || g.products.length % 2 !== 0) {
        throw new RenderError(
          `Product group "${g.title}" must have an even number of products (>=2); got ${g.products ? g.products.length : 0}. ` +
            `The engine will not fabricate a card to balance a row (CLAUDE.md §5.1/§6.9).`,
          { group: g.title, count: g.products ? g.products.length : 0 }
        );
      }
    }
  }

  const brandTokens = buildBrandTokens(brand);

  // --- load existing files (never rebuilt), comment-stripped + optional-pruned ---
  // header/section-heading/product-grid/trust-strip/skeleton are brand-aware
  // (brandFile) because their APPROVED markup differs by brand, not just by
  // colour token; every other component is genuinely brand-agnostic and stays
  // on the single shared file.
  const skeleton = load(repoRoot, brandFile(repoRoot, 'Templates/Weekly/weekly-skeleton.html', brand)); // markers stripped AFTER assembly
  const baseHead = clean(repoRoot, brandFile(repoRoot, 'Shared/Snippets/base-head.html', brand));
  const preheader = clean(repoRoot, 'Shared/Snippets/preheader.html');
  const header = clean(repoRoot, brandFile(repoRoot, 'Components/header.html', brand));
  const hero = clean(repoRoot, 'Components/hero.html');
  const intro = clean(repoRoot, 'Components/intro.html', (raw) => pruneIntro(raw, (pkg.introParas || []).length));
  const sectionHeading = clean(repoRoot, brandFile(repoRoot, 'Components/section-heading.html', brand));
  const trust = clean(repoRoot, brandFile(repoRoot, 'Components/trust-strip.html', brand));
  // pruneFooter is safe to run unconditionally on a brand-specific footer file too:
  // its two regexes only match the generic file's literal `[[FOOTER_LOGO_URL]]`
  // token and `<!-- Social -->`/`<!-- Compliance` comment pair — a brand file that
  // uses neither (e.g. footer.ss.html, which has its own verified social block) is
  // simply a no-op match.
  const footerPath = brandFile(repoRoot, 'Components/footer.html', brand);
  const footer = clean(repoRoot, footerPath, pruneFooter);
  const ctaComponent = clean(repoRoot, 'Components/CTA.html');
  const productGridComponent = clean(repoRoot, brandFile(repoRoot, 'Components/product-grid.html', brand));
  // Optional contact/help block — only ever reachable via a brand-specific
  // skeleton that declares its ASSEMBLE marker (the generic skeleton does not,
  // so this is inert for every brand without one).
  const contactBlockPath = 'Components/contact-block.html';
  const contactBlock = exists(path.join(repoRoot, contactBlockPath)) ? clean(repoRoot, contactBlockPath) : '';

  // --- pre-render the pieces that need per-instance token maps ---
  // A content-override campaign (platform/ai/copy.js buildOverridePackage) may
  // OMIT cta_primary/hero_heading/hero_body entirely — e.g. when the hero banner
  // is a baked-message graphic and the approved flow goes straight from the hero
  // image into the first section heading, with no separate text headline/intro/
  // primary-CTA block below it (CLAUDE.md §9 "hero establishes the theme; later
  // sections support, not restate"). This is opt-in per override file: an
  // existing override that already supplies these fields renders exactly as
  // before (unaffected) — only a NEW override that leaves them blank skips them.
  const isOverride = Boolean(pkg._decision && String(pkg._decision.generatedBy || '').startsWith('content-override'));
  const skipTextHero = isOverride && Boolean(pkg.heroMessageBaked);
  const skipPrimaryCta = isOverride && !pkg.ctaLabel;

  const ctaHtml = pkg.ctaLabel
    ? substitute(
        ctaComponent,
        { ...brandTokens, BUTTON_RADIUS: brandTokens.CTA_BUTTON_RADIUS, BUTTON_WIDTH: ctaWidthPx(pkg.ctaLabel), CTA_LABEL: esc(pkg.ctaLabel), CTA_URL: pkg.ctaUrl },
        { componentName: 'CTA.html' }
      )
    : '';

  // Optional closing CTA (rendered into the CTA-secondary slot, after the products).
  // A brand-specific override (Components/CTA-secondary.ss.html) renders a full
  // headline+supporting-line panel (the approved SS "Shop the Full Range" close);
  // the generic path is unchanged — a plain filled button via CTA.html, exactly as
  // before, for any brand/override without that file.
  const closingCtaTemplatePath = brandFile(repoRoot, 'Components/CTA-secondary.html', brand);
  const closingCtaUsesPanel = closingCtaTemplatePath !== 'Components/CTA-secondary.html';
  const closingCtaHtml = pkg.closingCtaLabel
    ? (closingCtaUsesPanel
        ? substitute(clean(repoRoot, closingCtaTemplatePath), {
            ...brandTokens,
            CTA2_HEADLINE: esc(pkg.closingCtaHeadline || pkg.closingCtaLabel),
            CTA2_SUBTEXT: esc(pkg.closingCtaSubtext || ''),
            CTA2_LABEL: esc(pkg.closingCtaLabel),
            CTA2_URL: pkg.closingCtaUrl,
          }, { componentName: 'CTA-secondary.ss.html' })
        : substitute(ctaComponent, { ...brandTokens, BUTTON_RADIUS: brandTokens.CTA_BUTTON_RADIUS, BUTTON_WIDTH: ctaWidthPx(pkg.closingCtaLabel), CTA_LABEL: esc(pkg.closingCtaLabel), CTA_URL: pkg.closingCtaUrl }, { componentName: 'CTA.html (closing)' }))
    : '';

  // Optional image hero (edge-to-edge, one anchor, §6.14/§6.6). Rendered into the
  // hero-image slot; when absent the slot stays empty (text-led hero only).
  const heroImageHtml = pkg.heroImage
    ? substitute(clean(repoRoot, 'Components/hero-image.html'), {
        ...brandTokens,
        HERO_IMAGE_URL: pkg.heroImage.url,
        HERO_IMAGE_ALT: esc(pkg.heroImage.alt || ''),
        HERO_IMAGE_HEIGHT: pkg.heroImage.height || 335,
        HERO_IMAGE_LINK: pkg.heroImage.link || brand.identity.website.value,
      }, { componentName: 'hero-image.html' })
    : '';

  // Optional support banner (after the product grids). Reuses the existing
  // hero-image.html component (same edge-to-edge fluid-image contract) rather
  // than a new one; absent when pkg.supportBanner is not set — never a blocker.
  const supportBannerHtml = pkg.supportBanner
    ? substitute(clean(repoRoot, 'Components/hero-image.html'), {
        ...brandTokens,
        HERO_IMAGE_URL: pkg.supportBanner.url,
        HERO_IMAGE_ALT: esc(pkg.supportBanner.alt || ''),
        HERO_IMAGE_HEIGHT: pkg.supportBanner.height || 335,
        HERO_IMAGE_LINK: pkg.supportBanner.link || brand.identity.website.value,
      }, { componentName: 'hero-image.html (support banner)' })
    : '';

  // Optional coupon/promo block (SYSTEM PATCH: Promotion/Coupon Resolution).
  // Rendered ONLY when the calendar-authoritative campaign declared a real
  // code + offer text (pkg.coupon, platform/ai/copy.js); otherwise the slot
  // stays empty — never a placeholder, never an invented code/discount/expiry
  // (Standards/coupon-contract.md). Optional fields not documented-default
  // (EYEBROW/FINEPRINT) are pruned rather than left as an empty line.
  const couponHtml = pkg.coupon
    ? substitute(
        clean(repoRoot, 'Components/coupon.html', (raw) => pruneCoupon(raw, { hasEyebrow: false, hasFinePrint: false })),
        {
          ...brandTokens,
          COUPON_CODE: esc(pkg.coupon.code),
          COUPON_OFFER_TEXT: esc(pkg.coupon.offerText),
          CTA_URL: pkg.coupon.ctaUrl,
          CTA_LABEL: esc(pkg.coupon.ctaLabel || 'Shop Now'),
          // Documented component defaults (Components/coupon.html header comment) — not invented.
          COUPON_BG: '#f0ebe4',
          COUPON_BORDER_COLOR: brandTokens.ACCENT_COLOR,
          BUTTON_BG: brandTokens.ACCENT_COLOR,
          BUTTON_TEXT_COLOR: '#ffffff',
          BUTTON_RADIUS: '24px',
        },
        { componentName: 'coupon.html' }
      )
    : '';

  // Build the product region: grouped (section-heading + even 2-col grid per group)
  // or a single flat grid. For groups the per-group headings live INSIDE this block,
  // so the standalone section-heading slot is emptied.
  let productSection;
  let sectionHeadingSlot;
  if (grouped) {
    const blocks = [];
    for (const g of pkg.groups) {
      const heading = substitute(sectionHeading, {
        ...brandTokens, SECTION_TITLE: esc(g.title), SECTION_SUBTITLE: esc(g.subtitle || ''), BADGE_TEXT: esc(g.badge || 'In Stock'),
      }, { componentName: 'section-heading.html (group)' });
      const rows = [];
      for (let i = 0; i < g.products.length; i += 2) {
        rows.push(renderProductRow(productGridComponent, brandTokens, g.products[i], g.products[i + 1], brand));
      }
      blocks.push(`${heading}\n${rows.join('\n')}`);
    }
    productSection = blocks.join('\n');
    sectionHeadingSlot = '';
  } else {
    const productRows = [];
    for (let i = 0; i < products.length; i += 2) {
      productRows.push(renderProductRow(productGridComponent, brandTokens, products[i], products[i + 1], brand));
    }
    productSection = productRows.join('\n');
    sectionHeadingSlot = sectionHeading;
  }

  // --- assemble: expand each ASSEMBLE marker (duplicate paths consumed in order) ---
  const queues = {
    'Shared/Snippets/base-head.html': [baseHead],
    'Shared/Snippets/preheader.html': [preheader],
    'Components/header.html': [header],
    'Components/hero-image.html': [heroImageHtml], // image hero when provided, else empty
    'Components/hero.html': [skipTextHero ? '' : hero],
    'Components/intro.html': [skipTextHero ? '' : intro],
    'Components/category-pills.html': [''],
    'Components/CTA.html': [skipPrimaryCta ? '' : ctaHtml],
    'Components/section-heading.html': [sectionHeadingSlot, ''], // grouped: headings live inside the grid block
    'Components/product-grid.html': [productSection, ''],
    'Components/support-banner.html': [supportBannerHtml], // optional, after the product grids
    'Components/CTA-secondary.html': [closingCtaHtml], // closing CTA when provided
    'Components/coupon.html': [couponHtml],
    'Components/trust-strip.html': [trust],
    'Components/contact-block.html': [contactBlock], // optional; only a brand-specific skeleton assembles this marker
    'Components/footer.html': [footer],
  };
  const assembled = skeleton.replace(/<!--\s*ASSEMBLE:\s*(\S+?)\s*-->/g, (m, p) => {
    const q = queues[p];
    return q && q.length ? q.shift() : '';
  });

  // --- one global substitution over the whole document (fills shell + all
  //     remaining component tokens; the pre-rendered CTA/product rows have none left) ---
  const copyTokens = {
    SUBJECT_LINE: esc(pkg.subject),
    PREHEADER_TEXT: esc(pkg.preheader),
    EYEBROW_TEXT: esc(pkg.eyebrow),
    HERO_HEADING: esc(pkg.heroHeading),
    HERO_BODY: esc(pkg.heroBody),
    INTRO_PARA_1: esc(pkg.introParas[0] || ''),
    INTRO_PARA_2: esc(pkg.introParas[1] || ''),
    SECTION_TITLE: esc(pkg.sectionTitle),
    SECTION_SUBTITLE: esc(pkg.sectionSubtitle),
    BADGE_TEXT: esc(pkg.badgeText),
  };
  // Strip the skeleton's own descriptive comments (keep MSO conditionals) BEFORE
  // the final substitution, so no example token inside a comment is treated as a slot.
  const stripped = stripDescriptiveComments(assembled);
  const html = substitute(stripped, { ...brandTokens, ...buildTrustTokens(brand), ...copyTokens }, {
    componentName: 'weekly-skeleton (final pass)',
  });

  // --- finalize: assert no token survived anywhere ---
  assertNoTokens(html);

  const renderedCount = grouped ? pkg.groups.reduce((n, g) => n + g.products.length, 0) : products.length;
  const rowCount = grouped ? pkg.groups.reduce((n, g) => n + Math.ceil(g.products.length / 2), 0) : Math.floor(products.length / 2);
  return {
    html,
    meta: {
      productsRendered: renderedCount,
      rows: rowCount,
      groups: grouped ? pkg.groups.length : 1,
      trimmedFrom: pkg.products.length,
    },
  };
}

module.exports = { renderWeekly, buildBrandTokens, ctaWidthPx, esc };
