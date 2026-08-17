// BigCommerce source-architecture tests (multi-brand). Offline, no network.
//
// VERIFIED architecture (from approved-send product image URLs in the repo):
//   - RDD uses its OWN BigCommerce store (hash ugqmr0qfvf, retaildisplaydirect.com.au).
//   - SS and SC SHARE ONE BigCommerce store (hash 498h0egvgn), served as two
//     storefronts: safetysector.com.au (SS) and sectorcare.com.au (SC).
//
// So SS + SC reference the SAME shared credential file (creds are NOT duplicated),
// but Klaviyo stays STRICTLY per brand. These tests prove both halves:
//   - shared product source: SS and SC share BC store hash + BC envPath;
//   - distinct storefronts:  SS and SC have different storeDomain (correct URLs);
//   - RDD is a different store from the SS/SC shared one;
//   - Klaviyo isolation is preserved (distinct key env vars + distinct klaviyo envPaths);
//   - missing shared creds fail SAFELY (IntegrationError, no products, no fabrication);
//   - a brand reads ONLY its configured envPath (no accidental RDD-store read).
//
// Isolation/fail-safe cases use a temp repoRoot with controlled .env files — no real
// credential is ever read or printed.

'use strict';

const { test } = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const os = require('os');
const path = require('path');

const { createProductSource, resolveCategoryByName } = require('../integrations/bigcommerce/adapter');
const { loadBrandConfig } = require('../common/config');
const { loadKlaviyoConfig } = require('../integrations/klaviyo/config');
const { IntegrationError } = require('../common/errors');

const noopLogger = { info() {}, warn() {}, debug() {}, error() {} };

function tmpDir(rootEnvContents) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'bc-iso-'));
  if (rootEnvContents != null) fs.writeFileSync(path.join(dir, '.env'), rootEnvContents);
  return dir;
}

test('SS and SC SHARE one BigCommerce store (same hash + same shared credential file)', () => {
  const ss = loadBrandConfig('SS').bigcommerce;
  const sc = loadBrandConfig('SC').bigcommerce;

  // Same underlying store, one shared (not duplicated) credential file.
  assert.strictEqual(ss.storeHashHint, '498h0egvgn');
  assert.strictEqual(sc.storeHashHint, '498h0egvgn');
  assert.strictEqual(ss.envPath, sc.envPath, 'SS and SC must reference the SAME shared BC credential file');
  assert.strictEqual(ss.envPath, 'Brands/_shared/.env');

  // Distinct storefronts → product URLs resolve to the right domain per brand.
  assert.notStrictEqual(ss.storeDomain, sc.storeDomain);
});

test('RDD uses a DIFFERENT BigCommerce store from the SS/SC shared store', () => {
  const rdd = loadBrandConfig('RDD').bigcommerce;
  const shared = loadBrandConfig('SS').bigcommerce;
  assert.notStrictEqual(rdd.storeHashHint, shared.storeHashHint); // ugqmr0qfvf vs 498h0egvgn
  assert.notStrictEqual(rdd.envPath, shared.envPath);             // RDD creds are its own file
  assert.strictEqual(rdd.envPath, 'Brands/RDD/.env');
});

test('Klaviyo stays ISOLATED per brand even though BigCommerce is shared', () => {
  const [rdd, ss, sc] = ['RDD', 'SS', 'SC'].map((b) => loadKlaviyoConfig(b));
  // Distinct key env vars (a global var cannot satisfy two brands).
  const vars = [rdd.apiKeyEnvVar, ss.apiKeyEnvVar, sc.apiKeyEnvVar];
  assert.strictEqual(new Set(vars).size, 3);
  // Distinct per-brand Klaviyo credential files.
  const envPaths = [rdd.envPath, ss.envPath, sc.envPath];
  assert.strictEqual(new Set(envPaths).size, 3);
  assert.strictEqual(ss.envPath, 'Brands/SS/.env');
  assert.strictEqual(sc.envPath, 'Brands/SC/.env');
  // The shared BC file is NOT a Klaviyo file.
  assert.ok(!envPaths.includes('Brands/_shared/.env'));
});

