// Klaviyo publish-sync: deterministic draft dedup, brand sender + reply-to on
// create AND update, and default-on tracking. Offline: mock client records every
// call; no network, no key, no send method exists.

'use strict';

const { test } = require('node:test');
const assert = require('node:assert');
const {
  createDraftCampaignService,
  buildCampaignPayload,
  resolveSender,
  campaignIdMatchesName,
  DEFAULT_TRACKING_OPTIONS,
} = require('../integrations/klaviyo/draft-campaign-service');

// A mock client that records GET/POST/PATCH and serves a configurable campaign list.
function mockClient({ campaigns = [], message = { id: 'MSG1', attributes: { content: { from_email: 'hello@rdd.com.au' } } } } = {}) {
  const calls = [];
  return {
    calls,
    get: async (pathname) => {
      calls.push({ method: 'GET', pathname });
      if (pathname.startsWith('/campaigns/?')) return { data: campaigns };
      if (/\/campaigns\/[^/]+\/campaign-messages\//.test(pathname)) return { data: [{ id: message.id }] };
      if (/\/campaign-messages\//.test(pathname)) return { data: message };
      if (pathname === '/accounts/') return { data: [{ attributes: { contact_information: { default_sender_email: 'default@acct.com', default_sender_name: 'Acct' } } }] };
      return { data: null };
    },
    post: async (pathname, body) => { calls.push({ method: 'POST', pathname, body }); return { data: { id: 'NEWDRAFT', attributes: { status: 'Draft' } } }; },
    patch: async (pathname, body) => { calls.push({ method: 'PATCH', pathname, body }); return { data: { id: pathname.split('/')[2], attributes: { status: 'Draft' } } }; },
  };
}
const svc = (client) => createDraftCampaignService({
  client,
  calendarService: { getNextCampaign: async () => null, getCampaignByWeek: async () => null },
  listService: { resolveByName: async () => null },
  segmentService: { resolveByName: async () => null },
});

// --- 1. deterministic, collision-safe campaign_id ↔ name matching -----------

test('campaignIdMatchesName matches the canonical "<id>: <subject>" name', () => {
  assert.ok(campaignIdMatchesName('RDD-2026-37: Bigger Screen, Better Experiences', 'RDD-2026-37'));
});
test('campaignIdMatchesName matches a legacy "DEMO — <id> — …" name', () => {
  assert.ok(campaignIdMatchesName('DEMO — RDD-2026-37 — Automation Draft (DO NOT SEND)', 'RDD-2026-37'));
});
test('campaignIdMatchesName matches an exact-equal name', () => {
  assert.ok(campaignIdMatchesName('SS-2026-32', 'SS-2026-32'));
});
test('campaignIdMatchesName does NOT collide: "RDD-2026-3" must not match "RDD-2026-37"', () => {
  assert.ok(!campaignIdMatchesName('RDD-2026-37: x', 'RDD-2026-3'));
  assert.ok(!campaignIdMatchesName('RDD-2026-350: x', 'RDD-2026-35'));
});
test('campaignIdMatchesName is brand-safe: RDD id never matches an SS name', () => {
  assert.ok(!campaignIdMatchesName('SS-2026-32: x', 'RDD-2026-32'));
});

// --- 2. findDraftForCampaign = idempotent reuse (no duplicate) --------------

test('findDraftForCampaign returns the existing Draft (so a re-push reuses it)', async () => {
  const client = mockClient({ campaigns: [
    { id: 'DR37', attributes: { name: 'RDD-2026-37: Bigger Screen', status: 'Draft' } },
    { id: 'DR35', attributes: { name: 'RDD-2026-35: Study Space', status: 'Sent' } },
  ] });
  const found = await svc(client).findDraftForCampaign('RDD-2026-37');
  assert.deepStrictEqual(found, { id: 'DR37', name: 'RDD-2026-37: Bigger Screen' });
});
test('findDraftForCampaign ignores Sent campaigns and returns null when only a longer id exists', async () => {
  const client = mockClient({ campaigns: [
    { id: 'DR37', attributes: { name: 'RDD-2026-37: x', status: 'Draft' } }, // longer id
    { id: 'DR35', attributes: { name: 'RDD-2026-35: x', status: 'Sent' } },  // sent
  ] });
  assert.strictEqual(await svc(client).findDraftForCampaign('RDD-2026-3'), null, 'must not false-match a longer id');
  assert.strictEqual(await svc(client).findDraftForCampaign('RDD-2026-35'), null, 'Sent is not a reusable Draft');
});

// --- 3. tracking on create + configurable ----------------------------------

test('buildCampaignPayload enables tracking parameters (UTM) by default', () => {
  const p = buildCampaignPayload({ name: 'N', includedAudienceIds: ['L1'], fromEmail: 'a@b.com' });
  assert.deepStrictEqual(p.data.attributes.tracking_options, { add_tracking_params: true });
  assert.deepStrictEqual(DEFAULT_TRACKING_OPTIONS, { add_tracking_params: true });
});
test('buildCampaignPayload carries brand from_email + reply_to into the message content', () => {
  const p = buildCampaignPayload({ name: 'N', includedAudienceIds: ['L1'], fromEmail: 'sales@retaildisplaydirect.com.au', fromLabel: 'Retail Display Direct', replyToEmail: 'sales@retaildisplaydirect.com.au' });
  const c = p.data.attributes['campaign-messages'].data[0].attributes.content;
  assert.strictEqual(c.from_email, 'sales@retaildisplaydirect.com.au');
  assert.strictEqual(c.reply_to_email, 'sales@retaildisplaydirect.com.au');
});
test('buildCampaignPayload can omit tracking_options when explicitly disabled', () => {
  const p = buildCampaignPayload({ name: 'N', includedAudienceIds: ['L1'], fromEmail: 'a@b.com', trackingOptions: null });
  assert.strictEqual('tracking_options' in p.data.attributes, false);
});

// --- 4. sender resolution prefers brand config (not the account default) ----

test('resolveSender uses the configured brand sender and mirrors it to reply-to', async () => {
  const client = mockClient();
  const s = await resolveSender({ sender: { fromEmail: 'sales@retaildisplaydirect.com.au', fromLabel: 'Retail Display Direct', replyToEmail: 'sales@retaildisplaydirect.com.au' } }, client);
  assert.strictEqual(s.fromEmail, 'sales@retaildisplaydirect.com.au');
  assert.strictEqual(s.replyToEmail, 'sales@retaildisplaydirect.com.au');
  assert.strictEqual(s.source, 'config');
  assert.ok(!client.calls.some((c) => c.pathname === '/accounts/'), 'must NOT fall back to the account default when config is set');
});

// --- 5. update path fixes sender on an existing draft (PATCH, never POST) ----

test('updateDraftMessageMetadata PATCHes sender + reply-to into an existing draft and creates nothing', async () => {
  const client = mockClient();
  const r = await svc(client).updateDraftMessageMetadata({
    campaignId: 'DR37', subject: 'S', previewText: 'P',
    fromEmail: 'sales@retaildisplaydirect.com.au', fromLabel: 'Retail Display Direct', replyToEmail: 'sales@retaildisplaydirect.com.au',
  });
  assert.strictEqual(r.fromEmail, 'sales@retaildisplaydirect.com.au');
  assert.strictEqual(r.replyToEmail, 'sales@retaildisplaydirect.com.au');
  const patch = client.calls.find((c) => c.method === 'PATCH' && /\/campaign-messages\//.test(c.pathname));
  const content = patch.body.data.attributes.content;
  assert.strictEqual(content.from_email, 'sales@retaildisplaydirect.com.au');
  assert.strictEqual(content.reply_to_email, 'sales@retaildisplaydirect.com.au');
  assert.strictEqual(content.subject, 'S');
  assert.ok(!client.calls.some((c) => c.method === 'POST'), 'update must never POST (no duplicate)');
});

// --- 6. tracking on an existing draft (PATCH campaign attributes) -----------

test('updateCampaignTracking PATCHes tracking_options onto the campaign', async () => {
  const client = mockClient();
  await svc(client).updateCampaignTracking('DR37');
  const patch = client.calls.find((c) => c.method === 'PATCH' && /^\/campaigns\/DR37\//.test(c.pathname));
  assert.ok(patch, 'must PATCH the campaign');
  assert.deepStrictEqual(patch.body.data.attributes.tracking_options, { add_tracking_params: true });
});

// --- 7. no delete surface (safety) -----------------------------------------

test('the draft service exposes no delete/send capability', () => {
  const client = mockClient();
  const s = svc(client);
  for (const k of Object.keys(s)) assert.ok(!/delete|remove|send|schedule/i.test(k), `unexpected method ${k}`);
});
