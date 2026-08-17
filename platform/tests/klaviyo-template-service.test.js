// Sprint 9 tests — Template Service (upload/assign/readback). Offline: mocked client.

'use strict';

const { test } = require('node:test');
const assert = require('node:assert');
const {
  createTemplateService,
  templateNameFor,
  templateUrl,
  TEMPLATES_PATH,
  ASSIGN_PATH,
} = require('../integrations/klaviyo/template-service');
const { PlatformError } = require('../common/errors');

// Programmable mock client that records calls and returns canned responses per
// (method, path-prefix). Missing routes throw so the test surfaces gaps.
function mockClient(routes = {}) {
  const calls = [];
  const handler = (method) => async (pathname, body) => {
    calls.push({ method, pathname, body });
    for (const [prefix, fn] of Object.entries(routes[method] || {})) {
      if (pathname.startsWith(prefix)) return fn(pathname, body);
    }
    throw new Error(`unmocked ${method} ${pathname}`);
  };
  return { calls, get: handler('GET'), post: handler('POST'), patch: handler('PATCH') };
}

test('templateNameFor + templateUrl are deterministic', () => {
  assert.strictEqual(templateNameFor('RDD-2026-W33'), 'Automation: RDD-2026-W33');
  assert.strictEqual(templateUrl('T1'), 'https://www.klaviyo.com/email-editor/T1/edit');
});

test('createTemplateService requires get/post/patch', () => {
  assert.throws(() => createTemplateService({ client: { get() {}, post() {} } }), PlatformError);
});

// --- upsert: no existing → CREATE ------------------------------------------

test('upsert creates when no template with that name exists', async () => {
  const client = mockClient({
    GET: { [TEMPLATES_PATH]: () => ({ data: [] }) }, // findByName → none
    POST: { [TEMPLATES_PATH]: () => ({ data: { id: 'T_NEW', attributes: { name: 'Automation: X' } } }) },
  });
  const svc = createTemplateService({ client });
  const r = await svc.upsert({ name: 'Automation: X', html: '<html></html>' });
  assert.strictEqual(r.created, true);
  assert.strictEqual(r.id, 'T_NEW');
  const post = client.calls.find((c) => c.method === 'POST');
  assert.strictEqual(post.body.data.attributes.editor_type, 'CODE');
  assert.strictEqual(post.body.data.attributes.html, '<html></html>');
});

// --- upsert: existing → UPDATE (no duplicate) ------------------------------

test('upsert updates the existing template instead of creating a duplicate', async () => {
  const client = mockClient({
    GET: { [TEMPLATES_PATH]: () => ({ data: [{ id: 'T_OLD', attributes: { name: 'Automation: X' } }] }) },
    PATCH: { [TEMPLATES_PATH]: () => ({ data: { id: 'T_OLD', attributes: { name: 'Automation: X' } } }) },
  });
  const svc = createTemplateService({ client });
  const r = await svc.upsert({ name: 'Automation: X', html: '<html>v2</html>' });
  assert.strictEqual(r.created, false);
  assert.strictEqual(r.id, 'T_OLD');
  assert.strictEqual(client.calls.some((c) => c.method === 'POST'), false, 'must NOT create when one exists');
  const patch = client.calls.find((c) => c.method === 'PATCH');
  assert.strictEqual(patch.body.data.attributes.html, '<html>v2</html>');
});

// --- message resolution ----------------------------------------------------

test('getCampaignMessageId returns the first message id', async () => {
  const client = mockClient({ GET: { '/campaigns/': () => ({ data: [{ type: 'campaign-message', id: 'M1' }] }) } });
  const svc = createTemplateService({ client });
  assert.strictEqual(await svc.getCampaignMessageId('C1'), 'M1');
});

test('getCampaignMessageId throws when a campaign has no message', async () => {
  const client = mockClient({ GET: { '/campaigns/': () => ({ data: [] }) } });
  await assert.rejects(() => createTemplateService({ client }).getCampaignMessageId('C1'));
});

// --- full attach workflow --------------------------------------------------

test('attachHtmlToCampaign: upsert → resolve message → assign → readback verified', async () => {
  const html = '<html><body>hi</body></html>';
  // Klaviyo clones the template into the message → the message's template id
  // (T1_CLONE) differs from the source (T1), and its HTML is normalized (shorter).
  const normalized = '<html><body>hi</body>';
  const client = mockClient({
    GET: {
      [TEMPLATES_PATH]: (p) => {
        if (p.includes('filter=')) return { data: [] }; // findByName → none → create
        if (p.includes('T1_CLONE')) return { data: { id: 'T1_CLONE', attributes: { editor_type: 'CODE', html: normalized } } };
        return { data: { id: 'T1', attributes: { name: 'Automation: RDD-2026-W32', editor_type: 'CODE', html } } };
      },
      '/campaigns/': () => ({ data: [{ type: 'campaign-message', id: 'M1' }] }),
      '/campaign-messages/': () => ({ data: { type: 'template', id: 'T1_CLONE' } }), // relationships/template (a clone)
    },
    POST: {
      [TEMPLATES_PATH]: () => ({ data: { id: 'T1', attributes: { name: 'Automation: RDD-2026-W32' } } }),
      [ASSIGN_PATH]: () => ({ data: { id: 'M1' } }),
    },
  });
  const svc = createTemplateService({ client });
  const r = await svc.attachHtmlToCampaign({ campaignId: 'C1', templateName: 'Automation: RDD-2026-W32', html });

  assert.strictEqual(r.templateId, 'T1'); // the managed source template (no-duplicate key)
  assert.strictEqual(r.templateCreated, true);
  assert.strictEqual(r.messageId, 'M1');
  assert.strictEqual(r.assignedTemplateId, 'T1_CLONE'); // the message's copy (expected to differ)
  assert.strictEqual(r.htmlLength, normalized.length); // html length of the assigned copy
  assert.strictEqual(r.verified, true);
  assert.strictEqual(r.sendStatus, 'NOT_APPROVED_TO_SEND');
  assert.strictEqual(r.campaignUrl, 'https://www.klaviyo.com/campaign/C1/wizard');
  assert.strictEqual(r.templateUrl, 'https://www.klaviyo.com/email-editor/T1/edit');
  // assignment was posted to the assign endpoint with the right linkage
  const assign = client.calls.find((c) => c.method === 'POST' && c.pathname === ASSIGN_PATH);
  assert.strictEqual(assign.body.data.id, 'M1');
  assert.strictEqual(assign.body.data.relationships.template.data.id, 'T1');
});

test('attachHtmlToCampaign validates inputs', async () => {
  const svc = createTemplateService({ client: mockClient() });
  await assert.rejects(() => svc.attachHtmlToCampaign({ templateName: 'n', html: 'x' }), PlatformError);
  await assert.rejects(() => svc.attachHtmlToCampaign({ campaignId: 'C', html: 'x' }), PlatformError);
  await assert.rejects(() => svc.attachHtmlToCampaign({ campaignId: 'C', templateName: 'n', html: '  ' }), PlatformError);
});

// --- no send surface -------------------------------------------------------

test('the Template Service exposes NO send/schedule method', () => {
  const svc = createTemplateService({ client: mockClient() });
  for (const fn of ['send', 'schedule', 'sendCampaign', 'publish', 'activate']) {
    assert.strictEqual(typeof svc[fn], 'undefined');
  }
});
