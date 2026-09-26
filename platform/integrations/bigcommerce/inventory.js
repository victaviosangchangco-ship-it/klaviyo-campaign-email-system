// ---------------------------------------------------------------------------
// inventory.js — Fail-Closed Inventory Safety Gate (all brands).
//
// A product MUST be positively verified as currently purchasable before it
// enters any campaign grid. UNKNOWN inventory state fails CLOSED (rejected).
//
// Supports BigCommerce's three inventory_tracking modes:
//   'product' — stock tracked at the product level (inventoryLevel governs)
//   'variant' — stock tracked per variant (product-level inventoryLevel is
//               the SUM; if zero, no variant has stock either — safe to reject)
//   'none'    — intentionally non-stock-tracked / always-purchasable
//               (digital goods, services, made-to-order); PASS when the product
//               is visible + available (never gated on a quantity that doesn't
//               exist for this product type)
//
// The decision is deterministic and auditable: every call returns a structured
// verdict with the reason, so QA/audit can trace why each product was accepted
// or rejected.
// ---------------------------------------------------------------------------

'use strict';

const PASS = 'PASS';
const FAIL = 'FAIL';

function isCampaignPurchasable(product, { brandCode = '?', storeDomain = null } = {}) {
  const verdict = { status: FAIL, reason: '', product: null };
  if (!product) {
    verdict.reason = 'null/undefined product';
    return verdict;
  }

  verdict.product = {
    id: product.id,
    sku: product.sku || null,
    name: product.name || null,
    url: product.url || null,
    brand: brandCode,
    storeDomain: storeDomain || null,
    inventoryTracking: product.inventoryTracking ?? null,
    inventoryLevel: product.inventoryLevel ?? null,
    availability: product.availability ?? null,
    isVisible: product.isVisible ?? null,
    priceLabel: product.priceLabel || null,
    imageUrl: product.imageUrl || null,
    verifiedAt: new Date().toISOString(),
  };

  // Gate 1: visibility — hidden/null products never reach customers
  if (product.isVisible === false || product.isVisible === null || product.isVisible === undefined) {
    verdict.reason = `product not visible (isVisible=${product.isVisible})`;
    return verdict;
  }

  // Gate 2: availability — disabled products are not purchasable
  if (product.availability === 'disabled') {
    verdict.reason = `product disabled (availability=${product.availability})`;
    return verdict;
  }

  // Gate 3: basic data quality — must have a price, image, and URL
  if (!product.priceLabel) {
    verdict.reason = 'no valid price';
    return verdict;
  }
  if (!product.imageUrl) {
    verdict.reason = 'no product image';
    return verdict;
  }
  if (!product.url) {
    verdict.reason = 'no product URL';
    return verdict;
  }

  // Gate 4: inventory — the core fail-closed stock check
  const tracking = product.inventoryTracking;

  if (tracking === 'none') {
    // Non-stock-tracked: intentionally always purchasable (digital goods,
    // services, made-to-order). The product is purchasable as long as it is
    // visible + available (already checked above).
    verdict.status = PASS;
    verdict.reason = 'non-stock-tracked product, visible and available (intentionally purchasable)';
    return verdict;
  }

  if (tracking === 'product') {
    const level = product.inventoryLevel;
    if (typeof level !== 'number' || !Number.isFinite(level)) {
      verdict.reason = `product-tracked but inventory level unresolved (inventoryLevel=${level})`;
      return verdict;
    }
    if (level <= 0) {
      verdict.reason = `out of stock (product-tracked, inventoryLevel=${level})`;
      return verdict;
    }
    verdict.status = PASS;
    verdict.reason = `in stock (product-tracked, inventoryLevel=${level})`;
    return verdict;
  }

  if (tracking === 'variant') {
    // For variant-tracked products, the product-level inventoryLevel is the
    // SUM of all variant inventory. If the sum is 0, no variant has stock.
    // If the sum is > 0, at least one purchasable variant exists.
    const level = product.inventoryLevel;
    if (typeof level !== 'number' || !Number.isFinite(level)) {
      verdict.reason = `variant-tracked but aggregate inventory level unresolved (inventoryLevel=${level})`;
      return verdict;
    }
    if (level <= 0) {
      verdict.reason = `out of stock — all variants depleted (variant-tracked, aggregate inventoryLevel=${level})`;
      return verdict;
    }
    verdict.status = PASS;
    verdict.reason = `in stock — at least one variant available (variant-tracked, aggregate inventoryLevel=${level})`;
    return verdict;
  }

  // Unknown/null/missing tracking mode: fail closed
  verdict.reason = `unknown inventory tracking mode (inventoryTracking=${tracking}) — fails closed`;
  return verdict;
}

