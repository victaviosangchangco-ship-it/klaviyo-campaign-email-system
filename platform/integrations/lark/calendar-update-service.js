// ---------------------------------------------------------------------------
// calendar-update-service.js — the guarded Campaign Calendar UPDATE workflow.
//
// Wires config → auth → read client → LarkCalendarWriter into the safe workflow
// the spec requires:
//
//     RESOLVE brand  →  RESOLVE calendar  →  READ record  →  VALIDATE
//       →  PLAN (CURRENT → PROPOSED, no write)  →  [confirm] WRITE  →  RE-READ  →  VERIFY
//
// Brand isolation is enforced at THREE layers: the calendar is resolved for the
// requested brand only (getCalendarForBrand), the writer's constructor refuses a
// calendar whose brand differs, and this service re-checks the resolved record's
// campaign_id prefix against the brand before building a plan. A write intended
// for one brand can never resolve to another brand's Base.
//
// DRY RUN is the default: planUpdate()/planCreate() perform reads and validation
// but NEVER write. Only apply({ confirm: true }) writes, and it always re-reads
// and verifies afterwards. Nothing here sends or schedules anything in Klaviyo.
//
// Injectable (config / appSecret / fetchImpl) so it is fully unit-testable offline
// with no disk or network access.
// ---------------------------------------------------------------------------

'use strict';

const { loadLarkConfig, getCalendarForBrand, resolveAppSecret } = require('./config');
const { LarkAuth } = require('./auth');
const { LarkBitableClient } = require('./bitable-client');
const {
  LarkCalendarWriter,
  ALLOWED_FIELDS,
  encodeCalendarDate,
  decodeCalendarDate,
} = require('./calendar-writer');
const { ConfigError } = require('../../common/errors');

// Fields stored as a Base date (epoch ms). Human input is YYYY-MM-DD and is
// encoded on the way in / decoded for display.
const DATE_FIELDS = new Set(['scheduled_date']);

const str = (v) =>
  typeof v === 'string' ? v : (Array.isArray(v) && v[0] && v[0].text) || (v && v.text) || null;

// Human-readable value for the CURRENT → PROPOSED preview.
function displayValue(field, raw) {
  if (raw == null) return null;
  if (DATE_FIELDS.has(field)) {
    const n = Number(raw);
    return Number.isFinite(n) && Math.abs(n) >= 1e11 ? decodeCalendarDate(n) : raw;
  }
  return str(raw) != null ? str(raw) : raw;
}

