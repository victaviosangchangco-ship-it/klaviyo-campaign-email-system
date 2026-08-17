// ---------------------------------------------------------------------------
// config.js — Lark (AI Email Automation System app) configuration loader.
//
// Loads the NON-SECRET connection settings from config/lark-calendar.json and
// reports whether the App Secret is present, WITHOUT returning it. This mirrors
// the Klaviyo config loader (integrations/klaviyo/config.js §hasApiKey): callers
// that only need to know "is this configured?" never touch the secret.
//
// The secret is resolved by a separate, explicit function (resolveAppSecret) so
// every read of it is greppable and intentional. It is injected into LarkAuth
// and held in memory only — never logged, never serialized, never written.
//
// MULTI-BRAND: `calendars` is a brand-keyed map (SS, RDD, …). One Lark app
// serves every brand — unlike Klaviyo, where the per-brand API key is the
// isolation mechanism (CLAUDE.md §12) — so the calendar targets live centrally
// and are auditable side by side. Adding a brand is one config entry, no code.
//
// BACKWARD COMPATIBLE: the superseded single-`calendar` shape is still accepted
// for one transition period and surfaces under the brand key "DEFAULT".
//
// Reuses platform/common/env.js (the platform's single env loader). No second
// env-loading system is introduced.
// ---------------------------------------------------------------------------

'use strict';

const fs = require('fs');
const path = require('path');
const { REPO_ROOT } = require('../../common/config');
const { parseEnvFile, resolveVar } = require('../../common/env');
const { ConfigError } = require('../../common/errors');

const CONFIG_PATH = path.join(REPO_ROOT, 'config', 'lark-calendar.json');

// Brand key used when a legacy single-`calendar` block carries no explicit brand.
const LEGACY_BRAND_KEY = 'DEFAULT';

const DEFAULTS = {
  baseUrl: 'https://open.larksuite.com/open-apis',
  envPath: '.env',
  appIdEnvVar: 'LARK_APP_ID',
  appSecretEnvVar: 'LARK_APP_SECRET',
  pageSize: 500,
  dateTimezoneOffsetMinutes: 0,
  cacheTtlMs: 45000, // 45s — inside the 30–60s target
};

function readConfigFile(configPath) {
  if (!fs.existsSync(configPath)) {
    throw new ConfigError(`Lark config not found: ${configPath}`, { path: configPath });
  }
  try {
    return JSON.parse(fs.readFileSync(configPath, 'utf8'));
  } catch (err) {
    throw new ConfigError(`Lark config is not valid JSON: ${configPath} (${err.message})`);
  }
}

// Normalize one calendar entry, layering: entry > overrides > defaults block > DEFAULTS.
function buildCalendar(brand, entry, defaults, overrides) {
  const appToken = overrides.appToken || entry.appToken || null;
  const tableId = overrides.tableId || entry.tableId || null;

  if (!appToken || !tableId) {
    throw new ConfigError(
      `Lark calendar "${brand}" is incomplete: appToken and tableId are required.`,
      { brand, hasAppToken: Boolean(appToken), hasTableId: Boolean(tableId) }
    );
  }

  const pick = (key, fallback) => {
    if (overrides[key] != null) return overrides[key];
    if (entry[key] != null) return entry[key];
    if (defaults[key] != null) return defaults[key];
    return fallback;
  };

  return {
    brand,
    label: entry.label || `${brand} Campaign Calendar`,
    appToken,
    tableId,
    viewId: overrides.viewId || entry.viewId || null,
    pageSize: Number(pick('pageSize', DEFAULTS.pageSize)),
    dateTimezoneOffsetMinutes: Number(pick('dateTimezoneOffsetMinutes', DEFAULTS.dateTimezoneOffsetMinutes)),
    cacheTtlMs: Number(pick('cacheTtlMs', DEFAULTS.cacheTtlMs)),
  };
}

// Load non-secret Lark settings. Returns hasAppSecret (boolean) — never the value.
// Throws ConfigError only for structural problems (missing file, no calendars,
// an incomplete calendar entry). A missing App ID / Secret is reported via the
// flags so the caller decides when that becomes fatal.
//
// `overrides` applies to EVERY resolved calendar and exists for tests and one-off
// callers; normal use supplies nothing.
function loadLarkConfig({ repoRoot = REPO_ROOT, configPath = CONFIG_PATH, overrides = {} } = {}) {
  const raw = readConfigFile(configPath);

  const appIdEnvVar = raw.appIdEnvVar || DEFAULTS.appIdEnvVar;
  const appSecretEnvVar = raw.appSecretEnvVar || DEFAULTS.appSecretEnvVar;
  const envRelPath = raw.envPath || DEFAULTS.envPath;
  const envPath = path.join(repoRoot, envRelPath);
  const fileEnv = parseEnvFile(envPath);

  const appId = resolveVar(fileEnv, appIdEnvVar);
  const appSecret = resolveVar(fileEnv, appSecretEnvVar); // presence check only
  const defaults = raw.defaults || {};

  // Preferred shape: a brand-keyed `calendars` map. Legacy shape: a single
  // `calendar` object, surfaced under its own brand or DEFAULT.
  let entries;
  let legacy = false;
  if (raw.calendars && typeof raw.calendars === 'object' && Object.keys(raw.calendars).length) {
    entries = raw.calendars;
  } else if (raw.calendar && typeof raw.calendar === 'object') {
    legacy = true;
    const brand = String(raw.calendar.brand || LEGACY_BRAND_KEY).toUpperCase();
    entries = { [brand]: raw.calendar };
  } else {
    throw new ConfigError(
      `Lark config has no calendars. Add a "calendars" map (brand code → { appToken, tableId, viewId }) to ${configPath}.`,
      { configPath }
    );
  }

  const calendars = {};
  for (const [key, entry] of Object.entries(entries)) {
    const brand = String(key).toUpperCase();
    calendars[brand] = buildCalendar(brand, entry || {}, defaults, overrides);
  }

  return {
    baseUrl: String(overrides.baseUrl || raw.baseUrl || DEFAULTS.baseUrl).replace(/\/$/, ''),
    appId,
    appIdEnvVar,
    appSecretEnvVar,
    envPath,
    hasAppId: Boolean(appId),
    hasAppSecret: Boolean(appSecret), // presence only — the value is NOT returned
    calendars,
    brands: Object.keys(calendars),
    legacy,
  };
}

// Resolve one brand's calendar, with a clear error listing what IS configured.
function getCalendarForBrand(config, brand) {
  const key = String(brand || '').toUpperCase();
  const cal = config.calendars[key];
  if (!cal) {
    throw new ConfigError(
      `No Lark calendar configured for brand "${brand}". Configured: ${config.brands.join(', ') || '(none)'}.`,
      { brand: key, configured: config.brands }
    );
  }
  return cal;
}

// Resolve the App Secret for injection into LarkAuth. Deliberately separate from
// loadLarkConfig so every access is explicit and auditable. The returned value
// must be passed straight into the auth client and never logged or persisted.
function resolveAppSecret({ repoRoot = REPO_ROOT, configPath = CONFIG_PATH } = {}) {
  const raw = readConfigFile(configPath);
  const envPath = path.join(repoRoot, raw.envPath || DEFAULTS.envPath);
  const fileEnv = parseEnvFile(envPath);
  return resolveVar(fileEnv, raw.appSecretEnvVar || DEFAULTS.appSecretEnvVar);
}

module.exports = {
  loadLarkConfig,
  getCalendarForBrand,
  resolveAppSecret,
  CONFIG_PATH,
  DEFAULTS,
  LEGACY_BRAND_KEY,
};
