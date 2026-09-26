// Weekly Hero Banner auto-resolution + publication/dimension verification
// (SYSTEM PATCH: Hero Publishing + Dimension Verification). Offline, isolated
// temp repoRoot — no real network (verifyHosted is mocked throughout; the
// production default wraps platform/qa/validators.js's checkLinksLive, which
// IS a real network call and is exercised only via its own existing tests).

'use strict';

const { test } = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const os = require('os');
const path = require('path');

const {
  resolveWeeklyHero,
  findHeroBannerMatches,
  validateHeroDimensions,
  ASSETS_DOMAIN,
  HERO_PUBLISH_FAILED,
  HERO_PUBLISH_REQUIRED,
  HERO_DIMENSION_INVALID,
} = require('../integrations/hosting/hero-resolver');
const { requireWeeklyHero, HERO_ASSET_REQUIRED } = require('../ai/theme-relevance');
const { buildCampaignThemePackage } = require('../workflow/campaign-theme-package');
const { ApprovalRequired } = require('../common/errors');

function tmpRepo() {
  return fs.mkdtempSync(path.join(os.tmpdir(), 'hero-resolver-'));
}
function heroDir(repoRoot, brand) {
  const dir = path.join(repoRoot, 'hosting', brand.toLowerCase(), 'hero-banners');
  fs.mkdirSync(dir, { recursive: true });
  return dir;
}

// Minimal buffer our OWN deterministic PNG reader accepts: the real 8-byte PNG
// signature, then width/height as big-endian uint32 at the exact byte offsets
// (16-19, 20-23) a real PNG's IHDR chunk carries them at. Sufficient to test
// real byte-level dimension reading without a real image-encoding dependency.
function fakePng(width, height) {
  const buf = Buffer.alloc(24);
  Buffer.from('89504e470d0a1a0a', 'hex').copy(buf, 0);
  buf.writeUInt32BE(13, 8); // IHDR length field (unchecked by our reader, kept realistic)
  buf.write('IHDR', 12, 'ascii');
  buf.writeUInt32BE(width, 16);
  buf.writeUInt32BE(height, 20);
  return buf;
}
function putHero(dir, name, width, height) {
  fs.writeFileSync(path.join(dir, name), fakePng(width, height));
}

const okVerify = async (url) => ({ url, status: 200, ok: true });
// A confirmed, real HTTP response saying "not deployed yet" (→ HERO_PUBLISH_REQUIRED).
const notYetDeployedVerify = async (url) => ({ url, status: 404, ok: false });
// The check itself failed to complete (network/timeout/DNS — → HERO_PUBLISH_FAILED).
const networkErrorVerify = async (url) => ({ url, status: 0, ok: false, error: 'timeout' });

const THEME_PKG = buildCampaignThemePackage({
  campaign_id: 'RDD-2026-39',
  topic_category: 'Acrylic Displays',
  campaign_name: 'Spring Refresh Sale – Acrylic Displays 15% Off',
  key_topic: '15% off selected acrylic display products.',
});

// ── 1-3: resolution + real dimensions ───────────────────────────────────────

test('1. exact local Hero resolves (with valid dimensions + verified hosting)', async () => {
  const repoRoot = tmpRepo();
  putHero(heroDir(repoRoot, 'RDD'), 'rdd-2026-39-acrylic-refresh-hero-v1.png', 600, 300);
  const hero = await resolveWeeklyHero({ repoRoot, brand: 'RDD', campaignId: 'RDD-2026-39', verifyHosted: okVerify });
  assert.ok(hero);
  assert.strictEqual(hero.campaignId, 'RDD-2026-39');
  assert.strictEqual(hero.brand, 'RDD');
  assert.strictEqual(hero.filename, 'rdd-2026-39-acrylic-refresh-hero-v1.png');
  assert.ok(hero.localPath.endsWith(path.join('hosting', 'rdd', 'hero-banners', 'rdd-2026-39-acrylic-refresh-hero-v1.png')));
});

test('2. real dimensions are extracted from the actual file bytes (never guessed)', async () => {
  const repoRoot = tmpRepo();
  putHero(heroDir(repoRoot, 'RDD'), 'rdd-2026-39-acrylic-refresh-hero-v1.png', 600, 328);
  const hero = await resolveWeeklyHero({ repoRoot, brand: 'RDD', campaignId: 'RDD-2026-39', verifyHosted: okVerify });
  assert.strictEqual(hero.width, 600);
  assert.strictEqual(hero.height, 328);
  assert.strictEqual(hero.aspectRatio, Number((600 / 328).toFixed(3)));
});

