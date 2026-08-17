// Calendar XLSX import — mapping (pure), importer (fixture workbook), and the
// deterministic campaign selection guard. Offline; the only file I/O is a temp
// fixture workbook written + read in a temp dir.

'use strict';

const { test } = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const os = require('os');
const path = require('path');
const XLSX = require('xlsx');

const mapping = require('../integrations/calendar/import/xlsx-mapping');
const { importCalendar } = require('../integrations/calendar/import/import-xlsx');
const { resolveCalendarCampaign } = require('../workflow/live-orchestrator');
const { createCalendarService } = require('../integrations/calendar/calendar-service');
const { JsonCalendarProvider } = require('../integrations/calendar/providers/json-provider');
const { ApprovalRequired } = require('../common/errors');

// ── helper: turn a plain object into the get(colName) accessor mapRow expects ──
function getter(obj) {
  return (name) => (name in obj ? obj[name] : null);
}

// =====================================================================
// Pure mapping
// =====================================================================

test('toIsoDate normalizes Excel serial, Date, and string forms → YYYY-MM-DD', () => {
  assert.strictEqual(mapping.toIsoDate(46204), '2026-07-01');     // Excel serial for 2026-07-01
  assert.strictEqual(mapping.toIsoDate(new Date(Date.UTC(2026, 7, 12))), '2026-08-12');
  assert.strictEqual(mapping.toIsoDate('2026-12-25 00:00:00'), '2026-12-25');
  assert.strictEqual(mapping.toIsoDate(null), null);
  assert.strictEqual(mapping.toIsoDate(' '), null);
});

test('slug + brandFromId derive campaign_type and brand', () => {
  assert.strictEqual(mapping.slug('Promotional sale'), 'promotional-sale');
  assert.strictEqual(mapping.slug('EOFY sale'), 'eofy-sale');
  assert.strictEqual(mapping.brandFromId('RDD-2026-28'), 'RDD');
  assert.strictEqual(mapping.brandFromId(''), null);
});

test('buildPromotion combines code + text, or null when both blank', () => {
  assert.deepStrictEqual(mapping.buildPromotion('NEWFY15', '15% off overstock items'), { code: 'NEWFY15', text: '15% off overstock items' });
  assert.strictEqual(mapping.buildPromotion(' ', ' '), null);
  assert.deepStrictEqual(mapping.buildPromotion('X', null), { code: 'X', text: null });
});

test('splitAudience maps audience_name into list vs segment by audience_type', () => {
  assert.deepStrictEqual(mapping.splitAudience('list', 'RDD - All Subscribers'), { list: 'RDD - All Subscribers', segment: null });
  assert.deepStrictEqual(mapping.splitAudience('segment', 'RDD - Active Subscribers'), { list: null, segment: 'RDD - Active Subscribers' });
  assert.deepStrictEqual(mapping.splitAudience('popup', 'All Website Visitors'), { list: null, segment: null });
});

test('classifyRow skips junk, missing id/date, and popup; keeps a good row', () => {
  const good = getter({ campaign_id: 'RDD-2026-28', scheduled_date: 46204, audience_type: 'list' });
  assert.strictEqual(mapping.classifyRow(good), null);
  assert.match(mapping.classifyRow(getter({ campaign_id: 'Past campaigns ' })), /divider/);
  assert.match(mapping.classifyRow(getter({ campaign_id: '  ' })), /no campaign_id/);
  assert.match(mapping.classifyRow(getter({ campaign_id: 'RDD-2026-99', scheduled_date: null })), /scheduled_date/);
  assert.match(mapping.classifyRow(getter({ campaign_id: 'RDD-2026-47', scheduled_date: 46204, audience_type: 'popup' })), /popup/);
});

