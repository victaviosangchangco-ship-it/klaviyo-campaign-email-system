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
//   campaign_id         ← campaign_id           (verbatim, e.g. "RDD-2026-28")
//   brand               ← campaign_id prefix    ("RDD")
//   topic_category_slug ← topic_category        (slugged; XLSX topic_category = the TYPE)
//   campaign_name       ← name
//   topic_category      ← product_categories    (product focus)
//   subject_line        ← subject_line
//   preview_text        ← null                  (absent in XLSX — never invented)
//   send_date           ← scheduled_date        (datetime/serial → "YYYY-MM-DD")
//   send_time           ← null                  (absent — all 00:00)
//   promotion           ← { code: promo_code, text: promo_text }  (null when both blank)
//   list                ← audience_name  IF audience_type == "list"
//   segment             ← audience_name  IF audience_type == "segment"
//
// NAME COLLISION FIXED 2026-09 (SYSTEM PATCH: Campaign-Type Collision Fix): the
// Calendar Service's core field is now `topic_category_slug` (renamed FROM
// `campaign_type`), which freed the name `campaign_type` to mean what the Lark
// column literally named `campaign_type` means: the human planning taxonomy
// (Product Focus / Seasonal / BAU / Promo / Educational — added to both Bases
// 2026-09-18). That real column was previously NOT in EXPECTED_HEADERS or
// OPTIONAL_HEADERS at all, so every edit a planner made to it was silently
// dropped on import — never reaching config/campaign-calendar.generated.json or
// the live-Lark provider (which reuses this same mapping). It is now read as a
// PLANNING EXTRA (like key_topic/tone/status), alongside seasonal_trigger,
// focus_category, priority and Parent items (see OPTIONAL_HEADERS below) — carried
// through for future planning/decision logic, but NOT wired into any Klaviyo
// payload (no current consumer needs them there; CLAUDE.md §5 — never invent a
// consumer that doesn't exist).
//
// MULTI-AUDIENCE (optional secondary slot — additive, backward compatible):
//   A row may also carry a SECOND audience via audience_2_type / audience_2_name
//   / audience_2_id. Both slots are routed to list/segment BY TYPE (not by slot
//   position), so a combo row (e.g. segment "Engaged 240D" + list "Safety Sector
//   Customer List") populates BOTH campaign.segment AND campaign.list. The core
//   12-field contract is unchanged. The audience_2_* columns are OPTIONAL: an
//   older export without them behaves exactly as a single-audience row.
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

// OPTIONAL columns. Deliberately NOT part of EXPECTED_HEADERS: the importer's
// strict header check must keep passing for OLD exports that lack them (get()
// returns null when a column is absent). Newer exports that include them enable
// the feature. Documented + read here so both stay in sync.
//
// campaign_type/seasonal_trigger/focus_category/priority are the Sep–Dec 2026
// planning-taxonomy Single Select columns (added to RDD+SS Bases 2026-09-18) —
// optional because older exports/rows predate them.
const OPTIONAL_HEADERS = [
  'audience_2_type', 'audience_2_name', 'audience_2_id', 'cadence',
  'campaign_type', 'seasonal_trigger', 'focus_category', 'priority',
];

// A real campaign_id is BRAND-YEAR-<segment>(-<segment>...): plain-numeric
// (RDD-2026-28), the CLAUDE.md §10 week format (RDD-2026-W39), or a structural
// cadence-token id (RDD-2026-HOL-fathers-day, SS-2026-LAUNCH-mobility-...).
// Used to reject the "Past campaigns" divider and any stray label row (neither
// of which carries a BRAND-YEAR- prefix at all).
//
// FIXED 2026-09 (SYSTEM PATCH: Campaign-ID Format Gap): the previous pattern
// (`^[A-Za-z]+-\d{4}-\d+$`, digits-only after the year) silently classified
// EVERY Www-format or cadence-token id as a divider/label row and dropped it —
// found live against RDD-2026-HOL-fathers-day / RDD-2026-CAT-sit-stand-workspace
// / RDD-2026-W38 while verifying Phase 1's default-to-Lark change (all three
// were being skipped, invisible to every resolution path: getCampaignById,
// week lookup, and getNextCampaign alike). cadenceFromId() below already
// parsed the token format correctly — classifyRow's own gate was stricter than
// the rest of the system and never let those rows reach it.
const CAMPAIGN_ID_RE = /^[A-Za-z]+-\d{4}-[A-Za-z0-9]+(-[A-Za-z0-9]+)*$/;

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

// "Promotional sale" → "promotional-sale". Used for topic_category_slug.
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

