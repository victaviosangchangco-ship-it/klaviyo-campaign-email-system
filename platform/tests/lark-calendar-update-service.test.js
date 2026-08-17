// Guarded Campaign Calendar UPDATE service + CLI arg parsing — offline unit tests.
// Injects a fake config + a real writer over a fake reader/fetch. No disk, no net.

'use strict';

const { test } = require('node:test');
const assert = require('node:assert');

const { createCalendarUpdater } = require('../integrations/lark/calendar-update-service');
const { LarkCalendarWriter, encodeCalendarDate } = require('../integrations/lark/calendar-writer');
const { parseArgs } = require('../engine/calendar-cli');
const { ConfigError } = require('../common/errors');

const RDD_CAL = { brand: 'RDD', label: 'RDD', appToken: 'AppTokenRDD', tableId: 'tblRDD', viewId: 'vewRDD', pageSize: 500, dateTimezoneOffsetMinutes: 660, cacheTtlMs: 0 };
const SS_CAL = { ...RDD_CAL, brand: 'SS', appToken: 'AppTokenSS', tableId: 'tblSS' };
const CONFIG = {
  baseUrl: 'https://open.larksuite.test/open-apis', hasAppId: true, appId: 'app', appIdEnvVar: 'LARK_APP_ID',
  appSecretEnvVar: 'LARK_APP_SECRET', envPath: '.env', calendars: { RDD: RDD_CAL, SS: SS_CAL }, brands: ['RDD', 'SS'],
};
const makeAuth = () => ({ getTenantAccessToken: async () => 't', invalidate() {} });
const makeReader = (records) => ({ listRecords: async () => ({ records, pages: 1, total: records.length }) });

// An RDD Base whose rows include one contaminating SS-prefixed record.
const RDD_RECORDS = [
  { record_id: 'recRDD36', fields: { campaign_id: 'RDD-2026-36', name: "Father's Day", status: 'pending', scheduled_date: 1787760000000 } },
  { record_id: 'recSSbad', fields: { campaign_id: 'SS-2026-01', name: 'foreign row' } },
];

function makeUpdater({ brand = 'RDD', calendar = RDD_CAL, records = RDD_RECORDS, onWrite } = {}) {
  const calls = [];
  const reader = makeReader(records);
  const fetchImpl = async (url, init = {}) => {
    calls.push({ url: String(url), method: (init.method || 'GET').toUpperCase(), body: init.body });
    onWrite && onWrite(init);
    return { ok: true, status: 200, json: async () => ({ code: 0, msg: 'success', data: {} }) };
  };
  const writer = new LarkCalendarWriter({ baseUrl: CONFIG.baseUrl, auth: makeAuth(), brand, calendar, reader, fetchImpl });
  const updater = createCalendarUpdater({ brand, config: CONFIG, reader, writer });
  return { updater, calls };
}

// --- dry-run planning (no write) -------------------------------------------

test('planUpdate produces CURRENT -> PROPOSED and writes NOTHING', async () => {
  const { updater, calls } = makeUpdater();
  const res = await updater.planUpdate({ campaignId: 'RDD-2026-36', set: { status: 'planned' }, reason: 'confirmed' });
  assert.strictEqual(res.dryRun, true);
  assert.strictEqual(res.record.campaignId, 'RDD-2026-36');
  const ch = res.changes.find((c) => c.field === 'status');
  assert.strictEqual(ch.current, 'pending');
  assert.strictEqual(ch.proposed, 'planned');
  assert.strictEqual(calls.filter((c) => c.method !== 'GET').length, 0, 'a plan must not write');
});

test('planUpdate encodes a human YYYY-MM-DD date and shows it decoded', async () => {
  const { updater } = makeUpdater();
  const res = await updater.planUpdate({ campaignId: 'RDD-2026-36', set: { scheduled_date: '2026-09-02' } });
  const ch = res.changes.find((c) => c.field === 'scheduled_date');
  assert.strictEqual(ch.current, '2026-08-27');            // decoded from 1787760000000
  assert.strictEqual(ch.proposed, '2026-09-02');           // decoded display
  assert.strictEqual(res.plan.items[0].fields.scheduled_date, encodeCalendarDate('2026-09-02')); // encoded payload
});

// --- validation / STOP conditions ------------------------------------------

