// ---------------------------------------------------------------------------
// approved-output.js — read + validate a QA-approved campaign package (Sprint 9).
//
// Workflow steps 1-3: read the generated HTML from an Output folder, confirm it
// exists, and confirm the QA report is PASS — BEFORE anything is uploaded to
// Klaviyo. Reuses the QA results the Export Layer already wrote (the package
// manifest + the QA report), so QA is never re-run here.
//
// Read-only filesystem access; no network.
//
// Note on the manifest `qa` shape: the Export Layer writes
//   qa: { pass: <boolean>, ...counts }  where counts = { blocker, warn, pass }.
// The spread overwrites `pass` with the passing-check COUNT, so the reliable
// PASS signal is `blocker === 0`. This reader accepts either an explicit boolean
// `pass === true` or a zero blocker count, so it is correct for the current and
// any future manifest shape. (The manifest `pass`-collision is noted for cleanup
// but is out of scope for this sprint.)
// ---------------------------------------------------------------------------

'use strict';

const path = require('path');
const { exists, readText } = require('../../common/fs-utils');
const { ConfigError, QaBlocker } = require('../../common/errors');

// Determine PASS from a manifest's qa block, tolerant of the field collision.
function qaPassed(qa) {
  if (!qa || typeof qa !== 'object') return false;
  if (qa.pass === true) return true;
  const blockers = qa.blockers != null ? qa.blockers : qa.blocker;
  return typeof blockers === 'number' && blockers === 0;
}

// Read the approved package for `campaignId` from `outputDir`.
// Returns { html, manifest, htmlPath, manifestPath }.
// Throws ConfigError if the HTML/manifest are missing, QaBlocker if QA is not PASS.
function readApprovedOutput({ outputDir, campaignId }) {
  if (!outputDir || !campaignId) {
    throw new ConfigError('readApprovedOutput requires { outputDir, campaignId }.');
  }
  const htmlPath = path.join(outputDir, `${campaignId}.html`);
  const manifestPath = path.join(outputDir, `${campaignId}-package.json`);

  if (!exists(htmlPath)) {
    throw new ConfigError(`Approved HTML not found: ${htmlPath}. Generate the campaign first.`, { htmlPath });
  }
  if (!exists(manifestPath)) {
    throw new ConfigError(`Package manifest not found: ${manifestPath}. Cannot confirm QA status.`, { manifestPath });
  }

  let manifest;
  try {
    manifest = JSON.parse(readText(manifestPath));
  } catch (err) {
    throw new ConfigError(`Package manifest is not valid JSON: ${manifestPath} (${err.message}).`);
  }

  if (!qaPassed(manifest.qa)) {
    throw new QaBlocker(
      `QA is not PASS for ${campaignId} — refusing to upload to Klaviyo. Fix blockers first (see the QA report).`,
      { campaignId, qa: manifest.qa }
    );
  }

  const html = readText(htmlPath);
  if (!html || !html.trim()) {
    throw new ConfigError(`Approved HTML file is empty: ${htmlPath}.`);
  }

  return { html, manifest, htmlPath, manifestPath };
}

module.exports = { readApprovedOutput, qaPassed };
