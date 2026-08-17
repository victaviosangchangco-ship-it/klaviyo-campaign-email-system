// ---------------------------------------------------------------------------
// draft-campaign-service.js — Klaviyo DRAFT Campaign Service (T7).
//
// Integrates the four building blocks into one workflow that turns a planned
// calendar campaign into a Klaviyo DRAFT campaign:
//
//   Content Calendar Service → List Service → Segment Service → Klaviyo Transport
//
// The 10-step workflow (createDraftForWeek):
//   1. read the campaign from the Content Calendar (by week, else the next one)
//   2. resolve the configured List (List Service)
//   3. resolve the configured Segment, if present (Segment Service)
//   4. validate the audience (at least one resolved id)
//   5. build the campaign payload (pure; no send_strategy → draft)
//   6. create a DRAFT campaign in Klaviyo (POST /campaigns/)
//   7. never schedule   — no send_strategy, no send-job
//   8. never send       — the transport has no send method; the guard enforces it
//   9. return the draft campaign id + Klaviyo URL
//  10. log every step
//
// SAFETY: this service ONLY calls POST /campaigns/ (create → Draft status) via
// the injected client. It never references a send/schedule endpoint (the no-send
// guard in safety.js scans this file). Every result is NOT_APPROVED_TO_SEND.
//
// Dependency-injected → fully unit-testable offline with mocked services.
// ---------------------------------------------------------------------------

'use strict';

const { PlatformError, IntegrationError, ConfigError, ApprovalRequired } = require('../../common/errors');

const CAMPAIGNS_PATH = '/campaigns/';
const DEFAULT_UI_BASE = 'https://www.klaviyo.com';

// Klaviyo UI deep link for a campaign (from the create_campaign API docs).
function campaignUrl(id, uiBaseUrl = DEFAULT_UI_BASE) {
  return `${uiBaseUrl}/campaign/${id}/wizard`;
}

// Resolve the sender for a brand: config first, else the account's OWN default
// sender (read-only GET /accounts) — never an invented address. Shared by the
// draft verifier and the live orchestrator (no duplication).
async function resolveSender(klaviyoConfig, client) {
  let fromEmail = klaviyoConfig.sender && klaviyoConfig.sender.fromEmail;
  let fromLabel = klaviyoConfig.sender && klaviyoConfig.sender.fromLabel;
  let replyTo = klaviyoConfig.sender && klaviyoConfig.sender.replyToEmail;
  let source = 'config';
  if (!fromEmail) {
    const acct = await client.get('/accounts/');
    const ci = (acct && acct.data && acct.data[0] && acct.data[0].attributes && acct.data[0].attributes.contact_information) || {};
    fromEmail = ci.default_sender_email || null;
    fromLabel = fromLabel || ci.default_sender_name || null;
    source = 'account-default';
  }
  replyTo = replyTo || fromEmail;
  return { fromEmail, fromLabel, replyToEmail: replyTo, source };
}

// Pure builder → a JSON:API draft EMAIL campaign payload. `send_strategy` is
// deliberately OMITTED: a created campaign is a Draft regardless, and omitting
// it means there is no scheduling semantics at all.
// Default tracking: "Include tracking parameters" (UTM) ON for every campaign.
// Per the Create Campaign API, tracking_options is writable on create; an empty
// custom_tracking_params list with add_tracking_params:true uses the company UTM
// defaults. Verified against the live API before relying on it (see §13.4).
const DEFAULT_TRACKING_OPTIONS = { add_tracking_params: true };

// Whole-token, boundary-delimited match of a campaign_id inside a draft name.
// A campaign_id ends in a number, so requiring a non-alphanumeric char (or the
// string edge) on both sides means "RDD-2026-3" cannot match "RDD-2026-37".
function campaignIdMatchesName(name, campaignId) {
  if (typeof name !== 'string' || !campaignId) return false;
  const esc = String(campaignId).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return new RegExp(`(^|[^0-9A-Za-z])${esc}([^0-9A-Za-z]|$)`).test(name);
}