test('3. the resolver output carries the fields the renderer actually reads (url + real height, not the old null/335 default)', async () => {
  const repoRoot = tmpRepo();
  putHero(heroDir(repoRoot, 'RDD'), 'rdd-2026-39-acrylic-refresh-hero-v1.png', 600, 335);
  const hero = await resolveWeeklyHero({ repoRoot, brand: 'RDD', campaignId: 'RDD-2026-39', verifyHosted: okVerify });
  // renderer.js reads pkg.heroImage.url and pkg.heroImage.height directly.
  assert.strictEqual(hero.url, hero.hostedUrl);
  assert.strictEqual(hero.url, `${ASSETS_DOMAIN.RDD}/hero-banners/rdd-2026-39-acrylic-refresh-hero-v1.png`);
  assert.strictEqual(hero.height, 335);
  assert.notStrictEqual(hero.height, null, 'height must be the real verified value, never left null for the renderer to guess/default');
});

// ── 4-6: hosted-URL verification is REQUIRED, not assumed ───────────────────

test('4. a hosted URL is not considered valid merely because it CAN be constructed', async () => {
  const repoRoot = tmpRepo();
  putHero(heroDir(repoRoot, 'RDD'), 'rdd-2026-39-acrylic-refresh-hero-v1.png', 600, 300);
  // No verifyHosted override reaching "ok" — simulate the real world where the
  // file exists locally/in hosting/ but has never actually been deployed.
  await assert.rejects(
    () => resolveWeeklyHero({ repoRoot, brand: 'RDD', campaignId: 'RDD-2026-39', verifyHosted: notYetDeployedVerify }),
    (err) => err.code === HERO_PUBLISH_REQUIRED
  );
});

test('5. successful verification of the existing publication step allows continuation', async () => {
  const repoRoot = tmpRepo();
  putHero(heroDir(repoRoot, 'RDD'), 'rdd-2026-39-acrylic-refresh-hero-v1.png', 600, 300);
  const hero = await resolveWeeklyHero({ repoRoot, brand: 'RDD', campaignId: 'RDD-2026-39', verifyHosted: okVerify });
  assert.strictEqual(hero.verified, true);
  assert.strictEqual(hero.publicationStatus, 'verified-live');
  assert.doesNotThrow(() => requireWeeklyHero({ ...hero, campaignId: 'RDD-2026-39' }, THEME_PKG));
});

test('6. a confirmed not-yet-deployed hero BLOCKS with HERO_PUBLISH_REQUIRED and the exact manual git step (no Klaviyo write can occur)', async () => {
  const repoRoot = tmpRepo();
  putHero(heroDir(repoRoot, 'RDD'), 'rdd-2026-39-acrylic-refresh-hero-v1.png', 600, 300);
  await assert.rejects(
    () => resolveWeeklyHero({ repoRoot, brand: 'RDD', campaignId: 'RDD-2026-39', verifyHosted: notYetDeployedVerify }),
    (err) => {
      assert.strictEqual(err.code, HERO_PUBLISH_REQUIRED);
      assert.match(err.message, /404/);
      assert.match(err.message, /git add hosting\/rdd/);
      assert.match(err.message, /git push/);
      return true;
    }
  );
});

test('6b. an inconclusive (network/timeout) verification check BLOCKS with HERO_PUBLISH_FAILED, distinct from a confirmed 404', async () => {
  const repoRoot = tmpRepo();
  putHero(heroDir(repoRoot, 'RDD'), 'rdd-2026-39-acrylic-refresh-hero-v1.png', 600, 300);
  await assert.rejects(
    () => resolveWeeklyHero({ repoRoot, brand: 'RDD', campaignId: 'RDD-2026-39', verifyHosted: networkErrorVerify }),
    (err) => err.code === HERO_PUBLISH_FAILED
  );
});

// ── 7: dimension validity ───────────────────────────────────────────────────

test('7. invalid dimensions BLOCK with HERO_DIMENSION_INVALID, reporting actual vs. expected', async () => {
  const repoRoot = tmpRepo();
  putHero(heroDir(repoRoot, 'RDD'), 'rdd-2026-39-acrylic-refresh-hero-v1.png', 1200, 800); // raw/uncropped, not export-ready
  await assert.rejects(
    () => resolveWeeklyHero({ repoRoot, brand: 'RDD', campaignId: 'RDD-2026-39', verifyHosted: okVerify }),
    (err) => {
      assert.strictEqual(err.code, HERO_DIMENSION_INVALID);
      assert.match(err.message, /1200x800/);
      assert.match(err.message, /exactly 600px/);
      assert.strictEqual(err.details.width, 1200);
      assert.strictEqual(err.details.height, 800);
      return true;
    }
  );
});

test('7b. validateHeroDimensions: the pure rule accepts the real historical approved range and rejects outside it', () => {
  assert.strictEqual(validateHeroDimensions({ width: 600, height: 335 }).valid, true);
  assert.strictEqual(validateHeroDimensions({ width: 600, height: 400 }).valid, true);
  assert.strictEqual(validateHeroDimensions({ width: 528, height: 294 }).valid, false, 'non-600 width rejected');
  assert.strictEqual(validateHeroDimensions({ width: 600, height: 100 }).valid, false, 'too short rejected');
  assert.strictEqual(validateHeroDimensions({ width: 600, height: 900 }).valid, false, 'too tall rejected');
});

