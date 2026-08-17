// ---------------------------------------------------------------------------
// lark-provider.js — Content Calendar provider backed by the Lark Base API.
//
// PRIMARY read path for the Campaign Calendar, MULTI-BRAND:
//
//     Lark Base (SS)  ─┐
//     Lark Base (RDD) ─┼→ LarkBitableClient (GET, paginated)
//     Lark Base (…)   ─┘     → this provider (normalize + map + guard)
//                              → Calendar Service            (unchanged)
//
//     new LarkCalendarProvider({ brand: 'SS' })   → only the SS Base
//     new LarkCalendarProvider({ brand: 'RDD' })  → only the RDD Base
//     new LarkCalendarProvider()                  → every configured calendar
//
// ONE provider class for every brand — no per-brand subclass, no second calendar
// abstraction, and the read-only CalendarProvider contract is unchanged.
//
// The XLSX importer (import/import-xlsx.js) remains the FALLBACK path and is
// untouched — `npm run calendar:import` still works exactly as before.
//
// Field semantics are NOT redefined here. This provider reuses the pure mapping
// module the XLSX importer already uses (import/xlsx-mapping.js): the same
// classifyRow() filters and the same mapRow() field map, including the documented
// quirks (Lark `topic_category` is the campaign TYPE; the system's
// `topic_category` carries `product_categories`; `preview_text` and `send_time`
// are absent from the source and are never invented). That guarantees API output
// ≈ XLSX-import output, so downstream campaign logic needs no source-specific code.
//
// BRAND CONTAMINATION GUARD: a row whose campaign_id prefix does not match the
// calendar's brand key is never returned. If a calendar yields ONLY foreign rows,
// that is a mis-pointed appToken and the read fails loudly (ConfigError) rather
// than feeding another brand's campaigns into the pipeline (CLAUDE.md §12).
//
// READ-ONLY: listCampaigns() is the only method, and the underlying client can
// issue GET requests only. No record is created, updated, or deleted.
// ---------------------------------------------------------------------------

'use strict';

const { CalendarProvider } = require('./base-provider');
const { ConfigError } = require('../../../common/errors');
const mapping = require('../import/xlsx-mapping');
const { loadLarkConfig, getCalendarForBrand, resolveAppSecret, LEGACY_BRAND_KEY } = require('../../lark/config');
const { LarkAuth } = require('../../lark/auth');
const { LarkBitableClient } = require('../../lark/bitable-client');

// Columns whose Lark value is a date field (epoch) rather than free text.
const DATE_FIELDS = new Set(['scheduled_date']);

// ── Lark field-value normalization ─────────────────────────────────────────
// A Lark Base cell can be a scalar, an array of rich-text segments, a person
// array, a link object, or a formula/lookup wrapper. Reduce any of those to the
// primitive (string | number | boolean | null) the shared mapping expects.
function larkFieldToPrimitive(value) {
  if (value == null) return null;

  const t = typeof value;
  if (t === 'string' || t === 'number' || t === 'boolean') return value;

  if (Array.isArray(value)) {
    const parts = value
      .map((v) => larkFieldToPrimitive(v))
      .filter((v) => v != null && String(v).trim() !== '');
    return parts.length ? parts.join(', ') : null;
  }

  if (t === 'object') {
    // Rich-text segment {type,text}; URL {link,text}; link field {text,text_arr,…}
    if (typeof value.text === 'string') return value.text;
    if (Array.isArray(value.text_arr)) return larkFieldToPrimitive(value.text_arr);
    // Person / user objects
    if (typeof value.name === 'string') return value.name;
    if (typeof value.en_name === 'string') return value.en_name;
    if (typeof value.link === 'string') return value.link;
    // Formula / lookup wrapper {type, value:[…]}
    if ('value' in value) return larkFieldToPrimitive(value.value);
    return null;
  }

  return null;
}

