// T6 tests — read-only Segment Service. Offline: a mocked client, no network, no key.

'use strict';

const { test } = require('node:test');
const assert = require('node:assert');
const { createSegmentService, shapeSegment } = require('../integrations/klaviyo/segment-service');
const { IntegrationError } = require('../common/errors');

function mockClient(responses) {
  const paths = [];
  return {
    paths,
    get: async (pathname) => {
      paths.push(pathname);
      const r = responses[Math.min(paths.length - 1, responses.length - 1)];
      if (r instanceof Error) throw r;
      return typeof r === 'function' ? r() : r;
    },
  };
}

function segResource(id, name, extra = {}) {
  return { type: 'segment', id, attributes: { name, created: '2026-01-01', updated: '2026-02-02', is_active: true, is_processing: false, ...extra } };
}

// --- shape -----------------------------------------------------------------

test('shapeSegment produces a clean typed object incl. active flags', () => {
  assert.deepStrictEqual(shapeSegment(segResource('S1', 'Engaged 90d')), {
    id: 'S1', name: 'Engaged 90d', created: '2026-01-01', updated: '2026-02-02', isActive: true, isProcessing: false,
  });
});

// --- listAll (pagination) --------------------------------------------------

test('listAll aggregates all pages and returns typed segments', async () => {
  const client = mockClient([
    { data: [segResource('S1', 'A'), segResource('S2', 'B')], links: { next: 'https://a.klaviyo.com/api/segments/?page=2' } },
    { data: [segResource('S3', 'C')], links: { next: null } },
  ]);
  const svc = createSegmentService({ client });
  const all = await svc.listAll();
  assert.deepStrictEqual(all.map((s) => s.id), ['S1', 'S2', 'S3']);
  assert.strictEqual(client.paths.length, 2);
  assert.strictEqual(client.paths[0], '/segments/');
  assert.strictEqual(client.paths[1], '/segments/?page=2');
});

test('listAll handles an account with no segments', async () => {
  const svc = createSegmentService({ client: mockClient([{ data: [], links: {} }]) });
  assert.deepStrictEqual(await svc.listAll(), []);
});

// --- resolveByName ---------------------------------------------------------

test('resolveByName matches case-insensitively and trims', async () => {
  const client = mockClient([{ data: [segResource('S1', 'Engaged 90d'), segResource('S2', 'VIP')], links: {} }]);
  assert.strictEqual((await createSegmentService({ client }).resolveByName('  engaged 90d ')).id, 'S1');
});

test('resolveByName returns null when nothing matches or name is empty', async () => {
  const svc = createSegmentService({ client: mockClient([{ data: [segResource('S1', 'VIP')], links: {} }]) });
  assert.strictEqual(await svc.resolveByName('Nope'), null);
  assert.strictEqual(await svc.resolveByName(''), null);
});

// --- resolveById -----------------------------------------------------------

test('resolveById returns the typed segment', async () => {
  const svc = createSegmentService({ client: mockClient([{ data: segResource('S9', 'Seed') }]) });
  assert.strictEqual((await svc.resolveById('S9')).name, 'Seed');
});

test('resolveById returns null on 404, rethrows other errors', async () => {
  assert.strictEqual(
    await createSegmentService({ client: mockClient([new IntegrationError('nf', { status: 404 })]) }).resolveById('X'),
    null
  );
  await assert.rejects(
    () => createSegmentService({ client: mockClient([new IntegrationError('boom', { status: 500 })]) }).resolveById('X'),
    IntegrationError
  );
});

// --- validateConfiguredSegment ---------------------------------------------

test('validateConfiguredSegment: by id (found / not found)', async () => {
  const found = createSegmentService({ client: mockClient([{ data: segResource('S9', 'Seed') }]) });
  const okr = await found.validateConfiguredSegment({ id: 'S9' });
  assert.strictEqual(okr.ok, true);
  assert.strictEqual(okr.segment.name, 'Seed');

  const missing = createSegmentService({ client: mockClient([new IntegrationError('nf', { status: 404 })]) });
  const r = await missing.validateConfiguredSegment({ id: 'Sx' });
  assert.strictEqual(r.ok, false);
  assert.match(r.reason, /not found/i);
});

test('validateConfiguredSegment: by name and the empty case', async () => {
  const byName = createSegmentService({ client: mockClient([{ data: [segResource('S2', 'VIP')], links: {} }]) });
  assert.strictEqual((await byName.validateConfiguredSegment({ name: 'VIP' })).ok, true);

  const none = createSegmentService({ client: mockClient([{ data: [], links: {} }]) });
  const r = await none.validateConfiguredSegment({});
  assert.strictEqual(r.ok, false);
  assert.match(r.reason, /no audience segment configured/i);
});

// --- read-only surface + guards --------------------------------------------

test('the Segment Service exposes NO write/create/send methods', () => {
  const svc = createSegmentService({ client: mockClient([{ data: [] }]) });
  for (const fn of ['listAll', 'resolveByName', 'resolveById', 'validateConfiguredSegment']) {
    assert.strictEqual(typeof svc[fn], 'function');
  }
  for (const fn of ['create', 'createSegment', 'delete', 'update', 'send']) {
    assert.strictEqual(typeof svc[fn], 'undefined');
  }
});

test('createSegmentService requires a client with get()', () => {
  assert.throws(() => createSegmentService({}), IntegrationError);
});
