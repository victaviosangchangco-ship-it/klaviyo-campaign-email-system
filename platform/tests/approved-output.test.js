// Sprint 9 tests — approved-output reader. Offline; uses a temp dir.

'use strict';

const { test } = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const os = require('os');
const path = require('path');

const { readApprovedOutput, qaPassed } = require('../integrations/klaviyo/approved-output');
const { ConfigError, QaBlocker } = require('../common/errors');

function makePackage(dir, id, { html = '<html><body>ok</body></html>', qa } = {}) {
  fs.mkdirSync(dir, { recursive: true });
  if (html !== null) fs.writeFileSync(path.join(dir, `${id}.html`), html);
  if (qa !== null) fs.writeFileSync(path.join(dir, `${id}-package.json`), JSON.stringify({ campaignId: id, qa }));
}

test('qaPassed: explicit boolean and blocker-count shapes both work', () => {
  assert.strictEqual(qaPassed({ pass: true }), true);
  assert.strictEqual(qaPassed({ pass: 12, blocker: 0 }), true); // the current (collided) shape
  assert.strictEqual(qaPassed({ blockers: 0 }), true);
  assert.strictEqual(qaPassed({ pass: 5, blocker: 2 }), false);
  assert.strictEqual(qaPassed(null), false);
});

test('readApprovedOutput returns html + manifest when QA passed', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'ao-'));
  makePackage(dir, 'RDD-2026-W32', { qa: { pass: 12, blocker: 0, warn: 0 } });
  const r = readApprovedOutput({ outputDir: dir, campaignId: 'RDD-2026-W32' });
  assert.match(r.html, /<body>ok<\/body>/);
  assert.strictEqual(r.manifest.campaignId, 'RDD-2026-W32');
});

test('readApprovedOutput throws QaBlocker when QA has blockers', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'ao-'));
  makePackage(dir, 'X', { qa: { pass: 3, blocker: 2, warn: 0 } });
  assert.throws(() => readApprovedOutput({ outputDir: dir, campaignId: 'X' }), QaBlocker);
});

test('readApprovedOutput throws ConfigError when HTML missing', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'ao-'));
  makePackage(dir, 'X', { html: null, qa: { blocker: 0 } });
  assert.throws(() => readApprovedOutput({ outputDir: dir, campaignId: 'X' }), ConfigError);
});

test('readApprovedOutput throws ConfigError when manifest missing', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'ao-'));
  makePackage(dir, 'X', { qa: null });
  assert.throws(() => readApprovedOutput({ outputDir: dir, campaignId: 'X' }), ConfigError);
});

test('readApprovedOutput throws ConfigError on empty HTML', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'ao-'));
  makePackage(dir, 'X', { html: '   ', qa: { blocker: 0 } });
  assert.throws(() => readApprovedOutput({ outputDir: dir, campaignId: 'X' }), ConfigError);
});
