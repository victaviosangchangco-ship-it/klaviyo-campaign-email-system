// Lark Campaign Calendar provider — offline unit tests (multi-brand).
//
// Every test injects a fake fetch: NO network call is made and no credential is
// read from disk. The fake also records each request so the suite can assert the
// integration is structurally read-only and that brand selection hits the right Base.

'use strict';

const { test } = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const os = require('os');
const path = require('path');

const {
  LarkCalendarProvider,
  larkFieldToPrimitive,
  larkDateToDate,
  makeFieldGetter,
  mapRecords,
  partitionByBrand,
} = require('../integrations/calendar/providers/lark-provider');
const { loadLarkConfig, getCalendarForBrand, LEGACY_BRAND_KEY } = require('../integrations/lark/config');
const { LarkAuth } = require('../integrations/lark/auth');
const { LarkBitableClient } = require('../integrations/lark/bitable-client');
const { createCalendarService, FIELDS } = require('../integrations/calendar/calendar-service');
const { IntegrationError, ConfigError } = require('../common/errors');

const FAKE_SECRET = 'unit-test-secret-value';

const SS_TOKEN = 'AppTokenSSUnitTest';
const RDD_TOKEN = 'AppTokenRDDUnitTest';

const CONFIG = {
  baseUrl: 'https://open.larksuite.test/open-apis',
  appId: 'cli_unit_test',
  appIdEnvVar: 'LARK_APP_ID',
  appSecretEnvVar: 'LARK_APP_SECRET',
  envPath: '/tmp/.env',
  hasAppId: true,
  hasAppSecret: true,
  legacy: false,
  brands: ['SS', 'RDD'],
  calendars: {
    SS: {
      brand: 'SS',
      label: 'Safety Sector Campaign Calendar',
      appToken: SS_TOKEN,
      tableId: 'tblSS',
      viewId: 'vewSS',
      pageSize: 500,
      dateTimezoneOffsetMinutes: 0,
      cacheTtlMs: 45000,
    },
    RDD: {
      brand: 'RDD',
      label: 'Retail Display Direct Campaign Calendar',
      appToken: RDD_TOKEN,
      tableId: 'tblRDD',
      viewId: 'vewRDD',
      pageSize: 500,
      dateTimezoneOffsetMinutes: 0,
      cacheTtlMs: 45000,
    },
  },
};

function record(fields) {
  return { record_id: `rec${Math.abs(JSON.stringify(fields).length)}`, fields };
}

const SS_01 = record({
  campaign_id: 'SS-2026-01',
  name: [{ type: 'text', text: 'New Year Safety Reset' }], // rich-text segments
  topic_category: 'Promotional sale', // Lark topic_category = the campaign TYPE
  subject_line: 'Start 2026 safely',
  scheduled_date: Date.UTC(2026, 0, 5), // epoch ms
  product_categories: 'Hi-Vis Workwear',
  key_topic: 'New year safety audit',
  promo_code: 'SAFE10',
  promo_text: '10% off hi-vis',
  tone: 'Practical',
  audience_type: 'segment',
  audience_id: 'seg_123',
  audience_name: '60D Active Customers',
  status: 'Planned',
  notes: 'Kickoff send',
  'Parent items': { text: 'Q1 Plan', text_arr: ['Q1 Plan'], type: 'text' },
});

// Optional fields absent entirely (Lark omits empty fields from `fields`).
const SS_02 = record({
  campaign_id: 'SS-2026-02',
  name: 'Winter PPE',
  topic_category: 'Product insight',
  scheduled_date: Date.UTC(2026, 0, 12),
  audience_type: 'list',
  audience_name: 'SS Subscribers',
});

const RDD_28 = record({
  campaign_id: 'RDD-2026-28',
  name: 'Acrylic Displays',
  topic_category: 'Product insight',
  scheduled_date: Date.UTC(2026, 0, 8),
  product_categories: 'Acrylic Display',
  audience_type: 'list',
  audience_name: 'RDD Email List',
});

const RDD_29 = record({
  campaign_id: 'RDD-2026-29',
  name: 'Snap Frames',
  topic_category: 'Promotional sale',
  scheduled_date: Date.UTC(2026, 0, 20),
  audience_type: 'segment',
  audience_name: 'RDD Engaged',
});

// Rows the shared classifyRow() must skip.
const DIVIDER = record({ campaign_id: 'Past campaigns' });
const NO_DATE = record({ campaign_id: 'SS-2026-99', name: 'No date' });
const POPUP = record({
  campaign_id: 'SS-2026-98',
  scheduled_date: Date.UTC(2026, 1, 2),
  audience_type: 'popup',
});

