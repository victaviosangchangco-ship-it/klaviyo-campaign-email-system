// T1 + T2 tests — env loader and Klaviyo config loader. Offline, no key, no network.

'use strict';

const { test } = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const os = require('os');
const path = require('path');

const { parseEnvFile, resolveVar, validateRequired } = require('../common/env');
const { loadKlaviyoConfig, validateForDraft } = require('../integrations/klaviyo/config');
const { ConfigError } = require('../common/errors');

// --- T1: env loader --------------------------------------------------------

test('parseEnvFile handles KEY: VALUE, KEY=VALUE, KEY := VALUE, comments, blanks', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'env-'));
  const file = path.join(dir, '.env');
  fs.writeFileSync(file, ['# comment', '', 'A: 1', 'B=2', 'C := 3', 'API PATH: https://x/y'].join('\n'));
  const env = parseEnvFile(file);
  assert.strictEqual(env.A, '1');
  assert.strictEqual(env.B, '2');
  assert.strictEqual(env.C, '3');
  assert.strictEqual(env['API PATH'], 'https://x/y');
});

test('parseEnvFile returns {} for a missing file (not an error)', () => {
  assert.deepStrictEqual(parseEnvFile(path.join(os.tmpdir(), 'does-not-exist-xyz.env')), {});
});

test('resolveVar prefers process.env over the file, then falls back', () => {
  const fileEnv = { KLAVIYO_API_KEY: 'from-file' };
  assert.strictEqual(resolveVar(fileEnv, 'KLAVIYO_API_KEY'), 'from-file');
  process.env.__TEST_KEY__ = 'from-process';
  try {
    assert.strictEqual(resolveVar({ __TEST_KEY__: 'from-file' }, '__TEST_KEY__'), 'from-process');
  } finally {
    delete process.env.__TEST_KEY__;
  }
  assert.strictEqual(resolveVar({}, 'NOPE'), null);
});

test('validateRequired reports missing labels without throwing', () => {
  const r = validateRequired({ a: 'x', b: null, c: '' });
  assert.strictEqual(r.ok, false);
  assert.deepStrictEqual(r.missing.sort(), ['b', 'c']);
  assert.strictEqual(validateRequired({ a: 'x' }).ok, true);
});

// --- T2: Klaviyo config loader ---------------------------------------------

test('loadKlaviyoConfig(RDD) returns structural config with safe defaults', () => {
  const cfg = loadKlaviyoConfig('RDD');
  assert.strictEqual(cfg.brand, 'RDD');
  assert.strictEqual(cfg.apiBaseUrl, 'https://a.klaviyo.com/api');
  assert.match(cfg.revision, /^\d{4}-\d{2}-\d{2}$/);
  assert.ok(Array.isArray(cfg.requiredScopes) && cfg.requiredScopes.length > 0);
  assert.strictEqual(cfg.apiKeyEnvVar, 'KLAVIYO_API_KEY');
});

test('loadKlaviyoConfig NEVER exposes the API key value (presence flag only)', () => {
  const cfg = loadKlaviyoConfig('RDD');
  assert.strictEqual(typeof cfg.hasApiKey, 'boolean');
  const serialized = JSON.stringify(cfg);
  assert.strictEqual(/pk_/.test(serialized), false, 'no key material may appear on the config object');
});

test('loadKlaviyoConfig reports pending external prerequisites (not fatal)', () => {
  const cfg = loadKlaviyoConfig('RDD');
  // The brand sender is now configured (sales@retaildisplaydirect.com.au, §13.4),
  // so it is NO LONGER pending; the audience remains a per-run confirmation (§13.1),
  // so the config is still not draft-ready on its own.
  assert.ok(!cfg.pending.includes('klaviyo.sender.fromEmail'), 'brand sender is now configured');
  assert.ok(cfg.pending.includes('klaviyo.audience.id|name'), 'audience stays a per-run prerequisite');
  assert.strictEqual(cfg.ready.forDraft, false);
  assert.strictEqual(validateForDraft(cfg).ok, false);
});

test('loadKlaviyoConfig is multi-brand ready: unknown brand → ConfigError', () => {
  // SS/SC are now configured brands (see SS/SC positive tests below); only a
  // genuinely-unknown code must throw.
  assert.throws(() => loadKlaviyoConfig('NOPE'), ConfigError);
  assert.throws(() => loadKlaviyoConfig('ZZZ'), ConfigError);
});

// --- SS + SC brand configs (multi-brand extension) -------------------------

for (const brand of ['SS', 'SC']) {
  test(`loadKlaviyoConfig(${brand}) returns structural config with a brand-prefixed key env var`, () => {
    const cfg = loadKlaviyoConfig(brand);
    assert.strictEqual(cfg.brand, brand);
    assert.strictEqual(cfg.apiBaseUrl, 'https://a.klaviyo.com/api');
    assert.match(cfg.revision, /^\d{4}-\d{2}-\d{2}$/);
    assert.strictEqual(cfg.apiKeyEnvVar, `${brand}_KLAVIYO_API_KEY`);
    assert.strictEqual(cfg.envPath, `Brands/${brand}/.env`);
  });

  test(`loadKlaviyoConfig(${brand}) NEVER exposes the API key value (presence flag only)`, () => {
    const cfg = loadKlaviyoConfig(brand);
    assert.strictEqual(typeof cfg.hasApiKey, 'boolean');
    assert.strictEqual(/pk_/.test(JSON.stringify(cfg)), false, 'no key material may appear on the config object');
  });
}
