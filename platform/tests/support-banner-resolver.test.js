// Optional Weekly support-banner resolution + liveness verification (SYSTEM
// PATCH: Support Banner Liveness). Offline, isolated temp repoRoot — no real
// network (verifyHosted is mocked throughout, same pattern as hero-resolver.test.js).

'use strict';

const { test } = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const os = require('os');
const path = require('path');

const {
  resolveSupportBanner,
  findSupportBannerMatches,
  SUPPORT_BANNER_PUBLISH_FAILED,
  SUPPORT_BANNER_PUBLISH_REQUIRED,
} = require('../integrations/hosting/support-banner-resolver');
const { ApprovalRequired } = require('../common/errors');

function tmpRepo() {
  return fs.mkdtempSync(path.join(os.tmpdir(), 'support-banner-resolver-'));
}
function bannerDir(repoRoot, brand) {
  const dir = path.join(repoRoot, 'hosting', brand.toLowerCase(), 'support-banners');
  fs.mkdirSync(dir, { recursive: true });
  return dir;
}
function fakePng(width, height) {
  const buf = Buffer.alloc(24);
  Buffer.from('89504e470d0a1a0a', 'hex').copy(buf, 0);
  buf.writeUInt32BE(13, 8);
  buf.write('IHDR', 12, 'ascii');
  buf.writeUInt32BE(width, 16);
  buf.writeUInt32BE(height, 20);
  return buf;
}
function putBanner(dir, name, width, height) {
  fs.writeFileSync(path.join(dir, name), fakePng(width, height));
}

const okVerify = async (url) => ({ url, status: 200, ok: true });
const notYetDeployedVerify = async (url) => ({ url, status: 404, ok: false });
const networkErrorVerify = async (url) => ({ url, status: 0, ok: false, error: 'timeout' });

test('1. no matching file → null, no blocker (absence stays optional)', async () => {
  const repoRoot = tmpRepo();
  bannerDir(repoRoot, 'SS');
  const result = await resolveSupportBanner({ repoRoot, brand: 'SS', campaignId: 'SS-2026-35', verifyHosted: okVerify });
  assert.strictEqual(result, null);
});

test('2. no support-banners/ directory at all → null, no blocker', async () => {
  const repoRoot = tmpRepo();
  const result = await resolveSupportBanner({ repoRoot, brand: 'SS', campaignId: 'SS-2026-35', verifyHosted: okVerify });
  assert.strictEqual(result, null);
});

test('3. file exists + verified live → resolves with the real hosted HTTPS URL and real height', async () => {
  const repoRoot = tmpRepo();
  putBanner(bannerDir(repoRoot, 'SS'), 'ss-2026-35-support-banner.png', 600, 300);
  const banner = await resolveSupportBanner({ repoRoot, brand: 'SS', campaignId: 'SS-2026-35', verifyHosted: okVerify });
  assert.ok(banner);
  assert.strictEqual(banner.url, 'https://assets-ss-wheat.vercel.app/support-banners/ss-2026-35-support-banner.png');
  assert.strictEqual(banner.height, 300);
});

test('4. file exists but confirmed HTTP 404 → BLOCKS with SUPPORT_BANNER_PUBLISH_REQUIRED (not silently skipped)', async () => {
  const repoRoot = tmpRepo();
  putBanner(bannerDir(repoRoot, 'SS'), 'ss-2026-35-support-banner.png', 600, 300);
  await assert.rejects(
    () => resolveSupportBanner({ repoRoot, brand: 'SS', campaignId: 'SS-2026-35', verifyHosted: notYetDeployedVerify }),
    (err) => {
      assert.strictEqual(err.code, SUPPORT_BANNER_PUBLISH_REQUIRED);
      assert.match(err.message, /SUPPORT_BANNER_PUBLISH_REQUIRED/);
      assert.match(err.message, /HTTP 404/);
      return true;
    }
  );
});

test('5. file exists but the live check is inconclusive (network/timeout) → BLOCKS with SUPPORT_BANNER_PUBLISH_FAILED, distinct from a confirmed 404', async () => {
  const repoRoot = tmpRepo();
  putBanner(bannerDir(repoRoot, 'SS'), 'ss-2026-35-support-banner.png', 600, 300);
  await assert.rejects(
    () => resolveSupportBanner({ repoRoot, brand: 'SS', campaignId: 'SS-2026-35', verifyHosted: networkErrorVerify }),
    (err) => {
      assert.strictEqual(err.code, SUPPORT_BANNER_PUBLISH_FAILED);
      assert.match(err.message, /SUPPORT_BANNER_PUBLISH_FAILED/);
      return true;
    }
  );
});

test('6. multiple matches → still ApprovalRequired, never chosen arbitrarily (liveness is never even checked)', async () => {
  const repoRoot = tmpRepo();
  const dir = bannerDir(repoRoot, 'SS');
  putBanner(dir, 'ss-2026-35-support-banner-v1.png', 600, 300);
  putBanner(dir, 'ss-2026-35-support-banner-v2.png', 600, 300);
  await assert.rejects(
    () => resolveSupportBanner({ repoRoot, brand: 'SS', campaignId: 'SS-2026-35', verifyHosted: okVerify }),
    ApprovalRequired
  );
});

test('7. findSupportBannerMatches: exact campaign_id anchor, same rule as the hero resolver', () => {
  const repoRoot = tmpRepo();
  const dir = bannerDir(repoRoot, 'SS');
  putBanner(dir, 'ss-2026-35-support-banner.png', 600, 300);
  putBanner(dir, 'ss-2026-350-unrelated.png', 600, 300); // must NOT match SS-2026-35 (prefix collision)
  const { matches } = findSupportBannerMatches({ repoRoot, brand: 'SS', campaignId: 'SS-2026-35' });
  assert.deepStrictEqual(matches, ['ss-2026-35-support-banner.png']);
});
