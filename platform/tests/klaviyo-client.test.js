// T4 tests — Klaviyo transport client. Fully offline: a mocked fetch, no key,
// no network, no delays (sleep + backoff are stubbed/zeroed).

'use strict';

const { test } = require('node:test');
const assert = require('node:assert');
const { KlaviyoClient } = require('../integrations/klaviyo/client');
const { IntegrationError, ConfigError } = require('../common/errors');

// --- fake HTTP helpers -----------------------------------------------------

function fakeRes(status, body, headers = {}) {
  return {
    status,
    ok: status >= 200 && status < 300,
    statusText: String(status),
    headers: { get: (n) => headers[n.toLowerCase()] ?? null },
    json: async () => body,
  };
}

// fetch stub that returns queued responses in order (last one repeats), and
// records every call so we can assert on headers.
function queuedFetch(responses) {
  const calls = [];
  const fn = async (url, options) => {
    calls.push({ url, options });
    const idx = Math.min(calls.length - 1, responses.length - 1);
    const r = responses[idx];
    if (r instanceof Error) throw r;
    return typeof r === 'function' ? r() : r;
  };
  fn.calls = calls;
  return fn;
}

const base = { apiBaseUrl: 'https://a.klaviyo.com/api', revision: '2024-10-15', apiKey: 'pk_secret_ABC123DEF456GHI789', backoffBaseMs: 0, sleepImpl: async () => {} };

// --- constructor validation ------------------------------------------------

test('constructor requires apiBaseUrl, revision, apiKey', () => {
  assert.throws(() => new KlaviyoClient({ revision: 'r', apiKey: 'k' }), ConfigError);
  assert.throws(() => new KlaviyoClient({ apiBaseUrl: 'u', apiKey: 'k' }), ConfigError);
  assert.throws(() => new KlaviyoClient({ apiBaseUrl: 'u', revision: 'r' }), ConfigError);
});

// --- headers / auth --------------------------------------------------------

test('sends Authorization (Klaviyo-API-Key), revision, and Accept headers', async () => {
  const fetchImpl = queuedFetch([fakeRes(200, { data: [{ id: 'ACC1' }] })]);
  const c = new KlaviyoClient({ ...base, fetchImpl });
  await c.get('/accounts/');
  const h = fetchImpl.calls[0].options.headers;
  assert.strictEqual(h.Authorization, 'Klaviyo-API-Key pk_secret_ABC123DEF456GHI789');
  assert.strictEqual(h.revision, '2024-10-15');
  assert.strictEqual(h.Accept, 'application/json');
  assert.strictEqual(fetchImpl.calls[0].options.method, 'GET');
});

// --- success path ----------------------------------------------------------

test('GET returns the parsed JSON body', async () => {
  const c = new KlaviyoClient({ ...base, fetchImpl: queuedFetch([fakeRes(200, { data: [{ id: 'X' }] })]) });
  const json = await c.get('/accounts/');
  assert.deepStrictEqual(json, { data: [{ id: 'X' }] });
});

test('verifyConnectivity returns accountId, accountName, revision', async () => {
  const body = { data: [{ id: 'XAUdQX', attributes: { test_account: false, contact_information: { organization_name: 'Retail Display Direct' } } }] };
  const c = new KlaviyoClient({ ...base, fetchImpl: queuedFetch([fakeRes(200, body)]) });
  const r = await c.verifyConnectivity();
  assert.deepStrictEqual(r, {
    ok: true,
    accountId: 'XAUdQX',
    accountName: 'Retail Display Direct',
    testAccount: false,
    revision: '2024-10-15',
    apiBaseUrl: 'https://a.klaviyo.com/api',
  });
});

// --- error mapping ---------------------------------------------------------

test('401 → IntegrationError about the API key', async () => {
  const c = new KlaviyoClient({ ...base, fetchImpl: queuedFetch([fakeRes(401, { errors: [{ detail: 'invalid key' }] })]) });
  await assert.rejects(() => c.get('/accounts/'), (e) => e instanceof IntegrationError && /key/i.test(e.message) && e.details.status === 401);
});

test('403 → IntegrationError about scope', async () => {
  const c = new KlaviyoClient({ ...base, fetchImpl: queuedFetch([fakeRes(403, {})]) });
  await assert.rejects(() => c.get('/accounts/'), (e) => e instanceof IntegrationError && /scope/i.test(e.message));
});

test('400 → IntegrationError mentioning the revision header', async () => {
  const c = new KlaviyoClient({ ...base, fetchImpl: queuedFetch([fakeRes(400, { errors: [{ detail: 'bad revision' }] })]) });
  await assert.rejects(() => c.get('/accounts/'), (e) => e instanceof IntegrationError && /revision/i.test(e.message));
});

// --- retry / backoff -------------------------------------------------------

test('retries on 429 then succeeds', async () => {
  const fetchImpl = queuedFetch([fakeRes(429, {}, { 'retry-after': '0' }), fakeRes(200, { data: [{ id: 'OK' }] })]);
  const c = new KlaviyoClient({ ...base, fetchImpl });
  const json = await c.get('/accounts/');
  assert.strictEqual(json.data[0].id, 'OK');
  assert.strictEqual(fetchImpl.calls.length, 2);
});

