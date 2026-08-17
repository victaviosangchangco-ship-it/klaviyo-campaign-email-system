// ---------------------------------------------------------------------------
// config.js — Klaviyo configuration loader (T2).
//
// Loads a brand's non-secret Klaviyo settings (from config/brands/<CODE>.config.json)
// and resolves whether the API key is present (from the brand .env / process.env),
// WITHOUT ever returning the key value and WITHOUT making any network call.
//
// Brand-parameterized by design → multi-brand ready: loadKlaviyoConfig('SS') will
// work the moment an SS config exists; today only RDD is configured.
//
// This module is pure infrastructure for T1-T3. It does not create campaigns,
// upload templates, or select audiences — those are T4+.
// ---------------------------------------------------------------------------

'use strict';

const path = require('path');
const { loadBrandConfig, REPO_ROOT } = require('../../common/config');
const { parseEnvFile, resolveVar } = require('../../common/env');
const { ConfigError } = require('../../common/errors');

// Safe defaults for non-secret, structural values (used only if a brand config
// omits them). Inert until the first API call in a later sprint.
const DEFAULTS = {
  apiBaseUrl: 'https://a.klaviyo.com/api',
  // Pin a stable revision; CONFIRM against Klaviyo's changelog before T4.
  revision: '2024-10-15',
  apiKeyEnvVar: 'KLAVIYO_API_KEY',
  requiredScopes: ['Campaigns:Full', 'Templates:Full', 'Lists:Read', 'Accounts:Read'],
};

// Read a confidence-tagged value ({value, confidence} | scalar | null) → scalar|null.
function val(node) {
  if (node == null) return null;
  if (typeof node === 'object' && 'value' in node) return node.value;
  return node;
}

// Load + validate a brand's Klaviyo config. Never throws for the "external
// prerequisite not yet supplied" case (sender/list/key) — those are reported
// via `pending` / `hasApiKey` so the caller decides when they become fatal
// (T6/T5). Throws ConfigError only for a structural problem (no brand config,
// no klaviyo block).
function loadKlaviyoConfig(brandCode, { repoRoot = REPO_ROOT } = {}) {
  const code = String(brandCode || '').toUpperCase();
  const brand = loadBrandConfig(code); // throws ConfigError if the brand is unknown
  const k = brand.klaviyo;
  if (!k || typeof k !== 'object') {
    throw new ConfigError(
      `Brand "${code}" has no "klaviyo" block in config/brands/${code}.config.json.`,
      { code }
    );
  }

  const apiKeyEnvVar = k.apiKeyEnvVar || DEFAULTS.apiKeyEnvVar;
  const envPath = k.envPath ? path.join(repoRoot, k.envPath) : null;
  const fileEnv = parseEnvFile(envPath);
  const apiKey = resolveVar(fileEnv, apiKeyEnvVar); // value stays local; not returned

  const sender = {
    fromEmail: val(k.sender && k.sender.fromEmail),
    fromLabel: val(k.sender && k.sender.fromLabel),
    replyToEmail: val(k.sender && k.sender.replyToEmail),
  };
  const audience = {
    type: (k.audience && k.audience.type) || 'list',
    name: val(k.audience && k.audience.name),
    id: val(k.audience && k.audience.id),
  };

  // What still needs supplying before a draft can be built (used later, T5/T6).
  const pending = [];
  if (!apiKey) pending.push(`env:${apiKeyEnvVar}`);
  if (!sender.fromEmail) pending.push('klaviyo.sender.fromEmail');
  if (!audience.id && !audience.name) pending.push('klaviyo.audience.id|name');

  return {
    brand: code,
    apiBaseUrl: k.apiBaseUrl || DEFAULTS.apiBaseUrl,
    revision: k.revision || DEFAULTS.revision,
    requiredScopes: k.requiredScopes || DEFAULTS.requiredScopes,
    apiKeyEnvVar,
    envPath: k.envPath || null,
    account: { idHint: val(k.account && k.account.idHint) },
    sender,
    audience,
    // presence ONLY — the key value is never exposed on the returned object
    hasApiKey: Boolean(apiKey),
    pending,
    // convenience flags for later phases; no side effects
    ready: { forDraft: pending.length === 0 },
  };
}

// Report readiness to build a draft (used by T5/T6, not this sprint). Pure.
function validateForDraft(cfg) {
  return { ok: cfg.pending.length === 0, missing: [...cfg.pending] };
}

module.exports = { loadKlaviyoConfig, validateForDraft, DEFAULTS };
