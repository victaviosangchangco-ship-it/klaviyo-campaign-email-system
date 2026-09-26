// Guarded Lark Campaign Calendar writer — offline unit tests.
//
// Every test injects a fake fetch and a fake reader: NO network call is made and
// no credential is read from disk. The fake fetch records every request so the
// suite can prove that planning never writes and that apply* is the only path
// that can issue a POST.

'use strict';

const { test } = require('node:test');
const assert = require('node:assert');

const {
  LarkCalendarWriter,
  ALLOWED_FIELDS,
  encodeCalendarDate,
  decodeCalendarDate,
} = require('../integrations/lark/calendar-writer');
const { ConfigError, IntegrationError } = require('../common/errors');

const FAKE_SECRET = 'writer-unit-test-secret';

const RDD_CAL = {
  brand: 'RDD',
  label: 'RDD',
  appToken: 'AppTokenRDD',
  tableId: 'tblRDD',
  viewId: 'vewRDD',
  pageSize: 500,
  dateTimezoneOffsetMinutes: 660,
  cacheTtlMs: 0,
};
const SS_CAL = { ...RDD_CAL, brand: 'SS', appToken: 'AppTokenSS', tableId: 'tblSS' };

const EXISTING = [
  { record_id: 'recRDD36', fields: { campaign_id: 'RDD-2026-36', name: "Father's Day Workplace Comfort Sale", scheduled_date: 1787760000000 } },
  { record_id: 'recRDD37', fields: { campaign_id: 'RDD-2026-37', name: 'Mobile TV Stands', scheduled_date: 1788105600000 } },
];

function makeAuth() {
  return { getTenantAccessToken: async () => 't-fake-token', invalidate() {} };
}

function makeReader(records = EXISTING) {
  return { listRecords: async () => ({ records, pages: 1, total: records.length }) };
}

function makeWriter({ calendar = RDD_CAL, brand = 'RDD', records, fetchImpl, maxBatch } = {}) {
  const calls = [];
  const impl =
    fetchImpl ||
    (async (url, init = {}) => {
      calls.push({ url: String(url), method: (init.method || 'GET').toUpperCase(), body: init.body });
      return { ok: true, status: 200, json: async () => ({ code: 0, msg: 'success', data: { records: [] } }) };
    });
  const writer = new LarkCalendarWriter({
    baseUrl: 'https://open.larksuite.test/open-apis',
    auth: makeAuth(),
    brand,
    calendar,
    reader: makeReader(records),
    fetchImpl: impl,
    maxBatch,
  });
  return { writer, calls };
}

// --- 1. exact field-level update -------------------------------------------

test('planUpdates produces an exact field-level payload with before values', async () => {
  const { writer } = makeWriter();
  const plan = await writer.planUpdates([
    { recordId: 'recRDD36', fields: { scheduled_date: encodeCalendarDate('2026-09-02') }, reason: "Father's Day" },
  ]);

  assert.strictEqual(plan.ok, true);
  assert.strictEqual(plan.operation, 'update');
  assert.strictEqual(plan.brand, 'RDD');
  assert.strictEqual(plan.count, 1);
  assert.strictEqual(plan.items[0].record_id, 'recRDD36');
  assert.deepStrictEqual(Object.keys(plan.items[0].fields), ['scheduled_date']);
  assert.strictEqual(plan.items[0].fields.scheduled_date, 1788278400000);
  assert.strictEqual(plan.items[0]._before.scheduled_date, 1787760000000); // original preserved
  assert.strictEqual(plan.items[0]._reason, "Father's Day");
});

test('only the named field is in the payload — untouched fields are never sent', async () => {
  const { writer } = makeWriter();
  const plan = await writer.planUpdates([{ recordId: 'recRDD36', fields: { scheduled_date: 1 } }]);
  assert.ok(!('name' in plan.items[0].fields));
  assert.ok(!('campaign_id' in plan.items[0].fields));
});

// --- 2. new record creation -------------------------------------------------

test('planCreates accepts a new, non-duplicate record', async () => {
  const { writer } = makeWriter();
  const plan = await writer.planCreates([
    { fields: { campaign_id: 'RDD-2026-56', name: 'New slot', scheduled_date: encodeCalendarDate('2026-11-18') } },
  ]);
  assert.strictEqual(plan.ok, true);
  assert.strictEqual(plan.operation, 'create');
  assert.strictEqual(plan.items[0].fields.campaign_id, 'RDD-2026-56');
});