// Convert a Lark date-field value to something xlsx-mapping.toIsoDate handles
// correctly. Lark returns epoch milliseconds (sometimes seconds); toIsoDate treats
// a bare number as an EXCEL SERIAL, so an epoch must be converted to a Date here
// or the date would be wildly wrong.
//
// offsetMinutes shifts the instant before the date is read at UTC, so a Base
// whose date fields are stored at local midnight resolves to the intended
// calendar day. Default 0 (interpret at UTC) — see config/lark-calendar.json.
function larkDateToDate(value, offsetMinutes = 0) {
  if (value == null || value === '') return null;

  const n = typeof value === 'number' ? value : Number(value);
  if (Number.isFinite(n) && Math.abs(n) >= 1e11) return new Date(n + offsetMinutes * 60000); // ms
  if (Number.isFinite(n) && Math.abs(n) >= 1e9) return new Date(n * 1000 + offsetMinutes * 60000); // s

  // Anything else (ISO string, etc.) is passed through for toIsoDate to parse.
  return value;
}

// Build a case/whitespace-insensitive `get(columnName)` over one Lark record's
// fields, matching the accessor contract mapRow()/classifyRow() already expect.
function makeFieldGetter(fields = {}, { dateTimezoneOffsetMinutes = 0 } = {}) {
  const index = new Map();
  for (const [key, value] of Object.entries(fields || {})) {
    index.set(String(key).trim().toLowerCase(), value);
  }

  return function get(name) {
    const raw = index.get(String(name).trim().toLowerCase());
    if (raw === undefined) return null; // absent field → null (never invented)
    const primitive = larkFieldToPrimitive(raw);
    if (DATE_FIELDS.has(name)) return larkDateToDate(primitive, dateTimezoneOffsetMinutes);
    return primitive;
  };
}

// Deterministic order, identical to the importer's: send_date, then campaign_id.
function sortCampaigns(campaigns) {
  return campaigns.sort((a, b) => {
    if (a.send_date !== b.send_date) return String(a.send_date).localeCompare(String(b.send_date));
    return String(a.campaign_id).localeCompare(String(b.campaign_id));
  });
}

// Map API records → the same raw campaign rows the XLSX importer produces,
// applying the same skip rules. Returns { campaigns, skipped, skipReasons }.
function mapRecords(records = [], { dateTimezoneOffsetMinutes = 0 } = {}) {
  const campaigns = [];
  const skipped = [];
  const skipReasons = {};

  for (const record of records) {
    const get = makeFieldGetter(record && record.fields, { dateTimezoneOffsetMinutes });

    const reason = mapping.classifyRow(get);
    if (reason) {
      skipReasons[reason] = (skipReasons[reason] || 0) + 1;
      skipped.push({ campaign_id: mapping.str(get('campaign_id')), reason });
      continue;
    }
    campaigns.push(mapping.mapRow(get));
  }

  return { campaigns: sortCampaigns(campaigns), skipped, skipReasons };
}

// Split mapped rows into the calendar's own brand vs foreign rows.
// Skipped for the legacy DEFAULT key, where no brand expectation exists.
function partitionByBrand(campaigns, expectedBrand) {
  if (!expectedBrand || expectedBrand === LEGACY_BRAND_KEY) {
    return { kept: campaigns, foreign: [] };
  }
  const kept = [];
  const foreign = [];
  for (const row of campaigns) {
    if (row.brand && String(row.brand).toUpperCase() !== expectedBrand) foreign.push(row);
    else kept.push(row);
  }
  return { kept, foreign };
}

class LarkCalendarProvider extends CalendarProvider {
  // opts:
  //   brand?       — read only this brand's calendar (e.g. 'SS')
  //   brands?      — read this explicit set of brands
  //                  (neither → every configured calendar)
  //   client?      — an object with listRecords() (injected in tests)
  //   config?      — a pre-loaded loadLarkConfig() result
  //   appSecret?   — injected secret (tests / callers that already hold it)
  //   cacheTtlMs?  — override the per-calendar TTL cache (0 disables)
  //   logger?, fetchImpl?, nowImpl?
  constructor(opts = {}) {
    super('lark-provider');
    this.opts = opts;
    this.logger = opts.logger || null;
    this.brand = opts.brand ? String(opts.brand).toUpperCase() : null;
    this.brands = Array.isArray(opts.brands) ? opts.brands.map((b) => String(b).toUpperCase()) : null;

    this._client = opts.client || null;
    this._config = opts.config || null;
    this._now = opts.nowImpl || (() => Date.now());
    this._cache = new Map(); // brand → { rows, expiresAt }
    this.lastSummary = null;
  }

