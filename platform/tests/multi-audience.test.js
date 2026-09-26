// Multi-audience support — offline unit tests.
//
// Proves a Campaign Calendar row can carry TWO audiences (primary audience_* +
// optional secondary audience_2_*), routed to campaign.list / campaign.segment
// BY TYPE, end-to-end through: xlsx-mapping, the XLSX importer (old + new files),
// the Lark provider, the guarded writer allowlist, the Calendar Service 13-field
// contract, and the Klaviyo audience resolver. No network, no credentials.

'use strict';

const { test } = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const os = require('os');
const path = require('path');
const XLSX = require('xlsx');

const mapping = require('../integrations/calendar/import/xlsx-mapping');
const { importCalendar } = require('../integrations/calendar/import/import-xlsx');
const { mapRecords } = require('../integrations/calendar/providers/lark-provider');
const { ALLOWED_FIELDS } = require('../integrations/lark/calendar-writer');
const { normalizeCampaign, FIELDS } = require('../integrations/calendar/calendar-service');
const { createDraftCampaignService } = require('../integrations/klaviyo/draft-campaign-service');

// get(colName) accessor over a plain object (mirrors the importer/provider getter)
const getter = (obj) => (name) => (name in obj ? obj[name] : null);

// ── 1. routeAudiences — type routing, both slots ────────────────────────────

test('routeAudiences: single list (primary only)', () => {
  assert.deepStrictEqual(
    mapping.routeAudiences(getter({ audience_type: 'list', audience_name: 'RDD - All Subscribers' })),
    { list: 'RDD - All Subscribers', segment: null }
  );
});

test('routeAudiences: single segment (primary only)', () => {
  assert.deepStrictEqual(
    mapping.routeAudiences(getter({ audience_type: 'segment', audience_name: '60D Active Customers' })),
    { list: null, segment: '60D Active Customers' }
  );
});

test('routeAudiences: combo (segment primary + list secondary) → BOTH', () => {
  assert.deepStrictEqual(
    mapping.routeAudiences(getter({
      audience_type: 'segment', audience_name: 'Engaged 240D',
      audience_2_type: 'list', audience_2_name: 'Safety Sector Customer List',
    })),
    { list: 'Safety Sector Customer List', segment: 'Engaged 240D' }
  );
});

test('routeAudiences: routing is BY TYPE, not slot position (list primary + segment secondary)', () => {
  assert.deepStrictEqual(
    mapping.routeAudiences(getter({
      audience_type: 'list', audience_name: 'Safety Sector Customer List',
      audience_2_type: 'segment', audience_2_name: 'Engaged 240D',
    })),
    { list: 'Safety Sector Customer List', segment: 'Engaged 240D' }
  );
});

test('routeAudiences: missing secondary resolves safely (single audience unchanged)', () => {
  assert.deepStrictEqual(
    mapping.routeAudiences(getter({ audience_type: 'segment', audience_name: '60D Active Customers' })),
    { list: null, segment: '60D Active Customers' }
  );
  assert.deepStrictEqual(mapping.routeAudiences(getter({})), { list: null, segment: null });
});

test('routeAudiences: popup/unknown types are ignored', () => {
  assert.deepStrictEqual(
    mapping.routeAudiences(getter({
      audience_type: 'popup', audience_name: 'All Website Visitors',
      audience_2_type: 'mystery', audience_2_name: 'Whatever',
    })),
    { list: null, segment: null }
  );
});

// ── 2. mapRow — combo + regression + stable key set ─────────────────────────

test('mapRow: combo row populates both segment and list, and keeps raw secondary extras', () => {
  const row = mapping.mapRow(getter({
    campaign_id: 'SS-2026-29', name: 'Fix it strong', topic_category: 'Product insights',
    scheduled_date: '2026-08-21', product_categories: 'Fixings and Drill Bit',
    audience_type: 'segment', audience_name: 'Engaged 240D', audience_id: 'Tdv6tq',
    audience_2_type: 'list', audience_2_name: 'Safety Sector Customer List', audience_2_id: 'Y6Axmi',
  }));
  assert.strictEqual(row.segment, 'Engaged 240D');
  assert.strictEqual(row.list, 'Safety Sector Customer List');
  assert.strictEqual(row.audience_2_type, 'list');
  assert.strictEqual(row.audience_2_name, 'Safety Sector Customer List');
  assert.strictEqual(row.audience_2_id, 'Y6Axmi');
});