function buildCampaignPayload({
  name,
  includedAudienceIds,
  excludedAudienceIds = [],
  subject,
  previewText,
  fromEmail,
  fromLabel,
  replyToEmail,
  label,
  trackingOptions = DEFAULT_TRACKING_OPTIONS,
}) {
  if (!name) throw new ConfigError('Campaign name is required to build a draft payload.');
  if (!Array.isArray(includedAudienceIds) || includedAudienceIds.length === 0) {
    throw new ApprovalRequired('At least one included audience (list or segment) id is required.');
  }
  if (!fromEmail) throw new ConfigError('A from_email (verified sender) is required — none configured/resolved.');

  return {
    data: {
      type: 'campaign',
      attributes: {
        name,
        audiences: { included: includedAudienceIds, excluded: excludedAudienceIds },
        // "Include tracking parameters" (UTM) — writable on create. Omitted → Klaviyo
        // still applies company defaults, but we set it explicitly so every campaign
        // is consistent regardless of account default.
        ...(trackingOptions ? { tracking_options: trackingOptions } : {}),
        // NO send_strategy → Draft, no schedule. Sending needs a send-job we never call.
        // NOTE: for API revision 2024-10-15 the campaign-message attributes are FLAT
        // (channel/label/content directly) — NOT nested under `definition` (the API
        // rejects `definition` and requires `channel`). Confirmed against the live API.
        'campaign-messages': {
          data: [
            {
              type: 'campaign-message',
              attributes: {
                channel: 'email',
                label: label || name,
                content: {
                  subject: subject || null,
                  preview_text: previewText || null,
                  from_email: fromEmail,
                  from_label: fromLabel || null,
                  reply_to_email: replyToEmail || fromEmail,
                },
              },
            },
          ],
        },
      },
    },
  };
}

