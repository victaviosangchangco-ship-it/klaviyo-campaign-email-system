// ImageKit hosting infrastructure tests — upload, watcher config, provider
// fallback, and SC brand integration. Offline (no real ImageKit API calls).

'use strict';

const { test } = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const path = require('path');
const os = require('os');

// ---------------------------------------------------------------------------
// 1. ImageKit upload script exists and is structurally sound
// ---------------------------------------------------------------------------

test('imagekit-upload.js exists and exports correctly when required as a module-check', () => {
  const scriptPath = path.resolve(__dirname, '../../Scripts/imagekit-upload.js');
  assert.ok(fs.existsSync(scriptPath), 'Scripts/imagekit-upload.js must exist');
  const content = fs.readFileSync(scriptPath, 'utf8');
  assert.match(content, /IMAGEKIT_ROOT/, 'must reference IMAGEKIT_ROOT');
  assert.match(content, /Image kit hosting/, 'must reference "Image kit hosting" folder');
  assert.match(content, /BRANDS.*=.*\[.*'RDD'.*'SS'.*'SC'/, 'must include all three brands');
  assert.match(content, /useUniqueFileName:\s*false/, 'must use deterministic filenames');
});

// ---------------------------------------------------------------------------
// 2. ImageKit watcher script exists and is structurally sound
// ---------------------------------------------------------------------------

test('imagekit-watcher.js exists and supports standalone + forked modes', () => {
  const scriptPath = path.resolve(__dirname, '../../Scripts/imagekit-watcher.js');
  assert.ok(fs.existsSync(scriptPath), 'Scripts/imagekit-watcher.js must exist');
  const content = fs.readFileSync(scriptPath, 'utf8');
  assert.match(content, /isForked/, 'must detect forked vs standalone mode');
  assert.match(content, /process\.send/, 'must support IPC when forked');
  assert.match(content, /fs\.watch/, 'must use fs.watch for file monitoring');
  assert.match(content, /fingerprint/, 'must use fingerprinting to avoid duplicate uploads');
});

// ---------------------------------------------------------------------------
// 3. SC brand folders exist in ImageKit source tree
// ---------------------------------------------------------------------------

test('"Image kit hosting/sc/" folder exists with expected structure', () => {
  const ikRoot = path.resolve(__dirname, '../../Image kit hosting');
  assert.ok(fs.existsSync(ikRoot), '"Image kit hosting/" folder must exist');
  const scDir = path.join(ikRoot, 'sc');
  assert.ok(fs.existsSync(scDir), '"Image kit hosting/sc/" folder must exist');
  assert.ok(fs.existsSync(path.join(scDir, 'hero-banners')), 'sc/hero-banners/ must exist');
  assert.ok(fs.existsSync(path.join(scDir, 'Featured Categories')), 'sc/Featured Categories/ must exist');
});

// ---------------------------------------------------------------------------
// 4. ImageKit credentials are referenced in .env.example (no real secrets)
// ---------------------------------------------------------------------------

test('.env.example includes ImageKit credential placeholders', () => {
  const envExample = path.resolve(__dirname, '../../.env.example');
  assert.ok(fs.existsSync(envExample), '.env.example must exist');
  const content = fs.readFileSync(envExample, 'utf8');
  assert.match(content, /IMAGEKIT_URL_ENDPOINT=/, 'must have IMAGEKIT_URL_ENDPOINT placeholder');
  assert.match(content, /IMAGEKIT_PUBLIC_KEY=/, 'must have IMAGEKIT_PUBLIC_KEY placeholder');
  assert.match(content, /IMAGEKIT_PRIVATE_KEY=/, 'must have IMAGEKIT_PRIVATE_KEY placeholder');
});

// ---------------------------------------------------------------------------
// 5. package.json has all ImageKit npm scripts
// ---------------------------------------------------------------------------

test('package.json includes all ImageKit npm scripts', () => {
  const pkg = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../../package.json'), 'utf8'));
  const scripts = pkg.scripts || {};
  assert.ok(scripts['imagekit:upload'], 'must have imagekit:upload script');
  assert.ok(scripts['imagekit:upload-all'], 'must have imagekit:upload-all script');
  assert.ok(scripts['imagekit:validate'], 'must have imagekit:validate script');
  assert.ok(scripts['imagekit:selftest'], 'must have imagekit:selftest script');
  assert.ok(scripts['imagekit:watch'], 'must have imagekit:watch script');
  assert.ok(pkg.dependencies && pkg.dependencies.imagekit, 'must have imagekit dependency');
});

// ---------------------------------------------------------------------------
// 6. Hero resolver supports both providers
// ---------------------------------------------------------------------------

test('hero-resolver exports ImageKit domain constants', () => {
  const { IMAGEKIT_ENDPOINT, IMAGEKIT_DOMAIN, ASSETS_DOMAIN } = require('../integrations/hosting/hero-resolver');
  assert.ok(IMAGEKIT_ENDPOINT, 'IMAGEKIT_ENDPOINT must be exported');
  assert.match(IMAGEKIT_ENDPOINT, /ik\.imagekit\.io/, 'must be an ImageKit URL');
  assert.ok(IMAGEKIT_DOMAIN.RDD, 'must have RDD ImageKit domain');
  assert.ok(IMAGEKIT_DOMAIN.SS, 'must have SS ImageKit domain');
  assert.ok(IMAGEKIT_DOMAIN.SC, 'must have SC ImageKit domain');
  assert.ok(ASSETS_DOMAIN.RDD, 'Vercel domains must still be exported (backward compat)');
  assert.ok(ASSETS_DOMAIN.SS, 'Vercel SS domain must still exist');
  assert.ok(ASSETS_DOMAIN.SC, 'Vercel SC domain must still exist');
});

// ---------------------------------------------------------------------------
// 7. Hero resolver prefers ImageKit folder over Vercel folder
// ---------------------------------------------------------------------------

test('findHeroBannerMatches prefers ImageKit source folder over Vercel hosting folder', () => {
  const { findHeroBannerMatches } = require('../integrations/hosting/hero-resolver');
  const repoRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'ik-hero-'));

  // Create a hero in the ImageKit source folder
  const ikDir = path.join(repoRoot, 'Image kit hosting', 'rdd', 'hero-banners');
  fs.mkdirSync(ikDir, { recursive: true });
  fs.writeFileSync(path.join(ikDir, 'rdd-2026-50-test-hero-v1.png'), fakePng(600, 300));

  // Also create a hero in the Vercel hosting folder
  const vDir = path.join(repoRoot, 'hosting', 'rdd', 'hero-banners');
  fs.mkdirSync(vDir, { recursive: true });
  fs.writeFileSync(path.join(vDir, 'rdd-2026-50-test-hero-v1.png'), fakePng(600, 300));

  const result = findHeroBannerMatches({ repoRoot, brand: 'RDD', campaignId: 'RDD-2026-50' });
  assert.strictEqual(result.provider, 'imagekit', 'ImageKit folder must take priority over Vercel');
  assert.strictEqual(result.matches.length, 1);
});