// ── fake transport ─────────────────────────────────────────────────────────
// byToken: { <appToken>: [ dataPage, … ] } — pages returned in order per Base.
function makeFakeFetch({ byToken = {}, authResponse = null, recordsError = null } = {}) {
  const calls = [];
  const pageIndex = new Map();

  const fetchImpl = async (url, init = {}) => {
    const u = String(url);
    calls.push({ url: u, method: (init.method || 'GET').toUpperCase(), body: init.body });

    if (u.includes('/auth/v3/tenant_access_token/internal')) {
      const body = authResponse || { code: 0, msg: 'ok', tenant_access_token: 't-fake-token', expire: 7200 };
      return { ok: true, status: 200, json: async () => body };
    }

    if (u.includes('/bitable/v1/apps/')) {
      if (recordsError) {
        return { ok: recordsError.ok !== false, status: recordsError.status || 200, json: async () => recordsError.body };
      }
      const token = u.match(/\/apps\/([^/]+)\//)[1];
      const pages = byToken[token] || [{ items: [], has_more: false }];
      const i = pageIndex.get(token) || 0;
      pageIndex.set(token, i + 1);
      const data = pages[Math.min(i, pages.length - 1)];
      return { ok: true, status: 200, json: async () => ({ code: 0, msg: 'success', data }) };
    }

    throw new Error(`unexpected URL in test: ${url}`);
  };

  return { fetchImpl, calls };
}

const BOTH_BASES = {
  [SS_TOKEN]: [{ items: [SS_01, SS_02], has_more: false }],
  [RDD_TOKEN]: [{ items: [RDD_28, RDD_29], has_more: false }],
};

function providerWith(fakeFetch, opts = {}) {
  return new LarkCalendarProvider({
    config: CONFIG,
    appSecret: FAKE_SECRET,
    fetchImpl: fakeFetch,
    cacheTtlMs: 0, // disable caching unless a test opts in
    ...opts,
  });
}

// Which Base tokens were actually read.
function tokensRead(calls) {
  return [
    ...new Set(
      calls.filter((c) => c.url.includes('/bitable/')).map((c) => c.url.match(/\/apps\/([^/]+)\//)[1])
    ),
  ];
}

// --- 1. SS calendar selection ----------------------------------------------

test('brand "SS" reads ONLY the SS Base', async () => {
  const { fetchImpl, calls } = makeFakeFetch({ byToken: BOTH_BASES });
  const rows = await providerWith(fetchImpl, { brand: 'SS' }).listCampaigns();

  assert.deepStrictEqual(rows.map((r) => r.campaign_id), ['SS-2026-01', 'SS-2026-02']);
  assert.deepStrictEqual(tokensRead(calls), [SS_TOKEN]);
  const readCall = calls.find((c) => c.url.includes('/bitable/'));
  assert.match(readCall.url, /tables\/tblSS\/records/);
  assert.match(readCall.url, /view_id=vewSS/);
});

test('brand selection is case-insensitive', async () => {
  const { fetchImpl, calls } = makeFakeFetch({ byToken: BOTH_BASES });
  const rows = await providerWith(fetchImpl, { brand: 'ss' }).listCampaigns();
  assert.strictEqual(rows.length, 2);
  assert.deepStrictEqual(tokensRead(calls), [SS_TOKEN]);
});

// --- 2. RDD calendar selection ---------------------------------------------

test('brand "RDD" reads ONLY the RDD Base', async () => {
  const { fetchImpl, calls } = makeFakeFetch({ byToken: BOTH_BASES });
  const rows = await providerWith(fetchImpl, { brand: 'RDD' }).listCampaigns();

  assert.deepStrictEqual(rows.map((r) => r.campaign_id), ['RDD-2026-28', 'RDD-2026-29']);
  assert.deepStrictEqual(tokensRead(calls), [RDD_TOKEN]);
  const readCall = calls.find((c) => c.url.includes('/bitable/'));
  assert.match(readCall.url, /tables\/tblRDD\/records/);
  assert.match(readCall.url, /view_id=vewRDD/);
});

// --- 3. unknown brand -------------------------------------------------------

test('an unknown brand fails with a ConfigError naming what IS configured', async () => {
  const { fetchImpl } = makeFakeFetch({ byToken: BOTH_BASES });
  await assert.rejects(
    () => providerWith(fetchImpl, { brand: 'SC' }).listCampaigns(),
    (err) => {
      assert.ok(err instanceof ConfigError);
      assert.match(err.message, /No Lark calendar configured for brand "SC"/);
      assert.match(err.message, /SS, RDD/);
      return true;
    }
  );
});

// --- 4. all-brands query ----------------------------------------------------

test('no brand reads EVERY configured calendar, merged and date-sorted', async () => {
  const { fetchImpl, calls } = makeFakeFetch({ byToken: BOTH_BASES });
  const provider = providerWith(fetchImpl);
  const rows = await provider.listCampaigns();

  assert.deepStrictEqual(rows.map((r) => r.campaign_id), [
    'SS-2026-01',  // 2026-01-05
    'RDD-2026-28', // 2026-01-08
    'SS-2026-02',  // 2026-01-12
    'RDD-2026-29', // 2026-01-20
  ]);
  assert.deepStrictEqual(tokensRead(calls).sort(), [SS_TOKEN, RDD_TOKEN].sort());
  assert.deepStrictEqual(provider.lastSummary.brands, ['SS', 'RDD']);
  assert.strictEqual(provider.lastSummary.written, 4);
  assert.strictEqual(provider.lastSummary.byBrand.SS.written, 2);
  assert.strictEqual(provider.lastSummary.byBrand.RDD.written, 2);
});

test('an explicit brands list reads exactly that set', async () => {
  const { fetchImpl, calls } = makeFakeFetch({ byToken: BOTH_BASES });
  const rows = await providerWith(fetchImpl, { brands: ['RDD'] }).listCampaigns();
  assert.strictEqual(rows.length, 2);
  assert.deepStrictEqual(tokensRead(calls), [RDD_TOKEN]);
});

// --- 5. contamination protection -------------------------------------------

test('a foreign row inside an otherwise-correct calendar is REJECTED, not returned', async () => {
  const warnings = [];
  const { fetchImpl } = makeFakeFetch({
    byToken: { [SS_TOKEN]: [{ items: [SS_01, RDD_28, SS_02], has_more: false }] },
  });
  const provider = providerWith(fetchImpl, {
    brand: 'SS',
    logger: { warn: (m, d) => warnings.push({ m, d }) },
  });

  const rows = await provider.listCampaigns();
  assert.deepStrictEqual(rows.map((r) => r.campaign_id), ['SS-2026-01', 'SS-2026-02']);
  assert.ok(!rows.some((r) => r.brand === 'RDD'), 'no RDD row may leak into an SS read');
  assert.strictEqual(provider.lastSummary.byBrand.SS.foreign, 1);
  assert.deepStrictEqual(provider.lastSummary.byBrand.SS.foreignIds, ['RDD-2026-28']);
  assert.ok(warnings.some((w) => /REJECTED 1 foreign row/.test(w.m)), 'expected a loud warning');
});

test('a calendar containing ONLY foreign rows fails loudly (mis-pointed appToken)', async () => {
  const { fetchImpl } = makeFakeFetch({
    byToken: { [SS_TOKEN]: [{ items: [RDD_28, RDD_29], has_more: false }] },
  });
  await assert.rejects(
    () => providerWith(fetchImpl, { brand: 'SS' }).listCampaigns(),
    (err) => {
      assert.ok(err instanceof ConfigError);
      assert.match(err.message, /contains NO SS campaigns/);
      assert.match(err.message, /points at the wrong Base/);
      return true;
    }
  );
});

test('partitionByBrand skips the guard for the legacy DEFAULT key', () => {
  const rows = [{ campaign_id: 'SS-1', brand: 'SS' }, { campaign_id: 'RDD-1', brand: 'RDD' }];
  assert.strictEqual(partitionByBrand(rows, LEGACY_BRAND_KEY).kept.length, 2);
  assert.strictEqual(partitionByBrand(rows, 'SS').kept.length, 1);
  assert.strictEqual(partitionByBrand(rows, 'SS').foreign.length, 1);
});

// --- 6. multi-calendar configuration loading -------------------------------

function writeTempConfig(doc) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'lark-cfg-'));
  const file = path.join(dir, 'lark-calendar.json');
  fs.writeFileSync(file, JSON.stringify(doc));
  return { dir, file };
}