test('planUpdate rejects an unknown campaign_id', async () => {
  const { updater } = makeUpdater();
  await assert.rejects(() => updater.planUpdate({ campaignId: 'RDD-2026-99', set: { status: 'x' } }),
    (e) => e instanceof ConfigError && /No RDD calendar record/.test(e.message));
});

test('planUpdate rejects a cross-brand record (SS row inside the RDD Base)', async () => {
  const { updater } = makeUpdater();
  await assert.rejects(() => updater.planUpdate({ recordId: 'recSSbad', set: { status: 'x' } }),
    (e) => e instanceof ConfigError && /is brand SS, not RDD/.test(e.message));
});

test('planUpdate rejects a field outside the calendar schema', async () => {
  const { updater } = makeUpdater();
  await assert.rejects(() => updater.planUpdate({ campaignId: 'RDD-2026-36', set: { secret_column: 'nope' } }),
    (e) => e instanceof ConfigError && /not in the Campaign Calendar schema/.test(e.message));
});

test('planUpdate rejects an empty set', async () => {
  const { updater } = makeUpdater();
  await assert.rejects(() => updater.planUpdate({ campaignId: 'RDD-2026-36', set: {} }), ConfigError);
});

test('an unknown brand cannot be targeted', () => {
  assert.throws(() => createCalendarUpdater({ brand: 'NOPE', config: CONFIG, reader: makeReader([]), writer: {} }),
    (e) => e instanceof ConfigError);
});

// --- write gating + verify --------------------------------------------------

test('apply refuses without confirm:true — nothing is written', async () => {
  const { updater, calls } = makeUpdater();
  const { plan } = await updater.planUpdate({ campaignId: 'RDD-2026-36', set: { status: 'planned' } });
  await assert.rejects(() => updater.apply({ plan }), ConfigError);
  await assert.rejects(() => updater.apply({ plan, confirm: false }), ConfigError);
  assert.strictEqual(calls.filter((c) => c.method !== 'GET').length, 0);
});

test('apply with confirm:true writes then re-reads and verifies', async () => {
  // Reader returns the post-write state (status already 'planned') so verify passes.
  const after = [{ record_id: 'recRDD36', fields: { campaign_id: 'RDD-2026-36', status: 'planned' } }];
  const { updater, calls } = makeUpdater({ records: after });
  const { plan } = await updater.planUpdate({ campaignId: 'RDD-2026-36', set: { status: 'planned' } });
  const { ok, verify } = await updater.apply({ plan, confirm: true });
  assert.strictEqual(ok, true);
  assert.strictEqual(verify.ok, true);
  assert.ok(calls.some((c) => c.method === 'PUT'), 'single update goes through PUT');
});

// --- brand isolation --------------------------------------------------------

test('an SS updater targets the SS Base only', async () => {
  const { updater, calls } = makeUpdater({
    brand: 'SS', calendar: SS_CAL,
    records: [{ record_id: 'recSS1', fields: { campaign_id: 'SS-2026-01', status: 'pending' } }],
  });
  const res = await updater.planUpdate({ campaignId: 'SS-2026-01', set: { status: 'planned' } });
  assert.strictEqual(res.brand, 'SS');
  assert.strictEqual(res.plan.appToken, 'AppTokenSS');
  await updater.apply({ plan: res.plan, confirm: true });
  assert.ok(calls.some((c) => /apps\/AppTokenSS\/tables\/tblSS\//.test(c.url) && c.method === 'PUT'));
});

// --- CLI arg parsing --------------------------------------------------------

test('CLI defaults to DRY RUN (write=false) and parses repeated --set', () => {
  const o = parseArgs(['update', '--brand', 'RDD', '--campaign', 'RDD-2026-37', '--set', 'status=planned', '--set', 'notes=hello world']);
  assert.strictEqual(o.command, 'update');
  assert.strictEqual(o.brand, 'RDD');
  assert.strictEqual(o.campaign, 'RDD-2026-37');
  assert.strictEqual(o.write, false, 'dry-run is the default');
  assert.deepStrictEqual(o.set, { status: 'planned', notes: 'hello world' });
});

test('CLI --write flips write on', () => {
  const o = parseArgs(['update', '--brand', 'SS', '--record-id', 'recX', '--set', 'status=sent', '--write']);
  assert.strictEqual(o.write, true);
  assert.strictEqual(o.recordId, 'recX');
});