test('gives up after maxRetries on persistent 429', async () => {
  const fetchImpl = queuedFetch([fakeRes(429, {})]);
  const c = new KlaviyoClient({ ...base, maxRetries: 2, fetchImpl });
  await assert.rejects(() => c.get('/accounts/'), (e) => e instanceof IntegrationError && /rate limit/i.test(e.message));
  assert.strictEqual(fetchImpl.calls.length, 3); // 1 + 2 retries
});

test('retries on 5xx then succeeds', async () => {
  const fetchImpl = queuedFetch([fakeRes(503, {}), fakeRes(200, { data: [{ id: 'OK' }] })]);
  const c = new KlaviyoClient({ ...base, fetchImpl });
  assert.strictEqual((await c.get('/accounts/')).data[0].id, 'OK');
});

test('retries a network error then maps to unreachable', async () => {
  const netErr = Object.assign(new Error('fetch failed'), { name: 'TypeError' });
  const c = new KlaviyoClient({ ...base, maxRetries: 1, fetchImpl: queuedFetch([netErr]) });
  await assert.rejects(() => c.get('/accounts/'), (e) => e instanceof IntegrationError && /unreachable/i.test(e.message));
});

test('maps a timeout (AbortError) to an unreachable/timeout error', async () => {
  const abort = Object.assign(new Error('aborted'), { name: 'AbortError' });
  const c = new KlaviyoClient({ ...base, maxRetries: 0, fetchImpl: queuedFetch([abort]) });
  await assert.rejects(() => c.get('/accounts/'), (e) => e instanceof IntegrationError && /timed out|unreachable/i.test(e.message));
});

// --- security / scope ------------------------------------------------------

test('the API key never leaks into an error message or details', async () => {
  const c = new KlaviyoClient({ ...base, fetchImpl: queuedFetch([fakeRes(401, {})]) });
  try {
    await c.get('/accounts/');
    assert.fail('should have thrown');
  } catch (e) {
    assert.strictEqual(e.message.includes('pk_secret'), false);
    assert.strictEqual(JSON.stringify(e.details || {}).includes('pk_secret'), false);
  }
});

test('the client exposes get + post (T7) but NO send/schedule surface', () => {
  const c = new KlaviyoClient({ ...base, fetchImpl: queuedFetch([fakeRes(200, {})]) });
  assert.strictEqual(typeof c.get, 'function');
  assert.strictEqual(typeof c.verifyConnectivity, 'function');
  assert.strictEqual(typeof c.post, 'function'); // write added in T7 (draft creation)
  assert.strictEqual(typeof c.patch, 'function'); // write added in Sprint 9 (template update)
  // still no send/schedule/activate capability on the transport
  assert.strictEqual(typeof c.send, 'undefined');
  assert.strictEqual(typeof c.schedule, 'undefined');
  assert.strictEqual(typeof c.sendCampaign, 'undefined');
});

test('patch sends a JSON body with method PATCH and does not retry 5xx', async () => {
  const okFetch = queuedFetch([fakeRes(200, { data: { id: 'T1' } })]);
  const c = new KlaviyoClient({ ...base, fetchImpl: okFetch });
  await c.patch('/templates/T1/', { data: { type: 'template' } });
  assert.strictEqual(okFetch.calls[0].options.method, 'PATCH');
  assert.strictEqual(okFetch.calls[0].options.headers['Content-Type'], 'application/json');

  const failFetch = queuedFetch([fakeRes(500, {}), fakeRes(200, { data: { id: 'X' } })]);
  const c2 = new KlaviyoClient({ ...base, fetchImpl: failFetch });
  await assert.rejects(() => c2.patch('/templates/T1/', {}), IntegrationError);
  assert.strictEqual(failFetch.calls.length, 1); // never retried
});

test('post sends a JSON body with Content-Type and method POST', async () => {
  const fetchImpl = queuedFetch([fakeRes(201, { data: { id: 'C1' } })]);
  const c = new KlaviyoClient({ ...base, fetchImpl });
  const out = await c.post('/campaigns/', { data: { type: 'campaign' } });
  assert.strictEqual(out.data.id, 'C1');
  const call = fetchImpl.calls[0];
  assert.strictEqual(call.options.method, 'POST');
  assert.strictEqual(call.options.headers['Content-Type'], 'application/json');
  assert.deepStrictEqual(JSON.parse(call.options.body), { data: { type: 'campaign' } });
});

test('post retries on 429 (rejected, not processed) then succeeds', async () => {
  const fetchImpl = queuedFetch([fakeRes(429, {}, { 'retry-after': '0' }), fakeRes(201, { data: { id: 'C2' } })]);
  const c = new KlaviyoClient({ ...base, fetchImpl });
  assert.strictEqual((await c.post('/campaigns/', {})).data.id, 'C2');
  assert.strictEqual(fetchImpl.calls.length, 2);
});

test('post does NOT retry on 5xx (idempotency safety — no duplicate campaign)', async () => {
  const fetchImpl = queuedFetch([fakeRes(500, {}), fakeRes(201, { data: { id: 'SHOULD_NOT_REACH' } })]);
  const c = new KlaviyoClient({ ...base, fetchImpl });
  await assert.rejects(() => c.post('/campaigns/', {}), IntegrationError);
  assert.strictEqual(fetchImpl.calls.length, 1); // only one attempt — never retried
});