test('loadLarkConfig reads a brand-keyed calendars map and layers defaults', () => {
  const { dir, file } = writeTempConfig({
    baseUrl: 'https://example.test/open-apis',
    defaults: { pageSize: 250, dateTimezoneOffsetMinutes: 600, cacheTtlMs: 30000 },
    calendars: {
      SS: { appToken: 'a1', tableId: 't1', viewId: 'v1', label: 'SS cal' },
      RDD: { appToken: 'a2', tableId: 't2', viewId: 'v2', pageSize: 100 },
    },
  });

  const cfg = loadLarkConfig({ repoRoot: dir, configPath: file });
  assert.deepStrictEqual(cfg.brands, ['SS', 'RDD']);
  assert.strictEqual(cfg.legacy, false);
  assert.strictEqual(cfg.calendars.SS.pageSize, 250); // from defaults
  assert.strictEqual(cfg.calendars.RDD.pageSize, 100); // per-calendar override wins
  assert.strictEqual(cfg.calendars.SS.dateTimezoneOffsetMinutes, 600);
  assert.strictEqual(cfg.calendars.SS.cacheTtlMs, 30000);
  assert.strictEqual(cfg.calendars.SS.label, 'SS cal');
  assert.strictEqual(cfg.calendars.RDD.label, 'RDD Campaign Calendar'); // derived
  assert.strictEqual(cfg.hasAppSecret, false); // no .env in the temp root
});

