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
const { readText } = require('../common/fs-utils');
const { substitute, assertNoTokens, stripDescriptiveComments } = require('./tokens');
const { RenderError } = require('../common/errors');

// Resolve a repo-relative asset path used by an ASSEMBLE marker.
function load(repoRoot, relPath) {
  return readText(path.join(repoRoot, relPath));
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

// Render one product-grid row (a pair of cards) from the existing component.
function renderProductRow(componentHtml, brandTokens, left, right) {
  const map = {
    ...brandTokens,
    // grid price badge radius is the compact 4px, not the pill CTA radius
    BUTTON_RADIUS: brandTokens.BUTTON_RADIUS,
    PRODUCT_1_URL: left.url,
    PRODUCT_1_IMAGE_URL: left.imageUrl,
    PRODUCT_1_TITLE: esc(left.name),
    PRODUCT_1_DESC: esc(left.desc || ''),
    PRODUCT_1_PRICE: esc(left.priceLabel),
    PRODUCT_1_IMAGE_W: left.imageW || 188,
    PRODUCT_1_IMAGE_H: left.imageH || 188,
    PRODUCT_2_URL: right.url,
    PRODUCT_2_IMAGE_URL: right.imageUrl,
    PRODUCT_2_TITLE: esc(right.name),
    PRODUCT_2_DESC: esc(right.desc || ''),
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
  const skeleton = load(repoRoot, 'Templates/Weekly/weekly-skeleton.html'); // markers stripped AFTER assembly
  const baseHead = clean(repoRoot, 'Shared/Snippets/base-head.html');
  const preheader = clean(repoRoot, 'Shared/Snippets/preheader.html');
  const header = clean(repoRoot, 'Components/header.html');
  const hero = clean(repoRoot, 'Components/hero.html');
  const intro = clean(repoRoot, 'Components/intro.html', (raw) => pruneIntro(raw, (pkg.introParas || []).length));
  const sectionHeading = clean(repoRoot, 'Components/section-heading.html');
  const trust = clean(repoRoot, 'Components/trust-strip.html');
  const footer = clean(repoRoot, 'Components/footer.html', pruneFooter);
  const ctaComponent = clean(repoRoot, 'Components/CTA.html');
  const productGridComponent = clean(repoRoot, 'Components/product-grid.html');

  // --- pre-render the pieces that need per-instance token maps ---
  const ctaHtml = substitute(
    ctaComponent,
    { ...brandTokens, BUTTON_RADIUS: brandTokens.CTA_BUTTON_RADIUS, BUTTON_WIDTH: ctaWidthPx(pkg.ctaLabel), CTA_LABEL: esc(pkg.ctaLabel), CTA_URL: pkg.ctaUrl },
    { componentName: 'CTA.html' }
  );

  // Optional closing CTA (rendered into the CTA-secondary slot, after the products).
  const closingCtaHtml = pkg.closingCtaLabel
    ? substitute(ctaComponent, { ...brandTokens, BUTTON_RADIUS: brandTokens.CTA_BUTTON_RADIUS, BUTTON_WIDTH: ctaWidthPx(pkg.closingCtaLabel), CTA_LABEL: esc(pkg.closingCtaLabel), CTA_URL: pkg.closingCtaUrl }, { componentName: 'CTA.html (closing)' })
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
        rows.push(renderProductRow(productGridComponent, brandTokens, g.products[i], g.products[i + 1]));
      }
      blocks.push(`${heading}\n${rows.join('\n')}`);
    }
    productSection = blocks.join('\n');
    sectionHeadingSlot = '';
  } else {
    const productRows = [];
    for (let i = 0; i < products.length; i += 2) {
      productRows.push(renderProductRow(productGridComponent, brandTokens, products[i], products[i + 1]));
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
    'Components/hero.html': [hero],
    'Components/intro.html': [intro],
    'Components/category-pills.html': [''],
    'Components/CTA.html': [ctaHtml],
    'Components/section-heading.html': [sectionHeadingSlot, ''], // grouped: headings live inside the grid block
    'Components/product-grid.html': [productSection, ''],
    'Components/CTA-secondary.html': [closingCtaHtml], // closing CTA when provided
    'Components/coupon.html': [''],
    'Components/trust-strip.html': [trust],
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
