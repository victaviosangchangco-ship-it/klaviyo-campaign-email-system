// ---------------------------------------------------------------------------
// segment-service.js — read-only Klaviyo Segment Service (T6).
//
// The Segments API is structurally identical to Lists, so this mirrors
// list-service.js and REUSES its pagination helper (toRelativePath) rather than
// duplicating it. Strictly READ-ONLY: GET /segments/ and GET /segments/{id}/
// only. Creates nothing, writes nothing, and has no send/schedule surface
// (the no-send guard scans this file automatically).
//
// Client is injected (unit-testable offline). Returns clean typed objects:
//   { id, name, created, updated, isActive, isProcessing }
// ---------------------------------------------------------------------------

'use strict';

const { IntegrationError } = require('../../common/errors');
const { toRelativePath } = require('./list-service'); // reuse (T5)

// Shape a raw JSON:API segment resource. Includes isActive/isProcessing because
// they matter when choosing a send-ready audience (an inactive or still-building
// segment is a poor target).
function shapeSegment(resource) {
  const a = (resource && resource.attributes) || {};
  return {
    id: resource && resource.id,
    name: a.name != null ? a.name : null,
    created: a.created != null ? a.created : null,
    updated: a.updated != null ? a.updated : null,
    isActive: a.is_active != null ? a.is_active : null,
    isProcessing: a.is_processing != null ? a.is_processing : null,
  };
}

function createSegmentService({ client, logger = null } = {}) {
  if (!client || typeof client.get !== 'function') {
    throw new IntegrationError('createSegmentService requires a Klaviyo client with a get() method.');
  }

  function log(level, msg, data) {
    if (logger && typeof logger[level] === 'function') logger[level](msg, data);
  }

  // Retrieve ALL segments, following pagination to completion.
  async function listAll() {
    const out = [];
    let pathname = '/segments/';
    let pages = 0;
    while (pathname) {
      // eslint-disable-next-line no-await-in-loop
      const json = await client.get(pathname);
      const data = Array.isArray(json && json.data) ? json.data : [];
      for (const resource of data) out.push(shapeSegment(resource));
      pages += 1;
      pathname = toRelativePath(json && json.links && json.links.next);
    }
    log('debug', `Retrieved ${out.length} Klaviyo segment(s) across ${pages} page(s).`);
    return out;
  }

  // Resolve a segment by exact name (case-insensitive, trimmed). Returns the
  // typed segment or null. First match wins if names collide (with a warning).
  async function resolveByName(name) {
    const needle = String(name == null ? '' : name).trim().toLowerCase();
    if (!needle) return null;
    const all = await listAll();
    const matches = all.filter((s) => (s.name || '').trim().toLowerCase() === needle);
    if (matches.length > 1) log('warn', `Multiple segments named "${name}" (${matches.length}); using the first.`);
    return matches[0] || null;
  }

  // Resolve a segment by id. Returns the typed segment, or null on a 404. Other
  // transport errors propagate.
  async function resolveById(id) {
    const segId = String(id == null ? '' : id).trim();
    if (!segId) return null;
    try {
      const json = await client.get(`/segments/${encodeURIComponent(segId)}/`);
      const resource = json && (Array.isArray(json.data) ? json.data[0] : json.data);
      return resource ? shapeSegment(resource) : null;
    } catch (err) {
      if (err instanceof IntegrationError && err.details && err.details.status === 404) return null;
      throw err;
    }
  }

  // Validate that a configured audience segment exists. `audience` is the shape
  // produced by loadKlaviyoConfig: { type, id, name }. Prefers id, then name.
  // Read-only. Returns { ok, segment, reason }.
  async function validateConfiguredSegment(audience = {}) {
    if (audience.id) {
      const byId = await resolveById(audience.id);
      return byId
        ? { ok: true, segment: byId, reason: null }
        : { ok: false, segment: null, reason: `Configured segment id "${audience.id}" not found in Klaviyo.` };
    }
    if (audience.name) {
      const byName = await resolveByName(audience.name);
      return byName
        ? { ok: true, segment: byName, reason: null }
        : { ok: false, segment: null, reason: `Configured segment name "${audience.name}" not found in Klaviyo.` };
    }
    return { ok: false, segment: null, reason: 'No audience segment configured (klaviyo.audience.id|name is empty).' };
  }

  return { listAll, resolveByName, resolveById, validateConfiguredSegment };
}

module.exports = { createSegmentService, shapeSegment };