test('loadLarkConfig rejects an incomplete calendar entry, naming the brand', () => {
  const { dir, file } = writeTempConfig({ calendars: { SS: { tableId: 't1' } } });
  assert.throws(() => loadLarkConfig({ repoRoot: dir, configPath: file }), (err) => {
    assert.ok(err instanceof ConfigError);
    assert.match(err.message, /Lark calendar "SS" is incomplete/);
    return true;
  });
});

test('loadLarkConfig rejects a config with no calendars at all', () => {
  const { dir, file } = writeTempConfig({ baseUrl: 'https://x.test' });
  assert.throws(() => loadLarkConfig({ repoRoot: dir, configPath: file }), ConfigError);
});

test('getCalendarForBrand resolves case-insensitively and errors clearly', () => {
  const { dir, file } = writeTempConfig({
    calendars: { SS: { appToken: 'a', tableId: 't' } },
  });
  const cfg = loadLarkConfig({ repoRoot: dir, configPath: file });
  assert.strictEqual(getCalendarForBrand(cfg, 'ss').brand, 'SS');
  assert.throws(() => getCalendarForBrand(cfg, 'NOPE'), ConfigError);
});

test('the REAL config/lark-calendar.json declares SS and RDD correctly', () => {
  const cfg = loadLarkConfig();
  assert.ok(cfg.brands.includes('SS'), 'SS calendar must be configured');
  assert.ok(cfg.brands.includes('RDD'), 'RDD calendar must be configured');
  assert.strictEqual(cfg.calendars.SS.tableId, 'tblbfhWEc0KSFiNj');
  assert.strictEqual(cfg.calendars.SS.viewId, 'vewnRfaYtC');
  assert.strictEqual(cfg.calendars.RDD.tableId, 'tblDsQnkLJz4vX0t');
  assert.strictEqual(cfg.calendars.RDD.viewId, 'vewO9kHUNA');
  // Base tokens are 27-character identifiers; a 26-char value is the truncation
  // bug that produced 91402 NOTEXIST. Pin the length so it cannot regress.
  assert.strictEqual(cfg.calendars.SS.appToken.length, 27);
  assert.strictEqual(cfg.calendars.RDD.appToken.length, 27);
});

test('the version-controlled Lark config carries no credential', () => {
  const larkConfigModule = require('../integrations/lark/config');
  const rawText = fs.readFileSync(larkConfigModule.CONFIG_PATH, 'utf8');
  const doc = JSON.parse(rawText);

  // 1. No credential-bearing KEY may exist anywhere in the document.
  const keys = [];
  (function walk(node) {
    if (!node || typeof node !== 'object') return;
    for (const [k, v] of Object.entries(node)) {
      keys.push(k);
      walk(v);
    }
  })(doc);
  for (const k of keys) {
    assert.ok(
      !/^(appSecret|secret|password|credential|accessToken|tenantAccessToken|apiKey)$/i.test(k),
      `config must not carry a credential key: ${k}`
    );
  }

  // 2. The real secret (when configured locally) must not appear in the file.
  //    Compared, never printed.
  const secret = larkConfigModule.resolveAppSecret();
  if (secret) {
    assert.ok(!rawText.includes(secret), 'the App Secret must never appear in the version-controlled config');
  }

  // 3. Only env-var NAMES are stored, not values.
  assert.strictEqual(doc.appSecretEnvVar, 'LARK_APP_SECRET');
  assert.strictEqual(doc.appIdEnvVar, 'LARK_APP_ID');
});

// --- 7. legacy config compatibility ----------------------------------------

test('the legacy single-calendar shape is still accepted, under DEFAULT', () => {
  const { dir, file } = writeTempConfig({
    calendar: { appToken: 'legacyToken', tableId: 'tblLegacy', viewId: 'vewLegacy' },
  });
  const cfg = loadLarkConfig({ repoRoot: dir, configPath: file });
  assert.strictEqual(cfg.legacy, true);
  assert.deepStrictEqual(cfg.brands, [LEGACY_BRAND_KEY]);
  assert.strictEqual(cfg.calendars[LEGACY_BRAND_KEY].appToken, 'legacyToken');
});

