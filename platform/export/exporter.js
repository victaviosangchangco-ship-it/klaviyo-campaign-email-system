// ---------------------------------------------------------------------------
// exporter.js — the Export Layer (Architecture V2 §2.7, Phase 3).
//
// Writes the campaign PACKAGE. SYSTEM PATCH (Draft/Output Lifecycle): automatic
// generation writes to Draft/ ONLY — the versioned HTML history, an unversioned
// "latest build" convenience copy, the product data (JSON+CSV), the QA report,
// and the package manifest all live under Draft/. Output/ is reserved for an
// explicitly approved artifact and is NEVER written by generation; an existing
// approved Output/ file is therefore never touched by a new/unreviewed run. The
// QA report is also written to Review/ (its canonical home, §8), and the
// structured run log to runtime/logs/.
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
  const cols = ['id', 'name', 'priceLabel', 'category', 'url', 'imageUrl', 'isVisible', 'availability', 'inventoryTracking', 'inventoryLevel', 'purchasable', 'dateModified'];
  const header = cols.join(',');
  const { isCampaignPurchasable, PASS } = require('../integrations/bigcommerce/inventory');
  const rows = products.map((p) => {
    const v = isCampaignPurchasable(p);
    return [p.id, p.name, p.priceLabel, p.desc, p.url, p.imageUrl, p.isVisible, p.availability, p.inventoryTracking, p.inventoryLevel, v.status === PASS ? 'YES' : `NO: ${v.reason}`, p.dateModified]
      .map(csvField)
      .join(',');
  });
  return [header, ...rows].join('\n');
}

function exportPackage({ repoRoot, brand, campaignId, html, pkg, qaSummary, reportMd, renderMeta, runId, generatedAt, logger, targetRoot, mode }) {
  // targetRoot is either the governed send folder (Brands/<CODE>/Campaigns/Weekly)
  // for a real run, or a sandbox (runtime/exports/<campaignId>) for fixture/dry-run
  // — so synthetic/test data NEVER overwrites approved work in Brands/.
  const root = targetRoot || sendDir(repoRoot, brand.code);
  const draftDir = path.join(root, 'Draft');
  const reviewDir = path.join(root, 'Review');
  // Output/ is intentionally NEVER written here (SYSTEM PATCH: Draft/Output
  // Lifecycle) — it is reserved for an explicitly approved artifact, promoted
  // there by a separate, human-gated step. Automatic generation writes Draft/ only.

  // 1) Draft (versioned — full history, never deleted; §4.1)
  const v = nextDraftVersion(draftDir, campaignId);
  const draftPath = writeText(path.join(draftDir, `${campaignId}-draft-v${v}.html`), html);

  // 2) Latest-build convenience copy + supporting artifacts — Draft/, not Output/.
  const htmlPath = writeText(path.join(draftDir, `${campaignId}.html`), html);
  const productsJsonPath = writeJson(path.join(draftDir, `${campaignId}-products.json`), pkg.products);
  const productsCsvPath = writeText(path.join(draftDir, `${campaignId}-products.csv`), productsToCsv(pkg.products));
  const qaReportPath = writeText(path.join(draftDir, `${campaignId}-qa-report.md`), reportMd);

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
    _note: 'Draft-only build (SYSTEM PATCH: Draft/Output Lifecycle). Output/ is untouched until an explicit, human-gated approval step promotes this Draft. Approval-to-send is tracked in Brief/ + Review/ and gated by CLAUDE.md §8.1. Klaviyo/send are out of MVP scope.',
    files: {
      html: path.relative(repoRoot, htmlPath),
      draft: path.relative(repoRoot, draftPath),
      products_json: path.relative(repoRoot, productsJsonPath),
      products_csv: path.relative(repoRoot, productsCsvPath),
      qa_report: path.relative(repoRoot, qaReportPath),
    },
  };
  const manifestPath = writeJson(path.join(draftDir, `${campaignId}-package.json`), manifest);

  // 3) QA report also in Review/ (canonical §8) with the draft reference
  const reviewPath = writeText(path.join(reviewDir, `${campaignId}-review.md`), reportMd);

  if (logger) {
    logger.info(`Draft written:       ${path.relative(repoRoot, draftPath)}`);
    logger.info(`Latest build (Draft/): ${path.relative(repoRoot, htmlPath)}`);
    logger.info(`Package + QA (Draft/): ${path.relative(repoRoot, manifestPath)}`);
    logger.info(`Output/ untouched — approval is a separate, explicit step (SYSTEM PATCH: Draft/Output Lifecycle).`);
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