// ---------------------------------------------------------------------------
// 8. Hero resolver falls back to Vercel when ImageKit folder is empty
// ---------------------------------------------------------------------------

test('findHeroBannerMatches falls back to Vercel when ImageKit folder has no match', () => {
  const { findHeroBannerMatches } = require('../integrations/hosting/hero-resolver');
  const repoRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'ik-hero-fb-'));

  // Only Vercel hosting folder has the hero
  const vDir = path.join(repoRoot, 'hosting', 'rdd', 'hero-banners');
  fs.mkdirSync(vDir, { recursive: true });
  fs.writeFileSync(path.join(vDir, 'rdd-2026-51-fallback-hero-v1.png'), fakePng(600, 300));

  const result = findHeroBannerMatches({ repoRoot, brand: 'RDD', campaignId: 'RDD-2026-51' });
  assert.strictEqual(result.provider, 'vercel', 'must fall back to Vercel provider');
  assert.strictEqual(result.matches.length, 1);
});

// ---------------------------------------------------------------------------
// 9. Full resolution with ImageKit provider generates correct URL
// ---------------------------------------------------------------------------

test('resolveWeeklyHero generates ImageKit CDN URL when hero is in ImageKit folder', async () => {
  const { resolveWeeklyHero, IMAGEKIT_DOMAIN } = require('../integrations/hosting/hero-resolver');
  const repoRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'ik-resolve-'));

  const ikDir = path.join(repoRoot, 'Image kit hosting', 'sc', 'hero-banners');
  fs.mkdirSync(ikDir, { recursive: true });
  fs.writeFileSync(path.join(ikDir, 'sc-2026-10-edu-hero-v1.png'), fakePng(600, 338));

  const okVerify = async (url) => ({ url, status: 200, ok: true });
  const hero = await resolveWeeklyHero({ repoRoot, brand: 'SC', campaignId: 'SC-2026-10', verifyHosted: okVerify });

  assert.ok(hero);
  assert.strictEqual(hero.provider, 'imagekit');
  assert.strictEqual(hero.source, 'imagekit-folder');
  assert.ok(hero.url.startsWith(IMAGEKIT_DOMAIN.SC), `URL must start with ImageKit SC domain, got: ${hero.url}`);
  assert.match(hero.url, /hero-banners\/sc-2026-10-edu-hero-v1\.png$/);
});