test('planCreates rejects a campaign_id that already exists', async () => {
  const { writer } = makeWriter();
  const plan = await writer.planCreates([{ fields: { campaign_id: 'RDD-2026-36', name: 'dupe' } }]);
  assert.strictEqual(plan.ok, false);
  assert.match(JSON.stringify(plan.errors), /already exists/);
});

test('planCreates rejects a duplicate campaign_id inside one batch', async () => {
  const { writer } = makeWriter();
  const plan = await writer.planCreates([
    { fields: { campaign_id: 'RDD-2026-56', name: 'a' } },
    { fields: { campaign_id: 'RDD-2026-56', name: 'b' } },
  ]);
  assert.strictEqual(plan.ok, false);
  assert.match(JSON.stringify(plan.errors), /appears twice/);
});

test('planCreates requires a campaign_id', async () => {
  const { writer } = makeWriter();
  const plan = await writer.planCreates([{ fields: { name: 'no id' } }]);
  assert.strictEqual(plan.ok, false);
  assert.match(JSON.stringify(plan.errors), /campaign_id is required/);
});

// --- 3. rejection of unknown record IDs ------------------------------------

test('planUpdates rejects a record id that does not exist in the Base', async () => {
  const { writer } = makeWriter();
  const plan = await writer.planUpdates([{ recordId: 'recDOESNOTEXIST', fields: { name: 'x' } }]);
  assert.strictEqual(plan.ok, false);
  assert.match(JSON.stringify(plan.errors), /does not exist in the RDD Base/);
});

// --- 4. rejection of unauthorized fields ------------------------------------

test('planUpdates refuses a field outside the calendar schema', async () => {
  const { writer } = makeWriter();
  const plan = await writer.planUpdates([
    { recordId: 'recRDD36', fields: { scheduled_date: 1, secret_column: 'nope' } },
  ]);
  assert.strictEqual(plan.ok, false);
  assert.match(JSON.stringify(plan.errors), /not in the Campaign Calendar schema/);
});

test('campaign_id is immutable on update', async () => {
  const { writer } = makeWriter();
  const plan = await writer.planUpdates([{ recordId: 'recRDD36', fields: { campaign_id: 'RDD-2026-99' } }]);
  assert.strictEqual(plan.ok, false);
  assert.match(JSON.stringify(plan.errors), /immutable on update/);
});

test('the allow-list is exactly the 23-field calendar schema (15 core + 3 secondary-audience + 4 planning-taxonomy + 1 hierarchy link)', () => {
  // Was 19 until the Sep–Dec 2026 planning-taxonomy rollout (campaign_type,
  // seasonal_trigger, focus_category, priority) added 4 more Single Select
  // columns to calendar-writer's ALLOWED_FIELDS on 2026-09-18 (see
  // calendar-field-manager.js + xlsx-mapping.js OPTIONAL_HEADERS, which now
  // reads these on import too — SYSTEM PATCH: Campaign-Type Collision Fix).
  assert.strictEqual(ALLOWED_FIELDS.size, 23);
  for (const f of ['campaign_id', 'scheduled_date', 'promo_code', 'notes', 'status']) {
    assert.ok(ALLOWED_FIELDS.has(f), `${f} must be writable`);
  }
  // Additive multi-audience columns are writable via the same guarded path.
  for (const f of ['audience_2_type', 'audience_2_name', 'audience_2_id']) {
    assert.ok(ALLOWED_FIELDS.has(f), `${f} must be writable`);
  }
  // Sep–Dec 2026 planning-taxonomy columns — writable, and now also imported
  // (see xlsx-mapping.js) instead of being write-only/silently dropped on read.
  for (const f of ['campaign_type', 'seasonal_trigger', 'focus_category', 'priority']) {
    assert.ok(ALLOWED_FIELDS.has(f), `${f} must be writable`);
  }
  // Hierarchy/grouping link field (additive) — writable as an array of record ids.
  assert.ok(ALLOWED_FIELDS.has('Parent items'), 'Parent items must be writable');
  for (const f of ['record_id', '__proto__', 'audience_3_type']) {
    assert.ok(!ALLOWED_FIELDS.has(f), `${f} must NOT be writable`);
  }
});

