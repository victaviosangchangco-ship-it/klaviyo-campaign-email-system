// Content Calendar Service + providers — offline unit tests (no network, no files
// unless explicitly created in a temp dir).

'use strict';

const { test } = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const os = require('os');
const path = require('path');

const { createCalendarService, normalizeCampaign, FIELDS } = require('../integrations/calendar/calendar-service');
const { JsonCalendarProvider } = require('../integrations/calendar/providers/json-provider');
const { LarkCalendarProvider } = require('../integrations/calendar/providers/lark-provider');
const { CsvCalendarProvider } = require('../integrations/calendar/providers/csv-provider');
const { PlatformError, ConfigError } = require('../common/errors');

// Sample rows (in-memory) used across service tests.
const SAMPLE = {
  campaigns: [
    { campaign_id: 'RDD-2026-W33', brand: 'RDD', campaign_type: 'weekly', campaign_name: 'Workspace', topic_category: 'Workspace', subject_line: 'S33', preview_text: 'P33', send_date: '2026-08-13', send_time: '10:00', promotion: null, segment: null, list: 'Email List' },
    { campaign_id: 'RDD-2026-W34', brand: 'RDD', campaign_type: 'weekly', campaign_name: 'Acrylic', topic_category: 'Acrylic', subject_line: 'S34', preview_text: 'P34', send_date: '2026-08-20', send_time: '10:00' },
    { campaign_id: 'SS-2026-W33', brand: 'SS', campaign_type: 'weekly', campaign_name: 'Safety', topic_category: 'Safety', subject_line: 'S', preview_text: 'P', send_date: '2026-08-13', send_time: '11:00', list: 'Safety Sector Customer List' },
  ],
};

function svcFromData(data = SAMPLE) {
  return createCalendarService({ provider: new JsonCalendarProvider({ data }) });
}

// --- normalization ---------------------------------------------------------

test('normalizeCampaign returns exactly the 12 typed fields, null-filled', () => {
  const c = normalizeCampaign({ campaign_id: 'X', brand: 'RDD' });
  assert.strictEqual(Object.keys(c).length, 12);
  assert.deepStrictEqual(Object.keys(c).sort(), [...FIELDS].sort());
  assert.strictEqual(c.subject_line, null);
  assert.strictEqual(c.campaign_id, 'X');
});

// --- JSON provider ---------------------------------------------------------

test('JsonCalendarProvider reads campaigns from injected data', async () => {
  const rows = await new JsonCalendarProvider({ data: SAMPLE }).listCampaigns();
  assert.strictEqual(rows.length, 3);
});

test('JsonCalendarProvider reads campaigns from a file', async () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'cal-'));
  const file = path.join(dir, 'cal.json');
  fs.writeFileSync(file, JSON.stringify(SAMPLE));
  const rows = await new JsonCalendarProvider({ filePath: file }).listCampaigns();
  assert.strictEqual(rows.length, 3);
});

test('JsonCalendarProvider yields [] when there is no campaigns array', async () => {
  assert.deepStrictEqual(await new JsonCalendarProvider({ data: { slots: [] } }).listCampaigns(), []);
});

// --- provider status --------------------------------------------------------
// The Lark provider is NO LONGER a stub — it is implemented against the Lark
// Base API (see lark-provider.test.js for its behavioural suite). This test was
// deliberately updated, not deleted: it now pins the *replacement* contract —
// unconfigured credentials must fail as a ConfigError (actionable setup problem),
// never as a silent empty read. CSV remains an unimplemented stub.

test('CsvCalendarProvider still throws NotImplemented (read-only stub)', async () => {
  await assert.rejects(() => new CsvCalendarProvider().listCampaigns(), PlatformError);
});

