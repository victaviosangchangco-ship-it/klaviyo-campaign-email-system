// T3 tests — logger redaction and the no-send safety guard. Offline.

'use strict';

const { test } = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const os = require('os');
const path = require('path');

const { redact } = require('../common/logger');
const { FORBIDDEN, scanForSendCapability, assertNoSend, guardKlaviyoDir } = require('../integrations/klaviyo/safety');
const { PlatformError } = require('../common/errors');
const { REPO_ROOT } = require('../common/config');

// --- logger redaction ------------------------------------------------------

test('redact hides a Klaviyo private key (pk_...)', () => {
  const out = redact('using key pk_ABCDEF0123456789abcdef more text');
  assert.strictEqual(out.includes('pk_ABCDEF'), false);
  assert.match(out, /\[REDACTED\]/);
});

test('redact hides the Klaviyo-API-Key auth header value', () => {
  const out = redact('Authorization: Klaviyo-API-Key pk_secretvalue1234567890');
  assert.strictEqual(/pk_secretvalue/.test(out), false);
});

test('redact hides a KLAVIYO_API_KEY: value line', () => {
  const out = redact('KLAVIYO_API_KEY: pk_line_value_abcdefghijklmnop');
  assert.match(out, /KLAVIYO_API_KEY:\s*\[REDACTED\]/);
});

test('redact leaves ordinary text untouched', () => {
  assert.strictEqual(redact('hello world weekly campaign'), 'hello world weekly campaign');
});

// --- no-send safety guard --------------------------------------------------

test('FORBIDDEN patterns are defined and non-empty', () => {
  assert.ok(Array.isArray(FORBIDDEN) && FORBIDDEN.length >= 2);
});

test('scanForSendCapability DETECTS a planted send reference (temp dir)', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'klv-'));
  // Build the offending string from fragments so this test file itself stays clean.
  const bad = ['campaign', 'send', 'jobs'].join('-');
  fs.writeFileSync(path.join(dir, 'evil.js'), `fetch('/api/${bad}/', { method: 'POST' })`);
  const findings = scanForSendCapability(dir, { repoRoot: dir });
  assert.strictEqual(findings.length >= 1, true);
  assert.strictEqual(findings[0].token, bad);
});

test('assertNoSend THROWS on a directory that contains a send reference', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'klv-'));
  fs.writeFileSync(path.join(dir, 'evil.js'), `const t = '${['send', 'campaign'].join('_')}';`);
  assert.throws(() => assertNoSend(dir, { repoRoot: dir }), PlatformError);
});

test('assertNoSend IGNORES *.test.js files (they may plant strings deliberately)', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'klv-'));
  fs.writeFileSync(path.join(dir, 'x.test.js'), `const t = '${['campaign', 'send', 'jobs'].join('-')}';`);
  assert.strictEqual(assertNoSend(dir, { repoRoot: dir }), true);
});

test('the REAL Klaviyo integration directory has NO send capability', () => {
  // This is the actual production guard: our shipped code must be send-free.
  assert.strictEqual(guardKlaviyoDir(REPO_ROOT), true);
});

test('scanForSendCapability returns [] for a non-existent directory', () => {
  assert.deepStrictEqual(scanForSendCapability(path.join(os.tmpdir(), 'no-such-dir-xyz')), []);
});
