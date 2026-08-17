// ---------------------------------------------------------------------------
// bigcommerce-client.js — brand-agnostic, read-only BigCommerce v3 access layer.
//
// Ported from the proven RDD Project 2 integration (bigcommerce.js) and
// refactored into a per-brand factory so the unified Klaviyo Campaign Email
// System can serve multiple stores without duplicating logic. The proven parts
// are preserved verbatim in spirit:
//   - .env loading (credentials never hardcoded, never logged),
//   - read-only (GET-only) BigCommerce v3 Catalog access,
//   - pagination, category caching, actionable 401/403 handling,
//   - shaping raw catalog objects into the small shape a campaign needs.
//
// What changed vs. the original:
//   - No module-level store constants. Everything store-specific (credentials,
//     domain, featured/sale category IDs, hero product) is passed in via
//     createBcClient(config), so this file has ZERO RDD-specific coupling.
//   - shapeProduct() now also surfaces stock/availability, visibility, sale
//     price, and date_modified (the "latest products, prices, stock, and
//     product updates" requirement).
//   - getRecentlyUpdatedProducts() added for "relevant product updates".
//
// All access is GET-only. Nothing here ever writes to the store.
// ---------------------------------------------------------------------------

'use strict';

const fs = require('fs');
const { URL } = require('url');

// ---------------------------------------------------------------------------
// .env loading (unchanged parsing behavior from the proven integration).
//
// Supports the store's existing "KEY: VALUE" format (space-separated keys and
// colon delimiter), as well as "KEY := VALUE" and standard "KEY=VALUE".
// ---------------------------------------------------------------------------
function loadEnv(filePath) {
  if (!fs.existsSync(filePath)) {
    return {};
  }

  const env = {};
  const contents = fs.readFileSync(filePath, 'utf8');
  for (const rawLine of contents.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith('#')) continue;
    // Delimiter is ":=", ":", or "=" (":=" checked first so it isn't parsed as
    // a ":" delimiter leaving a stray "=" at the head of the value).
    const match = line.match(/^([^:=]+?)\s*(?::=|[:=])\s*(.*)$/);
    if (!match) continue;
    env[match[1].trim()] = match[2].trim();
  }
  return env;
}

// Parse the store hash out of a full API path such as
// https://api.bigcommerce.com/stores/<hash>/v3/...
function parseStoreHashFromApiPath(value) {
  if (!value) return null;
  try {
    const url = new URL(value.trim());
    const match = url.pathname.match(/\/stores\/([^/]+)/i);
    return match ? match[1] : null;
  } catch {
    return null;
  }
}

