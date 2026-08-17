// ---------------------------------------------------------------------------
// adapter.js — BigCommerce Product Source adapter (Architecture V2 §2.5 / §6.1).
//
// Wraps the EXISTING, proven, read-only client (Brands/RDD/integration/
// bigcommerce-client.js) — it does NOT reimplement BigCommerce access. All calls
// remain GET-only; credentials load at runtime from the brand .env (git-ignored).
//
// It adds what the platform needs on top of the raw client:
//   - a brand-agnostic contract (getCandidateProducts) the rest of the engine calls,
//   - three SOURCE MODES for demo de-risking + testability (Architecture V2 §7.4):
//       live      → hit the API, then snapshot the result to runtime/cache/,
//       snapshot  → replay a REAL prior capture (offline demo, no network),
//       fixture   → load a named JSON file (tests only — clearly labelled data),
//   - a factual, non-invented one-line descriptor (the product's own category)
//     and an AUD price label, so cards render without fabricating copy (§5.1).
//
// It NEVER fabricates products. If live retrieval fails, it throws an
// IntegrationError with an actionable message — it does not fall back to fake data.
// ---------------------------------------------------------------------------

'use strict';

const path = require('path');
const fs = require('fs');
const { IntegrationError } = require('../../common/errors');

// The proven client currently lives under the RDD integration folder (the only
// copy). It is brand-agnostic (createBcClient factory), so every brand uses it.
// A later phase relocates it under platform/integrations/bigcommerce/.
const CLIENT_REL = 'Brands/RDD/integration/bigcommerce-client.js';

function formatAud(value) {
  const n = Number(value);
  if (!Number.isFinite(n) || n <= 0) return null;
  return `AUD $${n.toFixed(2)}`;
}

// Turn a shaped client product + its source-category label into the shape the
// renderer + QA expect. Description is the REAL category name (factual, not invented).
function enrich(product, categoryLabel) {
  const priceLabel = formatAud(product.salePrice ?? product.price);
  return {
    id: product.id,
    name: product.name,
    url: product.url,
    imageUrl: product.imageUrl,
    price: product.price,
    salePrice: product.salePrice,
    priceLabel,
    desc: categoryLabel || '',
    // verification-relevant fields (used by curation + QA)
    isVisible: product.isVisible,
    availability: product.availability,
    inventoryLevel: product.inventoryLevel,
    inventoryTracking: product.inventoryTracking,
    dateModified: product.dateModified,
  };
}

// Normalize a category name for tolerant matching: lowercase, strip punctuation,
// and singularize each word so "Anti-Slip Stair Nosing" (calendar) matches
// "Anti Slip Stair Nosings" (BigCommerce). This resolves the SAME category across
// a hyphen/plural naming variance — it never maps to a different category.
function normalizeCategoryName(s) {
  return String(s == null ? '' : s)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
    .split(' ')
    .filter(Boolean)
    .map((w) => w.replace(/s$/, '')) // crude singularization (nosings→nosing)
    .join(' ');
}

// A tree-category object uses `category_id`; a legacy category uses `id`.
const catIdOf = (c) => (c && (c.category_id != null ? c.category_id : c.id));

// Resolve the calendar's category name to ONE canonical BigCommerce category.
//
// Two modes:
//   • TREE-SCOPED (opts.treeId set — shared-store brands): resolve the name ONLY
//     within the brand's category tree, and — when opts.allowList is non-empty —
//     ONLY among that brand's VERIFIED category ids. This structurally prevents a
//     shared-store brand from resolving another storefront's category (SS↛SC,
//     SC↛SS) or an ambiguous cross-listed one (e.g. tree-1 "Mobility Aids" 195,
//     which is excluded from SS's allow-list). Returns null when the name is not
//     in the brand's verified scope — the caller then STOPS (never substitutes).
//   • DEFAULT (no treeId — single-store brands like RDD): unchanged store-wide
//     resolution (exact id/slug/name, else a normalized match, base slug wins).
async function resolveCategoryByName(bc, name, { treeId = null, allowList = null } = {}) {
  const target = normalizeCategoryName(name);

  if (treeId != null) {
    if (typeof bc.getTreeCategories !== 'function') {
      throw new IntegrationError('Tree-scoped category resolution requires a client with getTreeCategories().');
    }
    const treeCats = await bc.getTreeCategories(treeId);
    const allow = Array.isArray(allowList) && allowList.length ? new Set(allowList.map(Number)) : null;
    const scoped = allow ? treeCats.filter((c) => allow.has(Number(catIdOf(c)))) : treeCats;
    const matches = scoped.filter((c) => normalizeCategoryName(c.name) === target);
    if (!matches.length) return null;
    matches.sort((a, b) => Number(catIdOf(a)) - Number(catIdOf(b))); // base category (lowest id) wins
    const m = matches[0];
    const id = Number(catIdOf(m));
    // custom_url is only needed for the storefront category URL (best-effort).
    let custom_url = m.custom_url || null;
    if (!custom_url && typeof bc.getCategoryById === 'function') {
      try {
        const d = await bc.getCategoryById(id);
        custom_url = (d && d.custom_url) || null;
      } catch {
        /* URL is best-effort; the id is what governs which products are fetched */
      }
    }
    return { id, name: m.name, custom_url };
  }

  // Default (single-store): exact first, else normalized; base slug / lowest id wins.
  const exact = await bc.resolveCategory(name);
  if (exact) return exact;
  const cats = await bc.getAllCategories();
  const matches = cats.filter((c) => normalizeCategoryName(c.name) === target);
  if (!matches.length) return null;

  const slugLen = (c) => ((c.custom_url && c.custom_url.url) || '').length || 1e9;
  const visible = matches.filter((c) => c.is_visible !== false);
  const pool = visible.length ? visible : matches;
  pool.sort((a, b) => slugLen(a) - slugLen(b) || a.id - b.id);
  return pool[0];
}

