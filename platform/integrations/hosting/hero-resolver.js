// ---------------------------------------------------------------------------
// hero-resolver.js — Weekly Hero Banner auto-resolution from the existing
// hosting/<brand>/hero-banners/ workflow (SYSTEM PATCH: Hero Publishing +
// Dimension Verification). Reuses Scripts/publish-assets.js's isImage() and
// platform/qa/validators.js's checkLinksLive() — never reimplements either.
//
// Resolution priority (never reordered):
//   1. an explicit, valid config/campaign-heroes.json entry (machine-managed
//      cache — platform/common/config.js's loadCampaignHero, unchanged;
//      a human already vetted this entry, so it is NOT re-verified here)
//   2. an EXACT campaign_id filename match in hosting/<brand>/hero-banners/,
//      which is now additionally: (a) dimension-verified against the Hero
//      contract, and (b) confirmed LIVE at its hosted URL before use
//   3. otherwise: return null (the caller — requireWeeklyHero — then BLOCKS
//      with HERO_ASSET_REQUIRED; this module never invents/guesses an image)
//
// REAL PUBLICATION MECHANISM ON RECORD: Scripts/publish-assets.js's
// publishAsset() only copies an approved image into hosting/<brand>/ locally —
// it does NOT deploy to Vercel (no git push/PR/merge; see its own header
// comment and hosting/README.md). There is no other deploy automation in this
// repo. So "publication" for an asset already sitting in hosting/<brand>/
// hero-banners/ (where this resolver looks) means: the local copy step is
// already done by construction; what is NOT yet known is whether that file
// has actually been pushed/merged/deployed. This module verifies THAT — a
// live HTTP check of the constructed hosted URL — rather than assuming it.
//
// Campaign_id identity, not ISO week: "RDD-2026-39" only matches filenames
// anchored on "rdd-2026-39-" — never "rdd-2026-w38-"/"rdd-2026-w39-" (a "w"
// between the year and the number always fails the anchor). Sequence id and
// ISO week remain separate namespaces (CLAUDE.md).
// ---------------------------------------------------------------------------

'use strict';

const fs = require('fs');
const path = require('path');
const { loadCampaignHero } = require('../../common/config');
const { ApprovalRequired } = require('../../common/errors');
const { readImageDimensions } = require('../../common/image-dimensions');
const { checkLinksLive } = require('../../qa/validators');
const { isImage, BRANDS } = require('../../../Scripts/publish-assets');

const HERO_PUBLISH_FAILED = 'HERO_PUBLISH_FAILED';
const HERO_PUBLISH_REQUIRED = 'HERO_PUBLISH_REQUIRED';
const HERO_DIMENSION_INVALID = 'HERO_DIMENSION_INVALID';

// Verified from real approved-output HTML in this repo (grep for
// "https://assets-<brand>...vercel.app" in Brands/<CODE>/Campaigns/*/Output/),
// not invented. If a brand's domain changes, update here (single source).
const ASSETS_DOMAIN = {
  RDD: 'https://assets-rdd.vercel.app',
  SS: 'https://assets-ss-wheat.vercel.app',
  SC: 'https://assets-sc.vercel.app',
};

// ImageKit CDN — primary hosting provider for NEW campaign assets (CLAUDE.md §12).
// Existing Vercel URLs remain valid; this is additive, not a replacement.
const IMAGEKIT_ENDPOINT = 'https://ik.imagekit.io/5jjsemhse';
const IMAGEKIT_DOMAIN = {
  RDD: `${IMAGEKIT_ENDPOINT}/rdd`,
  SS: `${IMAGEKIT_ENDPOINT}/ss`,
  SC: `${IMAGEKIT_ENDPOINT}/sc`,
};

// Dimension requirement, derived from Standards/hero-contract.md (the fixed
// 600px email container — Components/hero-image.html hardcodes width="600",
// it is not a token) plus the height range actually shipped across this
// repo's approved hero artwork (600 x {300,328,333,335,338,400}px). Not an
// invented number. Adjust here if the approved range changes.
const REQUIRED_WIDTH = 600;
const MIN_HEIGHT = 250;
const MAX_HEIGHT = 450;

function validateHeroDimensions({ width, height } = {}) {
  const problems = [];
  if (width !== REQUIRED_WIDTH) problems.push(`width ${width}px (required: exactly ${REQUIRED_WIDTH}px — the fixed email container width, Components/hero-image.html)`);
  if (typeof height !== 'number' || height < MIN_HEIGHT || height > MAX_HEIGHT) problems.push(`height ${height}px (required: ${MIN_HEIGHT}-${MAX_HEIGHT}px)`);
  const aspectRatio = typeof width === 'number' && typeof height === 'number' && height > 0 ? Number((width / height).toFixed(3)) : null;
  return { valid: problems.length === 0, aspectRatio, problems };
}

