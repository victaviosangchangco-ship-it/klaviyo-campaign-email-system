// ---------------------------------------------------------------------------
// campaign-generator.js — THE canonical campaign-aware generation path
// (SYSTEM PATCH: Safe One-Command Routing).
//
// Root cause this closes: the plain `create` CLI path used to call
// runWeeklyPipeline() directly, without ever resolving an exact calendar
// campaign — so CampaignThemePackage/theme-relevance/hero-relevance never
// engaged and an incoherent draft could be produced (RDD-2026-39 validation).
//
// Every generation entry point (plain `create`, `--klaviyo`) must resolve a
// campaign and run the pipeline through THIS module — never re-implement
// campaign resolution or re-invoke the pipeline without an attached campaign.
//
//   exact campaign_id / --week / getNextCampaign  (resolveCalendarCampaign)
//     → calendar record
//     → runWeeklyPipeline({ options: { calendarCampaign } })
//         → CampaignThemePackage → product discovery → relevance gates → QA → Draft
//
// If no campaign resolves, resolveCalendarCampaign THROWS (ApprovalRequired) —
// there is no fallback to generic/unresolved generation.
// ---------------------------------------------------------------------------

'use strict';

const path = require('path');
const { runWeeklyPipeline } = require('./pipeline');
const { createCalendarService } = require('../integrations/calendar/calendar-service');
const { JsonCalendarProvider } = require('../integrations/calendar/providers/json-provider');
const { LarkCalendarProvider } = require('../integrations/calendar/providers/lark-provider');
const { isoWeekId } = require('../integrations/calendar/adapter');
const { ApprovalRequired } = require('../common/errors');

// Deterministically pick ONE calendar campaign. Precedence:
//   1. explicit campaignId (--campaign) — exact id, brand-checked
//   2. a target ISO week (--week, else the current week):
//        • exactly one match → use it
//        • MORE than one     → refuse (never silently take the first); the caller
//                              must disambiguate with --campaign
//        • none, and --week was explicit → error
//        • none, and no --week          → fall back to the soonest upcoming campaign
// Read-only: uses only the Calendar Service query surface (no service change).
async function resolveCalendarCampaign({ calendarService, brandCode, campaignId = null, week = null, now = new Date() }) {
  const brand = String(brandCode).toUpperCase();

  if (campaignId) {
    const c = await calendarService.getCampaignById(campaignId);
    if (!c) {
      throw new ApprovalRequired(`No calendar campaign with id "${campaignId}". Run \`npm run calendar:import\` and check config/campaign-calendar.generated.json.`);
    }
    if (String(c.brand).toUpperCase() !== brand) {
      throw new ApprovalRequired(`Campaign ${c.campaign_id} is brand ${c.brand}, not ${brand}. Pass the matching --brand.`);
    }
    if (week && c.send_date) {
      const actualWeek = isoWeekId(new Date(c.send_date));
      if (actualWeek !== week) {
        throw new ApprovalRequired(
          `Campaign ${c.campaign_id} (send_date ${c.send_date}) belongs to ISO week ${actualWeek}, ` +
            `but --week requested ${week}. Use the correct --campaign or correct --week.`
        );
      }
    }
    return c;
  }

  const targetWeek = week || isoWeekId(now);
  const all = await calendarService.listCampaigns({ brand });
  const inWeek = all.filter((c) => c.send_date && isoWeekId(new Date(c.send_date)) === targetWeek);

  if (inWeek.length === 1) return inWeek[0];
  if (inWeek.length > 1) {
    const ids = inWeek.map((c) => c.campaign_id).join(', ');
    throw new ApprovalRequired(
      `${inWeek.length} ${brand} campaigns are planned for ${targetWeek} (${ids}). ` +
        `Pick one explicitly with --campaign <id> — the engine will not choose for you.`
    );
  }

  // Nothing in the target week.
  if (week) {
    throw new ApprovalRequired(`No ${brand} campaign planned for ${week}. Check the calendar or pass --campaign <id>.`);
  }
  const next = await calendarService.getNextCampaign({ brand, now });
  if (!next) {
    throw new ApprovalRequired(`No upcoming ${brand} campaign on/after ${now.toISOString().slice(0, 10)}. Import the latest calendar or pass --campaign <id>.`);
  }
  return next;
}