for (const code of ['SS', 'SC']) {
  test(`${code}: missing SHARED BigCommerce creds fail safely — no products, no fabrication`, async () => {
    const repoRoot = tmpDir(null);
    fs.mkdirSync(path.join(repoRoot, 'Brands', '_shared'), { recursive: true });
    fs.writeFileSync(path.join(repoRoot, 'Brands', '_shared', '.env'), '# shared store token not provided yet\n');
    const brand = {
      code,
      bigcommerce: { envPath: 'Brands/_shared/.env', featuredCategoryIds: [], storeDomain: 'https://example.test' },
    };
    const src = createProductSource({ repoRoot, brand, logger: noopLogger, cacheDir: tmpDir(null) });
    await assert.rejects(() => src.getCandidateProducts({ source: 'live' }), IntegrationError);
    await assert.rejects(() => src.getCategoryProducts({ categoryName: 'Anything', source: 'live' }), IntegrationError);
    await assert.rejects(() => src.getProductsByIds([1, 2], { source: 'live' }), IntegrationError);
  });
}

test('a brand reads ONLY its configured envPath (SS shared file, never the RDD store file)', async () => {
  const repoRoot = tmpDir(null);
  fs.mkdirSync(path.join(repoRoot, 'Brands', 'RDD'), { recursive: true });
  fs.mkdirSync(path.join(repoRoot, 'Brands', '_shared'), { recursive: true });
  // RDD store file HAS (fake) creds; the shared file does NOT. SS must still fail safely,
  // proving it does not fall back to the RDD store's credentials.
  fs.writeFileSync(
    path.join(repoRoot, 'Brands', 'RDD', '.env'),
    'API PATH: https://api.bigcommerce.com/stores/rddfakehash/v3/\nACCESS TOKEN: fake-rdd-token\n'
  );
  fs.writeFileSync(path.join(repoRoot, 'Brands', '_shared', '.env'), '# shared token not provided yet\n');

  const brand = { code: 'SS', bigcommerce: { envPath: 'Brands/_shared/.env', featuredCategoryIds: [], storeDomain: 'https://safetysector.com.au' } };
  const src = createProductSource({ repoRoot, brand, logger: noopLogger, cacheDir: tmpDir(null) });
  await assert.rejects(() => src.getCandidateProducts({ source: 'live' }), IntegrationError);
});

test('RDD product retrieval contract preserved (fixture mode shapes products)', async () => {
  const brand = loadBrandConfig('RDD');
  const src = createProductSource({ repoRoot: process.cwd(), brand, logger: noopLogger, cacheDir: tmpDir(null) });
  const fixturePath = path.join(process.cwd(), 'platform', 'tests', 'fixtures', 'rdd-products.sample.json');
  const products = await src.getCandidateProducts({ source: 'fixture', fixturePath });
  assert.ok(Array.isArray(products) && products.length > 0, 'RDD fixture retrieval still returns products');
});

// --- shared-store product-mixing guard (requirement #6) --------------------

const isSharedRefusal = (e) => e instanceof IntegrationError && /SHARED BigCommerce store/.test(e.message);

for (const code of ['SS', 'SC']) {
  test(`${code}: REFUSES the generic store-wide candidate pool (prevents SS/SC product mixing)`, async () => {
    const brand = loadBrandConfig(code);
    assert.strictEqual(brand.bigcommerce.requireExplicitScoping, true, `${code} must require explicit scoping`);
    const src = createProductSource({ repoRoot: process.cwd(), brand, logger: noopLogger, cacheDir: tmpDir(null) });
    // Refused up front, before any network/creds AND regardless of source (the generic
    // pool concept is invalid for a shared store) — so no brand-ambiguous set is returned.
    await assert.rejects(() => src.getCandidateProducts({ source: 'live' }), isSharedRefusal);
    await assert.rejects(() => src.getCandidateProducts({ source: 'snapshot' }), isSharedRefusal);
    await assert.rejects(() => src.getCandidateProducts({ source: 'fixture', fixturePath: 'anything.json' }), isSharedRefusal);
  });
}

test('RDD is NOT flagged for explicit scoping — its generic candidate path is unaffected', () => {
  const rdd = loadBrandConfig('RDD').bigcommerce;
  assert.ok(!rdd.requireExplicitScoping, 'RDD (single-store) must not require explicit scoping');
});

// --- verified channel/tree scopes + disjoint category allow-lists ----------

test('SS and SC carry DISTINCT verified channel + category-tree scopes on the shared store', () => {
  const ss = loadBrandConfig('SS').bigcommerce;
  const sc = loadBrandConfig('SC').bigcommerce;
  assert.strictEqual(ss.channelId, 1);
  assert.strictEqual(ss.categoryTreeId, 1);
  assert.strictEqual(sc.channelId, 1786273);
  assert.strictEqual(sc.categoryTreeId, 2);
  assert.notStrictEqual(ss.channelId, sc.channelId);
  assert.notStrictEqual(ss.categoryTreeId, sc.categoryTreeId);
});