// ---------------------------------------------------------------------------
// 10. Full resolution with Vercel provider still generates correct Vercel URL
// ---------------------------------------------------------------------------

test('resolveWeeklyHero generates Vercel URL when hero is only in Vercel folder (backward compat)', async () => {
  const { resolveWeeklyHero, ASSETS_DOMAIN } = require('../integrations/hosting/hero-resolver');
  const repoRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'ik-vercel-'));

  const vDir = path.join(repoRoot, 'hosting', 'rdd', 'hero-banners');
  fs.mkdirSync(vDir, { recursive: true });
  fs.writeFileSync(path.join(vDir, 'rdd-2026-52-legacy-hero-v1.png'), fakePng(600, 335));

  const okVerify = async (url) => ({ url, status: 200, ok: true });
  const hero = await resolveWeeklyHero({ repoRoot, brand: 'RDD', campaignId: 'RDD-2026-52', verifyHosted: okVerify });

  assert.ok(hero);
  assert.strictEqual(hero.provider, 'vercel');
  assert.strictEqual(hero.source, 'hosting-folder');
  assert.ok(hero.url.startsWith(ASSETS_DOMAIN.RDD), `URL must start with Vercel RDD domain, got: ${hero.url}`);
});

// ---------------------------------------------------------------------------
// 11. ImageKit upload does not proceed on non-image files (structural check)
// ---------------------------------------------------------------------------

test('imagekit-upload.js rejects non-image extensions in its isImage check', () => {
  const content = fs.readFileSync(path.resolve(__dirname, '../../Scripts/imagekit-upload.js'), 'utf8');
  assert.match(content, /\.jpg.*\.jpeg.*\.png.*\.gif.*\.webp.*\.svg/, 'must support standard image extensions');
  assert.match(content, /Not an image file/, 'must reject non-image files with a clear error');
});

// ---------------------------------------------------------------------------
// 12. Watcher fingerprinting prevents duplicate uploads
// ---------------------------------------------------------------------------

test('imagekit watcher seeds fingerprints for existing images on startup (no re-upload)', () => {
  const content = fs.readFileSync(path.resolve(__dirname, '../../Scripts/imagekit-watcher.js'), 'utf8');
  assert.match(content, /Seed fingerprints/, 'must seed fingerprints for existing images');
  assert.match(content, /will not re-upload/, 'must log that existing images are skipped');
});

// ---------------------------------------------------------------------------
// 13. CLAUDE.md documents ImageKit as primary
// ---------------------------------------------------------------------------

test('CLAUDE.md documents ImageKit as primary hosting provider', () => {
  const claudeMd = fs.readFileSync(path.resolve(__dirname, '../../CLAUDE.md'), 'utf8');
  assert.match(claudeMd, /ImageKit.*primary/i, 'CLAUDE.md must document ImageKit as primary');
  assert.match(claudeMd, /Vercel.*legacy.*fallback/i, 'CLAUDE.md must document Vercel as legacy/fallback');
  assert.match(claudeMd, /ik\.imagekit\.io/, 'CLAUDE.md must include ImageKit CDN URL pattern');
  assert.match(claudeMd, /imagekit:watch/, 'CLAUDE.md must document the watcher command');
});

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function fakePng(width, height) {
  const buf = Buffer.alloc(24);
  Buffer.from('89504e470d0a1a0a', 'hex').copy(buf, 0);
  buf.writeUInt32BE(13, 8);
  buf.write('IHDR', 12, 'ascii');
  buf.writeUInt32BE(width, 16);
  buf.writeUInt32BE(height, 20);
  return buf;
}
