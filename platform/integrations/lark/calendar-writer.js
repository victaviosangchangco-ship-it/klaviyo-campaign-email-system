// ---------------------------------------------------------------------------
// calendar-writer.js — GUARDED, EXPLICIT write path for the Lark Campaign Calendar.
//
// Deliberately a SEPARATE module from bitable-client.js. That client remains
// read-only by construction (zero write methods, asserted by a test), so the
// read path keeps its guarantee and nothing that only reads can ever write.
//
// What this module can do:
//   • updateRecords — change named fields on EXPLICITLY allow-listed record ids
//   • createRecords — add new records whose campaign_id does not already exist
//
// What it can NOT do, by construction:
//   • delete anything (no delete method exists, and none may be added)
//   • write a field outside ALLOWED_FIELDS (the calendar schema)
//   • write to a record id that does not exist in that brand's Base
//   • write to another brand's Base (appToken is matched to the brand)
//   • write more than maxBatch records in one call (no arbitrary bulk)
//   • write at all without an explicit `{ confirm: true }` at the call site
//
// EVERY write is a two-step flow: plan* (pure, no network write, returns the exact
// payload) → apply* (requires confirm:true). A plan can be printed for human
// approval and applied later unchanged.
//
// SECURITY: the tenant token comes from the injected LarkAuth per request and is
// placed only in the Authorization header. Never logged, never persisted.
// ---------------------------------------------------------------------------

'use strict';

const { IntegrationError, ConfigError } = require('../../common/errors');

// The Campaign Calendar schema. A field not in this set can never be written —
// this is what stops an accidental write to an unrelated or unknown column.
const ALLOWED_FIELDS = new Set([
  'campaign_id',
  'name',
  'topic_category',
  'subject_line',
  'scheduled_date',
  'product_categories',
  'key_topic',
  'promo_code',
  'promo_text',
  'tone',
  'audience_type',
  'audience_id',
  'audience_name',
  // secondary audience slot (multi-audience support; additive, type-routed in mapping)
  'audience_2_type',
  'audience_2_name',
  'audience_2_id',
  'status',
  'notes',
  // Planning taxonomy fields (Sep–Dec 2026 seasonal-calendar rework). Single
  // Select columns created via calendar-field-manager.js before these are ever
  // written to. `status` itself is deliberately NOT touched by this rollout.
  'campaign_type',
  'seasonal_trigger',
  'focus_category',
  'priority',
  // Hierarchy/grouping: a self-referential link field pointing at a parent row
  // (e.g. the "Past campaigns" group). Value on write is an array of record ids.
  'Parent items',
]);

// campaign_id is the calendar's primary key; changing it on an existing record
// would silently re-identify a campaign. Updatable only on create.
const IMMUTABLE_ON_UPDATE = new Set(['campaign_id']);

// Link fields hold an array of record ids on write, and read back as an array of
// rich link objects [{ record_ids:[...], text, ... }]. They need array-of-ids
// validation and a record-id-set comparison on verify (not the text comparator).
const LINK_FIELDS = new Set(['Parent items']);

function linkRecordIds(v) {
  if (!Array.isArray(v)) return [];
  const ids = [];
  for (const x of v) {
    if (typeof x === 'string') ids.push(x);
    else if (x && Array.isArray(x.record_ids)) ids.push(...x.record_ids);
    else if (x && typeof x.id === 'string') ids.push(x.id);
  }
  return ids.filter(Boolean);
}

function linkValuesEqual(requested, actual) {
  const a = [...new Set(linkRecordIds(requested))].sort();
  const b = [...new Set(linkRecordIds(actual))].sort();
  return a.length === b.length && a.every((x, i) => x === b[i]);
}

const DEFAULTS = { timeoutMs: 15000, maxBatch: 20, maxRetries: 3, backoffBaseMs: 300 };

// The Base stores a date as 16:00Z on the PREVIOUS day (midnight at UTC+8).
// Verified exactly against three existing records. Encode the same way so the
// Lark UI shows the intended day.
function encodeCalendarDate(isoDate) {
  const m = String(isoDate).match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!m) throw new ConfigError(`encodeCalendarDate expects YYYY-MM-DD, got "${isoDate}".`);
  return Date.UTC(Number(m[1]), Number(m[2]) - 1, Number(m[3])) - 8 * 3600 * 1000;
}