// ---------------------------------------------------------------------------
// Client factory.
//
// config = {
//   token:                string  (required)  — BigCommerce X-Auth-Token
//   storeHash:            string  (required)  — resolved store hash
//   storeDomain:          string  (optional)  — canonical storefront origin
//   featuredCategoryIds:  number[] (optional) — design -> catalog mapping
//   saleCategoryId:       number  (optional)  — "On Sale Now" category
//   heroProductId:        number  (optional)  — fixed hero product
// }
//
// The factory holds NO secret in module scope and never logs the token.
// ---------------------------------------------------------------------------
function createBcClient(config = {}) {
  const {
    token,
    storeHash,
    storeDomain,
    featuredCategoryIds = [],
    saleCategoryId = null,
    heroProductId = null,
  } = config;

  const BC_BASE = `https://api.bigcommerce.com/stores/${storeHash}/v3`;
  const BC_HEADERS = { 'X-Auth-Token': token, Accept: 'application/json' };

  // Throw early (before any network call) if credentials are missing. The
  // message names the KEYS to set, never any value.
  function assertCredentials() {
    const missing = [];
    if (!token) missing.push('ACCESS TOKEN');
    if (!storeHash) missing.push('API PATH (store hash)');
    if (missing.length) {
      throw new Error(
        `BigCommerce credentials are missing in .env: ${missing.join(', ')}. ` +
          `Set "ACCESS TOKEN" and "API PATH" in Brands/RDD/.env (see .env.example).`
      );
    }
  }

  // All BigCommerce access is read-only: GET requests only, never write.
  async function bcGet(endpoint) {
    let response;
    try {
      response = await fetch(`${BC_BASE}${endpoint}`, { method: 'GET', headers: BC_HEADERS });
    } catch (err) {
      throw new Error(`BigCommerce request to ${endpoint} failed (network error): ${err.message}`);
    }

    if (response.status === 401 || response.status === 403) {
      throw new Error(
        `BigCommerce returned ${response.status} ${response.statusText} for GET ${endpoint}.\n` +
          `  This almost always means the API token cannot read the catalog. Check that the\n` +
          `  token in .env is current and that its OAuth scopes include "Products: read-only"\n` +
          `  (BigCommerce dashboard -> Settings -> API accounts). Update ACCESS TOKEN in .env\n` +
          `  and re-run once the scope/token is fixed.`
      );
    }
    if (!response.ok) {
      throw new Error(`BigCommerce GET ${endpoint} failed: ${response.status} ${response.statusText}`);
    }
    return response.json();
  }

  function normalizeStoreDomain(domain) {
    if (!domain) return null;
    const trimmed = domain.trim();
    if (/^https?:\/\//i.test(trimmed)) {
      return trimmed.replace(/\/$/, '');
    }
    return `https://${trimmed.replace(/\/$/, '')}`;
  }

  function buildUrl(customUrl, fallbackPath) {
    let target = customUrl || fallbackPath || '/';
    if (/^https?:\/\//i.test(target)) {
      return target;
    }
    const storeEndpoint = normalizeStoreDomain(storeDomain) || `https://${storeHash}.mybigcommerce.com`;
    return target.startsWith('/') ? `${storeEndpoint}${target}` : `${storeEndpoint}/${target}`;
  }

  function pickImage(images) {
    const list = Array.isArray(images) ? images : [];
    const featured = list.find((item) => item.is_thumbnail) || list[0] || {};
    return featured.url_standard || featured.url_zoom || featured.url_thumbnail || featured.image_url || '';
  }

  // Shape a raw catalog product into the small object a campaign renders.
  // Extended (vs. the original) to include stock, availability, visibility,
  // sale price, and date_modified so campaigns can reflect the latest state.
  function shapeProduct(product) {
    const customUrl =
      product.custom_url?.url || (typeof product.custom_url === 'string' ? product.custom_url : '');

    // sale_price is 0 when no sale is set; treat that as "no sale price".
    const rawSale = Number(product.sale_price);
    const salePrice = Number.isFinite(rawSale) && rawSale > 0 ? product.sale_price : null;

    return {
      id: product.id,
      name: product.name || 'Untitled product',
      // calculated_price already reflects active sale/rules when present.
      price: product.calculated_price ?? product.price ?? '0.00',
      salePrice,
      imageUrl: pickImage(product.images),
      url: buildUrl(customUrl, `/products/${product.id}`),
      // --- stock / freshness (new) ---
      inventoryLevel: product.inventory_level ?? null,
      inventoryTracking: product.inventory_tracking ?? null,
      availability: product.availability ?? null, // 'available' | 'disabled' | 'preorder'
      isVisible: product.is_visible ?? null,
      dateModified: product.date_modified ?? null,
    };
  }

  // --- Catalog helpers ------------------------------------------------------

  let categoryCache = null;
  async function getAllCategories() {
    if (categoryCache) return categoryCache;
    const all = [];
    let page = 1;
    for (;;) {
      const data = await bcGet(`/catalog/categories?limit=250&page=${page}`);
      const batch = Array.isArray(data.data) ? data.data : [];
      all.push(...batch);
      const pagination = data.meta?.pagination;
      if (!pagination || page >= pagination.total_pages) break;
      page += 1;
    }
    categoryCache = all;
    return all;
  }

  function slugOf(category) {
    const url = category.custom_url?.url || '';
    return url.replace(/^\/+|\/+$/g, '').toLowerCase();
  }

  // Resolve a category by ID, custom_url slug, or name (in that order of trust).
  async function resolveCategory(identifier) {
    const categories = await getAllCategories();
    if (/^\d+$/.test(String(identifier))) {
      const byId = categories.find((c) => c.id === Number(identifier));
      if (byId) return byId;
    }
    const needle = String(identifier).replace(/^\/+|\/+$/g, '').toLowerCase();
    return (
      categories.find((c) => slugOf(c) === needle) ||
      categories.find((c) => (c.name || '').toLowerCase() === needle.replace(/-/g, ' ')) ||
      null
    );
  }

  async function getProductsByCategoryId(categoryId, limit = 12) {
    const data = await bcGet(`/catalog/products?categories:in=${categoryId}&include=images&limit=${limit}`);
    const items = Array.isArray(data.data) ? data.data : [];
    return items.map(shapeProduct);
  }

  async function getProductById(productId) {
    const data = await bcGet(`/catalog/products/${productId}?include=images`);
    return data.data ? shapeProduct(data.data) : null;
  }

  // "Relevant product updates": most recently modified visible products.
  // sort=date_modified with direction=desc is supported by the v3 catalog API.
  async function getRecentlyUpdatedProducts(limit = 12) {
    const data = await bcGet(
      `/catalog/products?include=images&sort=date_modified&direction=desc&is_visible=true&limit=${limit}`
    );
    const items = Array.isArray(data.data) ? data.data : [];
    return items.map(shapeProduct);
  }

  // Read-only: all categories belonging to ONE category tree (multi-storefront
  // stores assign each channel/storefront its own tree). Used for tree-SCOPED
  // category-name resolution so a shared-store brand only ever resolves categories
  // from its own storefront. Paginated. Objects carry `category_id` (not `id`).
  async function getTreeCategories(treeId, limit = 250) {
    const all = [];
    let page = 1;
    for (;;) {
      const data = await bcGet(`/catalog/trees/categories?tree_id:in=${treeId}&limit=${limit}&page=${page}`);
      const batch = Array.isArray(data.data) ? data.data : [];
      all.push(...batch);
      const pagination = data.meta?.pagination;
      if (!pagination || page >= pagination.total_pages) break;
      page += 1;
    }
    return all;
  }

  // Read-only: a single category by id (for its custom_url slug when building a
  // category URL after tree-scoped resolution). Returns the raw category or null.
  async function getCategoryById(categoryId) {
    const data = await bcGet(`/catalog/categories/${categoryId}`);
    return data && data.data ? data.data : null;
  }

  // The one shape a campaign renders: fixed hero, featured categories, live sale.
  async function fetchEdmContent({ saleLimit = 12 } = {}) {
    assertCredentials();

    const categories = await getAllCategories();
    const byId = new Map(categories.map((c) => [c.id, c]));

    const featuredCategories = featuredCategoryIds
      .map((id) => {
        const c = byId.get(id);
        if (!c) return null;
        return {
          id: c.id,
          name: c.name,
          url: buildUrl(c.custom_url?.url, `/categories/${c.id}`),
          imageUrl: c.image_url || '',
        };
      })
      .filter(Boolean);

    const [sale, heroProduct] = await Promise.all([
      saleCategoryId ? getProductsByCategoryId(saleCategoryId, saleLimit) : Promise.resolve([]),
      heroProductId ? getProductById(heroProductId) : Promise.resolve(null),
    ]);

    return {
      hero: heroProduct,
      categories: featuredCategories,
      sale,
    };
  }

  return {
    // resolved config (no secrets echoed by callers, but exposed for wiring)
    BC_BASE,
    featuredCategoryIds,
    saleCategoryId,
    heroProductId,
    // read-only helpers
    assertCredentials,
    bcGet,
    buildUrl,
    pickImage,
    shapeProduct,
    getAllCategories,
    slugOf,
    resolveCategory,
    getProductsByCategoryId,
    getProductById,
    getRecentlyUpdatedProducts,
    getTreeCategories,
    getCategoryById,
    fetchEdmContent,
  };
}

module.exports = {
  loadEnv,
  parseStoreHashFromApiPath,
  createBcClient,
};
