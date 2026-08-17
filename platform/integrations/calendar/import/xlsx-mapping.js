// ---------------------------------------------------------------------------
// xlsx-mapping.js — the XLSX → Calendar Service field map + row filters.
//
// PURE module: it has NO dependency on the `xlsx` library or the filesystem, so
// it is fully unit-testable on plain objects. import-xlsx.js owns the workbook
// reading and hands each row here as a { columnName: rawValue } object.
//
// It turns one raw Lark-export row into the Content Calendar Service's typed
// shape (the same 12 fields calendar-service.js normalizes), plus a few useful
// planning extras (key_topic, tone, status, notes, …) that the service ignores
// but the AI/QA layers can use. It NEVER invents data: absent values stay null.
//
// Source of the mapping (see the approved architecture review):
//   campaign_id     ← campaign_id           (verbatim, e.g. "RDD-2026-28")
//   brand           ← campaign_id prefix    ("RDD")
//   campaign_type   ← topic_category        (slugged; XLSX topic_category = the TYPE)
//   campaign_name   ← name
//   topic_category  ← product_categories    (product focus)
//   subject_line    ← subject_line
//   preview_text    ← null                  (absent in XLSX — never invented)
//   send_date       ← scheduled_date        (datetime/serial → "YYYY-MM-DD")
//   send_time       ← null                  (absent — all 00:00)
//   promotion       ← { code: promo_code, text: promo_text }  (null when both blank)
//   list            ← audience_name  IF audience_type == "list"
//   segment         ← audience_name  IF audience_type == "segment"
// ---------------------------------------------------------------------------

'use strict';

// The worksheet the Lark export writes to.
const SHEET_NAME = 'Table';

// The columns we read, in export order. Used to validate the header row and to
// map header-name → column index (robust to column reordering in future exports).
const EXPECTED_HEADERS = [
  'campaign_id', 'name', 'topic_category', 'subject_line', 'scheduled_date',
  'product_categories', 'key_topic', 'promo_code', 'promo_text', 'tone',
  'audience_type', 'audience_id', 'audience_name', 'status', 'notes', 'Parent items',
];

// A campaign_id looks like RDD-2026-28 (BRAND-YEAR-NUMBER). Used to reject the
// "Past campaigns" divider and any stray label row.
const CAMPAIGN_ID_RE = /^[A-Za-z]+-\d{4}-\d+$/;

function pad2(n) { return String(n).padStart(2, '0'); }

// Trim a cell to a clean string, or null. Lark exports blank cells as a single
// space (" "); those collapse to null.
function str(v) {
  if (v == null) return null;
  const s = String(v).trim();
  return s.length ? s : null;
}

// Normalize a value from the scheduled_date column to "YYYY-MM-DD" (or null).
// Accepts a JS Date, an Excel serial number (1900 date system), or a string.
// Timezone-safe: Excel serials and Dates are read via UTC so a 00:00 timestamp
// never rolls back to the previous day.
function toIsoDate(v) {
  if (v == null || v === '') return null;

  if (v instanceof Date && !Number.isNaN(v.getTime())) {
    // A cellDates Date is constructed at UTC midnight by SheetJS; read as UTC.
    return `${v.getUTCFullYear()}-${pad2(v.getUTCMonth() + 1)}-${pad2(v.getUTCDate())}`;
  }

  if (typeof v === 'number' && Number.isFinite(v)) {
    // Excel serial → ms since Unix epoch. 25569 = days from 1899-12-30 to 1970-01-01.
    const ms = Math.round((v - 25569) * 86400 * 1000);
    const d = new Date(ms);
    if (Number.isNaN(d.getTime())) return null;
    return `${d.getUTCFullYear()}-${pad2(d.getUTCMonth() + 1)}-${pad2(d.getUTCDate())}`;
  }

  const s = String(v).trim();
  const iso = s.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (iso) return `${iso[1]}-${iso[2]}-${iso[3]}`;
  const t = Date.parse(s);
  if (Number.isFinite(t)) {
    const d = new Date(t);
    return `${d.getUTCFullYear()}-${pad2(d.getUTCMonth() + 1)}-${pad2(d.getUTCDate())}`;
  }
  return null;
}

// "Promotional sale" → "promotional-sale". Used for campaign_type.
function slug(v) {
  const s = str(v);
  if (!s) return null;
  return s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
}

// Derive the brand from the campaign_id prefix (all rows are RDD today, but this
// keeps the importer correct if the calendar ever carries more than one brand).
function brandFromId(campaignId) {
  const s = str(campaignId);
  if (!s) return null;
  const m = s.match(/^([A-Za-z]+)-/);
  return m ? m[1].toUpperCase() : null;
}

// Combine promo_code + promo_text into a single promotion object, or null.
function buildPromotion(code, text) {
  const c = str(code);
  const t = str(text);
  if (!c && !t) return null;
  return { code: c, text: t };
}

// Split the single audience_name into list/segment by audience_type.
// Returns { list, segment }. "popup" rows are excluded upstream (classifyRow),
// so they never reach here with an audience.
function splitAudience(audienceType, audienceName) {
  const type = (str(audienceType) || '').toLowerCase();
  const name = str(audienceName);
  if (!name) return { list: null, segment: null };
  if (type === 'list') return { list: name, segment: null };
  if (type === 'segment') return { list: null, segment: name };
  return { list: null, segment: null };
}

// Decide whether a raw row should be skipped, and why. `get(colName)` returns the
// raw cell value for that column. Returns a skip-reason string, or null to keep.
function classifyRow(get) {
  const id = str(get('campaign_id'));
  if (!id) return 'blank/no campaign_id';
  if (!CAMPAIGN_ID_RE.test(id)) return `divider/label row ("${id}")`;
  if (toIsoDate(get('scheduled_date')) == null) return 'missing/invalid scheduled_date';
  const audienceType = (str(get('audience_type')) || '').toLowerCase();
  if (audienceType === 'popup') return 'audience_type=popup (not an email)';
  return null;
}

// Map one kept raw row into the typed campaign object: the 12 Calendar Service
// fields + preserved planning extras. `get(colName)` returns the raw cell value.
function mapRow(get) {
  const campaignId = str(get('campaign_id'));
  const audience = splitAudience(get('audience_type'), get('audience_name'));

  return {
    // ── the 12 fields the Calendar Service normalizes ──────────────────────
    campaign_id: campaignId,
    brand: brandFromId(campaignId),
    campaign_type: slug(get('topic_category')),        // XLSX topic_category = the TYPE
    campaign_name: str(get('name')),
    topic_category: str(get('product_categories')),    // product focus
    subject_line: str(get('subject_line')),
    preview_text: null,                                // absent in XLSX — never invented
    send_date: toIsoDate(get('scheduled_date')),
    send_time: null,                                   // absent in XLSX — never invented
    promotion: buildPromotion(get('promo_code'), get('promo_text')),
    list: audience.list,
    segment: audience.segment,

    // ── preserved planning extras (ignored by the Service; used by AI/QA) ───
    campaign_type_label: str(get('topic_category')),
    key_topic: str(get('key_topic')),
    tone: str(get('tone')),
    status: str(get('status')),
    notes: str(get('notes')),
    audience_type: str(get('audience_type')),
    audience_id: str(get('audience_id')),
  };
}

module.exports = {
  SHEET_NAME,
  EXPECTED_HEADERS,
  CAMPAIGN_ID_RE,
  str,
  toIsoDate,
  slug,
  brandFromId,
  buildPromotion,
  splitAudience,
  classifyRow,
  mapRow,
};
