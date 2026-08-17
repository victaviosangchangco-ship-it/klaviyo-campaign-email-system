// ---------------------------------------------------------------------------
// calendar-service.js — read-only Content Calendar Service.
//
// Source-agnostic: it takes an injected PROVIDER (JSON now; Lark Base / CSV
// later) and turns raw calendar rows into clean typed campaign objects. It
// exposes the query surface the File-Driven System needs to look up "what is
// this week's campaign?" without knowing where the calendar physically lives.
//
// Strictly READ-ONLY. It never creates, schedules, or sends anything. It reuses
// the existing ISO-week helper (calendar/adapter.js) so week math is consistent
// with the rest of the platform, and it does not modify that adapter.
//
// Typed campaign object (exactly these 12 fields; missing values → null):
//   campaign_id, brand, campaign_type, campaign_name, topic_category,
//   subject_line, preview_text, send_date, send_time, promotion, segment, list
// ---------------------------------------------------------------------------

'use strict';

const { isoWeekId } = require('./adapter'); // reuse existing week math (unchanged)
const { PlatformError } = require('../../common/errors');

const FIELDS = [
  'campaign_id', 'brand', 'campaign_type', 'campaign_name', 'topic_category',
  'subject_line', 'preview_text', 'send_date', 'send_time', 'promotion', 'segment', 'list',
];

// Normalize a raw provider row into the typed object. The 12 core FIELDS are
// always present (null-filled). Any additional PLANNING EXTRAS the source carries
// (e.g. key_topic, tone, status, notes, campaign_type_label) are passed through
// unchanged so the content layer can use them — they never replace a core field.
// Rows without extras (e.g. content-calendar.json) still yield exactly 12 keys.
function normalizeCampaign(raw = {}) {
  const out = { ...raw };
  for (const f of FIELDS) out[f] = raw[f] != null ? raw[f] : null;
  return out;
}

function matchesFilter(c, { brand, type } = {}) {
  if (brand && String(c.brand).toUpperCase() !== String(brand).toUpperCase()) return false;
  if (type && String(c.campaign_type).toLowerCase() !== String(type).toLowerCase()) return false;
  return true;
}

// Parse a YYYY-MM-DD send_date to a comparable timestamp (UTC midnight). Returns
// null for missing/invalid dates so they sort last / never match a week.
function sendDateMs(c) {
  if (!c.send_date) return null;
  const t = Date.parse(`${c.send_date}T00:00:00Z`);
  return Number.isFinite(t) ? t : null;
}

function createCalendarService({ provider, logger = null } = {}) {
  if (!provider || typeof provider.listCampaigns !== 'function') {
    throw new PlatformError('createCalendarService requires a provider with a listCampaigns() method.');
  }

  function log(level, msg, data) {
    if (logger && typeof logger[level] === 'function') logger[level](msg, data);
  }

  async function _all() {
    const rows = await provider.listCampaigns();
    return (Array.isArray(rows) ? rows : []).map(normalizeCampaign);
  }

  // List campaigns, optionally filtered by brand and/or type.
  async function listCampaigns(filter = {}) {
    const all = await _all();
    const out = all.filter((c) => matchesFilter(c, filter));
    log('debug', `Calendar: ${out.length}/${all.length} campaign(s) match filter.`, filter);
    return out;
  }

  // Resolve a single campaign by its campaign_id (exact). Returns typed or null.
  async function getCampaignById(campaignId) {
    const needle = String(campaignId == null ? '' : campaignId).trim();
    if (!needle) return null;
    const all = await _all();
    return all.find((c) => c.campaign_id === needle) || null;
  }

  // Resolve the campaign for a given ISO week (e.g. "2026-W33"), matched on the
  // ISO week of its send_date. Optional brand/type filter. Returns the first
  // match (with a warning if several) or null.
  async function getCampaignByWeek(isoWeek, filter = {}) {
    const week = String(isoWeek == null ? '' : isoWeek).trim();
    if (!week) return null;
    const all = await _all();
    const matches = all.filter((c) => {
      if (!matchesFilter(c, filter)) return false;
      const ms = sendDateMs(c);
      return ms != null && isoWeekId(new Date(ms)) === week;
    });
    if (matches.length > 1) log('warn', `Multiple campaigns for ${week} (${matches.length}); using the first. Narrow with a brand filter.`);
    return matches[0] || null;
  }

  // The soonest upcoming campaign on/after `now` (default: current date).
  // Optional brand/type filter. Returns typed or null.
  async function getNextCampaign(filter = {}) {
    const now = filter.now instanceof Date ? filter.now : new Date();
    const cutoff = Date.parse(`${now.toISOString().slice(0, 10)}T00:00:00Z`);
    const all = await _all();
    const upcoming = all
      .filter((c) => matchesFilter(c, filter))
      .map((c) => ({ c, ms: sendDateMs(c) }))
      .filter((x) => x.ms != null && x.ms >= cutoff)
      .sort((a, b) => a.ms - b.ms);
    return upcoming.length ? upcoming[0].c : null;
  }

  return { listCampaigns, getCampaignById, getCampaignByWeek, getNextCampaign };
}

module.exports = { createCalendarService, normalizeCampaign, FIELDS };