test('mapRow: single-audience row is UNCHANGED and secondary extras are null (regression)', () => {
  const row = mapping.mapRow(getter({
    campaign_id: 'RDD-2026-40', scheduled_date: '2026-09-23',
    audience_type: 'segment', audience_name: '60D Active Customers',
  }));
  assert.strictEqual(row.segment, '60D Active Customers');
  assert.strictEqual(row.list, null);
  assert.strictEqual(row.audience_2_type, null);
  assert.strictEqual(row.audience_2_name, null);
  assert.strictEqual(row.audience_2_id, null);
});

test('mapRow: key set is stable whether or not secondary is present', () => {
  const withCombo = mapping.mapRow(getter({ campaign_id: 'X', scheduled_date: '2026-01-01', audience_2_type: 'list', audience_2_name: 'L' }));
  const without = mapping.mapRow(() => null);
  assert.deepStrictEqual(Object.keys(withCombo).sort(), Object.keys(without).sort());
});

// ── 3. OPTIONAL_HEADERS is not part of the strict required set ──────────────

test('OPTIONAL_HEADERS includes audience_2_*, cadence, and the planning-taxonomy fields, none in EXPECTED_HEADERS', () => {
  assert.deepStrictEqual(mapping.OPTIONAL_HEADERS, [
    'audience_2_type', 'audience_2_name', 'audience_2_id', 'cadence',
    'campaign_type', 'seasonal_trigger', 'focus_category', 'priority',
  ]);
  for (const h of mapping.OPTIONAL_HEADERS) {
    assert.ok(!mapping.EXPECTED_HEADERS.includes(h), `${h} must stay optional (not strict-required)`);
  }
});

// ── 4. XLSX importer — old file (no audience_2_*) and new file (with) ────────

function rowFromObj(headers, obj) { return headers.map((h) => (h in obj ? obj[h] : null)); }
function writeWorkbook(dir, headers, rows) {
  const ws = XLSX.utils.aoa_to_sheet([headers, ...rows], { cellDates: true });
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, mapping.SHEET_NAME);
  const file = path.join(dir, 'fixture.xlsx');
  XLSX.writeFile(wb, file);
  return file;
}

test('importCalendar: OLD export WITHOUT audience_2_* columns still imports (backward compatible)', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'ma-old-'));
  const headers = mapping.EXPECTED_HEADERS; // exactly the legacy 16 columns
  const rows = [
    rowFromObj(headers, {
      campaign_id: 'SS-2026-30', name: 'Wheel chocks', topic_category: 'Promotional sale',
      subject_line: 'S30', scheduled_date: new Date(Date.UTC(2026, 7, 27)),
      audience_type: 'segment', audience_name: '60D Active Customers', status: 'pending',
    }),
  ];
  const { doc, summary } = importCalendar({ inputPath: writeWorkbook(dir, headers, rows), write: false });
  assert.strictEqual(summary.written, 1);
  const c = doc.campaigns[0];
  assert.strictEqual(c.segment, '60D Active Customers');
  assert.strictEqual(c.list, null);
  assert.strictEqual(c.audience_2_name, null); // absent column → null, never invented
});

test('importCalendar: NEW export WITH audience_2_* columns produces a combo (segment + list)', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'ma-new-'));
  const headers = [...mapping.EXPECTED_HEADERS, ...mapping.OPTIONAL_HEADERS]; // 19 columns
  const rows = [
    rowFromObj(headers, {
      campaign_id: 'SS-2026-29', name: 'Fixings', topic_category: 'Product insights',
      subject_line: 'S29', scheduled_date: new Date(Date.UTC(2026, 7, 20)),
      audience_type: 'segment', audience_name: 'Engaged 240D', audience_id: 'Tdv6tq',
      audience_2_type: 'list', audience_2_name: 'Safety Sector Customer List', audience_2_id: 'Y6Axmi',
    }),
  ];
  const { doc, summary } = importCalendar({ inputPath: writeWorkbook(dir, headers, rows), write: false });
  assert.strictEqual(summary.written, 1);
  const c = doc.campaigns[0];
  assert.strictEqual(c.segment, 'Engaged 240D');
  assert.strictEqual(c.list, 'Safety Sector Customer List');
  assert.strictEqual(c.audience_2_id, 'Y6Axmi');
});

// ── 5. Lark provider — combo record maps to both audiences ──────────────────

