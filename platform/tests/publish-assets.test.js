// Phase 1 asset-publishing isolation tests. Offline, temp dirs — never mutates the
// real hosting/ tree, never touches Klaviyo/Cloudinary/BigCommerce/network.

'use strict';

const { test } = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const os = require('os');
const path = require('path');

const {
  slugifyAssetName, brandOfSourcePath, publishAsset, validateHostingDir, isImage,
} = require('../../Scripts/publish-assets');

function fakeRepo() {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'pub-'));
  for (const b of ['rdd', 'ss', 'sc']) fs.mkdirSync(path.join(root, 'hosting', b), { recursive: true });
  for (const b of ['RDD', 'SS', 'SC']) fs.mkdirSync(path.join(root, 'Brands', b, 'Campaigns', 'Weekly', 'Assets'), { recursive: true });
  return root;
}
const img = (root, brand, name) => {
  const p = path.join(root, 'Brands', brand, 'Campaigns', 'Weekly', 'Assets', name);
  fs.writeFileSync(p, 'IMG');
  return p;
};

test('slugifyAssetName keeps clean versioned names, fixes messy ones', () => {
  assert.strictEqual(slugifyAssetName('SS-2026-W32-hero-banner.jpg'), 'SS-2026-W32-hero-banner.jpg');
  assert.strictEqual(slugifyAssetName('My Hero Banner.JPG'), 'my-hero-banner.jpg');
});

test('isImage allow-list', () => {
  assert.ok(isImage('a.jpg') && isImage('b.PNG') && isImage('c.webp'));
  assert.ok(!isImage('x.env') && !isImage('y.js') && !isImage('z.md'));
});

test('brandOfSourcePath detects the owning brand under Brands/<X>/', () => {
  assert.strictEqual(brandOfSourcePath('Brands/SS/Campaigns/Weekly/Assets/a.jpg'), 'SS');
  assert.strictEqual(brandOfSourcePath('C:/x/Brands/rdd/Assets/a.jpg'), 'RDD');
  assert.strictEqual(brandOfSourcePath('/tmp/loose/a.jpg'), null);
});

test('publishAsset copies an SS image into hosting/ss (name preserved)', () => {
  const root = fakeRepo();
  const r = publishAsset({ brand: 'SS', src: img(root, 'SS', 'SS-2026-W32-hero-banner.jpg'), subdir: 'weekly', repoRoot: root });
  assert.strictEqual(r.relPath, 'weekly/SS-2026-W32-hero-banner.jpg');
  assert.ok(fs.existsSync(path.join(root, 'hosting', 'ss', 'weekly', 'SS-2026-W32-hero-banner.jpg')));
});

test('publishAsset BLOCKS cross-brand (RDD source → SS host)', () => {
  const root = fakeRepo();
  assert.throws(() => publishAsset({ brand: 'SS', src: img(root, 'RDD', 'RDD-hero.jpg'), repoRoot: root }), /Cross-brand/);
});

test('publishAsset REJECTS a non-image source', () => {
  const root = fakeRepo();
  const envp = path.join(root, 'Brands', 'SS', '.env');
  fs.writeFileSync(envp, 'ACCESS TOKEN: x');
  assert.throws(() => publishAsset({ brand: 'SS', src: envp, repoRoot: root }), /non-image/);
});

test('publishAsset BLOCKS path traversal via subdir', () => {
  const root = fakeRepo();
  assert.throws(() => publishAsset({ brand: 'SS', src: img(root, 'SS', 'a.jpg'), subdir: '../rdd', repoRoot: root }), /Unsafe subdir|escapes/);
});

test('validateHostingDir passes for an images-only host (+ vercel.json/.gitkeep)', () => {
  const root = fakeRepo();
  publishAsset({ brand: 'SC', src: img(root, 'SC', 'sc-hero.jpg'), repoRoot: root });
  fs.writeFileSync(path.join(root, 'hosting', 'sc', 'vercel.json'), '{}');
  fs.writeFileSync(path.join(root, 'hosting', 'sc', '.gitkeep'), '');
  const v = validateHostingDir({ brand: 'SC', repoRoot: root });
  assert.strictEqual(v.ok, true, JSON.stringify(v.violations));
});

test('validateHostingDir CATCHES a planted .env / non-image', () => {
  const root = fakeRepo();
  fs.writeFileSync(path.join(root, 'hosting', 'ss', '.env'), 'ACCESS TOKEN: x');
  fs.writeFileSync(path.join(root, 'hosting', 'ss', 'notes.md'), '# secret business notes');
  const v = validateHostingDir({ brand: 'SS', repoRoot: root });
  assert.strictEqual(v.ok, false);
  assert.ok(v.violations.some((x) => /\.env/.test(x)));
  assert.ok(v.violations.some((x) => /notes\.md/.test(x)));
});

test('validateHostingDir CATCHES a cross-brand filename in a host', () => {
  const root = fakeRepo();
  fs.writeFileSync(path.join(root, 'hosting', 'ss', 'RDD-leak.png'), 'x'); // RDD-prefixed file in SS host
  const v = validateHostingDir({ brand: 'SS', repoRoot: root });
  assert.strictEqual(v.ok, false);
  assert.ok(v.violations.some((x) => /cross-brand/i.test(x)));
});