// Infer cadence from the campaign_id's type token (CLAUDE.md §10 naming
// conventions). Only OFFICIALLY SUPPORTED structural tokens are recognized —
// a plain numeric ID (e.g. RDD-2026-38) returns null because it is NOT a
// safe structural signal (it could be Weekly, Monthly, or anything else).
const CADENCE_TOKENS = {
  LAUNCH: 'product-launch',
  HOL: 'holiday',
  SEA: 'seasonal',
  CAT: 'category',
  CLR: 'clearance',
  STORY: 'brand-story',
  EDU: 'educational',
  AUTO: 'automation',
};

function cadenceFromId(campaignId) {
  const s = str(campaignId);
  if (!s) return null;
  // Match BRAND-YEAR-TOKEN-slug pattern (e.g. SS-2026-LAUNCH-mobility)
  const m = s.match(/^[A-Za-z]+-\d{4}-([A-Z]+)-/);
  if (m && CADENCE_TOKENS[m[1]]) return CADENCE_TOKENS[m[1]];
  return null;
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

// Route BOTH audience slots (primary audience_* + optional secondary audience_2_*)
// into list/segment BY TYPE, not by slot position. A combo row therefore yields
// both campaign.list and campaign.segment. Single-audience rows are unchanged
// (the secondary slot is absent → contributes nothing). Unknown/"popup" types are
// ignored (popup rows are already filtered upstream by classifyRow). If two slots
// share a type, the first non-empty wins (the core model has one list + one
// segment; two-of-a-kind is out of scope and documented as such).
function routeAudiences(get) {
  const slots = [
    { type: (str(get('audience_type')) || '').toLowerCase(), name: str(get('audience_name')) },
    { type: (str(get('audience_2_type')) || '').toLowerCase(), name: str(get('audience_2_name')) },
  ];
  let list = null;
  let segment = null;
  for (const s of slots) {
    if (!s.name) continue;
    if (s.type === 'list') { if (list == null) list = s.name; }
    else if (s.type === 'segment') { if (segment == null) segment = s.name; }
  }
  return { list, segment };
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

// Map one kept raw row into the typed campaign object: the 13 Calendar Service
// fields + preserved planning extras. `get(colName)` returns the raw cell value.
function mapRow(get) {
  const campaignId = str(get('campaign_id'));
  const audience = routeAudiences(get); // primary + optional secondary, routed by type

  return {
    // ── the 13 fields the Calendar Service normalizes ──────────────────────
    campaign_id: campaignId,
    brand: brandFromId(campaignId),
    cadence: str(get('cadence')) || cadenceFromId(campaignId),
    topic_category_slug: slug(get('topic_category')),  // XLSX topic_category = the TYPE
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
    // NOTE: campaign_type_label is the human label of topic_category_slug's SAME
    // source column (topic_category) — a different concept from the `campaign_type`
    // extra below (the Lark human taxonomy column). Similar names, different columns;
    // see the file-header note above.
    campaign_type_label: str(get('topic_category')),
    key_topic: str(get('key_topic')),
    tone: str(get('tone')),
    status: str(get('status')),
    notes: str(get('notes')),
    audience_type: str(get('audience_type')),
    audience_id: str(get('audience_id')),
    // secondary audience slot (optional; null on single-audience rows) — kept raw
    // for audit/round-trip, in addition to being routed into list/segment above.
    audience_2_type: str(get('audience_2_type')),
    audience_2_name: str(get('audience_2_name')),
    audience_2_id: str(get('audience_2_id')),
    // Sep–Dec 2026 planning taxonomy (optional; null on rows/exports that predate
    // it) — imported so a Lark edit is never silently discarded, but NOT consumed
    // by any Klaviyo payload builder today (planning-tier only; see file header).
    campaign_type: str(get('campaign_type')),
    seasonal_trigger: str(get('seasonal_trigger')),
    focus_category: str(get('focus_category')),
    priority: str(get('priority')),
    // Hierarchy/grouping link (e.g. "Past campaigns"). Read-only passthrough —
    // display text only (the link's target record ids are not resolvable from
    // this primitive-valued getter); never used for eligibility gating (status
    // is — see calendar-service.js INELIGIBLE_STATUSES).
    parent_items: str(get('Parent items')),
  };
}

module.exports = {
  SHEET_NAME,
  EXPECTED_HEADERS,
  OPTIONAL_HEADERS,
  CAMPAIGN_ID_RE,
  str,
  toIsoDate,
  slug,
  brandFromId,
  cadenceFromId,
  buildPromotion,
  splitAudience,
  routeAudiences,
  classifyRow,
  mapRow,
};