test('a legacy calendar carrying an explicit brand keys on that brand', () => {
  const { dir, file } = writeTempConfig({
    calendar: { brand: 'SS', appToken: 'a', tableId: 't' },
  });
  const cfg = loadLarkConfig({ repoRoot: dir, configPath: file });
  assert.deepStrictEqual(cfg.brands, ['SS']);
});

test('a legacy-config read returns rows without tripping the brand guard', async () => {
  const legacyConfig = {
    ...CONFIG,
    legacy: true,
    brands: [LEGACY_BRAND_KEY],
    calendars: {
      [LEGACY_BRAND_KEY]: {
        brand: LEGACY_BRAND_KEY,
        label: 'Legacy',
        appToken: SS_TOKEN,
        tableId: 'tblSS',
        viewId: null,
        pageSize: 500,
        dateTimezoneOffsetMinutes: 0,
        cacheTtlMs: 0,
      },
    },
  };
  const { fetchImpl } = makeFakeFetch({ byToken: { [SS_TOKEN]: [{ items: [SS_01, RDD_28], has_more: false }] } });
  const rows = await new LarkCalendarProvider({
    config: legacyConfig,
    appSecret: FAKE_SECRET,
    fetchImpl,
    cacheTtlMs: 0,
  }).listCampaigns();
  assert.strictEqual(rows.length, 2, 'legacy key has no brand expectation, so nothing is rejected');
});

// --- 8. cache behaviour -----------------------------------------------------

test('a second read inside the TTL is served from cache (no extra HTTP)', async () => {
  const { fetchImpl, calls } = makeFakeFetch({ byToken: BOTH_BASES });
  const provider = providerWith(fetchImpl, { brand: 'SS', cacheTtlMs: 45000 });

  await provider.listCampaigns();
  const afterFirst = calls.filter((c) => c.url.includes('/bitable/')).length;
  const rows = await provider.listCampaigns();
  const afterSecond = calls.filter((c) => c.url.includes('/bitable/')).length;

  assert.strictEqual(afterFirst, 1);
  assert.strictEqual(afterSecond, 1, 'cached read must not issue another request');
  assert.strictEqual(rows.length, 2);
  assert.strictEqual(provider.lastSummary.byBrand.SS.cached, true);
});

test('the cache expires after the TTL and re-reads', async () => {
  let now = 1_000_000;
  const { fetchImpl, calls } = makeFakeFetch({ byToken: BOTH_BASES });
  const provider = providerWith(fetchImpl, {
    brand: 'SS',
    cacheTtlMs: 45000,
    nowImpl: () => now,
  });

  await provider.listCampaigns();
  now += 44_000; // still inside the TTL
  await provider.listCampaigns();
  assert.strictEqual(calls.filter((c) => c.url.includes('/bitable/')).length, 1);

  now += 2_000; // now past 45s
  await provider.listCampaigns();
  assert.strictEqual(calls.filter((c) => c.url.includes('/bitable/')).length, 2);
});

test('invalidateCache() forces a fresh read', async () => {
  const { fetchImpl, calls } = makeFakeFetch({ byToken: BOTH_BASES });
  const provider = providerWith(fetchImpl, { brand: 'SS', cacheTtlMs: 45000 });

  await provider.listCampaigns();
  provider.invalidateCache();
  await provider.listCampaigns();
  assert.strictEqual(calls.filter((c) => c.url.includes('/bitable/')).length, 2);
});

test('each brand caches independently', async () => {
  const { fetchImpl, calls } = makeFakeFetch({ byToken: BOTH_BASES });
  const provider = providerWith(fetchImpl, { cacheTtlMs: 45000 });

  await provider.listCampaigns(); // both bases
  assert.strictEqual(calls.filter((c) => c.url.includes('/bitable/')).length, 2);
  provider.invalidateCache('SS');
  await provider.listCampaigns(); // only SS re-read
  assert.strictEqual(calls.filter((c) => c.url.includes('/bitable/')).length, 3);
});

// --- 9. pagination ----------------------------------------------------------

test('follows has_more / page_token pagination and concatenates records', async () => {
  const { fetchImpl, calls } = makeFakeFetch({
    byToken: {
      [SS_TOKEN]: [
        { items: [SS_01], has_more: true, page_token: 'PAGE2', total: 2 },
        { items: [SS_02], has_more: false, total: 2 },
      ],
    },
  });
  const provider = providerWith(fetchImpl, { brand: 'SS' });

  const rows = await provider.listCampaigns();
  assert.strictEqual(rows.length, 2);

  const reads = calls.filter((c) => c.url.includes('/bitable/'));
  assert.strictEqual(reads.length, 2, 'expected two paginated reads');
  assert.ok(!reads[0].url.includes('page_token'), 'first page carries no page_token');
  assert.match(reads[1].url, /page_token=PAGE2/);
  assert.strictEqual(provider.lastSummary.byBrand.SS.pages, 2);
});

