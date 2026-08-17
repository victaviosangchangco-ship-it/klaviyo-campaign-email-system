// T5 tests — read-only List Service. Offline: a mocked client, no network, no key.

'use strict';

const { test } = require('node:test');
const assert = require('node:assert');
const { createListService, shapeList, toRelativePath } = require('../integrations/klaviyo/list-service');
const { IntegrationError } = require('../common/errors');

// Mock client: returns queued responses in order (keyed by call index), and
// records the paths requested. Optionally throws a queued Error.
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

function listResource(id, name) {
  return { type: 'list', id, attributes: { name, created: '2026-01-01', updated: '2026-02-02' } };
}

// --- helpers ---------------------------------------------------------------

test('shapeList produces a clean typed object', () => {
  assert.deepStrictEqual(shapeList(listResource('L1', 'VIP')), {
    id: 'L1', name: 'VIP', created: '2026-01-01', updated: '2026-02-02',
  });
});

test('toRelativePath reduces an absolute next-link to a relative path', () => {
  assert.strictEqual(
    toRelativePath('https://a.klaviyo.com/api/lists/?page%5Bcursor%5D=abc'),
    '/lists/?page%5Bcursor%5D=abc'
  );
  assert.strictEqual(toRelativePath(null), null);
});

// --- listAll (with pagination) ---------------------------------------------

test('listAll aggregates all pages and returns typed lists', async () => {
  const client = mockClient([
    { data: [listResource('L1', 'A'), listResource('L2', 'B')], links: { next: 'https://a.klaviyo.com/api/lists/?page=2' } },
    { data: [listResource('L3', 'C')], links: { next: null } },
  ]);
  const svc = createListService({ client });
  const all = await svc.listAll();
  assert.strictEqual(all.length, 3);
  assert.deepStrictEqual(all.map((l) => l.id), ['L1', 'L2', 'L3']);
  assert.strictEqual(client.paths.length, 2); // followed one next-page link
  assert.strictEqual(client.paths[1], '/lists/?page=2');
});

test('listAll handles an empty account', async () => {
  const svc = createListService({ client: mockClient([{ data: [], links: {} }]) });
  assert.deepStrictEqual(await svc.listAll(), []);
});

// --- resolveByName ---------------------------------------------------------

test('resolveByName matches case-insensitively and trims', async () => {
  const client = mockClient([{ data: [listResource('L1', 'Newsletter'), listResource('L2', 'VIP')], links: {} }]);
  const svc = createListService({ client });
  assert.strictEqual((await svc.resolveByName('  newsletter ')).id, 'L1');
});

test('resolveByName returns null when no list matches', async () => {
  const svc = createListService({ client: mockClient([{ data: [listResource('L1', 'Newsletter')], links: {} }]) });
  assert.strictEqual(await svc.resolveByName('Nope'), null);
  assert.strictEqual(await svc.resolveByName(''), null);
});

// --- resolveById -----------------------------------------------------------

test('resolveById returns the typed list', async () => {
  const svc = createListService({ client: mockClient([{ data: listResource('L9', 'Seed') }]) });
  const l = await svc.resolveById('L9');
  assert.strictEqual(l.name, 'Seed');
});

test('resolveById returns null on a 404 (not other errors)', async () => {
  const notFound = new IntegrationError('not found', { status: 404 });
  assert.strictEqual(await createListService({ client: mockClient([notFound]) }).resolveById('X'), null);

  const server = new IntegrationError('boom', { status: 500 });
  await assert.rejects(() => createListService({ client: mockClient([server]) }).resolveById('X'), IntegrationError);
});

// --- validateConfiguredList ------------------------------------------------

test('validateConfiguredList: by id (found / not found)', async () => {
  const found = createListService({ client: mockClient([{ data: listResource('L9', 'Seed') }]) });
  assert.deepStrictEqual(await found.validateConfiguredList({ id: 'L9' }), { ok: true, list: { id: 'L9', name: 'Seed', created: '2026-01-01', updated: '2026-02-02' }, reason: null });

  const missing = createListService({ client: mockClient([new IntegrationError('nf', { status: 404 })]) });
  const r = await missing.validateConfiguredList({ id: 'Lx' });
  assert.strictEqual(r.ok, false);
  assert.match(r.reason, /not found/i);
});

test('validateConfiguredList: by name and the empty case', async () => {
  const byName = createListService({ client: mockClient([{ data: [listResource('L2', 'VIP')], links: {} }]) });
  assert.strictEqual((await byName.validateConfiguredList({ name: 'VIP' })).ok, true);

  const none = createListService({ client: mockClient([{ data: [], links: {} }]) });
  const r = await none.validateConfiguredList({});
  assert.strictEqual(r.ok, false);
  assert.match(r.reason, /no audience list configured/i);
});

// --- read-only surface -----------------------------------------------------

test('the List Service exposes NO write/create/send methods', () => {
  const svc = createListService({ client: mockClient([{ data: [] }]) });
  for (const fn of ['listAll', 'resolveByName', 'resolveById', 'validateConfiguredList']) {
    assert.strictEqual(typeof svc[fn], 'function');
  }
  for (const fn of ['create', 'createList', 'delete', 'update', 'addProfiles', 'send']) {
    assert.strictEqual(typeof svc[fn], 'undefined');
  }
});

test('createListService requires a client with get()', () => {
  assert.throws(() => createListService({}), IntegrationError);
});
