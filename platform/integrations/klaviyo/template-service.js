// ---------------------------------------------------------------------------
// template-service.js — Klaviyo Template upload + assignment (Sprint 9).
//
// Uploads a QA-approved HTML email as a Klaviyo CODE template and attaches it to
// an existing DRAFT campaign's message, then reads back to confirm the draft now
// carries the HTML. It creates/updates TEMPLATES and assigns them — it never
// sends, schedules, or publishes (the no-send guard scans this file).
//
// No-duplicate rule: templates are addressed by a deterministic NAME derived
// from the campaign_id. `upsert` finds an existing template by that name and
// UPDATES it (PATCH), otherwise CREATES it — so re-running never makes duplicates.
//
// Endpoints (confirmed against the live API / MCP schema):
//   POST  /templates/                          create (editor_type CODE + html)
//   PATCH /templates/{id}/                      update html/name
//   GET   /templates/?filter=equals(name,"…")   find by name (no-duplicate lookup)
//   GET   /templates/{id}/                       read back (html length)
//   GET   /campaigns/{id}/campaign-messages/     resolve the message id
//   POST  /campaign-message-assign-template/     attach template → message
//   GET   /campaign-messages/{id}/relationships/template/   confirm linkage
//
// Dependency-injected client → unit-testable offline.
// ---------------------------------------------------------------------------

'use strict';

const { IntegrationError, PlatformError } = require('../../common/errors');
const { campaignUrl } = require('./draft-campaign-service'); // reuse (no dup)

const TEMPLATES_PATH = '/templates/';
const ASSIGN_PATH = '/campaign-message-assign-template/';
const DEFAULT_UI_BASE = 'https://www.klaviyo.com';

// Deterministic, filter-safe template name for a calendar campaign_id.
function templateNameFor(campaignId) {
  return `Automation: ${campaignId}`;
}

function templateUrl(id, uiBaseUrl = DEFAULT_UI_BASE) {
  return `${uiBaseUrl}/email-editor/${id}/edit`;
}

function shapeTemplate(resource) {
  const a = (resource && resource.attributes) || {};
  return {
    id: resource && resource.id,
    name: a.name != null ? a.name : null,
    editorType: a.editor_type != null ? a.editor_type : null,
    updated: a.updated != null ? a.updated : null,
    htmlLength: typeof a.html === 'string' ? a.html.length : null,
  };
}

