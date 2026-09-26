// Guarded Lark Campaign Calendar writer — "Parent items" link-field support.
//
// Offline unit tests (fake fetch + fake reader; no network, no credentials). Cover
// the additive hierarchy/grouping capability: a self-referential link field written
// as an array of record ids, read back as [{ record_ids:[...] }], and verified by a
// record-id-set comparison rather than the text comparator.

'use strict';

const { test } = require('node:test');
const assert = require('node:assert');

const {
  LarkCalendarWriter,
  ALLOWED_FIELDS,
  LINK_FIELDS,
  linkValuesEqual,
} = require('../integrations/lark/calendar-writer');

const RDD_CAL = {
  brand: 'RDD', label: 'RDD', appToken: 'AppTokenRDD', tableId: 'tblRDD', viewId: 'vewRDD',
  pageSize: 500, dateTimezoneOffsetMinutes: 660, cacheTtlMs: 0,
};
const PARENT = 'recPastCampaigns';
const CHILD = 'recRDD28';

// Reader returns the child ALREADY parented, to emulate the post-write re-read.
const AFTER = [
  { record_id: CHILD, fields: {
    campaign_id: 'RDD-2026-28',
    'Parent items': [{ record_ids: [PARENT], table_id: 'tblRDD', text: 'Past campaigns ', text_arr: ['Past campaigns '], type: 'text' }],
  } },
];

function makeAuth() { return { getTenantAccessToken: async () => 't', invalidate() {} }; }
function makeReader(records) { return { listRecords: async () => ({ records, pages: 1, total: records.length }) }; }
function makeWriter(records) {
  const calls = [];
  const impl = async (url, init = {}) => {
    calls.push({ url: String(url), method: (init.method || 'GET').toUpperCase(), body: init.body });
    return { ok: true, status: 200, json: async () => ({ code: 0, msg: 'success', data: { records: [] } }) };
  };
  const writer = new LarkCalendarWriter({
    baseUrl: 'https://open.larksuite.test/open-apis', auth: makeAuth(), brand: 'RDD',
    calendar: RDD_CAL, reader: makeReader(records), fetchImpl: impl,
  });
  return { writer, calls };
}

test('"Parent items" is in the writable schema as a link field', () => {
  assert.ok(ALLOWED_FIELDS.has('Parent items'));
  assert.ok(LINK_FIELDS.has('Parent items'));
});

test('linkValuesEqual compares record-id sets across write/read shapes', () => {
  // requested (write shape) vs actual (read-back shape) — same id → equal
  assert.strictEqual(linkValuesEqual([PARENT], AFTER[0].fields['Parent items']), true);
  // different parent → not equal
  assert.strictEqual(linkValuesEqual(['recOther'], AFTER[0].fields['Parent items']), false);
  // empty vs set → not equal
  assert.strictEqual(linkValuesEqual([], AFTER[0].fields['Parent items']), false);
});

test('planUpdates accepts a valid Parent items array and rejects a bad one', async () => {
  const { writer } = makeWriter(AFTER);
  const good = await writer.planUpdates([{ recordId: CHILD, fields: { 'Parent items': [PARENT] } }]);
  assert.strictEqual(good.ok, true);
  assert.deepStrictEqual(good.items[0].fields['Parent items'], [PARENT]);

  const bad = await writer.planUpdates([{ recordId: CHILD, fields: { 'Parent items': 'recNotAnArray' } }]);
  assert.strictEqual(bad.ok, false);
  assert.match(bad.errors[0].errors[0], /must be a non-empty array of record ids/);
});

test('verifyWrite matches a link field by record-id set (not text)', async () => {
  const { writer } = makeWriter(AFTER);
  const plan = await writer.planUpdates([{ recordId: CHILD, fields: { 'Parent items': [PARENT] } }]);
  const verify = await writer.verifyWrite(plan);
  assert.strictEqual(verify.ok, true, JSON.stringify(verify.mismatches));
  assert.strictEqual(verify.mismatches.length, 0);
});
