// Guarded Lark writer — single-record PUT, re-read verification, and
// idempotency-safe retry. Offline: fake fetch + fake reader, no network, no disk.

'use strict';

const { test } = require('node:test');
const assert = require('node:assert');

const { LarkCalendarWriter } = require('../integrations/lark/calendar-writer');
const { ConfigError } = require('../common/errors');

const RDD_CAL = {
  brand: 'RDD', label: 'RDD', appToken: 'AppTokenRDD', tableId: 'tblRDD', viewId: 'vewRDD',
  pageSize: 500, dateTimezoneOffsetMinutes: 660, cacheTtlMs: 0,
};
const makeAuth = (onInvalidate) => ({ getTenantAccessToken: async () => 't-fake', invalidate() { onInvalidate && onInvalidate(); } });
const makeReader = (records) => ({ listRecords: async () => ({ records, pages: 1, total: records.length }) });

function writerWith({ records, fetchImpl, auth, sleepImpl } = {}) {
  return new LarkCalendarWriter({
    baseUrl: 'https://open.larksuite.test/open-apis',
    auth: auth || makeAuth(),
    brand: 'RDD',
    calendar: RDD_CAL,
    reader: makeReader(records || [{ record_id: 'recRDD36', fields: { campaign_id: 'RDD-2026-36', status: 'pending' } }]),
    fetchImpl,
    backoffBaseMs: 0,
    sleepImpl: sleepImpl || (async () => {}),
  });
}
const ok200 = () => ({ ok: true, status: 200, json: async () => ({ code: 0, msg: 'success', data: {} }) });

// --- single-record PUT ------------------------------------------------------

test('applyUpdateOne issues a PUT to /records/{record_id} with only { fields }', async () => {
  const calls = [];
  const writer = writerWith({ fetchImpl: async (url, init = {}) => { calls.push({ url: String(url), method: (init.method || 'GET').toUpperCase(), body: init.body }); return ok200(); } });
  const plan = await writer.planUpdates([{ recordId: 'recRDD36', fields: { status: 'planned' } }]);
  await writer.applyUpdateOne(plan, { confirm: true });
  const put = calls.find((c) => c.method === 'PUT');
  assert.ok(put, 'a PUT must be issued');
  assert.match(put.url, /apps\/AppTokenRDD\/tables\/tblRDD\/records\/recRDD36$/);
  assert.deepStrictEqual(Object.keys(JSON.parse(put.body)), ['fields']);
  assert.deepStrictEqual(JSON.parse(put.body).fields, { status: 'planned' });
});

test('applyUpdateOne refuses without confirm:true — writes nothing', async () => {
  const calls = [];
  const writer = writerWith({ fetchImpl: async (u, i = {}) => { calls.push((i.method || 'GET').toUpperCase()); return ok200(); } });
  const plan = await writer.planUpdates([{ recordId: 'recRDD36', fields: { status: 'planned' } }]);
  await assert.rejects(() => writer.applyUpdateOne(plan), ConfigError);
  assert.strictEqual(calls.filter((m) => m === 'PUT').length, 0);
});

test('applyUpdateOne refuses a multi-record plan (batch must use applyUpdates)', async () => {
  const writer = writerWith({ records: [
    { record_id: 'recRDD36', fields: { campaign_id: 'RDD-2026-36' } },
    { record_id: 'recRDD37', fields: { campaign_id: 'RDD-2026-37' } },
  ], fetchImpl: async () => ok200() });
  const plan = await writer.planUpdates([
    { recordId: 'recRDD36', fields: { status: 'a' } },
    { recordId: 'recRDD37', fields: { status: 'b' } },
  ]);
  await assert.rejects(() => writer.applyUpdateOne(plan, { confirm: true }), (e) => /exactly one record/.test(e.message));
});

// --- re-read verification (spec §6) ----------------------------------------

