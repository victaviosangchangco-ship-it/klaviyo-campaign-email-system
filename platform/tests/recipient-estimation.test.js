// Recipient estimator — offline unit tests (mocked client, no sleep).

'use strict';

const { test } = require('node:test');
const assert = require('node:assert');
const { createRecipientEstimator, JOBS_PATH, ESTIMATES_PATH } = require('../integrations/klaviyo/recipient-estimation');

function mockClient(routes) {
  const calls = [];
  return {
    calls,
    post: async (p, b) => { calls.push({ m: 'POST', p, b }); return (routes.POST && routes.POST(p)) || {}; },
    get: async (p) => { calls.push({ m: 'GET', p }); if (routes.GET) return routes.GET(p); throw new Error(`unmocked GET ${p}`); },
  };
}
const noSleep = async () => {};

test('estimate returns the count when the job completes', async () => {
  const client = mockClient({
    POST: () => ({ data: { id: 'C1' } }),
    GET: (p) => {
      if (p.startsWith(JOBS_PATH)) return { data: { attributes: { status: 'complete' } } };
      if (p.startsWith(ESTIMATES_PATH)) return { data: { attributes: { estimated_recipient_count: 8421 } } };
      throw new Error('unexpected');
    },
  });
  const est = createRecipientEstimator({ client, sleepImpl: noSleep });
  assert.deepStrictEqual(await est.estimate('C1'), { available: true, count: 8421, status: 'complete' });
});

test('estimate reports unavailable when the job does not complete in time', async () => {
  const client = mockClient({
    POST: () => ({ data: { id: 'C1' } }),
    GET: () => ({ data: { attributes: { status: 'processing' } } }),
  });
  const est = createRecipientEstimator({ client, sleepImpl: noSleep, maxWaitMs: 3000, pollMs: 1000 });
  const r = await est.estimate('C1');
  assert.strictEqual(r.available, false);
  assert.strictEqual(r.count, null);
});

test('estimate is best-effort — a transport error → unavailable, never throws', async () => {
  const client = { post: async () => { throw new Error('boom'); }, get: async () => ({}) };
  const est = createRecipientEstimator({ client, sleepImpl: noSleep });
  const r = await est.estimate('C1');
  assert.strictEqual(r.available, false);
  assert.strictEqual(r.status, 'error');
});
