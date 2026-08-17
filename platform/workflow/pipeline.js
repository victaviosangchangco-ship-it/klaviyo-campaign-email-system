// ---------------------------------------------------------------------------
// pipeline.js — the Workflow Engine (Architecture V2 §2.2).
//
// A linear state machine over the file-driven stages for a Weekly send:
//
//   resolve-slot → retrieve-products → decide → render → qa → export
//
// Each stage reads the prior stage's output and produces the next artifact.
// It never skips Draft (CLAUDE.md §4.1) and never marks anything "approved to
// send". A QA blocker does NOT abort the run — the build still lands in Output/
// for preview and the blocker is recorded (§4.1); the four fatal error types
// (Config/Integration/Render/ApprovalRequired) do abort, loudly.
// ---------------------------------------------------------------------------

'use strict';

const calendar = require('../integrations/calendar/adapter');
const config = require('../common/config');
const { createProductSource } = require('../integrations/bigcommerce/adapter');
const { buildPackage, buildOverridePackage } = require('../ai/copy');
const { ApprovalRequired } = require('../common/errors');
const { renderWeekly } = require('../render/renderer');
const validators = require('../qa/validators');
const qaReport = require('../qa/report');
const { exportPackage, nextDraftVersion, sendDir } = require('../export/exporter');
const path = require('path');