function decodeCalendarDate(ms) {
  return new Date(Number(ms) + 8 * 3600 * 1000).toISOString().slice(0, 10);
}

const str = (v) =>
  typeof v === 'string' ? v : (Array.isArray(v) && v[0] && v[0].text) || (v && v.text) || null;

// Compare a requested field value to the value read back from the Base, tolerant
// of the Base's storage shapes: a date is epoch-ms (number), a text field may come
// back as a plain string OR a rich-text array [{text}]. Used by verifyWrite so a
// "success" HTTP response is never trusted on its own (spec §6).
function valuesEqual(requested, actual) {
  if (typeof requested === 'number' || typeof actual === 'number') {
    const a = Number(requested);
    const b = Number(actual);
    if (Number.isFinite(a) && Number.isFinite(b)) return a === b;
  }
  const sr = str(requested);
  const sa = str(actual);
  if (sr != null || sa != null) return String(sr) === String(sa);
  return requested === actual;
}

class LarkCalendarWriter {
  // opts: { baseUrl, auth, brand, calendar, reader, logger?, fetchImpl?, maxBatch? }
  //   calendar — the brand's entry from loadLarkConfig().calendars
  //   reader   — a LarkBitableClient (used to verify ids before any write)
  constructor(opts = {}) {
    if (!opts.baseUrl) throw new ConfigError('LarkCalendarWriter requires baseUrl.');
    if (!opts.auth || typeof opts.auth.getTenantAccessToken !== 'function') {
      throw new ConfigError('LarkCalendarWriter requires an auth object with getTenantAccessToken().');
    }
    if (!opts.brand) throw new ConfigError('LarkCalendarWriter requires a brand.');
    if (!opts.calendar || !opts.calendar.appToken || !opts.calendar.tableId) {
      throw new ConfigError('LarkCalendarWriter requires a calendar with appToken and tableId.');
    }
    // Cross-brand guard: the calendar handed in must BE this brand's calendar.
    if (String(opts.calendar.brand).toUpperCase() !== String(opts.brand).toUpperCase()) {
      throw new ConfigError(
        `Cross-brand write refused: writer brand "${opts.brand}" does not match calendar brand "${opts.calendar.brand}".`,
        { brand: opts.brand, calendarBrand: opts.calendar.brand }
      );
    }

    this.baseUrl = String(opts.baseUrl).replace(/\/$/, '');
    this.auth = opts.auth;
    this.brand = String(opts.brand).toUpperCase();
    this.calendar = opts.calendar;
    this.reader = opts.reader || null;
    this.logger = opts.logger || null;
    this.maxBatch = opts.maxBatch ?? DEFAULTS.maxBatch;
    this.timeoutMs = opts.timeoutMs ?? DEFAULTS.timeoutMs;
    this.maxRetries = opts.maxRetries ?? DEFAULTS.maxRetries;
    this.backoffBaseMs = opts.backoffBaseMs ?? DEFAULTS.backoffBaseMs;
    this._fetch = opts.fetchImpl || globalThis.fetch;
    this._sleep = opts.sleepImpl || ((ms) => new Promise((r) => setTimeout(r, ms)));

    if (typeof this._fetch !== 'function') {
      throw new ConfigError('No fetch implementation available (Node >= 18 or inject fetchImpl).');
    }
  }

  _log(level, msg, data) {
    if (this.logger && typeof this.logger[level] === 'function') this.logger[level](msg, data);
  }

  // Read the brand's records once, so plans can be validated against reality.
  async _existing() {
    if (!this.reader) {
      throw new ConfigError('LarkCalendarWriter requires a reader to validate record ids before writing.');
    }
    const { records } = await this.reader.listRecords({
      appToken: this.calendar.appToken,
      tableId: this.calendar.tableId,
      viewId: this.calendar.viewId,
      pageSize: this.calendar.pageSize,
    });
    const byId = new Map();
    const byCampaign = new Map();
    for (const r of records) {
      byId.set(r.record_id, r);
      const cid = str(r.fields && r.fields.campaign_id);
      if (cid) byCampaign.set(cid, r);
    }
    return { records, byId, byCampaign };
  }