test('mapRow produces the 12 service fields (+extras); topic_category=product focus, preview/send_time null', () => {
  const row = getter({
    campaign_id: 'RDD-2026-28',
    name: 'New Financial Year Clearance',
    topic_category: 'Clearance',
    subject_line: 'Start the New Financial Year with 15% Off',
    scheduled_date: 46204,
    product_categories: 'Overstock Items',
    key_topic: 'Kick off the new financial year…',
    promo_code: 'NEWFY15',
    promo_text: '15% off overstock items',
    tone: 'optimistic, fresh, value-driven',
    audience_type: 'list',
    audience_id: null,
    audience_name: 'RDD - All Subscribers',
    status: 'pending',
    notes: 'HIGHEST PRIORITY',
  });
  const c = mapping.mapRow(row);
  assert.strictEqual(c.campaign_id, 'RDD-2026-28');
  assert.strictEqual(c.brand, 'RDD');
  assert.strictEqual(c.campaign_type, 'clearance');       // from XLSX topic_category
  assert.strictEqual(c.topic_category, 'Overstock Items'); // from XLSX product_categories
  assert.strictEqual(c.send_date, '2026-07-01');
  assert.strictEqual(c.preview_text, null);
  assert.strictEqual(c.send_time, null);
  assert.deepStrictEqual(c.promotion, { code: 'NEWFY15', text: '15% off overstock items' });
  assert.strictEqual(c.list, 'RDD - All Subscribers');
  assert.strictEqual(c.segment, null);
  // preserved extras
  assert.strictEqual(c.key_topic, 'Kick off the new financial year…');
  assert.strictEqual(c.tone, 'optimistic, fresh, value-driven');
  assert.strictEqual(c.status, 'pending');
});

// =====================================================================
// Importer against a fixture workbook (exercises the xlsx read path)
// =====================================================================

const HEADERS = mapping.EXPECTED_HEADERS;

function fixtureRows() {
  // A miniature calendar exercising every filter + both audience kinds.
  // Two campaigns share ISO week 2026-W30 (07-20 and 07-22) for the guard test.
  return [
    ['RDD-2026-28', 'NFY Clearance', 'Clearance', 'S28', new Date(Date.UTC(2026, 6, 1)), 'Overstock Items', 'brief', 'NEWFY15', '15% off', 'fresh', 'list', null, 'RDD - All Subscribers', 'pending', 'note', null],
    ['RDD-2026-31', 'Whiteboards', 'Product insights', 'S31', new Date(Date.UTC(2026, 6, 15)), 'Magnetic Glass Whiteboards', 'brief', ' ', ' ', 'modern', 'segment', null, 'RDD - Active Subscribers', 'pending', ' ', null],
    ['RDD-2026-32', 'Sports 10%', 'Category spotlight', 'S32', new Date(Date.UTC(2026, 6, 20)), 'Sport Facility Equipment', 'brief', 'SPORT10', '10% off', 'energetic', 'list', null, 'RDD - All Subscribers', 'pending', ' ', null],
    ['RDD-2026-33', 'Wheel Chocks', 'Promotional sale', 'S33', new Date(Date.UTC(2026, 6, 22)), 'Rubber Wheel Chocks', 'brief', 'CHOCK10', '10% off', 'direct', 'list', null, 'RDD - All Subscribers', 'pending', ' ', null],
    // popup — excluded
    ['RDD-2026-47', 'BF VIP popup', 'Announcement', 'S47', new Date(Date.UTC(2026, 10, 2)), 'Storewide', 'brief', ' ', ' ', 'exclusive', 'popup', null, 'All Website Visitors', 'pending', 'popup only', null],
    // divider — excluded
    ['Past campaigns ', null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
    // past campaign with a Parent items relation — still a real email row, kept
    ['RDD-2026-01', 'New Year', 'Promotional sale', 'S01', new Date(Date.UTC(2026, 0, 1)), 'Storewide', 'brief', 'NEWYEAR10', '10% off', 'celebratory', 'list', null, 'RDD - All Subscribers', 'pending', ' ', 'Past campaigns '],
    // trailing row with only a stray "Parent items" relation (mirrors the real
    // export) — reaches the loop and is skipped as blank/no campaign_id
    [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, 'Past campaigns '],
    // missing date — excluded
    ['RDD-2026-99', 'No date', 'Newsletter', 'S99', null, 'Storewide', 'brief', ' ', ' ', 'warm', 'segment', null, 'RDD - Active Subscribers', 'pending', ' ', null],
  ];
}

function writeFixtureWorkbook(dir) {
  const aoa = [HEADERS, ...fixtureRows()];
  const ws = XLSX.utils.aoa_to_sheet(aoa, { cellDates: true });
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, mapping.SHEET_NAME);
  const file = path.join(dir, 'fixture.xlsx');
  XLSX.writeFile(wb, file);
  return file;
}

