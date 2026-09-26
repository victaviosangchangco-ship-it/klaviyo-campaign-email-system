'use strict';

// Normalize a product name to its base family stem for pairing.
function baseFamily(name) {
  return String(name || '')
    .toLowerCase()
    .replace(/[-–—:,]/g, ' ')
    .replace(/\b(black|yellow|white|grey|gray|red|blue|green|orange|silver|stainless)\b/g, '')
    .replace(/\b\d+\s*mm\b/g, '')
    .replace(/\b\d+\s*m\b/g, '')
    .replace(/\b\d+\s*x\s*\d+\b/g, '')
    .replace(/\b(pair|set|kit|pack)\b/g, '')
    .replace(/\s{2,}/g, ' ')
    .trim();
}

// Extract the functional core of a product name: the product-type noun phrase
// stripped of modifiers like mounting, material, finish, dimensions.
function functionalCore(name) {
  return String(name || '')
    .toLowerCase()
    .replace(/[-–—:,]/g, ' ')
    .replace(/\b(surface mounted|inground|removable|fixed|retractable|rubber|steel|metal|stainless|plastic)\b/g, '')
    .replace(/\b(black|yellow|white|grey|gray|red|blue|green|orange|silver)\b/g, '')
    .replace(/\b\d+\s*mm\b/g, '')
    .replace(/\b\d+\s*m\b/g, '')
    .replace(/\b\d+\s*x\s*\d+\b/g, '')
    .replace(/\b(pair|set|kit|pack|section|module|cap|end)\b/g, '')
    .replace(/\b(indoor|outdoor|heavy duty|disabled|car park|parking|traffic calming|safety|security)\b/g, '')
    .replace(/\s{2,}/g, ' ')
    .trim();
}

// Detect component↔complete-unit complementary relationship.
const COMPONENT_WORDS = /\b(end cap|end section|module|replacement|spare|connector|bracket|mount|extension)\b/i;

function isComponent(name) {
  return COMPONENT_WORDS.test(String(name || ''));
}

// Extract the product-system stem (e.g. "speed hump" from "Rubber Speed Hump End Cap").
function systemStem(name) {
  return String(name || '')
    .toLowerCase()
    .replace(/[-–—:,]/g, ' ')
    .replace(/\b(black|yellow|white|grey|gray|red|blue|green|orange|silver|stainless)\b/g, '')
    .replace(/\b\d+\s*mm\b/g, '')
    .replace(/\b\d+\s*m\b/g, '')
    .replace(/\b\d+\s*x\s*\d+\b/g, '')
    .replace(/\b(end cap|end section|module|replacement|spare|connector|bracket|mount|extension|pair|set|kit|pack)\b/g, '')
    .replace(/\b(rubber|steel|metal|plastic|surface mounted|inground|removable|fixed)\b/g, '')
    .replace(/\s{2,}/g, ' ')
    .trim();
}

// Score how strongly two products should be paired (higher = stronger match).
function pairScore(a, b) {
  const famA = baseFamily(a.name);
  const famB = baseFamily(b.name);

  // 1. Same base family (highest — exact variant match)
  if (famA && famB && famA === famB) return 100;

  // 2. Same function/purpose: different products serving the same role,
  //    detected via shared functional core within the same category.
  const catA = String(a.desc || '').trim().toLowerCase();
  const catB = String(b.desc || '').trim().toLowerCase();
  if (catA && catB && catA === catB) {
    const coreA = functionalCore(a.name);
    const coreB = functionalCore(b.name);
    if (coreA && coreB && coreA === coreB) return 90;
  }

  // 3. Verified complementary: a component pairs with a complete unit
  //    from the same product system (shared system stem).
  const compA = isComponent(a.name);
  const compB = isComponent(b.name);
  if (compA !== compB) {
    const stemA = systemStem(a.name);
    const stemB = systemStem(b.name);
    if (stemA && stemB && stemA === stemB) return 85;
  }

  // 4. Shared naming stem (>= 60% of shorter family overlaps)
  if (famA && famB) {
    const wordsA = famA.split(/\s+/);
    const wordsB = famB.split(/\s+/);
    const shorter = Math.min(wordsA.length, wordsB.length);
    if (shorter >= 2) {
      let shared = 0;
      for (const w of wordsA) { if (wordsB.includes(w)) shared++; }
      if (shared / shorter >= 0.6) return 70 + Math.min(shared, 10);
    }
  }

  // 5. Same category
  if (catA && catB && catA === catB) return 50;

  // 6. Campaign-theme fallback
  return 0;
}

function scoreToReason(score) {
  if (score >= 100) return 'SAME_BASE_FAMILY';
  if (score >= 90) return 'SAME_FUNCTION';
  if (score >= 85) return 'VERIFIED_COMPLEMENTARY';
  if (score >= 70) return 'SHARED_NAMING_STEM';
  if (score >= 50) return 'SAME_CATEGORY';
  return 'CAMPAIGN_THEME_FALLBACK';
}

// Deterministic grid ordering: pair products for 2-column rows.
// Uses global-optimal greedy: pick the strongest pair across all remaining
// products first, then the next strongest, etc. This prevents a mediocre
// early match from stealing a product that belongs in a perfect pair.
function orderProductsForGrid(products) {
  if (!Array.isArray(products) || products.length < 2) {
    return { ordered: products ? [...products] : [], pairingAudit: [] };
  }

  const n = products.length;
  const used = new Set();
  const pairs = [];

  // Build all pairwise scores, sorted strongest first.
  // Ties broken by lower origIdx for determinism.
  const candidates = [];
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      candidates.push({ i, j, score: pairScore(products[i], products[j]) });
    }
  }
  candidates.sort((a, b) => b.score - a.score || a.i - b.i || a.j - b.j);

  // Greedily select the strongest available pair
  for (const c of candidates) {
    if (used.has(c.i) || used.has(c.j)) continue;
    used.add(c.i);
    used.add(c.j);
    pairs.push({ left: products[c.i], right: products[c.j], score: c.score });
    if (pairs.length * 2 >= n - (n % 2)) break;
  }

  // Sort pairs by original position of the left product for stable row ordering
  pairs.sort((a, b) => products.indexOf(a.left) - products.indexOf(b.left));

  const ordered = [];
  const pairingAudit = [];
  for (const pair of pairs) {
    ordered.push(pair.left, pair.right);
    pairingAudit.push({
      row: pairingAudit.length + 1,
      left: { id: pair.left.id, name: pair.left.name },
      right: { id: pair.right.id, name: pair.right.name },
      score: pair.score,
      reason: scoreToReason(pair.score),
    });
  }

  // Odd product (shouldn't happen after even-count enforcement, but safe)
  for (let i = 0; i < n; i++) {
    if (!used.has(i)) {
      ordered.push(products[i]);
      pairingAudit.push({
        row: pairingAudit.length + 1,
        left: { id: products[i].id, name: products[i].name },
        right: null,
        score: 0,
        reason: 'ODD_PRODUCT_UNPAIRED',
      });
    }
  }

  return { ordered, pairingAudit };
}

module.exports = { orderProductsForGrid, pairScore, baseFamily, functionalCore, systemStem, isComponent };
