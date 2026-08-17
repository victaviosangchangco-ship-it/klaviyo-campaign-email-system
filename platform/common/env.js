// ---------------------------------------------------------------------------
// env.js — platform environment loader (T1).
//
// Reads a brand .env file (git-ignored) and resolves individual variables, with
// process.env taking precedence so a secrets manager / CI can inject values
// without a file. This is the platform's OWN loader — it does not import the
// vendored BigCommerce client (which keeps its own copy). No network, no writes.
//
// Supported .env line formats (matching the store's existing convention):
//   KEY: VALUE      KEY := VALUE      KEY=VALUE      (# comments and blanks ignored)
//
// SECURITY: this module returns values to the caller but never logs them. The
// caller is responsible for holding secrets only in memory (see the logger's
// redaction for defence in depth).
// ---------------------------------------------------------------------------

'use strict';

const fs = require('fs');

// Parse a .env file into a flat { KEY: value } map. Missing file → {} (not an
// error — absence is a valid state the caller reports on).
function parseEnvFile(filePath) {
  if (!filePath || !fs.existsSync(filePath)) return {};
  const out = {};
  for (const rawLine of fs.readFileSync(filePath, 'utf8').split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith('#')) continue;
    // ":=" checked first so it is not split as a bare ":" leaving a stray "=".
    const m = line.match(/^([^:=]+?)\s*(?::=|[:=])\s*(.*)$/);
    if (!m) continue;
    out[m[1].trim()] = m[2].trim();
  }
  return out;
}

// Resolve a variable by trying process.env first (injection wins), then the
// parsed file map, across one or more accepted key names. Returns null if none
// are present/non-empty.
function resolveVar(fileEnv, keys) {
  const names = Array.isArray(keys) ? keys : [keys];
  for (const k of names) {
    if (process.env[k]) return process.env[k];
  }
  for (const k of names) {
    if (fileEnv && fileEnv[k]) return fileEnv[k];
  }
  return null;
}

// Validate that a set of resolved values are present. `spec` is
// { label: value|null }. Returns { ok, missing: [label…] } — never throws, so
// callers can decide whether a given missing var is fatal now or later.
function validateRequired(spec) {
  const missing = Object.entries(spec)
    .filter(([, v]) => v == null || v === '')
    .map(([label]) => label);
  return { ok: missing.length === 0, missing };
}

module.exports = { parseEnvFile, resolveVar, validateRequired };