  _validateFields(fields, { isCreate }) {
    const errors = [];
    if (!fields || typeof fields !== 'object' || !Object.keys(fields).length) {
      errors.push('no fields supplied');
      return errors;
    }
    for (const key of Object.keys(fields)) {
      if (!ALLOWED_FIELDS.has(key)) {
        errors.push(`field "${key}" is not in the Campaign Calendar schema — refusing to write it`);
      } else if (!isCreate && IMMUTABLE_ON_UPDATE.has(key)) {
        errors.push(`field "${key}" is immutable on update (it identifies the campaign)`);
      } else if (LINK_FIELDS.has(key)) {
        const v = fields[key];
        const ok = Array.isArray(v) && v.length > 0 && v.every((x) => typeof x === 'string' && /^rec/.test(x));
        if (!ok) errors.push(`field "${key}" must be a non-empty array of record ids (e.g. ["recXXXX"])`);
      }
    }
    return errors;
  }

  // ── PLAN (pure — performs a READ to validate, never a write) ───────────────

  // updates: [{ recordId, fields, reason? }]
  async planUpdates(updates = []) {
    if (!Array.isArray(updates) || !updates.length) {
      throw new ConfigError('planUpdates requires a non-empty array of updates.');
    }
    if (updates.length > this.maxBatch) {
      throw new ConfigError(
        `Refusing a batch of ${updates.length} updates (max ${this.maxBatch}). Split it — no arbitrary bulk writes.`
      );
    }

    const { byId } = await this._existing();
    const items = [];
    const errors = [];

    for (const u of updates) {
      const rowErrors = [];
      const existing = byId.get(u.recordId);
      if (!existing) {
        rowErrors.push(`record id "${u.recordId}" does not exist in the ${this.brand} Base`);
      }
      rowErrors.push(...this._validateFields(u.fields, { isCreate: false }));

      const before = {};
      if (existing) {
        for (const key of Object.keys(u.fields || {})) before[key] = existing.fields[key];
      }

      if (rowErrors.length) errors.push({ recordId: u.recordId, errors: rowErrors });
      else items.push({ record_id: u.recordId, fields: u.fields, _before: before, _reason: u.reason || null });
    }

    return {
      brand: this.brand,
      operation: 'update',
      appToken: this.calendar.appToken,
      tableId: this.calendar.tableId,
      ok: errors.length === 0,
      errors,
      count: items.length,
      items,
    };
  }

  // creates: [{ fields, reason? }]  — campaign_id must be present and unused
  async planCreates(creates = []) {
    if (!Array.isArray(creates) || !creates.length) {
      throw new ConfigError('planCreates requires a non-empty array of records.');
    }
    if (creates.length > this.maxBatch) {
      throw new ConfigError(
        `Refusing a batch of ${creates.length} creates (max ${this.maxBatch}). Split it — no arbitrary bulk writes.`
      );
    }

    const { byCampaign } = await this._existing();
    const items = [];
    const errors = [];
    const seen = new Set();

    for (const c of creates) {
      const rowErrors = this._validateFields(c.fields, { isCreate: true });
      const cid = str(c.fields && c.fields.campaign_id);

      if (!cid) rowErrors.push('campaign_id is required on a new record');
      else {
        if (byCampaign.has(cid)) rowErrors.push(`campaign_id "${cid}" already exists — refusing to create a duplicate`);
        if (seen.has(cid)) rowErrors.push(`campaign_id "${cid}" appears twice in this batch`);
        seen.add(cid);
        // Cross-brand guard on the payload itself.
        const prefix = cid.split('-')[0].toUpperCase();
        if (prefix !== this.brand) {
          rowErrors.push(`campaign_id "${cid}" is brand ${prefix}, not ${this.brand} — cross-brand write refused`);
        }
      }

      if (rowErrors.length) errors.push({ campaignId: cid, errors: rowErrors });
      else items.push({ fields: c.fields, _reason: c.reason || null });
    }

    return {
      brand: this.brand,
      operation: 'create',
      appToken: this.calendar.appToken,
      tableId: this.calendar.tableId,
      ok: errors.length === 0,
      errors,
      count: items.length,
      items,
    };
  }

  // ── APPLY (the only methods that issue a write) ────────────────────────────

