// ---------------------------------------------------------------------------
// campaign-theme-package.js — CampaignThemePackage (SYSTEM PATCH: Campaign
// Theme Coherence).
//
// Builds ONE theme package straight from the EXACT resolved calendar campaign
// record (never an inferred/guessed one — the campaign must already be resolved
// by exact campaign_id / --week / getNextCampaign, per live-orchestrator.js).
// This package is the single source that hero selection, product relevance and
// semantic QA all check against, so a campaign cannot silently drift between
// its resolved theme and the content assembled for it.
//
// Deliberately does NOT infer an ISO week from the numeric campaign_id suffix
// (e.g. "RDD-2026-38" is sequence #38, not ISO week 38) — week comes only from
// the record's own send_date, via calendar/adapter.js isoWeekId, elsewhere.
// ---------------------------------------------------------------------------

'use strict';

function normalizeTerm(s) {
  return String(s == null ? '' : s).toLowerCase().trim();
}

// Distinct, non-empty lowercase search terms drawn from the campaign's own
// theme fields (never invented) — used by the product/hero relevance gates.
function themeSearchTerms(campaign) {
  const terms = new Set();
  const add = (s) => {
    const t = normalizeTerm(s);
    if (t) terms.add(t);
  };
  add(campaign.topic_category);
  add(campaign.campaign_name);
  add(campaign.key_topic);
  return [...terms];
}

function buildCampaignThemePackage(campaign) {
  if (!campaign || !campaign.campaign_id) {
    throw new Error('buildCampaignThemePackage requires a resolved calendar campaign record (with campaign_id).');
  }
  return {
    campaignId: campaign.campaign_id,
    brand: campaign.brand || null,
    cadence: campaign.cadence || null,
    campaignType: campaign.topic_category_slug || null,
    campaignTypeLabel: campaign.campaign_type_label || null,
    subjectLine: campaign.subject_line || null,
    campaignName: campaign.campaign_name || null,
    topicCategory: campaign.topic_category || null,
    keyTopic: campaign.key_topic || null,
    tone: campaign.tone || null,
    promotion: campaign.promotion || null,
    searchTerms: themeSearchTerms(campaign),
  };
}

module.exports = { buildCampaignThemePackage, themeSearchTerms };
