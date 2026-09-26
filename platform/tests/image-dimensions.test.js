// Deterministic, zero-dependency real pixel-dimension reader. Verified against
// actual files already in this repo's hosting/ tree (real bytes, not fixtures).

'use strict';

const { test } = require('node:test');
const assert = require('node:assert');
const path = require('path');

const { readImageDimensions } = require('../common/image-dimensions');

test('reads real PNG dimensions from an existing repo hero asset', () => {
  const dims = readImageDimensions(path.join('hosting', 'rdd', 'hero-banners', 'rdd-2026-w38-spring-hero-v1.png'));
  assert.ok(dims && Number.isInteger(dims.width) && Number.isInteger(dims.height));
  assert.ok(dims.width > 0 && dims.height > 0);
});

test('reads real JPEG dimensions from an existing repo hero asset', () => {
  const dims = readImageDimensions(path.join('hosting', 'rdd', 'hero-banners', 'rdd-2026-hol-fathers-day-hero-v1.jpg'));
  assert.deepStrictEqual(dims, { width: 1200, height: 800 });
});

test('returns null (never guesses) for an unrecognized format', () => {
  const os = require('os');
  const fs = require('fs');
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'imgdim-'));
  const f = path.join(tmp, 'not-an-image.txt');
  fs.writeFileSync(f, 'plain text, not an image');
  assert.strictEqual(readImageDimensions(f), null);
});
