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
// Typed campaign object (exactly these 13 fields; missing values → null):
//   campaign_id, brand, cadence, topic_category_slug, campaign_name, topic_category,
//   subject_line, preview_text, send_date, send_time, promotion, segment, list
//
// cadence = structural workflow (weekly, monthly, product-launch, holiday, …).
// topic_category_slug = a slug DERIVED FROM topic_category (product-insights,
//   promotional-sale, …) — an automation-internal classification, NOT the same
//   concept as the Lark taxonomy field literally named "campaign_type" (Product
//   Focus/Seasonal/BAU/Promo/Educational — a human planning field, carried as a
//   raw passthrough extra; see xlsx-mapping.js). Renamed 2026-09 (SYSTEM PATCH:
//   Campaign-Type Collision Fix) after both fields shared the name "campaign_type"
//   with unrelated meanings and only one was ever actually read on import.
// Playbook/template/folder routing uses cadence. Content/theme decisions use
// topic_category_slug.
// ---------------------------------------------------------------------------

'use strict';

const { isoWeekId } = require('./adapter'); // reuse existing week math (unchanged)
const { PlatformError, ApprovalRequired } = require('../../common/errors');

const FIELDS = [
  'campaign_id', 'brand', 'cadence', 'topic_category_slug', 'campaign_name', 'topic_category',
  'subject_line', 'preview_text', 'send_date', 'send_time', 'promotion', 'segment', 'list',
];

// Statuses that must NEVER be auto-resolved as "the" campaign for a week/next
// lookup (SYSTEM PATCH: Status Eligibility Gate, 2026-09). Before this, a
// superseded or already-sent row with a date/week overlapping a real active
// campaign could only be disambiguated by luck (e.g. an unrelated "2 campaigns
// this week" collision) — a LONE superseded/sent row in its own week would
// resolve silently as if it were the active plan (confirmed against live SS
// data: SS-2026-34, status=superseded, no colliding sibling that week).
//
// Deliberately a BLOCKLIST, not an allowlist: unknown/null status (e.g. the
// common 'pending'/'planned' values, or a status string not yet in this set)
// stays ELIGIBLE, so existing/unanticipated status values are never silently
// excluded. Only applies to AUTO-resolution (listCampaigns/
// getCampaignByWeek/getNextCampaign) — an explicit getCampaignById lookup is
// NEVER gated, so a historical/superseded campaign can always still be looked
// up deliberately by its exact id (audits, dedup checks, etc.).
const INELIGIBLE_STATUSES = new Set(['sent', 'superseded', 'archived', 'cancelled', 'canceled']);

function isEligibleStatus(c) {
  const s = c && c.status != null ? String(c.status).trim().toLowerCase() : '';
  return !INELIGIBLE_STATUSES.has(s);
}

// Normalize a raw provider row into the typed object. The 13 core FIELDS are
// always present (null-filled). Any additional PLANNING EXTRAS the source carries
// (e.g. key_topic, tone, status, notes, campaign_type_label) are passed through
// unchanged so the content layer can use them — they never replace a core field.
// Rows without extras (e.g. content-calendar.json) still yield exactly 13 keys.
function normalizeCampaign(raw = {}) {
  const out = { ...raw };
  for (const f of FIELDS) out[f] = raw[f] != null ? raw[f] : null;
  return out;
}

// `activeOnly` (default true) applies the status eligibility gate — set it to
// false explicitly to see every row regardless of status (audits/reporting).
function matchesFilter(c, { brand, type, activeOnly = true } = {}) {
  if (brand && String(c.brand).toUpperCase() !== String(brand).toUpperCase()) return false;
  if (type && String(c.topic_category_slug).toLowerCase() !== String(type).toLowerCase()) return false;
  if (activeOnly && !isEligibleStatus(c)) return false;
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
  // ISO week of its send_date. Optional brand/type filter. Returns the single
  // match or null. THROWS if multiple campaigns match — the caller must
  // disambiguate with an exact campaign_id.
  async function getCampaignByWeek(isoWeek, filter = {}) {
    const week = String(isoWeek == null ? '' : isoWeek).trim();
    if (!week) return null;
    const all = await _all();
    const matches = all.filter((c) => {
      if (!matchesFilter(c, filter)) return false;
      const ms = sendDateMs(c);
      return ms != null && isoWeekId(new Date(ms)) === week;
    });
    if (matches.length > 1) {
      const ids = matches.map((c) => c.campaign_id).join(', ');
      const brandHint = filter.brand ? ` for brand ${String(filter.brand).toUpperCase()}` : '';
      throw new ApprovalRequired(
        `${matches.length} campaigns${brandHint} are planned in ${week} (${ids}). ` +
          `Pick one explicitly with --campaign <id>.`
      );
    }
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
