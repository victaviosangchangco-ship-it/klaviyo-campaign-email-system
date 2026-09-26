// ---------------------------------------------------------------------------
// brand-visual.js — per-brand visual-regression QA (SS Weekly recovery,
// CLAUDE.md §6.1/§6.20/§6.21).
//
// Structural QA (validators.js) proves the HTML is email-safe. Semantic QA
// (theme-coherence.js) proves it is the RIGHT campaign. Neither one proves it
// LOOKS like the brand's approved system — a build can pass both while
// rendering RDD's visual language (solid-colour header, boxed button-style
// price, 4-across icon trust strip) under an SS subject line. This module
// closes that gap for brands with a known, approved visual contract that
// differs from the generic (RDD-modeled) components.
//
// Only SS has checks today (the brand that regressed). A brand with no
// contract defined here returns a single 'pass' finding — this module never
// blocks a brand it doesn't know about.
// ---------------------------------------------------------------------------

'use strict';

const { finding } = require('./validators');
const { isPlanningLanguage } = require('../ai/copy');

function checkSsWeeklyVisualContract(html, brand, pkg) {
  if (!brand || brand.code !== 'SS') {
    return [finding('pass', 'brand-visual-contract', 'No brand-specific visual contract defined for this brand; nothing to check.', 'platform/qa/brand-visual.js')];
  }

  const findings = [];

  // 1. Solid ACCENT_COLOR header block regression (RDD's approved treatment,
  //    not SS's — SS's approved header is white with a bottom divider).
  const headerMatch = html.match(/<body[\s\S]*?<table[^>]*>/i);
  const accent = (brand.designTokens && brand.designTokens.ACCENT_COLOR || '').toLowerCase();
  if (headerMatch && accent && headerMatch[0].toLowerCase().includes(`bgcolor="${accent}"`)) {
    findings.push(finding(
      'blocker',
      'ss-visual-header',
      `Header renders as a solid ${accent} block — SS's approved header is white with a bottom divider, not a coloured block (RDD's treatment).`,
      'CLAUDE.md §6.1'
    ));
  } else {
    findings.push(finding('pass', 'ss-visual-header', 'Header is not a solid accent-colour block.', 'CLAUDE.md §6.1'));
  }

  // 2. Generic dashboard-style section summary (tinted panel + "In Stock"
  //    pill) — SS's approved section framing is a plain accent bar, no panel.
  if (/background:#fbeaea|bgcolor="#fbeaea"/i.test(html) || />In Stock<\/span>/i.test(html)) {
    findings.push(finding(
      'blocker',
      'ss-visual-section-heading',
      'Section heading renders as a tinted panel with an "In Stock" badge — SS\'s approved framing is a plain white background with a short accent bar, no panel or badge.',
      'CLAUDE.md §6.21'
    ));
  } else {
    findings.push(finding('pass', 'ss-visual-section-heading', 'No generic tinted-panel section summary detected.', 'CLAUDE.md §6.21'));
  }

  // 3. Boxed button-style product price (class="pricebtn") — SS's approved
  //    card renders price as plain accent-colour text, never a filled button.
  if (/class="pricebtn"/i.test(html)) {
    findings.push(finding(
      'blocker',
      'ss-visual-price-button',
      'Product price renders inside a filled button (class="pricebtn") — SS\'s approved card shows price as plain accent-colour text, no button chrome.',
      'CLAUDE.md §6.17'
    ));
  } else {
    findings.push(finding('pass', 'ss-visual-price-button', 'No boxed button-style price detected.', 'CLAUDE.md §6.17'));
  }

  // 4. Internal/planning copy leaking into customer-facing text (hero body,
  //    intro paragraphs, preview text) — CLAUDE.md §9/§5.
  const copyFields = [
    ['heroBody', pkg && pkg.heroBody],
    ['preheader', pkg && pkg.preheader],
    ...((pkg && pkg.introParas) || []).map((p, i) => [`introParas[${i}]`, p]),
  ];
  const leaked = copyFields.filter(([, text]) => isPlanningLanguage(text));
  if (leaked.length) {
    findings.push(finding(
      'blocker',
      'ss-visual-planning-copy',
      `Planning/internal language reached customer-facing copy: ${leaked.map(([k, t]) => `${k}="${t}"`).join('; ')}.`,
      'CLAUDE.md §9/§5'
    ));
  } else {
    findings.push(finding('pass', 'ss-visual-planning-copy', 'No planning/internal language detected in customer-facing copy.', 'CLAUDE.md §9/§5'));
  }

  // 5. Trust cards — must be a 2x2 table layout (two <tr> rows, each with two
  //    .trust-card cells), never 4 cells in one row or single-column stacking.
  const trustCardCount = (html.match(/class="trust-card"/gi) || []).length;
  if (trustCardCount !== 4) {
    findings.push(finding(
      'blocker',
      'ss-visual-trust-cards',
      `Expected exactly 4 trust-card cells, found ${trustCardCount}.`,
      'platform/qa/brand-visual.js'
    ));
  } else {
    // Verify 2x2 table structure: two <tr> rows each containing two .trust-card cells
    const trustBlockMatch = html.match(/Why Australian businesses trust[\s\S]*?<\/table>\s*<\/td>\s*<\/tr>\s*<\/table>/i);
    if (trustBlockMatch) {
      const trustBlock = trustBlockMatch[0];
      const trRows = trustBlock.match(/<tr>[\s\S]*?<\/tr>/gi) || [];
      const rowsWithCards = trRows.filter(r => /class="trust-card"/i.test(r));
      if (rowsWithCards.length !== 2) {
        findings.push(finding(
          'blocker',
          'ss-visual-trust-cards',
          `Trust cards are not in a 2×2 table layout — found ${rowsWithCards.length} row(s) with cards instead of 2.`,
          'platform/qa/brand-visual.js'
        ));
      } else {
        findings.push(finding('pass', 'ss-visual-trust-cards', 'Trust cards render as a 2×2 table.', 'platform/qa/brand-visual.js'));
      }
    } else {
      findings.push(finding('pass', 'ss-visual-trust-cards', 'Trust cards present (structure check inconclusive).', 'platform/qa/brand-visual.js'));
    }
  }

  // 6. Trust card heading font-size — must be 14px (approved W36/W38 contract),
  //    not 12px (the pre-fix SMALL_SIZE drift).
  const trustHeadingMatch = html.match(/class="trust-card"[\s\S]*?font-size:(\d+)px;[^"]*font-weight:700/i);
  if (trustHeadingMatch && parseInt(trustHeadingMatch[1], 10) < 14) {
    findings.push(finding(
      'warn',
      'ss-visual-trust-heading-size',
      `Trust card heading font-size is ${trustHeadingMatch[1]}px — approved SS contract is 14px.`,
      'platform/qa/brand-visual.js'
    ));
  } else {
    findings.push(finding('pass', 'ss-visual-trust-heading-size', 'Trust card heading font-size is within the approved range.', 'platform/qa/brand-visual.js'));
  }

  // 7. CTA button — must use the SS approved mobile-compatible .tap class with
  //    padding-based sizing, not a generic min-height/line-height approach.
  const ctaMatch = html.match(/class="tap"[^>]*style="[^"]*padding:(\d+)px\s+(\d+)px/i);
  if (ctaMatch) {
    const vPad = parseInt(ctaMatch[1], 10);
    const hPad = parseInt(ctaMatch[2], 10);
    if (vPad > 22 || hPad > 50) {
      findings.push(finding(
        'warn',
        'ss-visual-cta-padding',
        `CTA padding ${vPad}px ${hPad}px exceeds the approved SS compact range (18px 40px).`,
        'platform/qa/brand-visual.js'
      ));
    } else {
      findings.push(finding('pass', 'ss-visual-cta-padding', 'CTA padding is within the approved SS range.', 'platform/qa/brand-visual.js'));
    }
  }

  // 8. Contact block — approved W38 typography contract: tel:/mailto: links
  //    must exist, render in the SS accent colour, AND carry the same bold
  //    visual weight as W38 ("02 9790 2182 | sales@safetysector.com.au").
  //    Colour alone is not sufficient — base-head's
  //    `.unstyle-auto-detected-links a { font-weight:inherit !important }`
  //    (Gmail/iOS auto-link neutralisation) silently flattens a plain
  //    `font-weight:700` back to the parent's regular weight; only
  //    `font-weight:700 !important` survives it. This exact drift shipped
  //    once already (SS-2026-35 v13/v14) before this check existed.
  const contactAccent = accent || '#e11b22';
  const phoneMatch = html.match(/<a\s+href="tel:[^"]*"[^>]*style="([^"]*)"[^>]*>([\s\S]*?)<\/a>/i);
  const emailMatch = html.match(/<a\s+href="mailto:[^"]*"[^>]*style="([^"]*)"[^>]*>([\s\S]*?)<\/a>/i);

  if (!phoneMatch) {
    findings.push(finding('blocker', 'ss-visual-contact-phone-missing', 'No tel: link found in the contact block.', 'platform/qa/brand-visual.js'));
  }
  if (!emailMatch) {
    findings.push(finding('blocker', 'ss-visual-contact-email-missing', 'No mailto: link found in the contact block.', 'platform/qa/brand-visual.js'));
  }

  function checkContactLink(kind, m) {
    if (!m) return;
    const anchorStyle = m[1];
    const innerHtml = m[2];
    const spanMatch = innerHtml.match(/<span[^>]*style="([^"]*)"/i);
    const boldRe = /font-weight:\s*700\s*!important/i;
    const colorRe = new RegExp(`color:\\s*${contactAccent.replace('#', '#?')}\\s*!important`, 'i');

    const anchorBold = boldRe.test(anchorStyle);
    const anchorColor = colorRe.test(anchorStyle);
    if (!anchorColor || !anchorBold) {
      findings.push(finding(
        'blocker',
        `ss-visual-contact-${kind}-anchor-style`,
        `${kind} anchor is missing ${!anchorColor ? `!important ${contactAccent} colour` : ''}${!anchorColor && !anchorBold ? ' and ' : ''}${!anchorBold ? '!important font-weight:700' : ''} — will render lighter/darker than the approved W38 contact block.`,
        'platform/qa/brand-visual.js'
      ));
    } else {
      findings.push(finding('pass', `ss-visual-contact-${kind}-anchor-style`, `${kind} anchor carries !important accent colour + bold weight.`, 'platform/qa/brand-visual.js'));
    }

    // Gmail-safe pattern: when an inner <span> wrap is present (the
    // countermeasure for `.unstyle-auto-detected-links a` neutralising the
    // anchor), it must carry its OWN !important colour + weight — relying on
    // inheritance from the (already-neutralised) anchor is what caused the drift.
    if (spanMatch) {
      const spanStyle = spanMatch[1];
      const spanBold = boldRe.test(spanStyle);
      const spanColor = colorRe.test(spanStyle);
      if (!spanColor || !spanBold) {
        findings.push(finding(
          'blocker',
          `ss-visual-contact-${kind}-span-style`,
          `${kind} inner <span> is missing ${!spanColor ? '!important accent colour' : ''}${!spanColor && !spanBold ? ' and ' : ''}${!spanBold ? '!important font-weight:700' : ''} — Gmail's auto-link neutralisation can still flatten this link to regular weight/default colour.`,
          'platform/qa/brand-visual.js'
        ));
      } else {
        findings.push(finding('pass', `ss-visual-contact-${kind}-span-style`, `${kind} inner span carries !important accent colour + bold weight (Gmail-safe).`, 'platform/qa/brand-visual.js'));
      }
    }
  }

  checkContactLink('phone', phoneMatch);
  checkContactLink('email', emailMatch);

  // 9. Product card descriptions — SS's approved card REQUIRES a short factual
  //    description between the product title and price. Empty = BLOCKER.
  const pdcPattern = /class="pnc"[\s\S]*?<(?:p|a)[^>]*>([\s\S]*?)<\/(?:p|a)>[\s\S]*?class="pdc"[\s\S]*?<p[^>]*>([\s\S]*?)<\/p>/gi;
  let pdcMatch;
  let totalPdc = 0;
  let emptyPdc = 0;
  let titleDupPdc = 0;
  let placeholderPdc = 0;
  const PLACEHOLDER_RE = /^(lorem ipsum|placeholder|tbd|todo|test description|insert|description here|n\/a)\.?$/i;
  while ((pdcMatch = pdcPattern.exec(html)) !== null) {
    totalPdc++;
    const title = pdcMatch[1].replace(/<[^>]+>/g, '').trim();
    const desc = pdcMatch[2].trim();
    if (!desc) { emptyPdc++; continue; }
    if (PLACEHOLDER_RE.test(desc)) { placeholderPdc++; continue; }
    const normTitle = title.toLowerCase().replace(/[-–—]/g, ' ').replace(/\s+/g, ' ').replace(/\.$/, '');
    const normDesc = desc.toLowerCase().replace(/[-–—]/g, ' ').replace(/\s+/g, ' ').replace(/\.$/, '');
    if (normDesc === normTitle) titleDupPdc++;
  }
  if (totalPdc > 0 && emptyPdc > 0) {
    findings.push(finding(
      'blocker',
      'ss-visual-product-descriptions-empty',
      `${emptyPdc} of ${totalPdc} product card(s) have empty descriptions — SS's approved card requires IMAGE → NAME → DESCRIPTION → PRICE.`,
      'platform/qa/brand-visual.js'
    ));
  }
  if (totalPdc > 0 && titleDupPdc > 0) {
    findings.push(finding(
      'blocker',
      'ss-visual-product-descriptions-title-dup',
      `${titleDupPdc} of ${totalPdc} product card description(s) are identical to the product title — description must add information beyond the name.`,
      'platform/qa/brand-visual.js'
    ));
  }
  if (totalPdc > 0 && placeholderPdc > 0) {
    findings.push(finding(
      'blocker',
      'ss-visual-product-descriptions-placeholder',
      `${placeholderPdc} of ${totalPdc} product card description(s) contain placeholder text — descriptions must be grounded in verified BigCommerce product data.`,
      'platform/qa/brand-visual.js'
    ));
  }
  if (totalPdc > 0 && emptyPdc === 0 && titleDupPdc === 0 && placeholderPdc === 0) {
    findings.push(finding('pass', 'ss-visual-product-descriptions', `All ${totalPdc} product card descriptions are populated, non-duplicate, and non-placeholder.`, 'platform/qa/brand-visual.js'));
  }

  // Heading typography — "Got a question? We're here to help." must keep the
  // approved W38 weight/size (Arial Black, 16px, 800) so it doesn't get lost
  // next to a now-correctly-bold phone/email line.
  if (/Got a question\? We're here to help\./i.test(html)) {
    const headingTagMatch = html.match(/<p[^>]*style="([^"]*)"[^>]*>Got a question\? We're here to help\./i);
    const headingOk = headingTagMatch && /font-weight:\s*800/i.test(headingTagMatch[1]) && /font-size:\s*16px/i.test(headingTagMatch[1]);
    if (!headingOk) {
      findings.push(finding(
        'warn',
        'ss-visual-contact-heading-typography',
        'Contact block heading does not match the approved W38 typography (Arial Black, 16px, weight 800).',
        'platform/qa/brand-visual.js'
      ));
    } else {
      findings.push(finding('pass', 'ss-visual-contact-heading-typography', 'Contact block heading matches the approved W38 typography.', 'platform/qa/brand-visual.js'));
    }
  }

  return findings;
}

module.exports = { checkSsWeeklyVisualContract };