  _log(level, msg, data) {
    if (this.logger && typeof this.logger[level] === 'function') this.logger[level](msg, data);
  }

  // Resolve config lazily so constructing the provider never touches the disk.
  _resolveConfig() {
    if (this._config) return this._config;
    this._config = loadLarkConfig({
      overrides: {
        baseUrl: this.opts.baseUrl,
        appToken: this.opts.appToken,
        tableId: this.opts.tableId,
        viewId: this.opts.viewId,
        pageSize: this.opts.pageSize,
        dateTimezoneOffsetMinutes: this.opts.dateTimezoneOffsetMinutes,
      },
    });
    return this._config;
  }

  // Which calendars this read covers. Explicit brand(s) win; otherwise all.
  _targetCalendars(config) {
    if (this.brand) return [getCalendarForBrand(config, this.brand)];
    if (this.brands) return this.brands.map((b) => getCalendarForBrand(config, b));

    const all = config.brands.map((b) => config.calendars[b]);
    if (!all.length) {
      throw new ConfigError('No Lark calendars are configured.', { configured: config.brands });
    }
    return all;
  }

  // ONE auth + ONE HTTP client for every calendar — a second client would mean a
  // second token exchange for no reason.
  _resolveClient(config) {
    if (this._client) return this._client;

    if (!config.hasAppId) {
      throw new ConfigError(
        `Lark App ID is not configured. Set ${config.appIdEnvVar} in ${config.envPath} (git-ignored).`,
        { envVar: config.appIdEnvVar }
      );
    }

    const appSecret = this.opts.appSecret || resolveAppSecret();
    if (!appSecret) {
      throw new ConfigError(
        `Lark App Secret is not configured. Set ${config.appSecretEnvVar} in ${config.envPath} ` +
          '(git-ignored; never commit it).',
        { envVar: config.appSecretEnvVar }
      );
    }

    const auth = new LarkAuth({
      baseUrl: config.baseUrl,
      appId: config.appId,
      appSecret, // injected; never logged
      logger: this.logger,
      fetchImpl: this.opts.fetchImpl,
    });

    this._client = new LarkBitableClient({
      baseUrl: config.baseUrl,
      auth,
      logger: this.logger,
      fetchImpl: this.opts.fetchImpl,
    });
    return this._client;
  }

  _ttlFor(cal) {
    return this.opts.cacheTtlMs != null ? Number(this.opts.cacheTtlMs) : Number(cal.cacheTtlMs || 0);
  }

  _cacheGet(cal) {
    const ttl = this._ttlFor(cal);
    if (!ttl) return null;
    const hit = this._cache.get(cal.brand);
    if (hit && this._now() < hit.expiresAt) return hit;
    return null;
  }

  _cacheSet(cal, rows, summary) {
    const ttl = this._ttlFor(cal);
    if (!ttl) return;
    this._cache.set(cal.brand, { rows, summary, expiresAt: this._now() + ttl });
  }

  // Drop cached rows (all brands, or one).
  invalidateCache(brand = null) {
    if (brand) this._cache.delete(String(brand).toUpperCase());
    else this._cache.clear();
  }

