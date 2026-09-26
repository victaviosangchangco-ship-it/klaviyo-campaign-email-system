// T7 tests — Draft Campaign Service. Offline: mocked client + mocked services.
// No network, no key. Proves draft-only behaviour and correct payload assembly.

'use strict';

const { test } = require('node:test');
const assert = require('node:assert');
const {
  createDraftCampaignService,
  buildCampaignPayload,
  campaignUrl,
  CAMPAIGNS_PATH,
} = require('../integrations/klaviyo/draft-campaign-service');
const { ConfigError, ApprovalRequired, PlatformError } = require('../common/errors');

// --- mocks -----------------------------------------------------------------

function mockClient() {
  const posts = [];
  return {
    posts,
    post: async (pathname, body) => {
      posts.push({ pathname, body });
      return { data: { id: '01HXYZDRAFT', attributes: { status: 'Draft' } } };
    },
    // NOTE: no send method exists on the mock either — mirrors the real client.
  };
}

const CAMPAIGN_ROW = {
  campaign_id: 'RDD-2026-W33', brand: 'RDD', topic_category_slug: 'weekly', campaign_name: 'Workspace Weekly',
  topic_category: 'Workspace', subject_line: 'Subject 33', preview_text: 'Preview 33',
  send_date: '2026-08-13', send_time: '10:00', promotion: null, segment: null, list: 'Email List',
};

const calendarService = {
  getNextCampaign: async () => CAMPAIGN_ROW,
  getCampaignByWeek: async () => CAMPAIGN_ROW,
};
const listService = { resolveByName: async (n) => (n === 'Email List' ? { id: 'L1', name: 'Email List' } : null) };
const segmentService = { resolveByName: async (n) => (n === '60D Active Customers' ? { id: 'S1', name: '60D Active Customers' } : null) };

const SENDER = { fromEmail: 'hello@rdd.com.au', fromLabel: 'RDD', replyToEmail: 'hello@rdd.com.au' };

function svc(client) {
  return createDraftCampaignService({ client, calendarService, listService, segmentService });
}

// --- payload builder (pure) ------------------------------------------------

test('buildCampaignPayload creates a draft email payload with NO send_strategy', () => {
  const p = buildCampaignPayload({
    name: 'N', includedAudienceIds: ['L1'], subject: 'S', previewText: 'P',
    fromEmail: 'a@b.com', fromLabel: 'B', replyToEmail: 'r@b.com', label: 'lbl',
  });
  assert.strictEqual(p.data.type, 'campaign');
  assert.strictEqual(p.data.attributes.name, 'N');
  assert.deepStrictEqual(p.data.attributes.audiences, { included: ['L1'], excluded: [] });
  assert.strictEqual('send_strategy' in p.data.attributes, false, 'must NOT set send_strategy (draft, no schedule)');
  const msg = p.data.attributes['campaign-messages'].data[0];
  // Flat message attributes (revision 2024-10-15): channel/label/content directly.
  assert.strictEqual(msg.attributes.channel, 'email');
  assert.strictEqual('definition' in msg.attributes, false);
  assert.strictEqual(msg.attributes.content.subject, 'S');
  assert.strictEqual(msg.attributes.content.from_email, 'a@b.com');
  assert.strictEqual(msg.attributes.content.reply_to_email, 'r@b.com');
});

test('buildCampaignPayload validates required inputs', () => {
  assert.throws(() => buildCampaignPayload({ includedAudienceIds: ['L1'], fromEmail: 'a@b' }), ConfigError); // no name
  assert.throws(() => buildCampaignPayload({ name: 'N', includedAudienceIds: [], fromEmail: 'a@b' }), ApprovalRequired); // no audience
  assert.throws(() => buildCampaignPayload({ name: 'N', includedAudienceIds: ['L1'] }), ConfigError); // no from_email
});

test('campaignUrl builds the Klaviyo wizard deep link', () => {
  assert.strictEqual(campaignUrl('ABC'), 'https://www.klaviyo.com/campaign/ABC/wizard');
});

// --- resolveAudience -------------------------------------------------------

test('resolveAudience: list only', async () => {
  const r = await svc(mockClient()).resolveAudience(CAMPAIGN_ROW);
  assert.strictEqual(r.ok, true);
  assert.deepStrictEqual(r.included, ['L1']);
  assert.strictEqual(r.resolved.segment, null);
});