test('importCalendar: filters junk/popup/blank/no-date, normalizes, and writes provenance JSON', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'calimp-'));
  const inputPath = writeFixtureWorkbook(dir);
  const outputPath = path.join(dir, 'out.json');
  const { doc, summary } = importCalendar({ inputPath, outputPath });

  // 5 kept (28, 31, 32, 33, 01); skipped: popup, divider, blank/no-id, no-date = 4.
  assert.strictEqual(summary.written, 5);
  assert.strictEqual(summary.skipped, 4);
  assert.ok(summary.skipReasons['audience_type=popup (not an email)'] >= 1);
  assert.ok(Object.keys(summary.skipReasons).some((r) => /divider/.test(r)));
  assert.ok(summary.skipReasons['blank/no campaign_id'] >= 1);
  assert.ok(summary.skipReasons['missing/invalid scheduled_date'] >= 1);

  // provenance + shape
  assert.strictEqual(doc._generatedFrom.length > 0, true);
  assert.match(doc._generatedAt, /^\d{4}-\d{2}-\d{2}T/);
  assert.strictEqual(doc.campaigns.length, 5);

  // date normalization + audience mapping on a sample
  const c28 = doc.campaigns.find((c) => c.campaign_id === 'RDD-2026-28');
  assert.strictEqual(c28.send_date, '2026-07-01');
  assert.strictEqual(c28.list, 'RDD - All Subscribers');
  assert.strictEqual(c28.segment, null);
  const c31 = doc.campaigns.find((c) => c.campaign_id === 'RDD-2026-31');
  assert.strictEqual(c31.segment, 'RDD - Active Subscribers');
  assert.strictEqual(c31.list, null);
  assert.strictEqual(c31.promotion, null); // both promo cells blank

  // written file is valid JSON with the same campaigns
  const reread = JSON.parse(fs.readFileSync(outputPath, 'utf8'));
  assert.strictEqual(reread.campaigns.length, 5);

  // idempotent: a second import yields identical campaigns (ignore _generatedAt)
  const again = importCalendar({ inputPath, outputPath }).doc;
  assert.deepStrictEqual(again.campaigns, doc.campaigns);
});

// =====================================================================
// Deterministic campaign selection
// =====================================================================

function svc(campaigns) {
  return createCalendarService({ provider: new JsonCalendarProvider({ data: { campaigns } }) });
}
const W30_A = { campaign_id: 'RDD-2026-32', brand: 'RDD', campaign_type: 'category-spotlight', send_date: '2026-07-20' };
const W30_B = { campaign_id: 'RDD-2026-33', brand: 'RDD', campaign_type: 'promotional-sale', send_date: '2026-07-22' };
const W29 = { campaign_id: 'RDD-2026-31', brand: 'RDD', campaign_type: 'product-insights', send_date: '2026-07-15' };

test('selection: --campaign picks that exact id (brand-checked)', async () => {
  const s = svc([W30_A, W30_B, W29]);
  const c = await resolveCalendarCampaign({ calendarService: s, brandCode: 'RDD', campaignId: 'RDD-2026-32' });
  assert.strictEqual(c.campaign_id, 'RDD-2026-32');
  await assert.rejects(() => resolveCalendarCampaign({ calendarService: s, brandCode: 'SS', campaignId: 'RDD-2026-32' }), ApprovalRequired);
  await assert.rejects(() => resolveCalendarCampaign({ calendarService: s, brandCode: 'RDD', campaignId: 'NOPE' }), ApprovalRequired);
});

test('selection: a single-campaign week resolves; a 2-campaign week REFUSES (no silent first)', async () => {
  const s = svc([W30_A, W30_B, W29]);
  // W29 has exactly one → resolves
  const one = await resolveCalendarCampaign({ calendarService: s, brandCode: 'RDD', week: '2026-W29' });
  assert.strictEqual(one.campaign_id, 'RDD-2026-31');
  // W30 has two → must refuse and name both
  await assert.rejects(
    () => resolveCalendarCampaign({ calendarService: s, brandCode: 'RDD', week: '2026-W30' }),
    (err) => err instanceof ApprovalRequired && /RDD-2026-32/.test(err.message) && /RDD-2026-33/.test(err.message)
  );
});

test('selection: no --week falls back to the soonest upcoming; explicit empty week errors', async () => {
  const s = svc([W30_A, W30_B, W29]);
  const next = await resolveCalendarCampaign({ calendarService: s, brandCode: 'RDD', now: new Date('2026-07-01') });
  assert.strictEqual(next.campaign_id, 'RDD-2026-31'); // 07-15 is soonest
  await assert.rejects(() => resolveCalendarCampaign({ calendarService: s, brandCode: 'RDD', week: '2026-W40' }), ApprovalRequired);
});