test('lark-provider mapRecords: a combo Lark record yields both segment and list', () => {
  const rec = {
    record_id: 'recCombo',
    fields: {
      campaign_id: 'SS-2026-33', name: 'Accessibility', scheduled_date: Date.UTC(2026, 8, 17),
      audience_type: 'segment', audience_name: 'Engaged 240D', audience_id: 'Tdv6tq',
      audience_2_type: 'list', audience_2_name: 'Safety Sector Customer List', audience_2_id: 'Y6Axmi',
    },
  };
  const { campaigns } = mapRecords([rec]);
  assert.strictEqual(campaigns.length, 1);
  assert.strictEqual(campaigns[0].segment, 'Engaged 240D');
  assert.strictEqual(campaigns[0].list, 'Safety Sector Customer List');
  assert.strictEqual(campaigns[0].brand, 'SS'); // brand derivation unaffected
});

// ── 6. Guarded writer allowlist ─────────────────────────────────────────────

test('ALLOWED_FIELDS includes the secondary audience fields (and still the primary)', () => {
  for (const f of ['audience_type', 'audience_name', 'audience_id', 'audience_2_type', 'audience_2_name', 'audience_2_id']) {
    assert.ok(ALLOWED_FIELDS.has(f), `writer must allow ${f}`);
  }
  // Non-schema fields remain rejected.
  assert.ok(!ALLOWED_FIELDS.has('audience_3_type'));
  assert.ok(!ALLOWED_FIELDS.has('preview_text'));
});

// ── 7. Calendar Service — 13-field contract preserved ───────────────────────

test('Calendar Service: 13 core fields intact; combo segment+list carried; extras pass through', () => {
  const raw = mapping.mapRow(getter({
    campaign_id: 'SS-2026-37', scheduled_date: '2026-10-17',
    audience_type: 'list', audience_name: 'Safety Sector Customer List',
    audience_2_type: 'segment', audience_2_name: 'Engaged 240D',
  }));
  const c = normalizeCampaign(raw);
  for (const f of FIELDS) assert.ok(f in c, `missing core field ${f}`);
  assert.strictEqual(FIELDS.length, 13);
  assert.strictEqual(c.segment, 'Engaged 240D');
  assert.strictEqual(c.list, 'Safety Sector Customer List');
  assert.strictEqual(c.audience_2_type, 'segment'); // extra passes through, not a core field
  assert.ok(!FIELDS.includes('audience_2_type'), 'secondary is an extra, not a core field');
});

test('Calendar Service: a plain row without any audience extras still yields the 13 core keys', () => {
  const c = normalizeCampaign({ campaign_id: 'RDD-2026-50', send_date: '2026-11-27' });
  for (const f of FIELDS) assert.ok(f in c);
});

// ── 8. Klaviyo resolver — combo produces both included ids ──────────────────

const calendarServiceStub = { getNextCampaign: async () => null, getCampaignByWeek: async () => null };
const listService = { resolveByName: async (n) => (n === 'Safety Sector Customer List' ? { id: 'Y6Axmi', name: n } : null) };
const segmentService = { resolveByName: async (n) => (n === 'Engaged 240D' ? { id: 'Tdv6tq', name: n } : null) };
const mockClient = { post: async () => ({ data: { id: 'D1', attributes: { status: 'Draft' } } }) };

test('Klaviyo resolver: a combo campaign resolves BOTH ids into audiences.included', async () => {
  const svc = createDraftCampaignService({ client: mockClient, calendarService: calendarServiceStub, listService, segmentService });
  const combo = mapping.mapRow(getter({
    campaign_id: 'SS-2026-49', scheduled_date: '2026-11-17',
    audience_type: 'segment', audience_name: 'Engaged 240D',
    audience_2_type: 'list', audience_2_name: 'Safety Sector Customer List',
  }));
  const r = await svc.resolveAudience(combo);
  assert.strictEqual(r.ok, true);
  assert.deepStrictEqual(r.included.sort(), ['Tdv6tq', 'Y6Axmi']);
  assert.strictEqual(r.resolved.segment.id, 'Tdv6tq');
  assert.strictEqual(r.resolved.list.id, 'Y6Axmi');
});

test('Klaviyo resolver: single-audience campaign still resolves to exactly one id (regression)', async () => {
  const svc = createDraftCampaignService({ client: mockClient, calendarService: calendarServiceStub, listService, segmentService });
  const single = mapping.mapRow(getter({ campaign_id: 'SS-2026-30', scheduled_date: '2026-08-27', audience_type: 'list', audience_name: 'Safety Sector Customer List' }));
  const r = await svc.resolveAudience(single);
  assert.deepStrictEqual(r.included, ['Y6Axmi']);
  assert.strictEqual(r.resolved.segment, null);
});