test('verifyWrite confirms when the re-read matches the requested values', async () => {
  const after = [{ record_id: 'recRDD36', fields: { campaign_id: 'RDD-2026-36', status: 'planned', scheduled_date: 1788278400000 } }];
  const writer = writerWith({ records: after, fetchImpl: async () => ok200() });
  const plan = await writer.planUpdates([{ recordId: 'recRDD36', fields: { status: 'planned', scheduled_date: 1788278400000 } }]);
  const v = await writer.verifyWrite(plan);
  assert.strictEqual(v.ok, true);
  assert.strictEqual(v.verified, 2);
  assert.strictEqual(v.mismatches.length, 0);
});

test('verifyWrite FLAGS a mismatch when the Base value differs after write (2xx is not trusted)', async () => {
  const stale = [{ record_id: 'recRDD36', fields: { campaign_id: 'RDD-2026-36', status: 'pending' } }];
  const writer = writerWith({ records: stale, fetchImpl: async () => ok200() });
  const plan = await writer.planUpdates([{ recordId: 'recRDD36', fields: { status: 'planned' } }]);
  const v = await writer.verifyWrite(plan);
  assert.strictEqual(v.ok, false);
  assert.strictEqual(v.mismatches.length, 1);
  assert.strictEqual(v.mismatches[0].field, 'status');
  assert.strictEqual(v.mismatches[0].requested, 'planned');
});

test('verifyWrite treats a rich-text array the same as its plain string', async () => {
  const after = [{ record_id: 'recRDD36', fields: { campaign_id: 'RDD-2026-36', notes: [{ type: 'text', text: 'theme confirmed' }] } }];
  const writer = writerWith({ records: after, fetchImpl: async () => ok200() });
  const plan = await writer.planUpdates([{ recordId: 'recRDD36', fields: { notes: 'theme confirmed' } }]);
  const v = await writer.verifyWrite(plan);
  assert.strictEqual(v.ok, true);
});

test('applyAndVerify uses PUT for a single update and returns a passing verify', async () => {
  const after = [{ record_id: 'recRDD36', fields: { campaign_id: 'RDD-2026-36', status: 'planned' } }];
  const calls = [];
  const writer = writerWith({ records: after, fetchImpl: async (u, i = {}) => { calls.push((i.method || 'GET').toUpperCase()); return ok200(); } });
  const plan = await writer.planUpdates([{ recordId: 'recRDD36', fields: { status: 'planned' } }]);
  const { verify } = await writer.applyAndVerify(plan, { confirm: true });
  assert.ok(calls.includes('PUT'), 'single update routes through PUT');
  assert.strictEqual(verify.ok, true);
});

// --- idempotency-safe retry -------------------------------------------------

test('a write is retried on 429 and then succeeds (429 = rejected, safe to retry)', async () => {
  let n = 0;
  const fetchImpl = async () => { n += 1; return n === 1 ? { ok: false, status: 429, json: async () => ({}) } : ok200(); };
  const writer = writerWith({ fetchImpl });
  const plan = await writer.planUpdates([{ recordId: 'recRDD36', fields: { status: 'planned' } }]);
  await writer.applyUpdateOne(plan, { confirm: true });
  assert.strictEqual(n, 2, 'first 429, then a successful retry');
});

test('a write refreshes the token once on 401 then succeeds', async () => {
  let n = 0; let invalidated = 0;
  const fetchImpl = async () => { n += 1; return n === 1 ? { ok: false, status: 401, json: async () => ({}) } : ok200(); };
  const writer = writerWith({ fetchImpl, auth: makeAuth(() => { invalidated += 1; }) });
  const plan = await writer.planUpdates([{ recordId: 'recRDD36', fields: { status: 'planned' } }]);
  await writer.applyUpdateOne(plan, { confirm: true });
  assert.strictEqual(invalidated, 1);
  assert.strictEqual(n, 2);
});

test('a write is NOT retried on a 5xx (ambiguous — may have applied) — it surfaces', async () => {
  let n = 0;
  const fetchImpl = async () => { n += 1; return { ok: false, status: 500, json: async () => ({ code: 500, msg: 'server error' }) }; };
  const writer = writerWith({ fetchImpl });
  const plan = await writer.planUpdates([{ recordId: 'recRDD36', fields: { status: 'planned' } }]);
  await assert.rejects(() => writer.applyUpdateOne(plan, { confirm: true }));
  assert.strictEqual(n, 1, 'a 5xx write must not be auto-retried');
});