// --- source: live ----------------------------------------------------------
async function fetchLive(brand, logger) {
  const bc = brand._client; // injected below
  const featuredIds = brand.bigcommerce.featuredCategoryIds || [];
  const perCat = 6;

  const categories = await bc.getAllCategories();
  const nameById = new Map(categories.map((c) => [c.id, c.name]));

  const pool = [];
  const seen = new Set();
  const push = (items, label) => {
    for (const p of items) {
      if (seen.has(p.id)) continue;
      seen.add(p.id);
      pool.push(enrich(p, label));
    }
  };

  for (const id of featuredIds) {
    const label = nameById.get(id) || null;
    // eslint-disable-next-line no-await-in-loop
    const items = await bc.getProductsByCategoryId(id, perCat);
    push(items, label);
    logger.debug(`Fetched ${items.length} product(s) from category ${id} (${label || 'unknown'}).`);
  }

  // Top up with recently-updated visible products so the pool is never thin.
  const recent = await bc.getRecentlyUpdatedProducts(12);
  push(recent, 'Latest Additions');

  logger.info(`Live catalog pool assembled: ${pool.length} unique product(s).`);
  return pool;
}

// --- the adapter ------------------------------------------------------------
function createProductSource({ repoRoot, brand, logger, cacheDir }) {
  const snapshotPath = path.join(cacheDir, `${brand.code}-products.json`);

  function loadClient() {
    const clientPath = path.join(repoRoot, CLIENT_REL);
    if (!fs.existsSync(clientPath)) {
      throw new IntegrationError(`BigCommerce client not found at ${CLIENT_REL}.`);
    }
    // eslint-disable-next-line global-require, import/no-dynamic-require
    const { loadEnv, parseStoreHashFromApiPath, createBcClient } = require(clientPath);
    const envPath = path.join(repoRoot, brand.bigcommerce.envPath);
    const raw = loadEnv(envPath);
    const apiPath = raw['API PATH'] || raw['API_PATH'] || raw['BIGCOMMERCE_API_PATH'];
    const token =
      raw['ACCESS TOKEN'] || raw['BIGCOMMERCE_ACCESS_TOKEN'] || raw['X-Auth-Token'] || raw['ACCESS_TOKEN'];
    const storeHash =
      raw['STORE HASH'] || raw['STORE_HASH'] || raw['BIGCOMMERCE_STORE_HASH'] || parseStoreHashFromApiPath(apiPath);
    if (!token || !storeHash) {
      throw new IntegrationError(
        `BigCommerce credentials missing for ${brand.code}. Set "API PATH" and "ACCESS TOKEN" in ` +
          `${brand.bigcommerce.envPath} (see Brands/RDD/integration/.env.example). Never committed.`,
        { brand: brand.code }
      );
    }
    return createBcClient({
      token,
      storeHash,
      storeDomain: brand.bigcommerce.storeDomain,
      featuredCategoryIds: brand.bigcommerce.featuredCategoryIds,
      saleCategoryId: brand.bigcommerce.saleCategoryId,
      heroProductId: brand.bigcommerce.heroProductId,
    });
  }

  async function getCandidateProducts({ source = 'live', fixturePath = null } = {}) {
    // Shared-store safety (CLAUDE.md §12): a brand on a BigCommerce store SHARED with
    // another storefront (SS/SC share store 498h0egvgn) must NEVER be built from the
    // generic, store-wide candidate/recently-updated pool — it would MIX the two
    // brands' products. Such a brand must scope explicitly (getCategoryProducts with
    // its own featuredCategoryIds / the calendar topic_category, or getProductsByIds).
    // Gated by a config flag so single-store brands (RDD) are completely unaffected.
    if (brand.bigcommerce && brand.bigcommerce.requireExplicitScoping) {
      throw new IntegrationError(
        `${brand.code} is on a SHARED BigCommerce store (${brand.bigcommerce.storeHashHint || 'shared'}); the ` +
          `generic store-wide product pool would mix storefronts. Use category or channel scoping ` +
          `(getCategoryProducts with this brand's category ids / the calendar topic_category) — never the ` +
          `generic candidate fallback (CLAUDE.md §12). Refusing to return a brand-ambiguous product set.`,
        { brand: brand.code, storeHash: brand.bigcommerce.storeHashHint || null }
      );
    }

    // fixture (tests only)
    if (source.startsWith('fixture')) {
      const fp = fixturePath || source.split(':')[1];
      if (!fp || !fs.existsSync(fp)) {
        throw new IntegrationError(`Fixture not found: ${fp}`);
      }
      logger.warn(`Using FIXTURE product data (${path.basename(fp)}) — test/dev only, not a real send.`);
      return JSON.parse(fs.readFileSync(fp, 'utf8'));
    }

    // snapshot (replay a real prior capture — offline demo)
    if (source === 'snapshot') {
      if (!fs.existsSync(snapshotPath)) {
        throw new IntegrationError(
          `No product snapshot for ${brand.code} at ${snapshotPath}. Run once with --source live first.`,
          { brand: brand.code }
        );
      }
      logger.info(`Replaying product snapshot for ${brand.code} (offline).`);
      return JSON.parse(fs.readFileSync(snapshotPath, 'utf8'));
    }

    // live (default) — GET-only; then snapshot the real result
    logger.info(`Retrieving live products for ${brand.code} from BigCommerce (read-only)…`);
    let pool;
    try {
      brand._client = loadClient();
      pool = await fetchLive(brand, logger);
    } catch (err) {
      if (err instanceof IntegrationError) throw err;
      throw new IntegrationError(
        `Live BigCommerce retrieval failed for ${brand.code}: ${err.message}. ` +
          `The engine reports this blocker rather than fabricate products (CLAUDE.md §5.1). ` +
          `Verify the token/scope with: python "Brands/RDD/integration/verify.py", or run --source snapshot.`,
        { brand: brand.code, cause: err.message }
      );
    }
    // persist a real snapshot for offline replay / demo fallback
    try {
      fs.mkdirSync(cacheDir, { recursive: true });
      fs.writeFileSync(snapshotPath, JSON.stringify(pool, null, 2), 'utf8');
      logger.debug(`Snapshot written: ${snapshotPath}`);
    } catch (e) {
      logger.warn(`Could not write product snapshot: ${e.message}`);
    }
    return pool;
  }

  // Retrieve products from ONE named category (the calendar's product_categories),
  // so a themed campaign shows only on-topic products — never mixing categories to
  // hit a count (CLAUDE.md §5.1.2). Returns { category:{id,name,url}, products:[…] }.
  // If the named category cannot be resolved live, it STOPS (does not substitute).
  async function getCategoryProducts({ categoryName, count = 24, source = 'live', fixturePath = null } = {}) {
    const name = String(categoryName == null ? '' : categoryName).trim();
    if (!name) throw new IntegrationError('getCategoryProducts requires a categoryName (the calendar product_categories).');

    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
    const catSnapshot = path.join(cacheDir, `${brand.code}-cat-${slug}.json`);
    const lc = name.toLowerCase();
    const matchesDesc = (p) => {
      const d = (p.desc || '').toLowerCase();
      return d && (d.includes(lc) || lc.includes(d));
    };

    // fixture (tests only)
    if (source.startsWith('fixture')) {
      const fp = fixturePath || source.split(':')[1];
      if (!fp || !fs.existsSync(fp)) throw new IntegrationError(`Fixture not found: ${fp}`);
      logger.warn(`Using FIXTURE product data (${path.basename(fp)}) — test/dev only.`);
      const pool = JSON.parse(fs.readFileSync(fp, 'utf8'));
      return { category: { id: null, name, url: null }, products: pool.filter(matchesDesc) };
    }

    // snapshot (offline replay) — prefer a category capture, else filter the main pool
    if (source === 'snapshot') {
      if (fs.existsSync(catSnapshot)) {
        logger.info(`Replaying category snapshot for ${brand.code} / "${name}" (offline).`);
        return JSON.parse(fs.readFileSync(catSnapshot, 'utf8'));
      }
      if (fs.existsSync(snapshotPath)) {
        logger.info(`Filtering ${brand.code} product snapshot by category "${name}" (offline).`);
        return { category: { id: null, name, url: null }, products: JSON.parse(fs.readFileSync(snapshotPath, 'utf8')).filter(matchesDesc) };
      }
      throw new IntegrationError(`No snapshot for ${brand.code} category "${name}". Run once with --source live first.`, { brand: brand.code });
    }

    // live (default) — GET-only; resolve the category, then its products
    logger.info(`Retrieving live products for ${brand.code} in category "${name}" from BigCommerce (read-only)…`);
    let result;
    try {
      brand._client = loadClient();
      const bc = brand._client;
      const bcfg = brand.bigcommerce || {};
      const treeId = bcfg.categoryTreeId != null ? bcfg.categoryTreeId : null;
      const allowList = Array.isArray(bcfg.featuredCategoryIds) ? bcfg.featuredCategoryIds : null;
      const cat = await resolveCategoryByName(bc, name, { treeId, allowList });
      if (!cat) {
        const scopeNote = treeId != null
          ? ` within ${brand.code}'s verified scope (category tree ${treeId}` +
            (allowList && allowList.length ? ` + verified allow-list` : '') + ')'
          : `'s BigCommerce catalog`;
        throw new IntegrationError(
          `Category "${name}" not found${scopeNote}. The calendar specifies this category; the engine will not ` +
            `resolve outside this brand's storefront or substitute another (no cross-brand products; ` +
            `CLAUDE.md §5.1.2/§12). Confirm the calendar category name for ${brand.code}.`,
          { brand: brand.code, category: name, treeId }
        );
      }
      logger.info(`Resolved calendar category "${name}" → BigCommerce "${cat.name}" (id ${cat.id}, ${(cat.custom_url && cat.custom_url.url) || 'no-slug'}).`);
      const items = await bc.getProductsByCategoryId(cat.id, count);
      const products = items.map((p) => enrich(p, cat.name));
      const url = bc.buildUrl(cat.custom_url && cat.custom_url.url, `/categories/${cat.id}`);
      logger.info(`Category "${cat.name}" (id ${cat.id}) → ${products.length} product(s).`);
      result = { category: { id: cat.id, name: cat.name, url }, products };
    } catch (err) {
      if (err instanceof IntegrationError) throw err;
      throw new IntegrationError(
        `Live category retrieval failed for ${brand.code} / "${name}": ${err.message}. ` +
          `The engine reports this blocker rather than fabricate products (CLAUDE.md §5.1).`,
        { brand: brand.code, cause: err.message }
      );
    }
    // persist a real category snapshot for offline replay / demo fallback
    try {
      fs.mkdirSync(cacheDir, { recursive: true });
      fs.writeFileSync(catSnapshot, JSON.stringify(result, null, 2), 'utf8');
      logger.debug(`Category snapshot written: ${catSnapshot}`);
    } catch (e) {
      logger.warn(`Could not write category snapshot: ${e.message}`);
    }
    return result;
  }

  // Retrieve specific products by BigCommerce id (for a content-override's curated
  // selection). Live: GET each product by id. snapshot/fixture: filter the pool by id.
  // Returns enriched products (desc left blank; the caller sets authored copy). Never
  // fabricates — a missing/hidden id simply does not come back, and the caller reports it.
  async function getProductsByIds(ids, { source = 'live', fixturePath = null } = {}) {
    const wanted = (Array.isArray(ids) ? ids : []).map((n) => Number(n)).filter((n) => Number.isFinite(n));
    if (!wanted.length) return [];

    if (source.startsWith('fixture')) {
      const fp = fixturePath || source.split(':')[1];
      if (!fp || !fs.existsSync(fp)) throw new IntegrationError(`Fixture not found: ${fp}`);
      const pool = JSON.parse(fs.readFileSync(fp, 'utf8'));
      return pool.filter((p) => wanted.includes(Number(p.id)));
    }
    if (source === 'snapshot') {
      if (!fs.existsSync(snapshotPath)) {
        throw new IntegrationError(`No product snapshot for ${brand.code} at ${snapshotPath}. Run once with --source live first.`, { brand: brand.code });
      }
      const pool = JSON.parse(fs.readFileSync(snapshotPath, 'utf8'));
      return pool.filter((p) => wanted.includes(Number(p.id)));
    }

    logger.info(`Retrieving ${wanted.length} product(s) by id for ${brand.code} from BigCommerce (read-only)…`);
    let out;
    try {
      brand._client = loadClient();
      const bc = brand._client;
      out = [];
      for (const id of wanted) {
        // eslint-disable-next-line no-await-in-loop
        const p = await bc.getProductById(id);
        if (p) out.push(enrich(p, ''));
      }
    } catch (err) {
      if (err instanceof IntegrationError) throw err;
      throw new IntegrationError(`Live product-by-id retrieval failed for ${brand.code}: ${err.message}.`, { brand: brand.code, cause: err.message });
    }
    return out;
  }

  return { getCandidateProducts, getCategoryProducts, getProductsByIds, snapshotPath };
}

module.exports = { createProductSource, formatAud, enrich, resolveCategoryByName };
