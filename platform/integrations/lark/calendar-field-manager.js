// ---------------------------------------------------------------------------
// calendar-field-manager.js — GUARDED field (column) creation for the Lark
// Campaign Calendar table.
//
// Deliberately separate from calendar-writer.js (which writes RECORD values
// into fields that already exist). This module's only job is adding new
// COLUMNS to the table schema, via:
//
//     POST {baseUrl}/bitable/v1/apps/{app_token}/tables/{table_id}/fields
//
// Same guarded shape as the record writer:
//   PLAN  (read existing fields, refuse duplicates, never writes)
//     → [confirm] APPLY (creates fields one at a time)
//     → VERIFY (re-reads the field list, confirms each name now exists)
//
// What this module can NOT do, by construction:
//   • delete or modify an existing field (no such method exists here)
//   • create a field outside the explicit NEW_FIELD_DEFINITIONS allow-list
//   • create anything without an explicit { confirm: true } at the call site
//   • touch record data — that stays in calendar-writer.js
//
// STATUS: prepared but NOT wired into any CLI/runner and NOT executed. Nothing
// in this file runs until a caller explicitly invokes createFields({ confirm: true }).
// ---------------------------------------------------------------------------

'use strict';

const { IntegrationError, ConfigError } = require('../../common/errors');

// Lark Bitable field-type codes (per the Bitable field API).
const FIELD_TYPE = {
  TEXT: 1,
  SINGLE_SELECT: 3,
};

// The 4 planning fields approved for this rollout. audience_segment and
// production_status are deliberately NOT here — out of scope for this pass.
// `status` is not touched by this module at all.
const NEW_FIELD_DEFINITIONS = [
  {
    field_name: 'campaign_type',
    type: FIELD_TYPE.SINGLE_SELECT,
    property: {
      options: [
        { name: 'BAU' },
        { name: 'Seasonal' },
        { name: 'Promo' },
        { name: 'Educational' },
        { name: 'Product Focus' },
      ],
    },
  },
  {
    field_name: 'seasonal_trigger',
    type: FIELD_TYPE.SINGLE_SELECT,
    property: {
      options: [
        { name: 'Spring Trading Floor Refresh' },
        { name: 'National Safe Work Month' },
        { name: 'Events & Peak Foot-Traffic Lead-In' },
        { name: 'Christmas & Venue Readiness' },
        { name: 'Boxing Day / New Year Reset' },
        { name: 'Summer / Outdoor Readiness' },
      ],
    },
  },
  {
    field_name: 'focus_category',
    type: FIELD_TYPE.SINGLE_SELECT,
    property: {
      options: [
        { name: 'Signage & Displays' },
        { name: 'Safety & Compliance' },
        { name: 'Office & Workspace' },
        { name: 'Outdoor Products' },
        { name: 'Events, Conferences & Venues' },
        { name: 'Retail Display & Queue Management' },
      ],
    },
  },
  {
    field_name: 'priority',
    type: FIELD_TYPE.SINGLE_SELECT,
    property: {
      options: [{ name: 'Tier 1' }, { name: 'Tier 2' }, { name: 'BAU' }],
    },
  },
];

function createCalendarFieldManager({ baseUrl, auth, calendar, reader, logger = null, fetchImpl } = {}) {
  if (!baseUrl) throw new ConfigError('createCalendarFieldManager requires baseUrl.');
  if (!auth || typeof auth.getTenantAccessToken !== 'function') {
    throw new ConfigError('createCalendarFieldManager requires an auth object with getTenantAccessToken().');
  }
  if (!calendar || !calendar.appToken || !calendar.tableId) {
    throw new ConfigError('createCalendarFieldManager requires a calendar with appToken and tableId.');
  }
  if (!reader || typeof reader.listFields !== 'function') {
    throw new ConfigError('createCalendarFieldManager requires a reader with listFields() to check for existing fields.');
  }

  const base = String(baseUrl).replace(/\/$/, '');
  const fetchFn = fetchImpl || globalThis.fetch;
  const log = (level, msg, data) => {
    if (logger && typeof logger[level] === 'function') logger[level](msg, data);
  };

  async function _existingFieldNames() {
    const { fields } = await reader.listFields({
      appToken: calendar.appToken,
      tableId: calendar.tableId,
      pageSize: calendar.pageSize,
    });
    return new Set(fields.map((f) => f.field_name));
  }

  // PLAN — pure read, never writes. Refuses any field that already exists so a
  // re-run of this plan can never duplicate a column.
  async function planCreateFields(definitions = NEW_FIELD_DEFINITIONS) {
    const existing = await _existingFieldNames();
    const toCreate = [];
    const skipped = [];
    for (const def of definitions) {
      if (existing.has(def.field_name)) {
        skipped.push({ field_name: def.field_name, reason: 'already exists' });
      } else {
        toCreate.push(def);
      }
    }
    return {
      appToken: calendar.appToken,
      tableId: calendar.tableId,
      ok: true,
      toCreate,
      skipped,
      count: toCreate.length,
      dryRun: true,
    };
  }

  async function _post(pathname, body) {
    const token = await auth.getTenantAccessToken();
    const res = await fetchFn(`${base}${pathname}`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json; charset=utf-8' },
      body: JSON.stringify(body),
    });
    let parsed;
    try {
      parsed = await res.json();
    } catch (err) {
      throw new IntegrationError(`Lark field creation returned a non-JSON response (HTTP ${res.status}).`, {
        system: 'lark',
        status: res.status,
      });
    }
    if (!res.ok || !parsed || parsed.code !== 0) {
      const code = parsed && parsed.code;
      const msg = (parsed && parsed.msg) || `HTTP ${res.status}`;
      throw new IntegrationError(`Lark field creation failed (code ${code ?? 'n/a'}): ${msg}`, {
        system: 'lark',
        code: code ?? null,
        status: res.status,
      });
    }
    return parsed.data || {};
  }

  // APPLY — the only method that writes. Creates fields one at a time (the
  // Bitable fields endpoint is single-field-per-call, unlike batch_create for
  // records) and re-reads the field list afterwards to verify each one landed.
  async function createFields(plan, { confirm = false } = {}) {
    if (!plan || !Array.isArray(plan.toCreate)) {
      throw new ConfigError('createFields requires a plan from planCreateFields().');
    }
    if (confirm !== true) {
      throw new ConfigError('createFields requires an explicit { confirm: true }. Nothing was written.');
    }
    if (!plan.toCreate.length) {
      return { created: [], verify: { ok: true, mismatches: [] } };
    }

    const pathname = `/bitable/v1/apps/${encodeURIComponent(calendar.appToken)}/tables/${encodeURIComponent(calendar.tableId)}/fields`;
    const created = [];
    for (const def of plan.toCreate) {
      const data = await _post(pathname, { field_name: def.field_name, type: def.type, property: def.property });
      created.push({ field_name: def.field_name, field_id: data.field && data.field.field_id });
      log('info', `Lark calendar field created: ${def.field_name}`);
    }

    const afterNames = await _existingFieldNames();
    const mismatches = plan.toCreate.filter((def) => !afterNames.has(def.field_name)).map((def) => ({ field_name: def.field_name }));
    return { created, verify: { ok: mismatches.length === 0, mismatches } };
  }

  return { NEW_FIELD_DEFINITIONS, planCreateFields, createFields };
}

module.exports = { createCalendarFieldManager, NEW_FIELD_DEFINITIONS, FIELD_TYPE };