// Default hosted-availability check — reuses the SAME live link checker the
// pipeline already uses for --verify-links (platform/qa/validators.js). Tests
// inject a mock `verifyHosted` instead of calling this (no real network in CI).
async function defaultVerifyHosted(url) {
  const { results } = await checkLinksLive([url], { timeoutMs: 8000, concurrency: 1 });
  return results[0] || { url, status: 0, ok: false };
}

// Parse "RDD-2026-39" → { brandLower: 'rdd', year: '2026', seq: '39' }, or null
// if the id isn't the standard Weekly <CODE>-<YYYY>-<NN> shape (e.g. a Category/
// Holiday slug) — those are out of scope for this resolver; it never guesses.
function parseWeeklyCampaignId(campaignId) {
  const m = String(campaignId || '').match(/^([A-Za-z]+)-(\d{4})-(\d+)$/);
  if (!m) return null;
  return { brandLower: m[1].toLowerCase(), year: m[2], seq: m[3] };
}

// Scan hosting/<brand>/hero-banners/ for filenames anchored on the EXACT
// campaign_id (brand-year-seq-), never a week-labeled or historical file.
// Returns the list of matching filenames (0, 1, or many — caller decides).
function findHeroBannerMatches({ repoRoot, brand, campaignId }) {
  const parsed = parseWeeklyCampaignId(campaignId);
  if (!parsed) return { anchor: null, matches: [], provider: null };
  if (parsed.brandLower !== String(brand).toLowerCase()) return { anchor: null, matches: [], provider: null };

  const anchor = `${parsed.brandLower}-${parsed.year}-${parsed.seq}-`;

  // Priority: ImageKit source folder first (primary provider), then Vercel hosting folder (legacy)
  const imagekitDir = path.join(repoRoot, 'Image kit hosting', parsed.brandLower, 'hero-banners');
  if (fs.existsSync(imagekitDir)) {
    const ikMatches = fs
      .readdirSync(imagekitDir)
      .filter((name) => isImage(name) && name.toLowerCase().startsWith(anchor))
      .sort();
    if (ikMatches.length > 0) return { anchor, matches: ikMatches, provider: 'imagekit' };
  }

  const dir = path.join(repoRoot, 'hosting', parsed.brandLower, 'hero-banners');
  if (!fs.existsSync(dir)) return { anchor, matches: [], provider: null };

  const matches = fs
    .readdirSync(dir)
    .filter((name) => isImage(name) && name.toLowerCase().startsWith(anchor))
    .sort();
  return { anchor, matches, provider: matches.length > 0 ? 'vercel' : null };
}