  // Core write. IDEMPOTENCY SAFETY: a write is retried ONLY when the request was
  // provably NOT processed — a 429 (rate-limited, rejected) or a 401 (auth
  // rejected before processing, refreshed once). A 5xx or a network/timeout error
  // on a write is AMBIGUOUS (it may have been applied), so it is never auto-retried
  // — it is surfaced, and verifyWrite() is what establishes the true final state.
  async _write(method, pathname, body) {
    let allowAuthRetry = true;
    let lastErr = null;
    for (let attempt = 0; attempt <= this.maxRetries; attempt++) {
      if (attempt > 0) await this._sleep(this.backoffBaseMs * 2 ** (attempt - 1));
      const token = await this.auth.getTenantAccessToken();

      let res;
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), this.timeoutMs);
      try {
        res = await this._fetch(`${this.baseUrl}${pathname}`, {
          method,
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json; charset=utf-8',
          },
          body: JSON.stringify(body),
          signal: controller.signal,
        });
      } catch (err) {
        clearTimeout(timer);
        // Ambiguous — do NOT auto-retry a write on a network/timeout error.
        throw new IntegrationError(`Lark Base write failed: ${err.message}`, { system: 'lark' });
      }
      clearTimeout(timer);

      // 401 → rejected (not processed); refresh the token once and retry.
      if (res.status === 401 && allowAuthRetry) {
        this.auth.invalidate?.();
        allowAuthRetry = false;
        continue;
      }
      // 429 → rate-limited and NOT processed; safe to retry a write.
      if (res.status === 429 && attempt < this.maxRetries) {
        lastErr = new IntegrationError('Lark Base HTTP 429 — retrying', { system: 'lark', status: 429 });
        continue;
      }

      let parsed;
      try {
        parsed = await res.json();
      } catch (err) {
        throw new IntegrationError(`Lark Base write returned a non-JSON response (HTTP ${res.status}).`, {
          system: 'lark',
          status: res.status,
        });
      }
      if (!res.ok || !parsed || parsed.code !== 0) {
        const code = parsed && parsed.code;
        const msg = (parsed && parsed.msg) || `HTTP ${res.status}`;
        throw new IntegrationError(`Lark Base write failed (code ${code ?? 'n/a'}): ${msg}`, {
          system: 'lark',
          code: code ?? null,
          status: res.status,
        });
      }
      return parsed.data || {};
    }
    throw lastErr || new IntegrationError('Lark Base write failed after retries.', { system: 'lark' });
  }

  _post(pathname, body) {
    return this._write('POST', pathname, body);
  }

  _put(pathname, body) {
    return this._write('PUT', pathname, body);
  }

  // A plan is applied verbatim. confirm MUST be exactly true.
  async applyUpdates(plan, { confirm = false } = {}) {
    if (!plan || plan.operation !== 'update') throw new ConfigError('applyUpdates requires an update plan.');
    if (!plan.ok) throw new ConfigError('Refusing to apply a plan that failed validation.', { errors: plan.errors });
    if (confirm !== true) {
      throw new ConfigError('applyUpdates requires an explicit { confirm: true }. Nothing was written.');
    }
    const records = plan.items.map((i) => ({ record_id: i.record_id, fields: i.fields }));
    const data = await this._post(
      `/bitable/v1/apps/${encodeURIComponent(plan.appToken)}/tables/${encodeURIComponent(plan.tableId)}/records/batch_update`,
      { records }
    );
    this._log('info', `Lark calendar ${this.brand}: updated ${records.length} record(s).`);
    return data;
  }

  async applyCreates(plan, { confirm = false } = {}) {
    if (!plan || plan.operation !== 'create') throw new ConfigError('applyCreates requires a create plan.');
    if (!plan.ok) throw new ConfigError('Refusing to apply a plan that failed validation.', { errors: plan.errors });
    if (confirm !== true) {
      throw new ConfigError('applyCreates requires an explicit { confirm: true }. Nothing was written.');
    }
    const records = plan.items.map((i) => ({ fields: i.fields }));
    const data = await this._post(
      `/bitable/v1/apps/${encodeURIComponent(plan.appToken)}/tables/${encodeURIComponent(plan.tableId)}/records/batch_create`,
      { records }
    );
    this._log('info', `Lark calendar ${this.brand}: created ${records.length} record(s).`);
    return data;
  }

  // Single-record update via the official PUT endpoint
  // (PUT /bitable/v1/apps/{app_token}/tables/{table_id}/records/{record_id}).
  // Used for the common "update one campaign" path; a multi-record plan goes
  // through applyUpdates (batch_update) instead. Same guards, same confirm gate.
  async applyUpdateOne(plan, { confirm = false } = {}) {
    if (!plan || plan.operation !== 'update') throw new ConfigError('applyUpdateOne requires an update plan.');
    if (!plan.ok) throw new ConfigError('Refusing to apply a plan that failed validation.', { errors: plan.errors });
    if (!Array.isArray(plan.items) || plan.items.length !== 1) {
      throw new ConfigError('applyUpdateOne handles exactly one record; use applyUpdates for a batch.');
    }
    if (confirm !== true) {
      throw new ConfigError('applyUpdateOne requires an explicit { confirm: true }. Nothing was written.');
    }
    const it = plan.items[0];
    const data = await this._put(
      `/bitable/v1/apps/${encodeURIComponent(plan.appToken)}/tables/${encodeURIComponent(plan.tableId)}/records/${encodeURIComponent(it.record_id)}`,
      { fields: it.fields }
    );
    this._log('info', `Lark calendar ${this.brand}: updated record ${it.record_id} via PUT.`);
    return data;
  }

  // RE-READ + VERIFY (spec §6). After a write, read the affected records back and
  // compare each written field's ACTUAL stored value to what was requested. A 2xx
  // write response is never trusted on its own. Returns
  //   { ok, verified, mismatches:[{recordId|campaignId, field, requested, actual}], results }.
  async verifyWrite(plan) {
    if (!plan || (plan.operation !== 'update' && plan.operation !== 'create')) {
      throw new ConfigError('verifyWrite requires an update or create plan.');
    }
    const { byId, byCampaign } = await this._existing();
    const results = [];

    if (plan.operation === 'update') {
      for (const it of plan.items) {
        const rec = byId.get(it.record_id);
        for (const [field, requested] of Object.entries(it.fields)) {
          const actual = rec ? rec.fields[field] : undefined;
          const cmp = LINK_FIELDS.has(field) ? linkValuesEqual : valuesEqual;
          results.push({ recordId: it.record_id, field, requested, actual, match: Boolean(rec) && cmp(requested, actual) });
        }
      }
    } else {
      for (const it of plan.items) {
        const cid = str(it.fields.campaign_id);
        const rec = byCampaign.get(cid);
        for (const [field, requested] of Object.entries(it.fields)) {
          const actual = rec ? rec.fields[field] : undefined;
          const cmp = LINK_FIELDS.has(field) ? linkValuesEqual : valuesEqual;
          results.push({ campaignId: cid, field, requested, actual, match: Boolean(rec) && cmp(requested, actual) });
        }
      }
    }

    const mismatches = results.filter((r) => !r.match);
    if (mismatches.length) {
      this._log('warn', `Lark calendar ${this.brand}: write verification found ${mismatches.length} mismatch(es).`);
    }
    return { ok: mismatches.length === 0, verified: results.length, mismatches, results };
  }

  // Apply a plan then verify it (READ → VALIDATE → PLAN → WRITE → RE-READ → VERIFY).
  // Routes a single-record update through PUT and a multi-record update through
  // batch_update; a create through batch_create. Requires confirm:true. Returns
  //   { applied, verify }.
  async applyAndVerify(plan, { confirm = false } = {}) {
    let applied;
    if (plan && plan.operation === 'create') {
      applied = await this.applyCreates(plan, { confirm });
    } else if (plan && plan.operation === 'update' && Array.isArray(plan.items) && plan.items.length === 1) {
      applied = await this.applyUpdateOne(plan, { confirm });
    } else {
      applied = await this.applyUpdates(plan, { confirm });
    }
    const verify = await this.verifyWrite(plan);
    return { applied, verify };
  }
}

module.exports = {
  LarkCalendarWriter,
  ALLOWED_FIELDS,
  IMMUTABLE_ON_UPDATE,
  LINK_FIELDS,
  linkValuesEqual,
  encodeCalendarDate,
  decodeCalendarDate,
};
