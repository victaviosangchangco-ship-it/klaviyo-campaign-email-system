// ---------------------------------------------------------------------------
// base-provider.js — the Content Calendar provider contract.
//
// A provider is the ONLY thing that knows where calendar rows physically live
// (a JSON file today; Lark Base or a CSV later). Every provider implements one
// read-only method:
//
//     async listCampaigns() -> Array<rawCampaignRow>
//
// The Calendar Service normalizes those raw rows into typed campaign objects, so
// providers may return loosely-shaped rows and the service owns the typing. This
// keeps the service source-agnostic (dependency injection) and makes each
// provider independently swappable and testable.
//
// Read-only: no provider writes to its source.
// ---------------------------------------------------------------------------

'use strict';

const { PlatformError } = require('../../../common/errors');

class CalendarProvider {
  // The name is used in errors/logs so failures say which source was involved.
  constructor(name) {
    this.name = name || 'unnamed-provider';
  }

  // eslint-disable-next-line class-methods-use-this
  async listCampaigns() {
    throw new PlatformError('CalendarProvider.listCampaigns() must be implemented by a subclass.');
  }
}

// Small helper for the not-yet-built providers, so an accidental early use
// fails loudly and clearly rather than silently returning nothing.
function notImplemented(providerName, tracking) {
  return new PlatformError(
    `${providerName} is not implemented yet${tracking ? ` (${tracking})` : ''}. ` +
      `Only the JSON provider is available in this sprint.`
  );
}

module.exports = { CalendarProvider, notImplemented };