// The ONE place calendar-source selection lives. DEFAULT is now LIVE LARK
// (SYSTEM PATCH: Stale Calendar Guard, 2026-09) — the generated runtime JSON
// (config/campaign-calendar.generated.json) is an EXPLICIT fallback only
// (`--calendar json`), never the silent default. This closes the gap found in
// the 2026-09 audit: the JSON export had drifted from live Lark (wrong date/
// topic/audience for RDD-2026-40) while every automated run kept reading it
// unnoticed. Both generation entry points build their calendar service through
// this function, so the default applies everywhere uniformly.
function buildCalendarService({ repoRoot, brand, platformConfig, options = {}, logger = null }) {
  const calendarSource = String(options.calendarSource || 'lark').toLowerCase();
  if (calendarSource === 'json') {
    const calendarRel = (platformConfig.paths && platformConfig.paths.calendar) || 'config/campaign-calendar.generated.json';
    const calendarFile = path.isAbsolute(calendarRel) ? calendarRel : path.join(repoRoot, calendarRel);
    logger && logger.info && logger.info(`Calendar source: generated runtime JSON (${calendarRel}) — EXPLICIT fallback, may be stale.`);
    return createCalendarService({
      provider: new JsonCalendarProvider({ filePath: calendarFile, logger, allowStale: Boolean(options.allowStaleCalendar) }),
      logger,
    });
  }
  logger && logger.info && logger.info(`Calendar source: LIVE Lark Base API (brand ${brand.code}) — read-only (default).`);
  return createCalendarService({ provider: new LarkCalendarProvider({ brand: brand.code, logger }), logger });
}

// Run the Weekly pipeline for an ALREADY-RESOLVED campaign. The campaign is
// always attached as options.calendarCampaign, so CampaignThemePackage/theme
// relevance/hero relevance always engage — this is the only call site that
// invokes runWeeklyPipeline for a real (non-test) generation.
async function runResolvedWeeklyPipeline({ ctx, campaign, runPipeline }) {
  const { repoRoot, brand, platformConfig, calendarConfig, logger, options, runId, generatedAt } = ctx;
  const run = runPipeline || runWeeklyPipeline;
  return run({
    repoRoot, brand, platformConfig, calendarConfig, logger, runId, generatedAt,
    options: { ...options, date: new Date(campaign.send_date), calendarCampaign: campaign },
  });
}

// THE canonical campaign-aware generation path (no Klaviyo). Resolves an exact
// campaign (or throws) and runs the pipeline with it attached. Both the plain
// `create` CLI path and `--klaviyo` (live-orchestrator) resolve campaigns
// through resolveCalendarCampaign; this function is the one non-Klaviyo caller.
async function generateWeeklyCampaign(ctx, deps = {}) {
  const { repoRoot, brand, platformConfig, options } = ctx;
  const calendarService = deps.calendarService || buildCalendarService({ repoRoot, brand, platformConfig, options, logger: ctx.logger });
  const now = options.date instanceof Date ? options.date : new Date();
  const campaign = await resolveCalendarCampaign({
    calendarService,
    brandCode: brand.code,
    campaignId: options.campaign || null,
    week: options.week || null,
    now,
  });
  const pipelineResult = await runResolvedWeeklyPipeline({ ctx, campaign, runPipeline: deps.runPipeline });
  return { ...pipelineResult, campaign };
}

module.exports = {
  resolveCalendarCampaign,
  buildCalendarService,
  runResolvedWeeklyPipeline,
  generateWeeklyCampaign,
};
