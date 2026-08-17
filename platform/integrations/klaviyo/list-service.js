// ---------------------------------------------------------------------------
// list-service.js — read-only Klaviyo List Service (T5).
//
// Retrieves and resolves Klaviyo Lists on top of the verified transport client.
// It is strictly READ-ONLY: GET /lists/ and GET /lists/{id}/ only. It creates
// nothing, writes nothing, and has no send/schedule surface (the no-send guard
// in safety.js scans this file automatically).
//
// The client is injected (dependency injection) so the service is unit-testable
// offline with a mocked client. Returns clean typed list objects:
//   { id, name, created, updated }
// ---------------------------------------------------------------------------

'use strict';

const { IntegrationError } = require('../../common/errors');

// Klaviyo paginates via an absolute `links.next` URL. The client prepends
// apiBaseUrl to a relative path, so reduce the next URL to the part after
// "/api" and re-issue it as a relative GET.
function toRelativePath(nextUrl) {
  if (!nextUrl) return null;
  const marker = '/api';
  const i = nextUrl.indexOf(marker);
  return i >= 0 ? nextUrl.slice(i + marker.length) : nextUrl;
}

// Shape a raw JSON:API list resource into the small object callers need.
function shapeList(resource) {
  const a = (resource && resource.attributes) || {};
  return {
    id: resource && resource.id,
    name: a.name != null ? a.name : null,
    created: a.created != null ? a.created : null,
    updated: a.updated != null ? a.updated : null,
  };
}

function createListService({ client, logger = null } = {}) {
  if (!client || typeof client.get !== 'function') {
    throw new IntegrationError('createListService requires a Klaviyo client with a get() method.');
  }

  function log(level, msg, data) {
    if (logger && typeof logger[level] === 'function') logger[level](msg, data);
  }

  // Retrieve ALL lists, following pagination to completion.
  async function listAll() {
    const out = [];
    let pathname = '/lists/';
    let pages = 0;
    while (pathname) {
      // eslint-disable-next-line no-await-in-loop
      const json = await client.get(pathname);
      const data = Array.isArray(json && json.data) ? json.data : [];
      for (const resource of data) out.push(shapeList(resource));
      pages += 1;
      pathname = toRelativePath(json && json.links && json.links.next);
    }
    log('debug', `Retrieved ${out.length} Klaviyo list(s) across ${pages} page(s).`);
    return out;
  }

  // Resolve a list by exact name (case-insensitive, trimmed). Returns the typed
  // list or null. If several lists share the name (Klaviyo permits duplicates),
  // returns the first and logs a warning.
  async function resolveByName(name) {
    const needle = String(name == null ? '' : name).trim().toLowerCase();
    if (!needle) return null;
    const all = await listAll();
    const matches = all.filter((l) => (l.name || '').trim().toLowerCase() === needle);
    if (matches.length > 1) log('warn', `Multiple lists named "${name}" (${matches.length}); using the first.`);
    return matches[0] || null;
  }

  // Resolve a list by id. Returns the typed list, or null if it does not exist
  // (404). Any other transport error propagates.
  async function resolveById(id) {
    const listId = String(id == null ? '' : id).trim();
    if (!listId) return null;
    try {
      const json = await client.get(`/lists/${encodeURIComponent(listId)}/`);
      const resource = json && (Array.isArray(json.data) ? json.data[0] : json.data);
      return resource ? shapeList(resource) : null;
    } catch (err) {
      if (err instanceof IntegrationError && err.details && err.details.status === 404) return null;
      throw err;
    }
  }

  // Validate that a configured audience list exists. `audience` is the shape
  // produced by loadKlaviyoConfig: { type, id, name }. Prefers id, then name.
  // Read-only. Returns { ok, list, reason }.
  async function validateConfiguredList(audience = {}) {
    if (audience.id) {
      const byId = await resolveById(audience.id);
      return byId
        ? { ok: true, list: byId, reason: null }
        : { ok: false, list: null, reason: `Configured list id "${audience.id}" not found in Klaviyo.` };
    }
    if (audience.name) {
      const byName = await resolveByName(audience.name);
      return byName
        ? { ok: true, list: byName, reason: null }
        : { ok: false, list: null, reason: `Configured list name "${audience.name}" not found in Klaviyo.` };
    }
    return { ok: false, list: null, reason: 'No audience list configured (klaviyo.audience.id|name is empty).' };
  }

  return { listAll, resolveByName, resolveById, validateConfiguredList };
}

module.exports = { createListService, shapeList, toRelativePath };