// THE resolver. Returns a fully-verified hero object (campaignId, brand,
// localPath, filename, url/hostedUrl, width, height, aspectRatio, verified) or
// null (no hero anywhere — caller blocks with HERO_ASSET_REQUIRED). Throws
// ApprovalRequired on ambiguity (>1 match), or an Error coded
// HERO_DIMENSION_INVALID / HERO_PUBLISH_FAILED when the ONE match fails
// verification — never silently accepted, never resized/regenerated.
async function resolveWeeklyHero({ repoRoot, brand, campaignId, altFallback = null, logger = null, verifyHosted = defaultVerifyHosted } = {}) {
  // Priority 1: explicit, already-declared cache entry (human-vetted; unchanged).
  const declared = loadCampaignHero(campaignId, { repoRoot });
  if (declared) return { ...declared, alt: declared.alt || altFallback, source: 'campaign-heroes.json' };

  // Priority 2: exact campaign_id match in hero-banners/ (ImageKit first, then Vercel).
  const { anchor, matches, provider } = findHeroBannerMatches({ repoRoot, brand, campaignId });
  if (!anchor || matches.length === 0) return null; // → HERO_ASSET_REQUIRED at the caller

  const brandLower = String(brand).toLowerCase();
  const brandUpper = String(brand).toUpperCase();

  if (matches.length > 1) {
    const providerFolder = provider === 'imagekit'
      ? `Image kit hosting/${brandLower}/hero-banners/`
      : `hosting/${brandLower}/hero-banners/`;
    throw new ApprovalRequired(
      `Multiple hero banners match campaign_id ${campaignId} in ${providerFolder} ` +
        `(${matches.join(', ')}). The engine will not choose arbitrarily — remove/rename all but the ONE approved file, ` +
        `or register the correct one explicitly in config/campaign-heroes.json.`,
      { campaignId, brand, matches, provider }
    );
  }

  const filename = matches[0];
  const relPath = `hero-banners/${filename}`;
  const localPath = provider === 'imagekit'
    ? path.join(repoRoot, 'Image kit hosting', brandLower, relPath)
    : path.join(repoRoot, 'hosting', brandLower, relPath);

  let hostedUrl;
  if (provider === 'imagekit') {
    const ikDomain = IMAGEKIT_DOMAIN[brandUpper];
    if (!ikDomain) {
      throw new ApprovalRequired(`No known ImageKit domain for brand ${brand}.`, { brand });
    }
    hostedUrl = `${ikDomain}/${relPath}`;
  } else {
    const domain = ASSETS_DOMAIN[brandUpper];
    if (!domain) {
      throw new ApprovalRequired(`No known public hosting domain for brand ${brand} — cannot resolve a hosted URL without inventing one.`, { brand });
    }
    hostedUrl = `${domain}/${relPath}`;
  }

  // --- 1) real pixel dimensions, read from the actual local file ------------
  const dims = readImageDimensions(localPath);
  if (!dims) {
    const err = new Error(
      `${HERO_DIMENSION_INVALID}: could not determine real pixel dimensions for ${filename} (unsupported or corrupt image ` +
        `format — never guessed). Expected a PNG/JPEG/GIF at exactly ${REQUIRED_WIDTH}px wide, ${MIN_HEIGHT}-${MAX_HEIGHT}px ` +
        `tall (Standards/hero-contract.md; Components/hero-image.html).`
    );
    err.code = HERO_DIMENSION_INVALID;
    err.details = { campaignId, brand, filename, localPath };
    throw err;
  }
  const { valid, aspectRatio, problems } = validateHeroDimensions(dims);
  if (!valid) {
    const err = new Error(
      `${HERO_DIMENSION_INVALID}: ${filename} is ${dims.width}x${dims.height}px — ${problems.join('; ')}. ` +
        `The engine will not resize or regenerate artwork automatically — source correct artwork for ${campaignId}.`
    );
    err.code = HERO_DIMENSION_INVALID;
    err.details = { campaignId, brand, filename, width: dims.width, height: dims.height, aspectRatio, problems };
    throw err;
  }

  // --- 2) hosted availability, verified live (never assumed) ----------------
  // For ImageKit: the file must have been uploaded via the ImageKit API — its
  // CDN URL is only valid after a successful upload. For Vercel: the file must
  // have been committed/merged to main and deployed. Both are verified by an
  // HTTP check of the constructed URL.
  const verification = await verifyHosted(hostedUrl);
  if (!verification || !verification.ok) {
    const status = verification ? verification.status : null;
    const manualStep = provider === 'imagekit'
      ? `Manual step: run \`npm run imagekit:upload -- --brand ${brandUpper} --src "Image kit hosting/${brandLower}/${relPath}"\` ` +
        `to upload the file to ImageKit CDN. Re-run once ${hostedUrl} returns HTTP 200.`
      : `Manual step: from a branch, \`git add hosting/${brandLower}/${relPath} && git commit -m "hosting: publish ${filename}" && git push\`, ` +
        `open a PR, and merge to main — Vercel auto-deploys hosting/${brandLower}/ on merge (hosting/README.md). Re-run once ${hostedUrl} returns HTTP 200.`;
    if (status) {
      const err = new Error(
        `${HERO_PUBLISH_REQUIRED}: hero asset for ${campaignId} exists locally but is NOT yet live at ${hostedUrl} ` +
          `(confirmed HTTP ${status}, provider: ${provider}). ${manualStep} No Klaviyo write may occur until this passes.`
      );
      err.code = HERO_PUBLISH_REQUIRED;
      err.details = { campaignId, brand, hostedUrl, status, provider };
      throw err;
    }
    const err = new Error(
      `${HERO_PUBLISH_FAILED}: could not verify whether ${hostedUrl} is live for ${campaignId} (${(verification && verification.error) || 'network/timeout error'}). ` +
        `The check itself did not complete — retry once connectivity is restored. ${manualStep}`
    );
    err.code = HERO_PUBLISH_FAILED;
    err.details = { campaignId, brand, hostedUrl, status: 0, error: verification && verification.error, provider };
    throw err;
  }

  const providerLabel = provider === 'imagekit' ? 'Image kit hosting' : 'hosting';
  logger && logger.info && logger.info(`Hero resolved + verified: ${providerLabel}/${brandLower}/${relPath} (${dims.width}x${dims.height}px, live at ${hostedUrl}).`);
  return {
    campaignId,
    brand: brandUpper,
    localPath,
    filename,
    url: hostedUrl,
    hostedUrl,
    width: dims.width,
    height: dims.height,
    aspectRatio,
    verified: true,
    publicationStatus: 'verified-live',
    alt: altFallback || null,
    link: null,
    source: provider === 'imagekit' ? 'imagekit-folder' : 'hosting-folder',
    provider: provider,
  };
}

module.exports = {
  resolveWeeklyHero,
  findHeroBannerMatches,
  parseWeeklyCampaignId,
  validateHeroDimensions,
  defaultVerifyHosted,
  ASSETS_DOMAIN,
  IMAGEKIT_ENDPOINT,
  IMAGEKIT_DOMAIN,
  BRANDS,
  HERO_PUBLISH_FAILED,
  HERO_PUBLISH_REQUIRED,
  HERO_DIMENSION_INVALID,
  REQUIRED_WIDTH,
  MIN_HEIGHT,
  MAX_HEIGHT,
};
