// ---------------------------------------------------------------------------
// json-provider.js — Content Calendar provider backed by a JSON file (T-now).
//
// Reads the `campaigns` array from config/content-calendar.json (or any JSON
// file / in-memory object injected for tests). Read-only; never writes.
// ---------------------------------------------------------------------------

'use strict';

const fs = require('fs');
const path = require('path');
const { CalendarProvider } = require('./base-provider');
const { REPO_ROOT } = require('../../../common/config');
const { ConfigError } = require('../../../common/errors');

// Staleness guard for the MACHINE-GENERATED calendar file (config/campaign-
// calendar.generated.json). It carries a `_generatedAt` timestamp (written by
// import-xlsx.js) recording when it was last produced from an exported Lark
// XLSX. Since campaign-generator.js switched the DEFAULT calendar source to
// live Lark (SYSTEM PATCH: Stale Calendar Guard), this JSON path is now the
// explicit `--calendar json` fallback — but a fallback that silently drives a
// campaign off week-old data is exactly the failure mode that caused
// RDD-2026-40 to resolve the wrong date/topic/audience (2026-09 audit). A hand-
// authored file (config/content-calendar.json, or any injected `data`/fixture
// without `_generatedAt`) never carries this field, so it is never gated —
// this check applies ONLY to a real generated-JSON export.
const STALE_WARN_DAYS = 3;
const STALE_BLOCK_DAYS = 10;

class JsonCalendarProvider extends CalendarProvider {
  // opts: { filePath?, data?, logger?, allowStale? }
  //   filePath   — path to a JSON calendar file (default config/content-calendar.json)
  //   data       — an already-parsed calendar object (bypasses the file; used in tests)
  //   logger     — optional; used for the staleness WARN (never for the BLOCK, which throws)
  //   allowStale — explicit escape hatch (operator knowingly wants offline/stale data);
  //                bypasses STALE_BLOCK_DAYS but the WARN is still logged
  constructor(opts = {}) {
    super('json-provider');
    this.filePath = opts.filePath || path.join(REPO_ROOT, 'config', 'content-calendar.json');
    this._data = opts.data || null;
    this.logger = opts.logger || null;
    this.allowStale = Boolean(opts.allowStale);
  }

  _load() {
    if (this._data) return this._data;
    if (!fs.existsSync(this.filePath)) {
      throw new ConfigError(`Content calendar file not found: ${this.filePath}`, { path: this.filePath });
    }
    try {
      return JSON.parse(fs.readFileSync(this.filePath, 'utf8'));
    } catch (err) {
      throw new ConfigError(`Content calendar is not valid JSON: ${this.filePath} (${err.message})`);
    }
  }

  _checkStaleness(doc) {
    const generatedAt = doc && doc._generatedAt;
    if (!generatedAt) return; // hand-authored / injected data — not the generated file, never gated

    const ageMs = Date.now() - Date.parse(generatedAt);
    if (!Number.isFinite(ageMs)) return; // unparsable timestamp — don't block on a malformed field
    const ageDays = ageMs / 86400000;

    if (ageDays >= STALE_BLOCK_DAYS && !this.allowStale) {
      throw new ConfigError(
        `${this.filePath} was generated ${ageDays.toFixed(1)} day(s) ago (${generatedAt}) — ` +
          `>= ${STALE_BLOCK_DAYS} days is treated as stale and refused. Re-run \`npm run calendar:import\` ` +
          `against a fresh Lark export, use \`--calendar lark\` for the live calendar, or pass an explicit ` +
          `allowStale override if you deliberately want this offline snapshot.`,
        { path: this.filePath, generatedAt, ageDays }
      );
    }
    if (ageDays >= STALE_WARN_DAYS) {
      const msg = `Calendar JSON (${path.basename(this.filePath)}) is ${ageDays.toFixed(1)} day(s) old ` +
        `(generated ${generatedAt}) — live Lark may have moved on. Prefer --calendar lark, or re-import.`;
      if (this.logger && typeof this.logger.warn === 'function') this.logger.warn(msg);
      // eslint-disable-next-line no-console
      else console.warn(`[calendar] WARN: ${msg}`);
    }
  }

  async listCampaigns() {
    const doc = this._load();
    this._checkStaleness(doc);
    const rows = Array.isArray(doc && doc.campaigns) ? doc.campaigns : [];
    return rows;
  }
}

module.exports = { JsonCalendarProvider, STALE_WARN_DAYS, STALE_BLOCK_DAYS };