// --- 5. no delete capability ------------------------------------------------

test('the writer exposes NO delete capability of any kind', () => {
  const methods = Object.getOwnPropertyNames(LarkCalendarWriter.prototype);
  for (const m of methods) {
    assert.ok(!/delete|remove|destroy|drop|truncate/i.test(m), `writer must not expose ${m}()`);
  }
  for (const forbidden of ['deleteRecords', 'deleteRecord', 'batchDelete', 'removeRecords']) {
    assert.strictEqual(typeof LarkCalendarWriter.prototype[forbidden], 'undefined');
  }
});

test('the READ client remains write-free (its guarantee is untouched)', () => {
  const { LarkBitableClient } = require('../integrations/lark/bitable-client');
  const m = Object.getOwnPropertyNames(LarkBitableClient.prototype);
  assert.strictEqual(m.filter((x) => /create|update|delete|post|put|patch/i.test(x)).length, 0);
});

// --- 6. no credential leakage ----------------------------------------------

test('no secret or token appears in a plan', async () => {
  const { writer } = makeWriter();
  const plan = await writer.planUpdates([{ recordId: 'recRDD36', fields: { scheduled_date: 1 } }]);
  const serialized = JSON.stringify(plan);
  assert.ok(!serialized.includes(FAKE_SECRET));
  assert.ok(!serialized.includes('t-fake-token'));
});

test('a write error carries no token in its message or details', async () => {
  const fetchImpl = async () => ({ ok: false, status: 403, json: async () => ({ code: 99991672, msg: 'Access denied' }) });
  const { writer } = makeWriter({ fetchImpl });
  const plan = await writer.planUpdates([{ recordId: 'recRDD36', fields: { scheduled_date: 1 } }]);
  await assert.rejects(
    () => writer.applyUpdates(plan, { confirm: true }),
    (err) => {
      assert.ok(err instanceof IntegrationError);
      assert.ok(!err.message.includes('t-fake-token'));
      assert.ok(!JSON.stringify(err.details).includes('t-fake-token'));
      return true;
    }
  );
});

// --- 7. API error handling --------------------------------------------------

test('a non-zero Lark code on write surfaces as IntegrationError with the code', async () => {
  const fetchImpl = async () => ({ ok: true, status: 200, json: async () => ({ code: 1254045, msg: 'FieldNameNotFound' }) });
  const { writer } = makeWriter({ fetchImpl });
  const plan = await writer.planUpdates([{ recordId: 'recRDD36', fields: { scheduled_date: 1 } }]);
  await assert.rejects(
    () => writer.applyUpdates(plan, { confirm: true }),
    (err) => err instanceof IntegrationError && /1254045/.test(err.message) && err.details.code === 1254045
  );
});

test('a non-JSON write response is an IntegrationError, not a crash', async () => {
  const fetchImpl = async () => ({ ok: true, status: 200, json: async () => { throw new Error('not json'); } });
  const { writer } = makeWriter({ fetchImpl });
  const plan = await writer.planUpdates([{ recordId: 'recRDD36', fields: { scheduled_date: 1 } }]);
  await assert.rejects(() => writer.applyUpdates(plan, { confirm: true }), IntegrationError);
});

// --- 8. dry-run / change-set output ----------------------------------------

test('planning issues NO write request at all', async () => {
  const { writer, calls } = makeWriter();
  await writer.planUpdates([{ recordId: 'recRDD36', fields: { scheduled_date: 1 } }]);
  await writer.planCreates([{ fields: { campaign_id: 'RDD-2026-56', name: 'x' } }]);
  assert.strictEqual(calls.filter((c) => c.method !== 'GET').length, 0, 'a plan must never POST');
});

test('apply* refuses without an explicit confirm:true — and writes nothing', async () => {
  const { writer, calls } = makeWriter();
  const plan = await writer.planUpdates([{ recordId: 'recRDD36', fields: { scheduled_date: 1 } }]);

  await assert.rejects(() => writer.applyUpdates(plan), ConfigError);
  await assert.rejects(() => writer.applyUpdates(plan, { confirm: false }), ConfigError);
  await assert.rejects(() => writer.applyUpdates(plan, { confirm: 'yes' }), ConfigError);
  assert.strictEqual(calls.filter((c) => c.method === 'POST').length, 0);
});