// --- 10. field mapping (reuses xlsx-mapping semantics) ----------------------

test('field mapping preserves the documented XLSX quirks', async () => {
  const { fetchImpl } = makeFakeFetch({ byToken: BOTH_BASES });
  const [row] = await providerWith(fetchImpl, { brand: 'SS' }).listCampaigns();

  assert.strictEqual(row.campaign_id, 'SS-2026-01');
  assert.strictEqual(row.brand, 'SS'); // derived from the campaign_id prefix
  assert.strictEqual(row.campaign_name, 'New Year Safety Reset'); // rich-text flattened
  // Lark topic_category → topic_category_slug (slugged)
  assert.strictEqual(row.topic_category_slug, 'promotional-sale');
  // Lark product_categories → the system's topic_category
  assert.strictEqual(row.topic_category, 'Hi-Vis Workwear');
  assert.strictEqual(row.send_date, '2026-01-05');
  assert.deepStrictEqual(row.promotion, { code: 'SAFE10', text: '10% off hi-vis' });
  // audience_type routes the single audience_name to segment vs list
  assert.strictEqual(row.segment, '60D Active Customers');
  assert.strictEqual(row.list, null);
  // Planning extras survive for the AI/QA layers
  assert.strictEqual(row.key_topic, 'New year safety audit');
  assert.strictEqual(row.status, 'Planned');
});

test('never invents preview_text or send_time (absent in the Lark source)', async () => {
  const { fetchImpl } = makeFakeFetch({ byToken: BOTH_BASES });
  const [row] = await providerWith(fetchImpl, { brand: 'SS' }).listCampaigns();
  assert.strictEqual(row.preview_text, null);
  assert.strictEqual(row.send_time, null);
});

test('records with optional fields absent map to nulls, never to invented values', async () => {
  const { fetchImpl } = makeFakeFetch({ byToken: { [SS_TOKEN]: [{ items: [SS_02], has_more: false }] } });
  const [row] = await providerWith(fetchImpl, { brand: 'SS' }).listCampaigns();

  assert.strictEqual(row.campaign_id, 'SS-2026-02');
  assert.strictEqual(row.promotion, null); // no promo_code / promo_text
  assert.strictEqual(row.subject_line, null);
  assert.strictEqual(row.list, 'SS Subscribers');
  assert.strictEqual(row.segment, null);
});

test('date fields are epoch-aware (not misread as Excel serials)', () => {
  const ms = Date.UTC(2026, 0, 5);
  assert.strictEqual(larkDateToDate(ms).toISOString().slice(0, 10), '2026-01-05');
  assert.strictEqual(larkDateToDate(Math.floor(ms / 1000)).toISOString().slice(0, 10), '2026-01-05');
  const shifted = larkDateToDate(Date.UTC(2026, 0, 4, 13, 0, 0), 660);
  assert.strictEqual(shifted.toISOString().slice(0, 10), '2026-01-05');
  assert.strictEqual(larkDateToDate(null), null);
});

test('larkFieldToPrimitive flattens every Lark cell shape', () => {
  assert.strictEqual(larkFieldToPrimitive('plain'), 'plain');
  assert.strictEqual(larkFieldToPrimitive(42), 42);
  assert.strictEqual(larkFieldToPrimitive([{ type: 'text', text: 'a' }, { type: 'text', text: 'b' }]), 'a, b');
  assert.strictEqual(larkFieldToPrimitive({ link: 'https://x', text: 'X' }), 'X');
  assert.strictEqual(larkFieldToPrimitive([{ name: 'Vic', id: 'ou_1' }]), 'Vic');
  assert.strictEqual(larkFieldToPrimitive({ type: 1, value: ['v'] }), 'v');
  assert.strictEqual(larkFieldToPrimitive(null), null);
  assert.strictEqual(larkFieldToPrimitive([]), null);
});

test('field lookup is case/whitespace-insensitive and absent fields are null', () => {
  const get = makeFieldGetter({ ' Campaign_ID ': 'SS-2026-07' });
  assert.strictEqual(get('campaign_id'), 'SS-2026-07');
  assert.strictEqual(get('promo_code'), null);
});