function createCalendarUpdater({
  brand,
  config = null,
  appSecret = null,
  logger = null,
  fetchImpl,
  reader: injectedReader = null,
  writer: injectedWriter = null,
} = {}) {
  const code = String(brand || '').toUpperCase();
  if (!code) throw new ConfigError('createCalendarUpdater requires a brand.');

  const cfg = config || loadLarkConfig();
  // Resolve THIS brand's calendar only — an unknown brand throws here.
  const calendar = getCalendarForBrand(cfg, code);

  let reader = injectedReader;
  let writer = injectedWriter;

  if (!reader || !writer) {
    if (!cfg.hasAppId) {
      throw new ConfigError(`Lark App ID is not configured (${cfg.appIdEnvVar} in ${cfg.envPath}).`, { envVar: cfg.appIdEnvVar });
    }
    const secret = appSecret || resolveAppSecret();
    if (!secret) {
      throw new ConfigError(`Lark App Secret is not configured (${cfg.appSecretEnvVar} in ${cfg.envPath}).`, { envVar: cfg.appSecretEnvVar });
    }
    const auth = new LarkAuth({ baseUrl: cfg.baseUrl, appId: cfg.appId, appSecret: secret, logger, fetchImpl });
    reader = reader || new LarkBitableClient({ baseUrl: cfg.baseUrl, auth, logger, fetchImpl });
    writer = writer || new LarkCalendarWriter({ baseUrl: cfg.baseUrl, auth, brand: code, calendar, reader, logger, fetchImpl });
  }

  async function readAll() {
    const { records } = await reader.listRecords({
      appToken: calendar.appToken,
      tableId: calendar.tableId,
      viewId: calendar.viewId,
      pageSize: calendar.pageSize,
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

  // Normalize a human {field: value} set into a Base payload: reject unknown
  // fields early, encode date fields. (The writer re-validates on plan.)
  function toFields(set) {
    if (!set || typeof set !== 'object' || !Object.keys(set).length) {
      throw new ConfigError('At least one field to set is required.');
    }
    const fields = {};
    for (const [k, v] of Object.entries(set)) {
      if (!ALLOWED_FIELDS.has(k)) {
        throw new ConfigError(`Field "${k}" is not writable — not in the Campaign Calendar schema.`, { field: k });
      }
      fields[k] = DATE_FIELDS.has(k) ? encodeCalendarDate(v) : v;
    }
    return fields;
  }

  // Resolve a record for THIS brand by campaign_id or record_id, enforcing the
  // brand-prefix guard. Throws (STOP) on a missing or cross-brand record.
  async function resolveRecord({ campaignId = null, recordId = null }) {
    if (!campaignId && !recordId) throw new ConfigError('A campaignId or recordId is required.');
    const { byId, byCampaign } = await readAll();
    const rec = recordId ? byId.get(recordId) : byCampaign.get(campaignId);
    if (!rec) {
      throw new ConfigError(
        `No ${code} calendar record found for ${recordId ? `record "${recordId}"` : `campaign "${campaignId}"`}.`,
        { brand: code }
      );
    }
    const cid = str(rec.fields && rec.fields.campaign_id);
    const prefix = String(cid || '').split('-')[0].toUpperCase();
    if (prefix !== code) {
      throw new ConfigError(
        `Record ${rec.record_id} (campaign "${cid}") is brand ${prefix}, not ${code} — refusing cross-brand write.`,
        { brand: code, foundBrand: prefix }
      );
    }
    return { rec, campaignId: cid };
  }

  // DRY-RUN plan for a single-record update. Returns the writer plan plus a
  // human CURRENT → PROPOSED change set. Performs reads only — never writes.
  async function planUpdate({ campaignId = null, recordId = null, set = {}, reason = null }) {
    const fields = toFields(set);
    const { rec, campaignId: cid } = await resolveRecord({ campaignId, recordId });
    const plan = await writer.planUpdates([{ recordId: rec.record_id, fields, reason }]);
    const changes = Object.keys(fields).map((f) => ({
      field: f,
      current: displayValue(f, rec.fields ? rec.fields[f] : undefined),
      proposed: displayValue(f, fields[f]),
      unchanged: valuesEqualLoose(displayValue(f, rec.fields ? rec.fields[f] : undefined), displayValue(f, fields[f])),
    }));
    return {
      brand: code,
      record: { recordId: rec.record_id, campaignId: cid },
      changes,
      plan,
      dryRun: true,
    };
  }

  // DRY-RUN plan for adding a new slot. Never writes.
  async function planCreate({ set = {}, reason = null }) {
    const fields = toFields(set);
    const plan = await writer.planCreates([{ fields, reason }]);
    const preview = Object.keys(fields).map((f) => ({ field: f, proposed: displayValue(f, fields[f]) }));
    return { brand: code, plan, preview, dryRun: true };
  }

  // The ONLY method that writes. Requires confirm:true, applies via the writer
  // (single → PUT, multi → batch_update, create → batch_create), then re-reads and
  // verifies. Returns { applied, verify, ok }.
  async function apply({ plan, confirm = false }) {
    if (!plan) throw new ConfigError('apply requires a plan (from planUpdate/planCreate).');
    if (confirm !== true) {
      throw new ConfigError('apply requires an explicit { confirm: true }. Nothing was written (dry-run is the default).');
    }
    const { applied, verify } = await writer.applyAndVerify(plan, { confirm: true });
    return { applied, verify, ok: verify.ok };
  }

  return { calendar, brand: code, readAll, resolveRecord, planUpdate, planCreate, apply, ALLOWED_FIELDS };
}

// Loose equality for the display layer only (both sides already normalized).
function valuesEqualLoose(a, b) {
  if (a == null && b == null) return true;
  return String(a) === String(b);
}

module.exports = { createCalendarUpdater, DATE_FIELDS, displayValue };