test('apply* refuses to apply a plan that failed validation', async () => {
  const { writer, calls } = makeWriter();
  const bad = await writer.planUpdates([{ recordId: 'recNOPE', fields: { name: 'x' } }]);
  assert.strictEqual(bad.ok, false);
  await assert.rejects(() => writer.applyUpdates(bad, { confirm: true }), ConfigError);
  assert.strictEqual(calls.filter((c) => c.method === 'POST').length, 0);
});

test('a confirmed apply posts to batch_update and sends only record_id + fields', async () => {
  const { writer, calls } = makeWriter();
  const plan = await writer.planUpdates([
    { recordId: 'recRDD36', fields: { scheduled_date: 1788278400000 }, reason: 'note only' },
  ]);
  await writer.applyUpdates(plan, { confirm: true });

  const post = calls.find((c) => c.method === 'POST');
  assert.match(post.url, /tables\/tblRDD\/records\/batch_update$/);
  const body = JSON.parse(post.body);
  assert.deepStrictEqual(Object.keys(body.records[0]).sort(), ['fields', 'record_id']);
  assert.ok(!('_reason' in body.records[0]), 'internal annotations must not be sent');
  assert.ok(!('_before' in body.records[0]));
});

test('no arbitrary bulk: a batch over the cap is refused before any read', async () => {
  const { writer } = makeWriter({ maxBatch: 2 });
  const many = Array.from({ length: 3 }, () => ({ recordId: 'recRDD36', fields: { name: 'x' } }));
  await assert.rejects(() => writer.planUpdates(many), (err) => /max 2/.test(err.message));
});

// --- 9. cross-brand write protection ---------------------------------------

test('constructing a writer whose brand and calendar disagree is refused', () => {
  assert.throws(
    () =>
      new LarkCalendarWriter({
        baseUrl: 'https://x.test',
        auth: makeAuth(),
        brand: 'SS',
        calendar: RDD_CAL, // RDD calendar under an SS brand
        reader: makeReader(),
        fetchImpl: async () => {},
      }),
    (err) => err instanceof ConfigError && /Cross-brand write refused/.test(err.message)
  );
});

test('creating an SS-prefixed campaign in the RDD Base is refused', async () => {
  const { writer } = makeWriter();
  const plan = await writer.planCreates([{ fields: { campaign_id: 'SS-2026-99', name: 'wrong base' } }]);
  assert.strictEqual(plan.ok, false);
  assert.match(JSON.stringify(plan.errors), /cross-brand write refused/i);
});

test('an SS writer targets the SS Base only', async () => {
  const { writer, calls } = makeWriter({
    brand: 'SS',
    calendar: SS_CAL,
    records: [{ record_id: 'recSS1', fields: { campaign_id: 'SS-2026-01' } }],
  });
  const plan = await writer.planCreates([{ fields: { campaign_id: 'SS-2026-48', name: 'ok' } }]);
  assert.strictEqual(plan.ok, true);
  assert.strictEqual(plan.appToken, 'AppTokenSS');
  await writer.applyCreates(plan, { confirm: true });
  const post = calls.find((c) => c.method === 'POST');
  assert.match(post.url, /apps\/AppTokenSS\/tables\/tblSS\/records\/batch_create$/);
});

// --- date encoding ----------------------------------------------------------

test('date encoding matches the Base convention (16:00Z previous day)', () => {
  // Verified against three real records during the audit.
  assert.strictEqual(encodeCalendarDate('2026-08-27'), 1787760000000);
  assert.strictEqual(encodeCalendarDate('2026-08-31'), 1788105600000);
  assert.strictEqual(encodeCalendarDate('2026-12-01'), 1796054400000);
  assert.strictEqual(decodeCalendarDate(1787760000000), '2026-08-27');
  assert.strictEqual(decodeCalendarDate(encodeCalendarDate('2026-11-30')), '2026-11-30');
  assert.throws(() => encodeCalendarDate('27/08/2026'), ConfigError);
});