test('divider, undated and popup rows are skipped by the shared classifyRow rules', () => {
  const { campaigns, skipped, skipReasons } = mapRecords([SS_01, DIVIDER, NO_DATE, POPUP]);
  assert.strictEqual(campaigns.length, 1);
  assert.strictEqual(skipped.length, 3);
  assert.ok(Object.keys(skipReasons).some((r) => /divider/.test(r)));
  assert.ok(Object.keys(skipReasons).some((r) => /scheduled_date/.test(r)));
  assert.ok(Object.keys(skipReasons).some((r) => /popup/.test(r)));
});

test('an empty table yields [] (not an error, not fabricated data)', async () => {
  const { fetchImpl } = makeFakeFetch({ byToken: { [SS_TOKEN]: [{ items: [], has_more: false, total: 0 }] } });
  const provider = providerWith(fetchImpl, { brand: 'SS' });
  assert.deepStrictEqual(await provider.listCampaigns(), []);
  assert.strictEqual(provider.lastSummary.written, 0);
});

// --- authentication ---------------------------------------------------------

test('authentication failure surfaces an IntegrationError without leaking the secret', async () => {
  const { fetchImpl } = makeFakeFetch({
    byToken: BOTH_BASES,
    authResponse: { code: 10003, msg: 'invalid app_secret' },
  });
  await assert.rejects(
    () => providerWith(fetchImpl, { brand: 'SS' }).listCampaigns(),
    (err) => {
      assert.ok(err instanceof IntegrationError, 'expected IntegrationError');
      assert.match(err.message, /Lark authentication failed/);
      assert.ok(!err.message.includes(FAKE_SECRET), 'secret must not appear in the message');
      assert.ok(!JSON.stringify(err.details).includes(FAKE_SECRET), 'secret must not appear in details');
      return true;
    }
  );
});

test('ONE token exchange serves every calendar in a multi-brand read', async () => {
  const { fetchImpl, calls } = makeFakeFetch({ byToken: BOTH_BASES });
  await providerWith(fetchImpl).listCampaigns(); // both bases

  const authCalls = calls.filter((c) => c.url.includes('/auth/v3/'));
  assert.strictEqual(authCalls.length, 1, 'one app, one token, many Bases');
  assert.strictEqual(calls.filter((c) => c.url.includes('/bitable/')).length, 2);
});

test('an unresolvable App Secret never yields a silent empty read', async () => {
  // On a machine with a populated .env, resolveAppSecret() finds the real secret
  // and the run proceeds to the (blocked) transport; on a bare machine it stops
  // at config resolution. Either way the contract is the same: fail loudly.
  // The thrown message deliberately avoids the retryable-network pattern so this
  // test fails fast instead of exercising the backoff ladder.
  const provider = new LarkCalendarProvider({
    config: CONFIG,
    appSecret: '',
    fetchImpl: () => {
      throw new Error('BLOCKED-BY-TEST');
    },
  });
  await assert.rejects(
    () => provider.listCampaigns(),
    (err) => err instanceof ConfigError || err instanceof IntegrationError
  );
});

// --- API error propagation --------------------------------------------------

test('a Lark API error code propagates as IntegrationError with the code', async () => {
  const { fetchImpl } = makeFakeFetch({
    recordsError: { ok: true, status: 200, body: { code: 91402, msg: 'NOTEXIST' } },
  });
  await assert.rejects(
    () => providerWith(fetchImpl, { brand: 'SS' }).listCampaigns(),
    (err) => {
      assert.ok(err instanceof IntegrationError);
      assert.match(err.message, /Lark Base read failed \(code 91402\)/);
      assert.strictEqual(err.details.code, 91402);
      return true;
    }
  );
});

test('a permission error (99991672 / 403) propagates unchanged for the operator to action', async () => {
  const { fetchImpl } = makeFakeFetch({
    recordsError: { ok: false, status: 403, body: { code: 99991672, msg: 'Access denied: no permission to the app' } },
  });
  await assert.rejects(
    () => providerWith(fetchImpl, { brand: 'RDD' }).listCampaigns(),
    (err) => err instanceof IntegrationError && /99991672/.test(err.message)
  );
});

test('a wrong table (no campaign_id anywhere) fails loudly instead of returning []', async () => {
  const { fetchImpl } = makeFakeFetch({
    byToken: { [SS_TOKEN]: [{ items: [record({ some_other_field: 'x' })], has_more: false }] },
  });
  await assert.rejects(() => providerWith(fetchImpl, { brand: 'SS' }).listCampaigns(), ConfigError);
});

