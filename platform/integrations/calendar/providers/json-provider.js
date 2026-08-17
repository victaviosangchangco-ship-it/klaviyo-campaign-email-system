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

class JsonCalendarProvider extends CalendarProvider {
  // opts: { filePath?, data? }
  //   filePath — path to a JSON calendar file (default config/content-calendar.json)
  //   data     — an already-parsed calendar object (bypasses the file; used in tests)
  constructor(opts = {}) {
    super('json-provider');
    this.filePath = opts.filePath || path.join(REPO_ROOT, 'config', 'content-calendar.json');
    this._data = opts.data || null;
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

  async listCampaigns() {
    const doc = this._load();
    const rows = Array.isArray(doc && doc.campaigns) ? doc.campaigns : [];
    return rows;
  }
}

module.exports = { JsonCalendarProvider };