function createDraftCampaignService({
  client,
  calendarService,
  listService,
  segmentService,
  logger = null,
  uiBaseUrl = DEFAULT_UI_BASE,
} = {}) {
  if (!client || typeof client.post !== 'function') {
    throw new PlatformError('createDraftCampaignService requires a Klaviyo client with post().');
  }
  if (!calendarService || typeof calendarService.getNextCampaign !== 'function') {
    throw new PlatformError('createDraftCampaignService requires a Content Calendar Service.');
  }
  if (!listService || typeof listService.resolveByName !== 'function') {
    throw new PlatformError('createDraftCampaignService requires a List Service.');
  }
  if (!segmentService || typeof segmentService.resolveByName !== 'function') {
    throw new PlatformError('createDraftCampaignService requires a Segment Service.');
  }

  function log(level, msg, data) {
    if (!logger || typeof logger[level] !== 'function') return;
    if (data !== undefined) logger[level](msg, data);
    else logger[level](msg);
  }

  // Resolve + validate the audience for a calendar campaign row.
  // Returns { ok, reason, included:[ids], resolved:{ list, segment } }.
  async function resolveAudience(campaign) {
    const resolved = { list: null, segment: null };
    const included = [];

    if (campaign.list) {
      const list = await listService.resolveByName(campaign.list);
      if (!list) return { ok: false, reason: `List "${campaign.list}" not found in Klaviyo.`, included, resolved };
      resolved.list = list;
      included.push(list.id);
    }
    if (campaign.segment) {
      const seg = await segmentService.resolveByName(campaign.segment);
      if (!seg) return { ok: false, reason: `Segment "${campaign.segment}" not found in Klaviyo.`, included, resolved };
      resolved.segment = seg;
      included.push(seg.id);
    }
    if (included.length === 0) {
      return { ok: false, reason: 'Calendar campaign has neither a list nor a segment audience.', included, resolved };
    }
    return { ok: true, reason: null, included, resolved };
  }

  // The full 10-step workflow. `sender` = { fromEmail, fromLabel, replyToEmail }
  // (resolved by the caller from config or the account default).
  async function createDraftForWeek({ brand, week = null, sender, namePrefix = 'DEMO —', now, campaign: providedCampaign = null, name = null } = {}) {
    if (!sender || !sender.fromEmail) {
      throw new ConfigError('sender.fromEmail is required (a verified sender). None resolved.');
    }

    // 1. read from calendar (or use the campaign supplied by the caller, e.g. the
    //    orchestrator's already-resolved record with a run-scoped audience override).
    log('info', `[1/10] ${providedCampaign ? 'Using supplied campaign record' : `Reading calendar for ${brand}${week ? ` (${week})` : ' (next campaign)'}`}…`);
    const campaign = providedCampaign
      || (week
        ? await calendarService.getCampaignByWeek(week, { brand })
        : await calendarService.getNextCampaign({ brand, now }));
    if (!campaign) {
      throw new ApprovalRequired(`No calendar campaign found for ${brand}${week ? ` in ${week}` : ' (next)'} — nothing to draft.`);
    }
    log('info', `        → ${campaign.campaign_id}: "${campaign.subject_line}"`);

    // 2-4. resolve + validate audience
    log('info', `[2-4/10] Resolving audience (list="${campaign.list}", segment="${campaign.segment || 'none'}")…`);
    const aud = await resolveAudience(campaign);
    if (!aud.ok) throw new ApprovalRequired(`Audience validation failed: ${aud.reason}`);
    log('info', `        → included id(s): ${aud.included.join(', ')}`);

    // 5. build payload
    log('info', '[5/10] Building draft payload (no send_strategy → draft, no schedule)…');
    // Use the caller-supplied real name when given; else the legacy placeholder.
    const draftName = name || `${namePrefix} ${campaign.campaign_id} — Automation Draft (DO NOT SEND)`.trim();
    const payload = buildCampaignPayload({
      name: draftName,
      includedAudienceIds: aud.included,
      subject: campaign.subject_line,
      previewText: campaign.preview_text,
      fromEmail: sender.fromEmail,
      fromLabel: sender.fromLabel,
      replyToEmail: sender.replyToEmail,
      label: campaign.campaign_name || campaign.campaign_id,
    });

    // 6. create DRAFT
    log('info', '[6/10] Creating DRAFT campaign in Klaviyo (POST /campaigns/)…');
    const res = await client.post(CAMPAIGNS_PATH, payload);
    const data = res && res.data;
    const id = data && data.id;
    if (!id) throw new IntegrationError('Klaviyo did not return a campaign id on create.');
    const status = (data && data.attributes && data.attributes.status) || 'Draft';

    // 7-8. no schedule, no send
    log('info', '[7-8/10] No send_strategy set and no send-job created — draft only.');

    // 9. return id + url
    const url = campaignUrl(id, uiBaseUrl);
    log('info', `[9/10] Draft created: ${id} (status=${status}).`);

    // 10. done (logged throughout)
    log('info', '[10/10] Draft ready for human review. NOT sent.');

    return {
      ok: true,
      campaignId: id,
      status,
      url,
      name: draftName,
      subject: campaign.subject_line,
      previewText: campaign.preview_text,
      audience: aud.resolved,
      includedAudienceIds: aud.included,
      calendarCampaignId: campaign.campaign_id,
      sendStatus: 'NOT_APPROVED_TO_SEND',
    };
  }

  // Patch-on-reuse: refresh an EXISTING draft's campaign-message metadata (subject
  // + preview_text) to the current calendar subject and resolved preview. Create
  // sets these at build time; reuse must too, so a re-run never leaves a stale or
  // empty preheader (CLAUDE.md §6.24). It reads the current content first and MERGES
  // (never blanks from_email/from_label/reply_to on PATCH), and touches ONLY message
  // metadata — never the template/HTML, never audience, never send/schedule.
  async function updateDraftMessageMetadata({ campaignId, subject = null, previewText = null, fromEmail = null, fromLabel = null, replyToEmail = null }) {
    if (!campaignId) throw new PlatformError('updateDraftMessageMetadata requires a campaignId (the draft).');

    // resolve the (single) email message id for the campaign
    const listJson = await client.get(`/campaigns/${encodeURIComponent(campaignId)}/campaign-messages/`);
    const list = Array.isArray(listJson && listJson.data) ? listJson.data : [];
    if (!list.length || !list[0].id) {
      throw new IntegrationError(`Campaign ${campaignId} has no message to update metadata on.`);
    }
    const messageId = list[0].id;

    // read current content so we MERGE (revision 2024-10-15 uses flat `content`;
    // some reads expose it under `definition.content` — handle both on read).
    const cur = await client.get(`/campaign-messages/${encodeURIComponent(messageId)}/`);
    const curAttrs = (cur && cur.data && cur.data.attributes) || {};
    const curContent = (curAttrs.definition && curAttrs.definition.content) || curAttrs.content || {};

    // MERGE: only overwrite what the caller supplies; never blank an existing field.
    const content = { ...curContent };
    if (subject != null) content.subject = subject;
    if (previewText != null) content.preview_text = previewText;
    // Brand sender + reply-to: correct them on an existing draft too, so a re-push
    // fixes a draft first created under the account-default sender (Tasks 2-3).
    if (fromEmail != null) content.from_email = fromEmail;
    if (fromLabel != null) content.from_label = fromLabel;
    if (replyToEmail != null) content.reply_to_email = replyToEmail;

    await client.patch(`/campaign-messages/${encodeURIComponent(messageId)}/`, {
      data: { type: 'campaign-message', id: messageId, attributes: { content } },
    });

    log('info', `Refreshed draft ${campaignId} message ${messageId}: metadata + sender updated (never touches HTML/audience/send).`);
    return {
      ok: true, messageId,
      subject: content.subject != null ? content.subject : null,
      previewText: content.preview_text != null ? content.preview_text : null,
      fromEmail: content.from_email != null ? content.from_email : null,
      replyToEmail: content.reply_to_email != null ? content.reply_to_email : null,
    };
  }

  // Set "Include tracking parameters" (UTM) on an EXISTING draft (campaign-level
  // attribute), so a re-push of a draft created before this default also gets it.
  // PATCH /campaigns/{id}/ with tracking_options. Draft only; never sends.
  async function updateCampaignTracking(campaignId, trackingOptions = DEFAULT_TRACKING_OPTIONS) {
    if (!campaignId) throw new PlatformError('updateCampaignTracking requires a campaignId.');
    await client.patch(`/campaigns/${encodeURIComponent(campaignId)}/`, {
      data: { type: 'campaign', id: campaignId, attributes: { tracking_options: trackingOptions } },
    });
    log('info', `Set tracking_options on draft ${campaignId}: ${JSON.stringify(trackingOptions)}.`);
    return { ok: true, campaignId, trackingOptions };
  }

  // Rename a draft campaign (campaign-level attribute). Used so a reused draft that
  // was first created with a placeholder name (e.g. a "DEMO —" prefix) is corrected
  // to the real campaign name. The name must still contain the campaign_id so the
  // no-duplicate lookup (findDraftForCampaign) keeps matching it. Draft only.
  async function updateCampaignName(campaignId, name) {
    if (!campaignId) throw new PlatformError('updateCampaignName requires a campaignId.');
    const clean = String(name == null ? '' : name).trim();
    if (!clean) throw new PlatformError('updateCampaignName requires a non-empty name.');
    await client.patch(`/campaigns/${encodeURIComponent(campaignId)}/`, {
      data: { type: 'campaign', id: campaignId, attributes: { name: clean } },
    });
    log('info', `Renamed draft ${campaignId} → "${clean}".`);
    return { ok: true, campaignId, name: clean };
  }

  // Find an existing DRAFT campaign for a campaign_id, so a re-push REUSES it
  // instead of creating a duplicate. DETERMINISTIC + collision-safe: matches the
  // campaign_id as a whole token (boundary-delimited), so "RDD-2026-3" never
  // matches "RDD-2026-37", while still matching both the canonical
  // "<campaign_id>: <subject>" name and any legacy "DEMO — <campaign_id> — …" name.
  // Returns {id,name}|null.
  async function findDraftForCampaign(calendarCampaignId) {
    const key = String(calendarCampaignId || '').trim();
    if (!key) return null;
    const filter = encodeURIComponent("equals(messages.channel,'email')");
    const json = await client.get(`/campaigns/?filter=${filter}&sort=-created_at&fields[campaign]=name,status`);
    const data = Array.isArray(json && json.data) ? json.data : [];
    const matches = data.filter(
      (c) => c.attributes && c.attributes.status === 'Draft' && campaignIdMatchesName(c.attributes.name, key)
    );
    if (matches.length > 1) {
      log('warn', `findDraftForCampaign("${key}") matched ${matches.length} drafts; reusing the most recent (no duplicate is created).`);
    }
    // data is sorted -created_at, so matches[0] is the newest.
    return matches.length ? { id: matches[0].id, name: matches[0].attributes.name } : null;
  }

  return { buildCampaignPayload, resolveAudience, createDraftForWeek, findDraftForCampaign, updateDraftMessageMetadata, updateCampaignName, updateCampaignTracking };
}

module.exports = { createDraftCampaignService, buildCampaignPayload, campaignUrl, resolveSender, campaignIdMatchesName, DEFAULT_TRACKING_OPTIONS, CAMPAIGNS_PATH };