test('resolveAudience: list + segment', async () => {
  const r = await svc(mockClient()).resolveAudience({ ...CAMPAIGN_ROW, segment: '60D Active Customers' });
  assert.deepStrictEqual(r.included.sort(), ['L1', 'S1']);
});

test('resolveAudience: unknown list → not ok', async () => {
  const r = await svc(mockClient()).resolveAudience({ ...CAMPAIGN_ROW, list: 'Nope' });
  assert.strictEqual(r.ok, false);
  assert.match(r.reason, /not found/i);
});

test('resolveAudience: no list and no segment → not ok', async () => {
  const r = await svc(mockClient()).resolveAudience({ ...CAMPAIGN_ROW, list: null, segment: null });
  assert.strictEqual(r.ok, false);
});

// --- createDraftForWeek (the 10-step workflow) -----------------------------

test('createDraftForWeek: happy path creates ONE draft via POST /campaigns/ only', async () => {
  const client = mockClient();
  const r = await svc(client).createDraftForWeek({ brand: 'RDD', sender: SENDER });
  // exactly one write, to the campaigns endpoint (never a send endpoint)
  assert.strictEqual(client.posts.length, 1);
  assert.strictEqual(client.posts[0].pathname, CAMPAIGNS_PATH);
  // returns id + url + draft-only status
  assert.strictEqual(r.campaignId, '01HXYZDRAFT');
  assert.strictEqual(r.status, 'Draft');
  assert.strictEqual(r.url, 'https://www.klaviyo.com/campaign/01HXYZDRAFT/wizard');
  assert.strictEqual(r.sendStatus, 'NOT_APPROVED_TO_SEND');
  assert.deepStrictEqual(r.includedAudienceIds, ['L1']);
  // the payload carried the calendar's subject/preview and no schedule
  const attrs = client.posts[0].body.data.attributes;
  assert.strictEqual('send_strategy' in attrs, false);
  assert.strictEqual(attrs['campaign-messages'].data[0].attributes.content.subject, 'Subject 33');
});

test('createDraftForWeek: no sender → ConfigError (no write)', async () => {
  const client = mockClient();
  await assert.rejects(() => svc(client).createDraftForWeek({ brand: 'RDD', sender: {} }), ConfigError);
  assert.strictEqual(client.posts.length, 0);
});

test('createDraftForWeek: no calendar campaign → ApprovalRequired (no write)', async () => {
  const emptyCal = { getNextCampaign: async () => null, getCampaignByWeek: async () => null };
  const client = mockClient();
  const s = createDraftCampaignService({ client, calendarService: emptyCal, listService, segmentService });
  await assert.rejects(() => s.createDraftForWeek({ brand: 'RDD', sender: SENDER }), ApprovalRequired);
  assert.strictEqual(client.posts.length, 0);
});

test('createDraftForWeek: audience unresolved → ApprovalRequired (no write)', async () => {
  const badCal = { getNextCampaign: async () => ({ ...CAMPAIGN_ROW, list: 'Nope' }), getCampaignByWeek: async () => null };
  const client = mockClient();
  const s = createDraftCampaignService({ client, calendarService: badCal, listService, segmentService });
  await assert.rejects(() => s.createDraftForWeek({ brand: 'RDD', sender: SENDER }), ApprovalRequired);
  assert.strictEqual(client.posts.length, 0);
});

// --- DI guards + no-send surface -------------------------------------------

test('createDraftCampaignService requires all four collaborators', () => {
  assert.throws(() => createDraftCampaignService({}), PlatformError);
  assert.throws(() => createDraftCampaignService({ client: mockClient() }), PlatformError);
  assert.throws(() => createDraftCampaignService({ client: mockClient(), calendarService }), PlatformError);
  assert.throws(() => createDraftCampaignService({ client: mockClient(), calendarService, listService }), PlatformError);
});

test('the Draft Campaign Service exposes NO send/schedule method', () => {
  const s = svc(mockClient());
  for (const fn of ['createDraftForWeek', 'buildCampaignPayload', 'resolveAudience']) {
    assert.strictEqual(typeof s[fn], 'function');
  }
  for (const fn of ['send', 'schedule', 'sendCampaign', 'activate', 'createSendJob']) {
    assert.strictEqual(typeof s[fn], 'undefined');
  }
});
