// ---------------------------------------------------------------------------
// exporter.js — the Export Layer (Architecture V2 §2.7, Phase 3).
//
// Writes the campaign PACKAGE. Honors the file-driven pipeline (CLAUDE.md
// §4.1/§9): the HTML is authored as a versioned Draft first, then Output mirrors
// the latest build. Per the MVP brief ("export everything into the Output
// folder"), the package artifacts (subject/preview, product data JSON+CSV, QA
// report) are written alongside the HTML in the send's Output/ folder, each
// clearly prefixed with the campaign id. The QA report is also written to
// Review/ (its canonical home, §8), and the structured run log to runtime/logs/.
//
// Nothing here approves or sends. Every package records sendStatus =
// NOT_APPROVED_TO_SEND (CR-16/CR-17, §8.1).
// ---------------------------------------------------------------------------

'use strict';

const fs = require('fs');
const path = require('path');
const { ensureDir, writeText, writeJson } = require('../common/fs-utils');

function sendDir(repoRoot, brandCode) {
  // MVP builds Weekly. (Type is a parameter for later phases.)
  return path.join(repoRoot, 'Brands', brandCode, 'Campaigns', 'Weekly');
}

function nextDraftVersion(draftDir, campaignId) {
  ensureDir(draftDir);
  const re = new RegExp(`^${campaignId}-draft-v(\\d+)\\.html$`);
  let max = 0;
  for (const name of fs.readdirSync(draftDir)) {
    const m = name.match(re);
    if (m) max = Math.max(max, Number(m[1]));
  }
  return max + 1;
}

function csvField(value) {
  const s = value == null ? '' : String(value);
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

function productsToCsv(products) {
  const cols = ['id', 'name', 'priceLabel', 'category', 'url', 'imageUrl', 'isVisible', 'availability', 'inventoryLevel', 'dateModified'];
  const header = cols.join(',');
  const rows = products.map((p) =>
    [p.id, p.name, p.priceLabel, p.desc, p.url, p.imageUrl, p.isVisible, p.availability, p.inventoryLevel, p.dateModified]
      .map(csvField)
      .join(',')
  );
  return [header, ...rows].join('\n');
}

function exportPackage({ repoRoot, brand, campaignId, html, pkg, qaSummary, reportMd, renderMeta, runId, generatedAt, logger, targetRoot, mode }) {
  // targetRoot is either the governed send folder (Brands/<CODE>/Campaigns/Weekly)
  // for a real run, or a sandbox (runtime/exports/<campaignId>) for fixture/dry-run
  // — so synthetic/test data NEVER overwrites approved work in Brands/.
  const root = targetRoot || sendDir(repoRoot, brand.code);
  const draftDir = path.join(root, 'Draft');
  const outputDir = path.join(root, 'Output');
  const reviewDir = path.join(root, 'Review');

  // 1) Draft (versioned — full history, never deleted; §4.1)
  const v = nextDraftVersion(draftDir, campaignId);
  const draftPath = writeText(path.join(draftDir, `${campaignId}-draft-v${v}.html`), html);

  // 2) Output (un-versioned latest; mirrors newest Draft; §9)
  const htmlPath = writeText(path.join(outputDir, `${campaignId}.html`), html);

  // 3) Package artifacts in Output/ (subject/preview, product data, QA report)
  const productsJsonPath = writeJson(path.join(outputDir, `${campaignId}-products.json`), pkg.products);
  const productsCsvPath = writeText(path.join(outputDir, `${campaignId}-products.csv`), productsToCsv(pkg.products));
  const qaReportPath = writeText(path.join(outputDir, `${campaignId}-qa-report.md`), reportMd);

  const manifest = {
    campaignId,
    brand: brand.code,
    type: 'weekly',
    generatedAt,
    runId,
    subject: pkg.subject,
    previewText: pkg.preheader,
    productCount: pkg.products.length,
    render: renderMeta,
    qa: { pass: qaSummary.pass, ...qaSummary.counts },
    writeMode: mode || 'pipeline',
    sendStatus: 'NOT_APPROVED_TO_SEND',
    _note: 'Presence in Output/ is preview only. Approval-to-send is tracked in Brief/ + Review/ and gated by CLAUDE.md §8.1. Klaviyo/send are out of MVP scope.',
    files: {
      html: path.relative(repoRoot, htmlPath),
      draft: path.relative(repoRoot, draftPath),
      products_json: path.relative(repoRoot, productsJsonPath),
      products_csv: path.relative(repoRoot, productsCsvPath),
      qa_report: path.relative(repoRoot, qaReportPath),
    },
  };
  const manifestPath = writeJson(path.join(outputDir, `${campaignId}-package.json`), manifest);

  // 4) QA report also in Review/ (canonical §8) with the draft reference
  const reviewPath = writeText(path.join(reviewDir, `${campaignId}-review.md`), reportMd);

  if (logger) {
    logger.info(`Draft written:  ${path.relative(repoRoot, draftPath)}`);
    logger.info(`Output written: ${path.relative(repoRoot, htmlPath)}`);
    logger.info(`Package + QA:   ${path.relative(repoRoot, manifestPath)}`);
  }

  return {
    draftVersion: `v${v}`,
    paths: {
      draft: draftPath,
      html: htmlPath,
      productsJson: productsJsonPath,
      productsCsv: productsCsvPath,
      qaReport: qaReportPath,
      manifest: manifestPath,
      review: reviewPath,
    },
    manifest,
  };
}

module.exports = { exportPackage, productsToCsv, nextDraftVersion, sendDir };