  // Read + map + guard ONE calendar.
  async _readCalendar(client, cal) {
    const cached = this._cacheGet(cal);
    if (cached) {
      this._log('debug', `Lark calendar ${cal.brand}: served ${cached.rows.length} row(s) from cache.`);
      return { rows: cached.rows, summary: { ...cached.summary, cached: true } };
    }

    const { records, pages, total } = await client.listRecords({
      appToken: cal.appToken,
      tableId: cal.tableId,
      viewId: cal.viewId,
      pageSize: cal.pageSize,
    });

    if (!records.length) {
      const summary = { brand: cal.brand, read: 0, written: 0, skipped: 0, foreign: 0, skipReasons: {}, pages, total, cached: false };
      this._log('warn', `Lark calendar ${cal.brand} (${cal.label}) returned no records.`, {
        tableId: cal.tableId,
        viewId: cal.viewId,
      });
      this._cacheSet(cal, [], summary);
      return { rows: [], summary };
    }

    // Fail loud rather than silently returning nothing if the table/view is not
    // a Campaign Calendar (e.g. a tableId pointed at another table).
    const hasCampaignId = records.some((r) => makeFieldGetter(r && r.fields)('campaign_id') != null);
    if (!hasCampaignId) {
      throw new ConfigError(
        `Lark calendar "${cal.brand}" (table ${cal.tableId}) returned ${records.length} record(s) but none ` +
          'carry a "campaign_id" field. Check appToken / tableId / viewId in config/lark-calendar.json.',
        { brand: cal.brand, tableId: cal.tableId, viewId: cal.viewId }
      );
    }

    const { campaigns, skipped, skipReasons } = mapRecords(records, {
      dateTimezoneOffsetMinutes: cal.dateTimezoneOffsetMinutes,
    });

    // ── brand contamination guard ────────────────────────────────────────────
    const { kept, foreign } = partitionByBrand(campaigns, cal.brand);

    if (foreign.length && kept.length === 0) {
      // Every row belongs to another brand → this appToken points at the wrong Base.
      const seen = [...new Set(foreign.map((r) => r.brand))].join(', ');
      throw new ConfigError(
        `Lark calendar "${cal.brand}" contains NO ${cal.brand} campaigns — every row belongs to: ${seen}. ` +
          `The appToken for "${cal.brand}" almost certainly points at the wrong Base. Refusing the read.`,
        { brand: cal.brand, foundBrands: seen, appTokenTail: String(cal.appToken).slice(-4) }
      );
    }

    if (foreign.length) {
      // A partial mismatch is a data-entry problem, not a mis-pointed Base:
      // reject those rows (never leak another brand's campaigns) and warn loudly.
      this._log(
        'warn',
        `Lark calendar ${cal.brand}: REJECTED ${foreign.length} foreign row(s) — ` +
          `${foreign.map((r) => `${r.campaign_id} (${r.brand})`).join(', ')}. ` +
          'A campaign_id prefix must match its calendar brand.',
        { brand: cal.brand, rejected: foreign.map((r) => r.campaign_id) }
      );
    }

    const summary = {
      brand: cal.brand,
      label: cal.label,
      read: records.length,
      written: kept.length,
      skipped: skipped.length,
      foreign: foreign.length,
      foreignIds: foreign.map((r) => r.campaign_id),
      skipReasons,
      pages,
      total,
      cached: false,
    };

    this._cacheSet(cal, kept, summary);
    this._log('debug', `Lark calendar ${cal.brand}: ${kept.length}/${records.length} record(s) mapped.`, summary);
    return { rows: kept, summary };
  }

  // Read the configured calendar(s) and return raw campaign rows in the same
  // shape the XLSX importer produces. Read-only.
  async listCampaigns() {
    const config = this._resolveConfig();
    const calendars = this._targetCalendars(config);
    const client = this._resolveClient(config);

    const all = [];
    const byBrand = {};

    for (const cal of calendars) {
      const { rows, summary } = await this._readCalendar(client, cal);
      byBrand[cal.brand] = summary;
      all.push(...rows);
    }

    this.lastSummary = {
      brands: calendars.map((c) => c.brand),
      read: Object.values(byBrand).reduce((n, s) => n + s.read, 0),
      written: Object.values(byBrand).reduce((n, s) => n + s.written, 0),
      skipped: Object.values(byBrand).reduce((n, s) => n + s.skipped, 0),
      foreign: Object.values(byBrand).reduce((n, s) => n + s.foreign, 0),
      byBrand,
    };

    return sortCampaigns(all);
  }
}

module.exports = {
  LarkCalendarProvider,
  // exported for unit tests
  larkFieldToPrimitive,
  larkDateToDate,
  makeFieldGetter,
  mapRecords,
  partitionByBrand,
  DATE_FIELDS,
};