async function runWeeklyPipeline(ctx) {
  const { repoRoot, brand, platformConfig, calendarConfig, logger, options, runId, generatedAt } = ctx;

  // ── Stage 1: resolve the calendar slot ────────────────────────────────────
  logger.step(1, 'Resolve calendar slot ("this week")');
  const slot = calendar.resolveSlot({
    calendar: calendarConfig,
    brandCode: brand.code,
    type: 'weekly',
    date: options.date || new Date(),
  });
  // When the live orchestrator supplies a calendar campaign (the source of truth),
  // it governs the campaign id + theme; otherwise fall back to the ISO-week id.
  const campaign = options.calendarCampaign || null;
  const campaignId = (campaign && campaign.campaign_id) || options.campaign || `${brand.code}-${slot.isoWeek}`;
  // An approved CONTENT OVERRIDE (specific hero + grouped product selection + authored
  // copy) takes precedence over calendar-driven generation. The calendar is untouched.
  const overridePlan = config.loadCampaignOverride(campaignId);
  logger.info(`Slot: ${brand.code}/${slot.type} ${slot.isoWeek}${slot.synthesized ? ' (default slot)' : ''} → ${campaignId}${overridePlan ? ' (content override)' : campaign ? ` (calendar: ${campaign.campaign_type})` : ''}`);

  // ── Stage 2: retrieve products (read-only BigCommerce) ────────────────────
  logger.step(2, 'Retrieve products (BigCommerce, read-only)');
  const source = createProductSource({
    repoRoot,
    brand,
    logger,
    cacheDir: path.join(repoRoot, platformConfig.paths.cache),
  });
  const count = (platformConfig.product && platformConfig.product.defaultCount) || 16;

  // ── Stage 3: decide (curate + copy) — AI Decision Engine ──────────────────
  let pkg;
  if (overridePlan) {
    logger.info(`Content override: "${overridePlan.subject}" — ${overridePlan.groups.length} group(s).`);
    const groups = [];
    for (const g of overridePlan.groups) {
      // eslint-disable-next-line no-await-in-loop
      const prods = await source.getProductsByIds(g.product_ids, { source: options.source, fixturePath: options.fixturePath });
      const verified = prods.filter((p) => p && p.isVisible !== false && p.availability !== 'disabled' && p.priceLabel && p.imageUrl && p.url);
      const byId = new Map(verified.map((p) => [Number(p.id), p]));
      const missing = g.product_ids.filter((id) => !byId.has(Number(id)));
      if (missing.length) {
        throw new ApprovalRequired(
          `Content override ${campaignId} group "${g.title}": product id(s) ${missing.join(', ')} could not be verified ` +
            `(hidden, unpriced, no image, or dead URL). The engine will not fabricate or substitute (CLAUDE.md §5.1).`,
          { campaignId, group: g.title, missing }
        );
      }
      const ordered = g.product_ids.map((id) => {
        const p = byId.get(Number(id));
        const desc = (overridePlan.descriptions && overridePlan.descriptions[String(id)]) || p.desc || '';
        return { ...p, desc };
      });
      groups.push({ title: g.title, subtitle: g.subtitle || '', badge: g.badge || 'In Stock', products: ordered });
      logger.info(`  group "${g.title}": ${ordered.length} verified product(s).`);
    }
    logger.step(3, 'Assemble content-override package (authored copy + verified products)');
    pkg = buildOverridePackage({ brand, plan: overridePlan, groups });
  } else {
    let candidates;
    let category = null;
    if (campaign && campaign.topic_category) {
      logger.info(`Calendar theme: targeting category "${campaign.topic_category}" only (no category mixing).`);
      const res = await source.getCategoryProducts({ categoryName: campaign.topic_category, count, source: options.source, fixturePath: options.fixturePath });
      category = res.category;
      candidates = res.products;
      logger.info(`Category "${category.name}" candidate products: ${candidates.length}`);
    } else {
      candidates = await source.getCandidateProducts({ source: options.source, fixturePath: options.fixturePath });
      logger.info(`Candidate products: ${candidates.length}`);
    }
    logger.step(3, 'Curate products + generate copy (AI Decision Engine)');
    pkg = buildPackage({ brand, slot, products: candidates, config: platformConfig, campaign, category });
  }
  logger.info(`Curated ${pkg.products.length} verified product(s). Subject: "${pkg.subject}"`);

  // ── Stage 4: render HTML from existing components ─────────────────────────
  logger.step(4, 'Render HTML from components (Rendering Engine)');
  const rendered = renderWeekly({ repoRoot, brand, pkg });
  logger.info(`Rendered ${rendered.meta.rows} product row(s); ${(Buffer.byteLength(rendered.html, 'utf8') / 1024).toFixed(1)}KB.`);

  // ── Stage 5: QA ───────────────────────────────────────────────────────────
  logger.step(5, 'Automated QA (CLAUDE.md §6/§8 validators)');
  const findings = validators.runAll(rendered.html, { platformConfig });

  let linkResults = null;
  if (options.verifyLinks) {
    const urls = [
      ...pkg.products.map((p) => p.url),
      ...pkg.products.map((p) => p.imageUrl),
      pkg.ctaUrl,
      brand.logo.url.value,
      brand.identity.privacyUrl.value,
    ].filter(Boolean);
    const linkCheck = await validators.checkLinksLive(urls, {
      timeoutMs: platformConfig.qa.linkCheckTimeoutMs,
      concurrency: platformConfig.qa.linkCheckConcurrency,
      logger,
    });
    findings.push(linkCheck.finding);
    linkResults = linkCheck.results;
  }

  const summary = qaReport.summarize(findings);
  logger[summary.pass ? 'info' : 'warn'](
    `QA: ${summary.pass ? 'PASS' : 'BLOCKERS PRESENT'} — ${summary.counts.blocker} blocker · ${summary.counts.warn} warn · ${summary.counts.pass} pass`
  );
  for (const b of summary.blockers) logger.error(`  BLOCKER [${b.rule}] ${b.message}`);

  // ── Stage 6: export the package (Draft + Output + package + Review) ───────
  // Choose the write target: a real run (live/snapshot) writes into the governed
  // send folder; fixture or --dry-run writes to a sandbox so synthetic/test data
  // never overwrites approved work in Brands/ (learned the hard way in dev).
  const mode = options.dryRun || options.source === 'fixture' ? 'sandbox' : 'pipeline';
  const targetRoot =
    mode === 'sandbox'
      ? path.join(repoRoot, platformConfig.paths.exports, campaignId)
      : sendDir(repoRoot, brand.code);
  logger.step(6, `Export campaign package (${mode === 'sandbox' ? 'sandbox: runtime/exports' : 'pipeline: Brands/…/Output'})`);
  if (mode === 'sandbox') logger.warn('Sandbox write — not touching the governed Brands/ pipeline (fixture or --dry-run).');

  // Peek the next draft version (read-only) so the QA report can reference it;
  // the exporter recomputes the same value when it actually writes the draft.
  const draftDir = path.join(targetRoot, 'Draft');
  const provisionalDraftVersion = `v${nextDraftVersion(draftDir, campaignId)}`;
  const reportMd = qaReport.toMarkdown({
    campaignId,
    brandCode: brand.code,
    draftVersion: provisionalDraftVersion,
    findings,
    summary,
    pkg,
    linkResults,
    meta: rendered.meta,
    generatedAt,
  });
  const exportResult = exportPackage({
    repoRoot,
    brand,
    campaignId,
    html: rendered.html,
    pkg,
    qaSummary: summary,
    reportMd,
    renderMeta: rendered.meta,
    runId,
    generatedAt,
    logger,
    targetRoot,
    mode,
  });

  return { campaignId, slot, pkg, rendered: rendered.meta, qa: summary, linkResults, exportResult, mode };
}

module.exports = { runWeeklyPipeline };