function createTemplateService({ client, logger = null, uiBaseUrl = DEFAULT_UI_BASE } = {}) {
  if (!client || typeof client.post !== 'function' || typeof client.patch !== 'function' || typeof client.get !== 'function') {
    throw new PlatformError('createTemplateService requires a Klaviyo client with get(), post() and patch().');
  }

  function log(level, msg, data) {
    if (!logger || typeof logger[level] !== 'function') return;
    if (data !== undefined) logger[level](msg, data);
    else logger[level](msg);
  }

  // Find an existing template by exact name (no-duplicate lookup). null if none.
  async function findByName(name) {
    const filter = encodeURIComponent(`equals(name,"${name}")`);
    const json = await client.get(`${TEMPLATES_PATH}?filter=${filter}&fields[template]=name,editor_type,updated`);
    const data = Array.isArray(json && json.data) ? json.data : [];
    return data.length ? shapeTemplate(data[0]) : null;
  }

  async function getById(id, { includeHtml = false } = {}) {
    const fields = includeHtml ? 'name,editor_type,updated,html' : 'name,editor_type,updated';
    const json = await client.get(`${TEMPLATES_PATH}${encodeURIComponent(id)}/?fields[template]=${fields}`);
    const resource = json && (Array.isArray(json.data) ? json.data[0] : json.data);
    return resource ? shapeTemplate(resource) : null;
  }

  async function create({ name, html }) {
    const json = await client.post(TEMPLATES_PATH, {
      data: { type: 'template', attributes: { name, editor_type: 'CODE', html } },
    });
    const t = shapeTemplate(json && json.data);
    if (!t.id) throw new IntegrationError('Klaviyo did not return a template id on create.');
    return { ...t, created: true };
  }

  async function update(id, { name, html }) {
    const attributes = {};
    if (html != null) attributes.html = html;
    if (name != null) attributes.name = name;
    const json = await client.patch(`${TEMPLATES_PATH}${encodeURIComponent(id)}/`, {
      data: { type: 'template', id, attributes },
    });
    const t = shapeTemplate(json && json.data);
    return { ...t, id: t.id || id, created: false };
  }

  // No-duplicate: update the existing template with this name, else create.
  async function upsert({ name, html }) {
    const existing = await findByName(name);
    if (existing) {
      log('info', `Template "${name}" exists (${existing.id}) — updating (no duplicate).`);
      return update(existing.id, { name, html });
    }
    log('info', `Template "${name}" not found — creating.`);
    return create({ name, html });
  }

  // Resolve the (single) email message id for a campaign.
  async function getCampaignMessageId(campaignId) {
    const json = await client.get(`/campaigns/${encodeURIComponent(campaignId)}/campaign-messages/`);
    const data = Array.isArray(json && json.data) ? json.data : [];
    if (!data.length || !data[0].id) {
      throw new IntegrationError(`Campaign ${campaignId} has no message to attach a template to.`);
    }
    return data[0].id;
  }

  // Attach a template to a campaign message (draft stays a draft).
  async function assignTemplate(messageId, templateId) {
    await client.post(ASSIGN_PATH, {
      data: {
        type: 'campaign-message',
        id: messageId,
        relationships: { template: { data: { type: 'template', id: templateId } } },
      },
    });
  }

  // Readback: the template id currently linked to the message (null if none).
  async function getAssignedTemplateId(messageId) {
    try {
      const json = await client.get(`/campaign-messages/${encodeURIComponent(messageId)}/relationships/template/`);
      const d = json && json.data;
      return d ? d.id : null;
    } catch (err) {
      if (err instanceof IntegrationError && err.details && err.details.status === 404) return null;
      throw err;
    }
  }

  // The full workflow: upsert template → resolve message → assign → readback.
  async function attachHtmlToCampaign({ campaignId, templateName, html }) {
    if (!campaignId) throw new PlatformError('attachHtmlToCampaign requires a campaignId (the draft).');
    if (!templateName) throw new PlatformError('attachHtmlToCampaign requires a templateName.');
    if (!html || !html.trim()) throw new PlatformError('attachHtmlToCampaign requires non-empty html.');

    log('info', `[1/4] Upserting template "${templateName}" (${html.length} bytes)…`);
    const tpl = await upsert({ name: templateName, html });
    log('info', `      → template ${tpl.id} (${tpl.created ? 'created' : 'updated'}).`);

    log('info', `[2/4] Resolving campaign message for ${campaignId}…`);
    const messageId = await getCampaignMessageId(campaignId);
    log('info', `      → message ${messageId}.`);

    log('info', '[3/4] Assigning template to the draft message (draft only)…');
    await assignTemplate(messageId, tpl.id);

    log('info', '[4/4] Reading back to confirm the draft now carries the HTML…');
    // NOTE: Klaviyo CLONES the assigned template into the message, so the
    // message's template id is a NEW id (a copy of our source template) — it is
    // expected to differ from tpl.id. Success = the message HAS an assigned
    // template that carries HTML (Klaviyo also normalizes the HTML, so its byte
    // length differs from what we uploaded — that is fine).
    const assignedId = await getAssignedTemplateId(messageId);
    let htmlLength = null;
    if (assignedId) {
      const assignedTpl = await getById(assignedId, { includeHtml: true });
      htmlLength = assignedTpl ? assignedTpl.htmlLength : null;
    }
    const verified = !!assignedId && typeof htmlLength === 'number' && htmlLength > 0;
    log(verified ? 'info' : 'warn', `      → message template=${assignedId} (clone of ${tpl.id}), html=${htmlLength} bytes, verified=${verified}.`);

    return {
      ok: true,
      campaignId,
      templateId: tpl.id,
      templateCreated: tpl.created,
      messageId,
      assignedTemplateId: assignedId,
      htmlLength,
      verified,
      campaignUrl: campaignUrl(campaignId, uiBaseUrl),
      templateUrl: templateUrl(tpl.id, uiBaseUrl),
      sendStatus: 'NOT_APPROVED_TO_SEND',
    };
  }

  return {
    findByName,
    getById,
    create,
    update,
    upsert,
    getCampaignMessageId,
    assignTemplate,
    getAssignedTemplateId,
    attachHtmlToCampaign,
  };
}

module.exports = { createTemplateService, templateNameFor, templateUrl, shapeTemplate, TEMPLATES_PATH, ASSIGN_PATH };
