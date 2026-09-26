// Draft/Output lifecycle (SYSTEM PATCH: automatic generation writes Draft ONLY —
// Output/ is reserved for an explicit, human-gated approval step and is never
// touched by exportPackage). Offline, isolated temp repoRoot, no network.

'use strict';

const { test } = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const os = require('os');
const path = require('path');

const { exportPackage } = require('../export/exporter');

function tmpRoot() {
  return fs.mkdtempSync(path.join(os.tmpdir(), 'export-lifecycle-'));
}

function callExport(overrides = {}) {
  const repoRoot = overrides.repoRoot || tmpRoot();
  const brand = { code: 'RDD' };
  const campaignId = overrides.campaignId || 'RDD-2026-39';
  const targetRoot = path.join(repoRoot, 'Brands', 'RDD', 'Campaigns', 'Weekly');
  const result = exportPackage({
    repoRoot,
    brand,
    campaignId,
    html: overrides.html || '<html><body>ok</body></html>',
    pkg: { products: [{ id: 1, name: 'P1' }], subject: 'S', preheader: 'P' },
    qaSummary: { pass: true, counts: { blocker: 0, warn: 0, pass: 1 } },
    reportMd: '# QA Report',
    renderMeta: { rows: 1 },
    runId: 'test-run',
    generatedAt: new Date().toISOString(),
    logger: null,
    targetRoot,
    mode: 'pipeline',
  });
  return { repoRoot, targetRoot, campaignId, result };
}

test('8. generation writes Draft only: every artifact lands under Draft/', () => {
  const { targetRoot, campaignId, result } = callExport();
  const draftDir = path.join(targetRoot, 'Draft');
  assert.ok(fs.existsSync(path.join(draftDir, `${campaignId}-draft-v1.html`)), 'versioned draft HTML written');
  assert.ok(fs.existsSync(path.join(draftDir, `${campaignId}.html`)), 'latest-build convenience copy written to Draft/');
  assert.ok(fs.existsSync(path.join(draftDir, `${campaignId}-products.json`)), 'products.json written to Draft/');
  assert.ok(fs.existsSync(path.join(draftDir, `${campaignId}-products.csv`)), 'products.csv written to Draft/');
  assert.ok(fs.existsSync(path.join(draftDir, `${campaignId}-qa-report.md`)), 'qa-report.md written to Draft/');
  assert.ok(fs.existsSync(path.join(draftDir, `${campaignId}-package.json`)), 'manifest written to Draft/');
  // Every returned path points inside Draft/, not Output/.
  for (const [key, p] of Object.entries(result.paths)) {
    if (key === 'review') continue; // Review/ is the QA-notes canonical home, unaffected
    assert.ok(p.includes(`${path.sep}Draft${path.sep}`) || p.endsWith(`${path.sep}Draft`), `${key} path is under Draft/: ${p}`);
  }
});

test('9. unapproved generation does not write Output/ at all', () => {
  const { targetRoot, campaignId } = callExport();
  const outputDir = path.join(targetRoot, 'Output');
  assert.ok(!fs.existsSync(path.join(outputDir, `${campaignId}.html`)), 'no Output/<id>.html written');
  assert.ok(!fs.existsSync(path.join(outputDir, `${campaignId}-package.json`)), 'no Output/<id>-package.json written');
  // Output/ may legitimately not exist at all for a brand-new campaign.
});

test('9b. manifest itself documents Draft-only / not-approved status', () => {
  const { result } = callExport();
  assert.strictEqual(result.manifest.sendStatus, 'NOT_APPROVED_TO_SEND');
  assert.match(result.manifest._note, /Draft-only/);
});

test('10. an existing approved Output/ file is never touched by a new generation run', () => {
  const repoRoot = tmpRoot();
  const campaignId = 'RDD-2026-39';
  const targetRoot = path.join(repoRoot, 'Brands', 'RDD', 'Campaigns', 'Weekly');
  const outputDir = path.join(targetRoot, 'Output');
  fs.mkdirSync(outputDir, { recursive: true });
  const approvedHtmlPath = path.join(outputDir, `${campaignId}.html`);
  const approvedContent = '<html><body>APPROVED — do not touch</body></html>';
  fs.writeFileSync(approvedHtmlPath, approvedContent);
  const approvedManifestPath = path.join(outputDir, `${campaignId}-package.json`);
  fs.writeFileSync(approvedManifestPath, JSON.stringify({ approved: true }));

  // Run generation TWICE (simulating further iteration after the approved Output existed).
  callExport({ repoRoot, campaignId, html: '<html><body>new draft v1</body></html>' });
  callExport({ repoRoot, campaignId, html: '<html><body>new draft v2</body></html>' });

  assert.strictEqual(fs.readFileSync(approvedHtmlPath, 'utf8'), approvedContent, 'approved Output HTML is byte-identical, untouched');
  assert.deepStrictEqual(JSON.parse(fs.readFileSync(approvedManifestPath, 'utf8')), { approved: true }, 'approved Output manifest untouched');
  // The new Draft versions coexist without disturbing Output/.
  const draftDir = path.join(targetRoot, 'Draft');
  assert.ok(fs.existsSync(path.join(draftDir, `${campaignId}-draft-v1.html`)));
  assert.ok(fs.existsSync(path.join(draftDir, `${campaignId}-draft-v2.html`)));
});
