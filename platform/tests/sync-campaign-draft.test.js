// sync-campaign-draft — offline unit tests (injected client; no network, no key).
// Proves UPDATE-ONLY behaviour: update existing Draft, STOP on missing/non-Draft/
// multiple, no duplicate create, brand isolation, no send_strategy/audience/schedule,
// and verify-after-update.

'use strict';

const { test } = require('node:test');
const assert = require('node:assert');

const { syncCampaignDraft, brandPrefixOf } = require('../integrations/klaviyo/sync-campaign-draft');
const { ApprovalRequired, ConfigError } = require('../common/errors');

const CID = 'SC-2026-LAUNCH-x';
const NAME = `${CID}: New Arrival`;
const HTML = '<html><body>hi</body></html>';

// A recording mock Klaviyo client covering every path the sync + reused services hit.
function makeClient({ campaigns = [], assignedHtmlLen = 1200, templateFind = [] } = {}) {
  const calls = { get: [], post: [], patch: [] };
  const findById = (id) => campaigns.find((c) => c.id === id);
  const get = async (p) => {
    calls.get.push(p);
    if (p.startsWith('/campaigns/?filter=')) return { data: campaigns, links: { next: null } };
    if (/^\/campaigns\/[^/]+\/campaign-messages\/$/.test(p)) return { data: [{ type: 'campaign-message', id: 'MSG1' }] };
    if (/^\/campaigns\/[^/]+\/\?fields/.test(p)) {
      const id = p.split('/')[2];
      const c = findById(id);
      return { data: { id, attributes: { name: (c && c.attributes.name) || NAME, status: (c && c.attributes.status) || 'Draft', audiences: { included: ['L1'], excluded: [] } } } };
    }
    if (p.startsWith('/templates/?filter=')) return { data: templateFind };
    if (/^\/templates\/[^/?]+\/\?fields/.test(p)) {
      const id = p.split('/')[2];
      return { data: { id, attributes: { name: 'Automation: X', editor_type: 'CODE', updated: 't', html: 'x'.repeat(assignedHtmlLen) } } };
    }
    if (/^\/campaign-messages\/[^/]+\/relationships\/template\/$/.test(p)) return { data: { type: 'template', id: 'TCLONE' } };
    if (/^\/campaign-messages\/[^/]+\/$/.test(p)) return { data: { id: 'MSG1', attributes: { content: { subject: 'old', preview_text: 'old', from_email: 'x@y.com' } } } };
    throw new Error('unexpected GET ' + p);
  };
  const post = async (p, b) => {
    calls.post.push({ p, b });
    if (p === '/templates/') return { data: { id: 'TSRC', attributes: { name: 'Automation: X', editor_type: 'CODE' } } };
    if (p === '/campaign-message-assign-template/') return { data: {} };
    if (p === '/campaigns/') return { data: { id: 'NEWDRAFT', attributes: { status: 'Draft' } } };
    throw new Error('unexpected POST ' + p);
  };
  const patch = async (p, b) => { calls.patch.push({ p, b }); return { data: { id: p.split('/')[2], attributes: {} } }; };
  return { calls, get, post, patch };
}

const draftRow = (id = 'D1', status = 'Draft', name = NAME) => ({ id, attributes: { name, status } });
const writeBodies = (client) => [...client.calls.post, ...client.calls.patch].map((c) => JSON.stringify(c.b || {}));

// --- 1. existing Draft update (happy path) ---------------------------------

test('updates the existing Draft: assigns template, refreshes subject/preview, verifies', async () => {
  const client = makeClient({ campaigns: [draftRow()] });
  const r = await syncCampaignDraft({ brand: 'SC', campaignId: CID, html: HTML, subject: 'S', previewText: 'P', client, repoRoot: '/tmp' });
  assert.strictEqual(r.ok, true);
  assert.strictEqual(r.verified, true);
  assert.strictEqual(r.draftId, 'D1');
  assert.strictEqual(r.status, 'Draft');
  assert.strictEqual(r.duplicateDraftCount, 1);
  assert.ok(client.calls.post.some((c) => c.p === '/campaign-message-assign-template/'), 'template assigned to the draft message');
});

// --- 2. duplicate prevention (never POST /campaigns/) ----------------------

test('reuses the existing Draft — never creates a duplicate campaign', async () => {
  const client = makeClient({ campaigns: [draftRow()] });
  await syncCampaignDraft({ brand: 'SC', campaignId: CID, html: HTML, client, repoRoot: '/tmp' });
  assert.ok(!client.calls.post.some((c) => c.p === '/campaigns/'), 'must NOT create a campaign');
});

// --- 3. missing Draft → STOP, no writes -----------------------------------

test('STOPs when no matching campaign exists (never creates one)', async () => {
  const client = makeClient({ campaigns: [] });
  await assert.rejects(
    () => syncCampaignDraft({ brand: 'SC', campaignId: CID, html: HTML, client, repoRoot: '/tmp' }),
    (e) => e instanceof ApprovalRequired && /No existing Klaviyo campaign/.test(e.message)
  );
  assert.strictEqual(client.calls.post.length, 0);
  assert.strictEqual(client.calls.patch.length, 0);
});