test('HTTP 5xx is retried and then raised as IntegrationError', async () => {
  let hits = 0;
  const fetchImpl = async (url) => {
    if (String(url).includes('/auth/v3/')) {
      return { ok: true, status: 200, json: async () => ({ code: 0, tenant_access_token: 't', expire: 7200 }) };
    }
    hits += 1;
    return { ok: false, status: 503, json: async () => ({ code: 1, msg: 'unavailable' }) };
  };

  const auth = new LarkAuth({ baseUrl: CONFIG.baseUrl, appId: 'x', appSecret: FAKE_SECRET, fetchImpl });
  const client = new LarkBitableClient({
    baseUrl: CONFIG.baseUrl,
    auth,
    fetchImpl,
    maxRetries: 2,
    sleepImpl: async () => {},
  });

  await assert.rejects(
    () => client.listRecords({ appToken: 'a', tableId: 't' }),
    (err) => err instanceof IntegrationError && /503/.test(err.message)
  );
  assert.strictEqual(hits, 3, 'initial attempt + 2 retries');
});

// --- 12. read-only guarantee ------------------------------------------------

test('every Lark Base request is a GET — no write is ever issued, across all brands', async () => {
  const { fetchImpl, calls } = makeFakeFetch({
    byToken: {
      [SS_TOKEN]: [
        { items: [SS_01], has_more: true, page_token: 'P2' },
        { items: [SS_02], has_more: false },
      ],
      [RDD_TOKEN]: [{ items: [RDD_28, RDD_29], has_more: false }],
    },
  });
  await providerWith(fetchImpl).listCampaigns();

  const bitableCalls = calls.filter((c) => c.url.includes('/bitable/'));
  assert.ok(bitableCalls.length >= 3);
  for (const c of bitableCalls) {
    assert.strictEqual(c.method, 'GET', `expected GET, got ${c.method} for ${c.url}`);
    assert.strictEqual(c.body, undefined, 'a read must not carry a request body');
  }
  const nonGet = calls.filter((c) => c.method !== 'GET');
  assert.strictEqual(nonGet.length, 1);
  assert.match(nonGet[0].url, /\/auth\/v3\/tenant_access_token\/internal$/);

  for (const forbidden of ['createRecord', 'updateRecord', 'deleteRecord', 'batchCreate', 'post', 'put', 'patch']) {
    assert.strictEqual(
      typeof LarkBitableClient.prototype[forbidden],
      'undefined',
      `LarkBitableClient must not expose ${forbidden}()`
    );
  }
});

// --- 11. Calendar Service compatibility -------------------------------------

test('single-brand provider output drops straight into the Calendar Service', async () => {
  const { fetchImpl } = makeFakeFetch({ byToken: BOTH_BASES });
  const svc = createCalendarService({ provider: providerWith(fetchImpl, { brand: 'SS' }) });

  const all = await svc.listCampaigns();
  assert.strictEqual(all.length, 2);
  for (const f of FIELDS) assert.ok(f in all[0], `missing core field ${f}`);

  assert.strictEqual((await svc.getCampaignById('SS-2026-02')).campaign_name, 'Winter PPE');
  assert.strictEqual((await svc.getCampaignByWeek('2026-W02', { brand: 'SS' })).campaign_id, 'SS-2026-01');
});

test('multi-brand provider supports the Service\'s cross-brand queries', async () => {
  const { fetchImpl } = makeFakeFetch({ byToken: BOTH_BASES });
  const svc = createCalendarService({ provider: providerWith(fetchImpl, { cacheTtlMs: 45000 }) });

  assert.strictEqual((await svc.listCampaigns()).length, 4);
  assert.strictEqual((await svc.listCampaigns({ brand: 'SS' })).length, 2);
  assert.strictEqual((await svc.listCampaigns({ brand: 'RDD' })).length, 2);
  assert.strictEqual((await svc.getCampaignById('RDD-2026-29')).campaign_name, 'Snap Frames');
  // Week 2026-W03 contains RDD-2026-29 (2026-01-20) only.
  assert.strictEqual((await svc.getCampaignByWeek('2026-W04', { brand: 'RDD' })).campaign_id, 'RDD-2026-29');
  assert.strictEqual(
    (await svc.getNextCampaign({ brand: 'SS', now: new Date('2026-01-06') })).campaign_id,
    'SS-2026-02'
  );
});

test('API rows carry the same key set as the XLSX importer produces', async () => {
  const { fetchImpl } = makeFakeFetch({ byToken: BOTH_BASES });
  const [apiRow] = await providerWith(fetchImpl, { brand: 'SS' }).listCampaigns();

  const mappingModule = require('../integrations/calendar/import/xlsx-mapping');
  const xlsxRow = mappingModule.mapRow(() => null);
  assert.deepStrictEqual(Object.keys(apiRow).sort(), Object.keys(xlsxRow).sort());
});