function filterPurchasable(products, opts = {}) {
  const accepted = [];
  const rejected = [];
  for (const p of products || []) {
    const v = isCampaignPurchasable(p, opts);
    if (v.status === PASS) {
      accepted.push({ product: p, verdict: v });
    } else {
      rejected.push({ product: p, verdict: v });
    }
  }
  return { accepted, rejected };
}

function assertAllPurchasable(products, { context = 'campaign', brandCode = '?', storeDomain = null } = {}) {
  const { rejected } = filterPurchasable(products, { brandCode, storeDomain });
  if (rejected.length) {
    const summary = rejected.slice(0, 5).map((r) =>
      `  - [${r.verdict.product.id}] ${r.verdict.product.name}: ${r.verdict.reason}`
    ).join('\n');
    const err = new Error(
      `INVENTORY_SAFETY_BLOCK: ${rejected.length} product(s) in ${context} failed the ` +
      `purchasability check for ${brandCode}:\n${summary}` +
      (rejected.length > 5 ? `\n  ... and ${rejected.length - 5} more` : '')
    );
    err.code = 'INVENTORY_SAFETY_BLOCK';
    err.rejected = rejected;
    throw err;
  }
}

// Re-fetch products from BigCommerce by ID and run isCampaignPurchasable()
// against the CURRENT state. Never relies on stale in-memory inventory data.
// `fetchProducts` is an async (ids) => enrichedProduct[] callback (typically
// source.getProductsByIds bound to the correct brand/storefront client).
async function freshInventoryRecheck(productIds, fetchProducts, opts = {}) {
  const { brandCode = '?', context = 'recheck' } = opts;
  const ids = (Array.isArray(productIds) ? productIds : []).map(Number).filter(Number.isFinite);
  if (!ids.length) return { passed: [], failed: [], notFound: [], freshProducts: [] };

  let freshProducts;
  try {
    freshProducts = await fetchProducts(ids);
  } catch (err) {
    const error = new Error(
      `FRESH_RECHECK_FETCH_FAILED: could not re-fetch ${ids.length} product(s) for ` +
      `${context} (${brandCode}): ${err.message}`
    );
    error.code = 'FRESH_RECHECK_FETCH_FAILED';
    error.ids = ids;
    throw error;
  }

  if (!Array.isArray(freshProducts)) freshProducts = [];
  const freshById = new Map(freshProducts.map((p) => [Number(p.id), p]));

  const passed = [];
  const failed = [];
  const notFound = [];

  for (const id of ids) {
    const fresh = freshById.get(id);
    if (!fresh) {
      notFound.push({ id, reason: 'not returned by fresh BigCommerce fetch (removed/hidden/delisted)' });
      continue;
    }
    const verdict = isCampaignPurchasable(fresh, { brandCode });
    if (verdict.status === PASS) {
      passed.push({ product: fresh, verdict });
    } else {
      failed.push({ product: fresh, verdict });
    }
  }

  return { passed, failed, notFound, freshProducts: Array.from(freshById.values()) };
}

module.exports = {
  isCampaignPurchasable,
  filterPurchasable,
  assertAllPurchasable,
  freshInventoryRecheck,
  PASS,
  FAIL,
};