test('LarkCalendarProvider fails with ConfigError when credentials are not configured', async () => {
  // Config injected so the test never reads the real .env or touches the network.
  const provider = new LarkCalendarProvider({
    config: {
      baseUrl: 'https://example.invalid/open-apis',
      appId: null,
      appIdEnvVar: 'LARK_APP_ID',
      appSecretEnvVar: 'LARK_APP_SECRET',
      envPath: '/tmp/.env',
      hasAppId: false,
      hasAppSecret: false,
      legacy: false,
      brands: ['SS'],
      calendars: {
        SS: {
          brand: 'SS',
          label: 'SS',
          appToken: 'app',
          tableId: 'tbl',
          viewId: null,
          pageSize: 500,
          dateTimezoneOffsetMinutes: 0,
          cacheTtlMs: 0,
        },
      },
    },
  });
  await assert.rejects(() => provider.listCampaigns(), ConfigError);
});

// --- service: listCampaigns ------------------------------------------------

test('listCampaigns returns all, or filtered by brand/type', async () => {
  const svc = svcFromData();
  assert.strictEqual((await svc.listCampaigns()).length, 3);
  assert.strictEqual((await svc.listCampaigns({ brand: 'RDD' })).length, 2);
  assert.strictEqual((await svc.listCampaigns({ brand: 'rdd', type: 'weekly' })).length, 2);
  assert.strictEqual((await svc.listCampaigns({ brand: 'SS' })).length, 1);
});

// --- service: getCampaignById ----------------------------------------------

test('getCampaignById returns the typed campaign or null', async () => {
  const svc = svcFromData();
  assert.strictEqual((await svc.getCampaignById('RDD-2026-W34')).campaign_name, 'Acrylic');
  assert.strictEqual(await svc.getCampaignById('NOPE'), null);
  assert.strictEqual(await svc.getCampaignById(''), null);
});

// --- service: getCampaignByWeek --------------------------------------------

test('getCampaignByWeek matches on the ISO week of send_date (+brand filter)', async () => {
  const svc = svcFromData();
  // 2026-08-13 → W33; two brands share it, so filter by brand.
  assert.strictEqual((await svc.getCampaignByWeek('2026-W33', { brand: 'RDD' })).campaign_id, 'RDD-2026-W33');
  assert.strictEqual((await svc.getCampaignByWeek('2026-W33', { brand: 'SS' })).campaign_id, 'SS-2026-W33');
  assert.strictEqual((await svc.getCampaignByWeek('2026-W34')).campaign_id, 'RDD-2026-W34');
  assert.strictEqual(await svc.getCampaignByWeek('2026-W40'), null);
  assert.strictEqual(await svc.getCampaignByWeek(''), null);
});

// --- service: getNextCampaign ----------------------------------------------

test('getNextCampaign returns the soonest upcoming on/after now', async () => {
  const svc = svcFromData();
  // Before everything → W33 is next.
  assert.strictEqual((await svc.getNextCampaign({ brand: 'RDD', now: new Date('2026-08-01') })).campaign_id, 'RDD-2026-W33');
  // On the W33 send date → still W33 (inclusive).
  assert.strictEqual((await svc.getNextCampaign({ brand: 'RDD', now: new Date('2026-08-13') })).campaign_id, 'RDD-2026-W33');
  // After W33 → W34.
  assert.strictEqual((await svc.getNextCampaign({ brand: 'RDD', now: new Date('2026-08-14') })).campaign_id, 'RDD-2026-W34');
  // Past everything → null.
  assert.strictEqual(await svc.getNextCampaign({ brand: 'RDD', now: new Date('2026-12-01') }), null);
});

// --- service: DI guard -----------------------------------------------------

test('createCalendarService requires a provider with listCampaigns()', () => {
  assert.throws(() => createCalendarService({}), PlatformError);
  assert.throws(() => createCalendarService({ provider: {} }), PlatformError);
});

// --- the real config file loads through the default provider ---------------

test('default JsonCalendarProvider reads the real config/content-calendar.json', async () => {
  const svc = createCalendarService({ provider: new JsonCalendarProvider() });
  const rdd = await svc.listCampaigns({ brand: 'RDD' });
  assert.ok(rdd.length >= 1, 'expected at least one RDD sample campaign in the config');
  for (const c of rdd) assert.strictEqual(Object.keys(c).length, 12);
});
