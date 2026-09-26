// ---------------------------------------------------------------------------
// support-banner-resolver.js — OPTIONAL Weekly support-banner resolution from
// hosting/<brand>/support-banners/. Mirrors hero-resolver.js's exact-campaign_id
// matching (never a week-labeled or historical file), and is optional ONLY in
// the sense that ABSENCE never blocks: no matching file → null, skip silently.
// Once a file DOES exist, it is held to the same hosted-liveness bar as the
// hero (same defaultVerifyHosted/checkLinksLive mechanism) — a present-but-not-
// yet-deployed file is a real defect (a broken image in the final email), not
// an "optional" one, so it blocks with SUPPORT_BANNER_PUBLISH_REQUIRED/FAILED
// exactly as the hero blocks with HERO_PUBLISH_REQUIRED/FAILED. Ambiguity
// (>1 match) still throws, same as the hero resolver.
// ---------------------------------------------------------------------------

'use strict';

const fs = require('fs');
const path = require('path');
const { ApprovalRequired } = require('../../common/errors');
const { readImageDimensions } = require('../../common/image-dimensions');
const { isImage } = require('../../../Scripts/publish-assets');
const { parseWeeklyCampaignId, ASSETS_DOMAIN, defaultVerifyHosted } = require('./hero-resolver');

const SUPPORT_BANNER_PUBLISH_FAILED = 'SUPPORT_BANNER_PUBLISH_FAILED';
const SUPPORT_BANNER_PUBLISH_REQUIRED = 'SUPPORT_BANNER_PUBLISH_REQUIRED';

// Scan hosting/<brand>/support-banners/ for filenames anchored on the EXACT
// campaign_id, same anchor rule as findHeroBannerMatches.
function findSupportBannerMatches({ repoRoot, brand, campaignId }) {
  const parsed = parseWeeklyCampaignId(campaignId);
  if (!parsed) return { anchor: null, matches: [] };
  if (parsed.brandLower !== String(brand).toLowerCase()) return { anchor: null, matches: [] };

  const dir = path.join(repoRoot, 'hosting', parsed.brandLower, 'support-banners');
  const anchor = `${parsed.brandLower}-${parsed.year}-${parsed.seq}-`;
  if (!fs.existsSync(dir)) return { anchor, matches: [] };

  const matches = fs
    .readdirSync(dir)
    .filter((name) => isImage(name) && name.toLowerCase().startsWith(anchor))
    .sort();
  return { anchor, matches };
}

// Resolves an OPTIONAL support banner. Returns null when NO file matches
// (never blocks campaign generation) or a { url, alt, height, link } object
// once the ONE matching file's hosted URL is confirmed live. Throws:
//   - ApprovalRequired on ambiguity (>1 match) — never chosen arbitrarily.
//   - SUPPORT_BANNER_PUBLISH_REQUIRED — file exists locally but a confirmed
//     non-2xx response proves it isn't deployed yet.
//   - SUPPORT_BANNER_PUBLISH_FAILED — file exists but the live check itself
//     was inconclusive (network/timeout/DNS failure).
// This mirrors resolveWeeklyHero's own PUBLISH_REQUIRED/PUBLISH_FAILED split
// exactly (same defaultVerifyHosted mechanism) — once a support banner file
// exists, embedding a broken image is a real defect, not an optional one.
async function resolveSupportBanner({ repoRoot, brand, campaignId, altFallback = null, logger = null, verifyHosted = defaultVerifyHosted } = {}) {
  const { anchor, matches } = findSupportBannerMatches({ repoRoot, brand, campaignId });
  if (!anchor || matches.length === 0) return null; // no file at all — optional, skip silently

  if (matches.length > 1) {
    throw new ApprovalRequired(
      `Multiple support banners match campaign_id ${campaignId} in hosting/${String(brand).toLowerCase()}/support-banners/ ` +
        `(${matches.join(', ')}). The engine will not choose arbitrarily — remove/rename all but the ONE approved file.`,
      { campaignId, brand, matches }
    );
  }

  const filename = matches[0];
  const brandLower = String(brand).toLowerCase();
  const relPath = `support-banners/${filename}`;
  const localPath = path.join(repoRoot, 'hosting', brandLower, relPath);
  const domain = ASSETS_DOMAIN[String(brand).toUpperCase()];
  if (!domain) return null; // no known hosting domain — skip silently, never invent a URL

  const dims = readImageDimensions(localPath);
  if (!dims) {
    logger && logger.warn && logger.warn(`Support banner ${filename} found but its real pixel dimensions could not be read — skipping it.`);
    return null; // optional asset: an unreadable file is skipped, not a blocker
  }

  const url = `${domain}/${relPath}`;

  // A file EXISTS from here on — liveness is no longer optional (same bar as the hero).
  const verification = await verifyHosted(url);
  if (!verification || !verification.ok) {
    const status = verification ? verification.status : null;
    const manualStep =
      `Manual step: from a branch, \`git add hosting/${brandLower}/${relPath} && git commit -m "hosting: publish ${filename}" && git push\`, ` +
      `open a PR, and merge to main — Vercel auto-deploys hosting/${brandLower}/ on merge (hosting/README.md). Re-run once ${url} returns HTTP 200.`;
    if (status) {
      const err = new Error(
        `${SUPPORT_BANNER_PUBLISH_REQUIRED}: support banner for ${campaignId} exists locally but is NOT yet live at ${url} ` +
          `(confirmed HTTP ${status}). ${manualStep}`
      );
      err.code = SUPPORT_BANNER_PUBLISH_REQUIRED;
      err.details = { campaignId, brand, url, status };
      throw err;
    }
    const err = new Error(
      `${SUPPORT_BANNER_PUBLISH_FAILED}: could not verify whether ${url} is live for ${campaignId} ` +
        `(${(verification && verification.error) || 'network/timeout error'}). The check itself did not complete — retry once connectivity is restored. ${manualStep}`
    );
    err.code = SUPPORT_BANNER_PUBLISH_FAILED;
    err.details = { campaignId, brand, url, status: 0, error: verification && verification.error };
    throw err;
  }

  return {
    url,
    alt: altFallback || null,
    height: dims.height,
    link: null,
  };
}

module.exports = {
  resolveSupportBanner,
  findSupportBannerMatches,
  SUPPORT_BANNER_PUBLISH_FAILED,
  SUPPORT_BANNER_PUBLISH_REQUIRED,
};
