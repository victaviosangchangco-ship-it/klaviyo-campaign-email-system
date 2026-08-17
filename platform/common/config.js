// ---------------------------------------------------------------------------
// config.js — configuration loader (Architecture V2 §2.1 / §3 config/).
//
// Resolves the repository root, loads config/platform.config.json and a brand
// config (config/brands/<CODE>.config.json), and exposes helpers to resolve
// paths against the repo root. NO secrets are loaded here — brand .env files
// are read by the BigCommerce adapter via the proven integration.
// ---------------------------------------------------------------------------

'use strict';

const fs = require('fs');
const path = require('path');
const { ConfigError } = require('./errors');

// The repo root is two levels up from platform/common/.
const REPO_ROOT = path.resolve(__dirname, '..', '..');

function repoPath(...segments) {
  return path.join(REPO_ROOT, ...segments);
}

function readJson(absPath) {
  if (!fs.existsSync(absPath)) {
    throw new ConfigError(`Config file not found: ${absPath}`, { path: absPath });
  }
  try {
    return JSON.parse(fs.readFileSync(absPath, 'utf8'));
  } catch (err) {
    throw new ConfigError(`Config file is not valid JSON: ${absPath} (${err.message})`, {
      path: absPath,
    });
  }
}

function loadPlatformConfig() {
  return readJson(repoPath('config', 'platform.config.json'));
}

function loadBrandConfig(code) {
  const upper = String(code || '').toUpperCase();
  if (!upper) throw new ConfigError('Brand code is required.');
  const file = repoPath('config', 'brands', `${upper}.config.json`);
  if (!fs.existsSync(file)) {
    throw new ConfigError(
      `No brand config for "${upper}". Expected config/brands/${upper}.config.json. ` +
        `Only brands with a config are buildable (CLAUDE.md §2 — SC/Stack are placeholders).`,
      { code: upper }
    );
  }
  const cfg = readJson(file);
  // A brand config must at least declare its identity + design tokens to render.
  if (!cfg.designTokens || !cfg.identity) {
    throw new ConfigError(
      `Brand config for "${upper}" is incomplete (missing identity or designTokens).`,
      { code: upper }
    );
  }
  return cfg;
}

function loadContentCalendar() {
  return readJson(repoPath('config', 'content-calendar.json'));
}

// Optional per-campaign CONTENT OVERRIDE (an approved content direction that the
// calendar cannot express: a specific hero image, a grouped multi-category product
// selection, and authored copy). Returns the parsed override or null if none exists.
// This is NOT the calendar — the calendar stays the planning source and is untouched.
function loadCampaignOverride(campaignId) {
  const id = String(campaignId == null ? '' : campaignId).trim();
  if (!id) return null;
  const file = repoPath('config', 'campaign-overrides', `${id}.json`);
  if (!fs.existsSync(file)) return null;
  return readJson(file);
}

// Optional APPROVED-CREATIVE attachment for a campaign (config/approved-html.json).
// When present, the live orchestrator attaches this human-approved Output HTML to
// the Klaviyo draft verbatim instead of regenerating a creative. Returns a
// normalized { htmlPath (absolute), subject|null, previewText|null } or null when
// the campaign has no entry. This is a lookup only — it does not read the HTML.
function loadApprovedHtml(campaignId, { repoRoot = REPO_ROOT } = {}) {
  const id = String(campaignId == null ? '' : campaignId).trim();
  if (!id) return null;
  const file = path.join(repoRoot, 'config', 'approved-html.json');
  if (!fs.existsSync(file)) return null;
  const map = readJson(file);
  const entry = map && map.campaigns && map.campaigns[id];
  if (!entry) return null;
  // Accept either a bare path string or an object with html/subject/preview_text.
  const rel = typeof entry === 'string' ? entry : entry.html;
  if (!rel) return null;
  return {
    htmlPath: path.isAbsolute(rel) ? rel : path.join(repoRoot, rel),
    htmlRel: rel,
    subject: (typeof entry === 'object' && entry.subject) || null,
    previewText: (typeof entry === 'object' && entry.preview_text) || null,
  };
}

module.exports = {
  REPO_ROOT,
  repoPath,
  readJson,
  loadPlatformConfig,
  loadBrandConfig,
  loadContentCalendar,
  loadCampaignOverride,
  loadApprovedHtml,
};