test('SS and SC featuredCategoryIds are DISJOINT (no category can feed both brands)', () => {
  const ss = loadBrandConfig('SS').bigcommerce.featuredCategoryIds;
  const sc = loadBrandConfig('SC').bigcommerce.featuredCategoryIds;
  assert.ok(ss.length > 0 && sc.length > 0, 'both brands have verified category ids');
  const overlap = ss.filter((id) => sc.includes(id));
  assert.deepStrictEqual(overlap, [], `SS/SC category ids must not overlap (found ${overlap})`);
  // The known SC-polluted tree-1 categories must NOT be in SS's clean scope.
  for (const polluted of [120, 137, 195]) assert.ok(!ss.includes(polluted), `SS must exclude SC-polluted cat ${polluted}`);
});

// --- tree-scoped category resolution (offline, fake client) ----------------
//
// A fake catalog mirroring the live store shape: tree 1 (SS) holds Safety Bollards
// (18), Tactile Indicator (32) and the ALL-SC cross-listed "Mobility Aids" (195);
// tree 2 (SC) holds Rollators (175), "Mobility Aids" (174) and Bath Aids (190).
const FAKE_BC = {
  getTreeCategories: async (treeId) => (treeId === 1
    ? [{ category_id: 18, name: 'Safety Bollards', parent_id: 0 }, { category_id: 32, name: 'Tactile Indicator', parent_id: 0 }, { category_id: 195, name: 'Mobility Aids', parent_id: 0 }]
    : [{ category_id: 175, name: 'Rollators', parent_id: 0 }, { category_id: 174, name: 'Mobility Aids', parent_id: 0 }, { category_id: 190, name: 'Bath Aids', parent_id: 0 }]),
  getCategoryById: async (id) => ({ id, custom_url: { url: `/cat-${id}/` } }),
  // These must NOT be called in tree-scoped mode (store-wide resolution is bypassed):
  resolveCategory: async () => { throw new Error('store-wide resolveCategory must not run in tree mode'); },
  getAllCategories: async () => { throw new Error('store-wide getAllCategories must not run in tree mode'); },
};
const SS_SCOPE = { treeId: 1, allowList: [18, 32] }; // 195 deliberately NOT allow-listed
const SC_SCOPE = { treeId: 2, allowList: [175, 174, 190] };

test('tree-scoped: SS resolves an SS category within tree 1 + allow-list', async () => {
  const c = await resolveCategoryByName(FAKE_BC, 'Safety Bollards', SS_SCOPE);
  assert.strictEqual(c.id, 18);
  assert.strictEqual(c.custom_url.url, '/cat-18/');
});

test('tree-scoped: SS CANNOT resolve an SC-only category (Rollators → null)', async () => {
  assert.strictEqual(await resolveCategoryByName(FAKE_BC, 'Rollators', SS_SCOPE), null);
});

test('tree-scoped: SC CANNOT resolve an SS-only category (Safety Bollards → null)', async () => {
  assert.strictEqual(await resolveCategoryByName(FAKE_BC, 'Safety Bollards', SC_SCOPE), null);
});

test('tree-scoped: ambiguous cross-listed "Mobility Aids" is EXCLUDED from SS (195 not allow-listed → null)', async () => {
  assert.strictEqual(await resolveCategoryByName(FAKE_BC, 'Mobility Aids', SS_SCOPE), null);
});

test('tree-scoped: SC resolves its OWN "Mobility Aids" (tree-2 174), never the tree-1 195', async () => {
  const c = await resolveCategoryByName(FAKE_BC, 'Mobility Aids', SC_SCOPE);
  assert.strictEqual(c.id, 174);
});

test('tree-scoped: tolerant name match still works within scope (Rollator → Rollators 175)', async () => {
  const c = await resolveCategoryByName(FAKE_BC, 'Rollator', SC_SCOPE);
  assert.strictEqual(c.id, 175);
});

test('default (no treeId): store-wide resolution unchanged for single-store brands (RDD)', async () => {
  const bc = {
    resolveCategory: async (n) => (n === 'Snap Frames' ? { id: 505, name: 'Snap Frames', custom_url: { url: '/snap-frames/' } } : null),
    getAllCategories: async () => [],
  };
  const c = await resolveCategoryByName(bc, 'Snap Frames');
  assert.strictEqual(c.id, 505);
});
