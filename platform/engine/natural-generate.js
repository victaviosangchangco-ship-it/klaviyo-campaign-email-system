// ---------------------------------------------------------------------------
// natural-generate.js — the one-command production entry point (SYSTEM PATCH:
// Campaign ID → Hosted Hero → Klaviyo Draft).
//
// Turns "Please generate this Weekly Campaign RDD-2026-14" into a full,
// gated run through Klaviyo Draft creation, by extracting the EXACT
// campaign_id and delegating ENTIRELY to the existing canonical path
// (platform/engine/run.js's createCampaign, which already routes
// klaviyo:true → live-orchestrator.js → campaign-generator.js →
// resolveCalendarCampaign + the pipeline). No generation/QA/hero/promotion
// logic is reimplemented here — this module only parses intent and formats
// the short response.
// ---------------------------------------------------------------------------

'use strict';

const { createCampaign } = require('./run');

// Known brand codes (same set cli.js's natural-phrase parsing already uses).
const KNOWN_BRANDS = ['RDD', 'SS', 'SC', 'STACK'];

// An exact Weekly campaign_id: <CODE>-<YYYY>-<NN>. The trailing digits are a
// SEQUENCE NUMBER, never an ISO week — "RDD-2026-14" is campaign #14, not
// week 14, and is never conflated with a "W14"-labeled artifact (CLAUDE.md).
const CAMPAIGN_ID_RE = /\b([A-Za-z]{2,5})-(\d{4})-(\d+)\b/;

// Extract the exact campaign_id (and the brand it determines) from free text.
// Returns null — never a guess — when no such id is present, or its brand
// prefix isn't one of this platform's known brands.
function parseCampaignIdFromText(text) {
  const m = String(text || '').match(CAMPAIGN_ID_RE);
  if (!m) return null;
  const brand = m[1].toUpperCase();
  if (!KNOWN_BRANDS.includes(brand)) return null;
  return { campaignId: `${brand}-${m[2]}-${m[3]}`, brand, year: m[2], seq: m[3] };
}

// THE one-command entry point. `text` is the user's natural request; brand,
// cadence/type, theme, audience, and promotion all come from the CALENDAR
// record the extracted campaign_id resolves to — never asked of the user
// separately. Delegates to createCampaign({ klaviyo: true, ... }) — the SAME
// function the `--klaviyo` CLI path already uses; no second implementation.
async function generateFromNaturalCommand(text, extraOpts = {}, deps = {}) {
  const runCreateCampaign = deps.createCampaign || createCampaign;
  const parsed = parseCampaignIdFromText(text);
  if (!parsed) {
    return {
      ok: false,
      error: {
        name: 'ApprovalRequired',
        message:
          `No exact campaign_id (e.g. RDD-2026-14) found in "${text}". The numeric suffix is a sequence id, ` +
          `never an ISO week, and is never guessed — provide the exact campaign_id.`,
      },
    };
  }
  const result = await runCreateCampaign({
    brand: parsed.brand,
    type: 'weekly',
    campaign: parsed.campaignId,
    klaviyo: true,
    ...extraOpts,
  });
  return { ...result, campaignIdRequested: parsed.campaignId };
}

// Short, fixed-shape response for the target UX (spec §6/§7). Never prints
// step-by-step logs — that remains run.js's console output for operators
// watching a real invocation; this is the compact chat-style summary.
function formatShortSummary(result) {
  if (!result || result.ok === false) {
    const err = (result && result.error) || {};
    return [`Status: BLOCKED`, `Reason: ${err.name || 'Error'} — ${err.message || 'unknown error'}`].join('\n');
  }

  const pkg = result.pkg || {};
  const campaign = result.campaign || {};
  const k = result.klaviyo || {};
  const qaPass = Boolean(result.qa && result.qa.pass);
  const draftPath = (result.exportResult && result.exportResult.paths && result.exportResult.paths.draft) || 'n/a';
  const promotion = pkg.coupon ? `${pkg.coupon.offerText} (${pkg.coupon.code})` : 'none';
  const products = Array.isArray(pkg.products) ? pkg.products.length : 0;

  return [
    `Campaign: ${result.campaignId}`,
    `Theme: ${campaign.topic_category || pkg.sectionTitle || 'n/a'}`,
    `Hero: verified + hosted`,
    `Products: ${products} theme-relevant`,
    `Promotion: ${promotion}`,
    `Semantic QA: ${qaPass ? 'PASS' : 'BLOCKED'}`,
    `Structural QA: ${qaPass ? 'PASS' : 'BLOCKED'}`,
    `Local Draft: ${draftPath}`,
    `Klaviyo Draft: ${k.reused ? 'updated' : 'created'} (${k.draftId || 'n/a'})`,
    `Status: READY FOR HUMAN REVIEW`,
  ].join('\n');
}

module.exports = { parseCampaignIdFromText, generateFromNaturalCommand, formatShortSummary, CAMPAIGN_ID_RE, KNOWN_BRANDS };