// --- 4. non-Draft status → STOP, no writes --------------------------------

test('STOPs when the matched campaign is not a Draft (Sent/Scheduled/Sending)', async () => {
  for (const status of ['Sent', 'Scheduled', 'Sending']) {
    const client = makeClient({ campaigns: [draftRow('S1', status)] });
    await assert.rejects(
      () => syncCampaignDraft({ brand: 'SC', campaignId: CID, html: HTML, client, repoRoot: '/tmp' }),
      (e) => e instanceof ApprovalRequired && /NONE are Draft/.test(e.message)
    );
    assert.strictEqual(client.calls.post.length, 0, `${status}: no writes`);
    assert.strictEqual(client.calls.patch.length, 0, `${status}: no writes`);
  }
});

// --- 5. multiple matching Drafts → STOP, no writes ------------------------

test('STOPs on ambiguity when >1 Draft matches (never guesses)', async () => {
  const client = makeClient({ campaigns: [draftRow('D1'), draftRow('D2', 'Draft', `${CID}: Copy`)] });
  await assert.rejects(
    () => syncCampaignDraft({ brand: 'SC', campaignId: CID, html: HTML, client, repoRoot: '/tmp' }),
    (e) => e instanceof ApprovalRequired && /AMBIGUOUS/.test(e.message)
  );
  assert.strictEqual(client.calls.post.length, 0);
  assert.strictEqual(client.calls.patch.length, 0);
});

// --- 6. brand/account isolation -------------------------------------------

test('refuses a cross-brand campaign_id before any API call', async () => {
  const client = makeClient({ campaigns: [] });
  await assert.rejects(
    () => syncCampaignDraft({ brand: 'SS', campaignId: CID, html: HTML, client, repoRoot: '/tmp' }),
    (e) => e instanceof ConfigError && /cross-brand/.test(e.message)
  );
  assert.strictEqual(client.calls.get.length, 0, 'guard runs before any network call');
});

test('brandPrefixOf derives the brand from the campaign_id', () => {
  assert.strictEqual(brandPrefixOf('SC-2026-LAUNCH-x'), 'SC');
  assert.strictEqual(brandPrefixOf('RDD-2026-37'), 'RDD');
  assert.strictEqual(brandPrefixOf(''), null);
});

// --- 7/8/9. no send_strategy, no audience change, no send/schedule --------

test('never writes send_strategy, audiences, or any send/schedule endpoint', async () => {
  const client = makeClient({ campaigns: [draftRow()] });
  await syncCampaignDraft({ brand: 'SC', campaignId: CID, html: HTML, subject: 'S', previewText: 'P', client, repoRoot: '/tmp' });
  const bodies = writeBodies(client);
  assert.ok(bodies.every((b) => !b.includes('send_strategy')), 'no send_strategy in any write');
  assert.ok(bodies.every((b) => !b.includes('audiences')), 'no audience change in any write');
  const allPaths = [...client.calls.get, ...client.calls.post.map((c) => c.p), ...client.calls.patch.map((c) => c.p)];
  assert.ok(allPaths.every((p) => !/send-job|send_campaign|\/campaign-send/.test(p)), 'no send/schedule endpoint touched');
  // metadata refresh patches the MESSAGE, not the campaign (so audience/tracking untouched)
  assert.ok(client.calls.patch.every((c) => /^\/campaign-messages\//.test(c.p)), 'only message metadata is patched');
});

// --- 10. verify-after-update -----------------------------------------------

test('re-fetches the campaign after the write to verify status + no duplicate', async () => {
  const client = makeClient({ campaigns: [draftRow()] });
  const r = await syncCampaignDraft({ brand: 'SC', campaignId: CID, html: HTML, client, repoRoot: '/tmp' });
  assert.ok(client.calls.get.some((p) => /^\/campaigns\/D1\/\?fields\[campaign\]=name,status,audiences/.test(p)), 'verify re-read happened');
  assert.strictEqual(r.noSchedule, true);
  assert.strictEqual(r.verified, true);
});

// --- dry-run: no writes ----------------------------------------------------

test('--dry-run resolves + guards but writes nothing', async () => {
  const client = makeClient({ campaigns: [draftRow()] });
  const r = await syncCampaignDraft({ brand: 'SC', campaignId: CID, html: HTML, client, repoRoot: '/tmp', dryRun: true });
  assert.strictEqual(r.dryRun, true);
  assert.strictEqual(r.draftId, 'D1');
  assert.strictEqual(client.calls.post.length, 0);
  assert.strictEqual(client.calls.patch.length, 0);
});

// --- input validation ------------------------------------------------------

test('requires --brand and --campaign', async () => {
  await assert.rejects(() => syncCampaignDraft({ campaignId: CID, html: HTML, client: makeClient(), repoRoot: '/tmp' }), ConfigError);
  await assert.rejects(() => syncCampaignDraft({ brand: 'SC', html: HTML, client: makeClient(), repoRoot: '/tmp' }), ConfigError);
});