test('7c. an unsupported/corrupt image format cannot be verified and is treated as HERO_DIMENSION_INVALID (never guessed)', async () => {
  const repoRoot = tmpRepo();
  const dir = heroDir(repoRoot, 'RDD');
  fs.writeFileSync(path.join(dir, 'rdd-2026-39-acrylic-refresh-hero-v1.webp'), Buffer.from('RIFF....WEBPVP8 ')); // not parsed by our reader
  await assert.rejects(
    () => resolveWeeklyHero({ repoRoot, brand: 'RDD', campaignId: 'RDD-2026-39', verifyHosted: okVerify }),
    (err) => err.code === HERO_DIMENSION_INVALID
  );
});

// ── 8-9: the existing safety gates are unchanged ────────────────────────────

test('8. zero matches → still HERO_ASSET_REQUIRED (via requireWeeklyHero)', async () => {
  const repoRoot = tmpRepo();
  heroDir(repoRoot, 'RDD'); // empty
  const hero = await resolveWeeklyHero({ repoRoot, brand: 'RDD', campaignId: 'RDD-2026-39', verifyHosted: okVerify });
  assert.strictEqual(hero, null);
  assert.throws(() => requireWeeklyHero(hero, THEME_PKG), (err) => err.code === HERO_ASSET_REQUIRED);
});

test('9. multiple matches → still ApprovalRequired, never chosen arbitrarily', async () => {
  const repoRoot = tmpRepo();
  const dir = heroDir(repoRoot, 'RDD');
  putHero(dir, 'rdd-2026-39-acrylic-hero-v1.png', 600, 300);
  putHero(dir, 'rdd-2026-39-acrylic-hero-v2.png', 600, 300);
  await assert.rejects(
    () => resolveWeeklyHero({ repoRoot, brand: 'RDD', campaignId: 'RDD-2026-39', verifyHosted: okVerify }),
    (err) => {
      assert.ok(err instanceof ApprovalRequired);
      assert.deepStrictEqual(err.details.matches.sort(), ['rdd-2026-39-acrylic-hero-v1.png', 'rdd-2026-39-acrylic-hero-v2.png']);
      return true;
    }
  );
});

// ── carried over: identity / brand isolation (unaffected by this patch) ────

test('a W38-labeled filename does NOT equal campaign_id RDD-2026-38 (sequence id vs ISO week are separate namespaces)', () => {
  const repoRoot = tmpRepo();
  putHero(heroDir(repoRoot, 'RDD'), 'rdd-2026-w38-evergreen-display-solutions-hero-v2.png', 600, 300);
  const { matches } = findHeroBannerMatches({ repoRoot, brand: 'RDD', campaignId: 'RDD-2026-38' });
  assert.deepStrictEqual(matches, [], 'a "w38" filename must never satisfy campaign_id 38');
});

test('a wrong-brand hero (mis-filed, or requested under the wrong brand) is rejected', async () => {
  const repoRoot = tmpRepo();
  putHero(heroDir(repoRoot, 'RDD'), 'ss-2026-39-mobility-hero-v1.png', 600, 300);
  assert.strictEqual(await resolveWeeklyHero({ repoRoot, brand: 'RDD', campaignId: 'RDD-2026-39', verifyHosted: okVerify }), null);
  putHero(heroDir(repoRoot, 'SS'), 'rdd-2026-39-acrylic-hero-v1.png', 600, 300);
  assert.strictEqual(await resolveWeeklyHero({ repoRoot, brand: 'SS', campaignId: 'RDD-2026-39', verifyHosted: okVerify }), null);
});

test('campaign-heroes.json (priority 1) still wins over a hosting/ folder match, and is NOT re-verified (human-vetted)', async () => {
  const repoRoot = tmpRepo();
  fs.mkdirSync(path.join(repoRoot, 'config'), { recursive: true });
  fs.writeFileSync(
    path.join(repoRoot, 'config', 'campaign-heroes.json'),
    JSON.stringify({ campaigns: { 'RDD-2026-39': { url: 'https://assets-rdd.vercel.app/hero-banners/declared.png', alt: 'Declared', height: 300 } } })
  );
  putHero(heroDir(repoRoot, 'RDD'), 'rdd-2026-39-acrylic-refresh-hero-v1.png', 600, 300);
  const hero = await resolveWeeklyHero({ repoRoot, brand: 'RDD', campaignId: 'RDD-2026-39', verifyHosted: notYetDeployedVerify });
  assert.strictEqual(hero.source, 'campaign-heroes.json');
  assert.strictEqual(hero.url, 'https://assets-rdd.vercel.app/hero-banners/declared.png');
});

test('non-Weekly-shaped campaign_id (e.g. a Category/Holiday slug) is not guessed at — resolves to null, not a crash', async () => {
  const repoRoot = tmpRepo();
  heroDir(repoRoot, 'RDD');
  assert.strictEqual(await resolveWeeklyHero({ repoRoot, brand: 'RDD', campaignId: 'RDD-2026-CAT-sit-stand' }), null);
});
