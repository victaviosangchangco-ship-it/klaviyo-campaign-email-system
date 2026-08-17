// ---------------------------------------------------------------------------
// safety.js — the no-send safety guard (T3).
//
// The platform must NEVER be able to send or schedule a Klaviyo campaign
// (KLAVIYO_MVP_IMPLEMENTATION_PLAN.md §4/§6). This module is layer 2 of the
// defence: a source scanner that FAILS THE BUILD if any Klaviyo module gains a
// reference to a send/schedule capability.
//
// Design note — self-reference: the forbidden identifiers are assembled from
// fragments at runtime, so this guard file does not itself contain the literal
// strings it looks for. As belt-and-suspenders, the scanner also skips this file
// and any *.test.js. Net effect: a real send reference anywhere in the Klaviyo
// tree (written literally, as it would have to be to call the API) is caught,
// while the guard and its tests never false-positive.
//
// This module makes NO network calls. It only reads local source files.
// ---------------------------------------------------------------------------

'use strict';

const fs = require('fs');
const path = require('path');
const { PlatformError } = require('../../common/errors');

// Forbidden capability identifiers, assembled from fragments (never written as a
// single literal here). These are the ONLY ways to send/schedule in Klaviyo:
//   - the campaign send-job REST endpoint, and
//   - the equivalent MCP send tool.
const FORBIDDEN = [
  ['campaign', 'send', 'jobs'].join('-'), // the send/schedule REST endpoint (plural)
  ['campaign', 'send', 'job'].join('-'), // singular variant
  ['send', 'campaign'].join('_'), // the MCP send tool identifier
];

// A finding: { file (repo-relative), line (1-based), token }.
function scanFile(absPath, repoRoot) {
  const findings = [];
  const text = fs.readFileSync(absPath, 'utf8');
  const lower = text.toLowerCase();
  for (const token of FORBIDDEN) {
    if (lower.includes(token)) {
      // locate the line for an actionable message
      const idx = lower.indexOf(token);
      const line = text.slice(0, idx).split(/\r?\n/).length;
      findings.push({ file: path.relative(repoRoot, absPath), line, token });
    }
  }
  return findings;
}

// Recursively scan a directory's .js files (excluding *.test.js and this guard
// file) for any forbidden send/schedule capability. Missing directory → [] (a
// not-yet-created Klaviyo tree is trivially send-free).
function scanForSendCapability(dir, { repoRoot = dir } = {}) {
  if (!fs.existsSync(dir)) return [];
  const findings = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      findings.push(...scanForSendCapability(full, { repoRoot }));
      continue;
    }
    if (!entry.name.endsWith('.js')) continue; // code only (docs/.md are excluded)
    if (entry.name.endsWith('.test.js')) continue; // tests may plant a string on purpose
    if (entry.name === 'safety.js') continue; // the guard itself
    findings.push(...scanFile(full, repoRoot));
  }
  return findings;
}

// Assert a directory contains no send capability. Throws PlatformError listing
// every offending file:line so the build fails loudly. Returns true when clean.
function assertNoSend(dir, opts = {}) {
  const findings = scanForSendCapability(dir, opts);
  if (findings.length) {
    const detail = findings.map((f) => `  ${f.file}:${f.line} → "${f.token}"`).join('\n');
    throw new PlatformError(
      `No-send safety guard TRIPPED — send/schedule capability detected in the Klaviyo tree:\n${detail}\n` +
        `The platform creates DRAFTS ONLY. Remove the send reference (KLAVIYO_MVP_IMPLEMENTATION_PLAN §4/§6).`,
      { findings }
    );
  }
  return true;
}

// Convenience: guard the real Klaviyo integration directory.
function guardKlaviyoDir(repoRoot) {
  const dir = path.join(repoRoot, 'platform', 'integrations', 'klaviyo');
  return assertNoSend(dir, { repoRoot });
}

module.exports = { FORBIDDEN, scanForSendCapability, assertNoSend, guardKlaviyoDir };
