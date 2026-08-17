// ---------------------------------------------------------------------------
// csv-provider.js — Content Calendar provider backed by a CSV export (FUTURE).
//
// Deliberately NOT implemented in this sprint. Placeholder that completes the
// provider architecture and marks the future wiring point. When built it will
// parse a CSV export of the calendar and return the same raw campaign rows.
// ---------------------------------------------------------------------------

'use strict';

const { CalendarProvider, notImplemented } = require('./base-provider');

class CsvCalendarProvider extends CalendarProvider {
  constructor(opts = {}) {
    super('csv-provider');
    this.opts = opts; // e.g. { filePath } — held, not used yet
  }

  // eslint-disable-next-line class-methods-use-this
  async listCampaigns() {
    throw notImplemented('CSV provider', 'roadmap — not connected this sprint');
  }
}

module.exports = { CsvCalendarProvider };
