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
const { buildCampaignThemePackage } = require('./campaign-theme-package');
const { resolveThemeRelevantProducts, assertHeroMatchesTheme, requireWeeklyHero, INSUFFICIENT_THEME_RELEVANT_PRODUCTS } = require('../ai/theme-relevance');
const { resolveWeeklyHero } = require('../integrations/hosting/hero-resolver');
const { resolveSupportBanner } = require('../integrations/hosting/support-banner-resolver');
const { checkThemeCoherence } = require('../qa/theme-coherence');
const { checkSsWeeklyVisualContract } = require('../qa/brand-visual');
const { checkCurationBalance } = require('../qa/curation-balance');
const { checkGridPairing } = require('../qa/grid-pairing');
const { freshInventoryRecheck } = require('../integrations/bigcommerce/inventory');
const path = require('path');

// Last-resort only — every real brand config declares its own product.defaultCount
// (SS/RDD = 18). Reached only if platformConfig itself is missing product.defaultCount.
const DEFAULT_PRODUCT_COUNT = 16;

// SINGLE authoritative resolution for how many products a campaign needs.
// Priority: campaign.product_count > brand.product.defaultCount >
// platformConfig.product.defaultCount > DEFAULT_PRODUCT_COUNT (last resort).
//
// Resolved ONCE per run and threaded through every downstream use — candidate-
// fetch sizing, curation (buildPackage/curate's targetCount), and the
// post-curation required-count gate — so a brand's configured target (e.g. SS/RDD's
// 18) can never be silently overridden by a lower, independently-derived count
// further down the pipeline (SYSTEM PATCH: Required Product Count Unification —
// previously curate() capped at platformConfig's default of 16 regardless of the
// brand's own higher configured target, so an 18-product campaign could never
// actually reach 18 even with plenty of valid candidates).
function resolveRequiredProductCount({ campaign, brand, platformConfig }) {
  return (
    (campaign && campaign.product_count) ||
    (brand && brand.product && brand.product.defaultCount) ||
    (platformConfig && platformConfig.product && platformConfig.product.defaultCount) ||
    DEFAULT_PRODUCT_COUNT
  );
}

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
  const requiredCount = resolveRequiredProductCount({ campaign, brand, platformConfig });
  // An approved CONTENT OVERRIDE (specific hero + grouped product selection + authored
  // copy) takes precedence over calendar-driven generation. The calendar is untouched.
  const overridePlan = config.loadCampaignOverride(campaignId);
  logger.info(`Slot: ${brand.code}/${slot.type} ${slot.isoWeek}${slot.synthesized ? ' (default slot)' : ''} → ${campaignId}${overridePlan ? ' (content override)' : campaign ? ` (calendar: ${campaign.topic_category_slug})` : ''}`);

  // ── Stage 2: retrieve products (read-only BigCommerce) ────────────────────
  logger.step(2, 'Retrieve products (BigCommerce, read-only)');
  const source = createProductSource({
    repoRoot,
    brand,
    logger,
    cacheDir: path.join(repoRoot, platformConfig.paths.cache),
  });
  const count = requiredCount; // candidate-fetch sizing uses the SAME resolved target

  // One CampaignThemePackage built straight from the EXACT resolved campaign
  // (never inferred). Hero selection, product relevance and semantic QA all
  // check against this SAME package (SYSTEM PATCH: Campaign Theme Coherence).
  const themePkg = campaign ? buildCampaignThemePackage(campaign) : null;

  // ── Stage 3: decide (curate + copy) — AI Decision Engine ──────────────────
  let pkg;
  let candidatePool = []; // saved for pre-export replacement (override = no pool)
  if (overridePlan) {
    logger.info(`Content override: "${overridePlan.subject}" — ${overridePlan.groups.length} group(s).`);
    const groups = [];
    for (const g of overridePlan.groups) {
      // eslint-disable-next-line no-await-in-loop
      const prods = await source.getProductsByIds(g.product_ids, { source: options.source, fixturePath: options.fixturePath });
      const { filterPurchasable } = require('../integrations/bigcommerce/inventory');
      const { accepted: invAccepted, rejected: invRejected } = filterPurchasable(prods, { brandCode: brand.code });
      if (invRejected.length) {
        logger.warn(`Content override group "${g.title}": ${invRejected.length} product(s) rejected by inventory safety gate.`);
      }
      const verified = invAccepted.map((a) => a.product);
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
        // getProductsByIds() leaves `desc` blank by design (adapter.js: "the
        // caller sets authored copy"). `desc` doubles as the category signal
        // checkThemeCoherence/theme-relevance use (getCategoryOf reads
        // product.category || product.categoryPath || product.desc) — the
        // group's title is the real category a human curator already verified
        // these ids belong to, so it fills that role here (never invented: the
        // override author is asserting membership, same as picking the group).
        // An authored per-product description is a SEPARATE, display-only field
        // (renderer.js's renderProductRow prefers it for the card, never for
        // theme matching), so it does not overwrite `desc`.
        const cardDescription = (overridePlan.descriptions && overridePlan.descriptions[String(id)]) || null;
        return { ...p, desc: g.title || p.desc, cardDescription };
      });
      groups.push({ title: g.title, subtitle: g.subtitle || '', badge: g.badge || 'In Stock', products: ordered });
      logger.info(`  group "${g.title}": ${ordered.length} verified product(s).`);
    }
    logger.step(3, 'Assemble content-override package (authored copy + verified products)');
    pkg = buildOverridePackage({ brand, plan: overridePlan, groups });

    // Hero selection uses the SAME CampaignThemePackage. Identity check only
    // (heroImage.campaignId), never "fixed" by editing alt text.
    assertHeroMatchesTheme(pkg.heroImage, { campaignId: campaignId });

    // Support banner (OPTIONAL, same as the calendar-driven branch below):
    // an override campaign can still have an exact-campaign_id support banner
    // published in hosting/<brand>/support-banners/ — absence never blocks.
    const overrideSupportBanner = await resolveSupportBanner({
      repoRoot,
      brand: brand.code,
      campaignId,
      altFallback: overridePlan.subject,
      logger,
    });
    if (overrideSupportBanner) pkg.supportBanner = overrideSupportBanner;
  } else {
    let candidates;
    let category = null;
    if (campaign && campaign.topic_category) {
      logger.info(`Calendar theme: targeting category "${campaign.topic_category}" only (no category mixing).`);
      const res = await source.getCategoryProducts({ categoryName: campaign.topic_category, count, source: options.source, fixturePath: options.fixturePath });
      category = res.category;
      candidates = res.products;
      logger.info(`Category "${category.name}" candidate products: ${candidates.length}`);

      // THEME GATE (defense-in-depth on top of the category-scoped retrieval
      // above): a verified product must also support the resolved campaign's
      // theme. Never backfill a short count with unrelated-but-verified products.
      // FALLBACK DISCOVERY (RDD-2026-39 patch): the exact category can be
      // correctly resolved yet currently hold too few (or zero) products — before
      // blocking, resolveThemeRelevantProducts widens the candidate POOL through
      // verified related-category + catalog-search tiers (getThemeCandidateProducts);
      // filterThemeRelevant is re-applied to the merged pool and remains authoritative.
      const min = (platformConfig.product && platformConfig.product.minCount) || 4;
      const gated = await resolveThemeRelevantProducts({
        candidates,
        themePkg,
        min,
        fetchFallback: typeof source.getThemeCandidateProducts === 'function'
          ? () => source.getThemeCandidateProducts({ themePkg, count, source: options.source, fixturePath: options.fixturePath })
          : null,
        onFallback: (preCount) => logger.warn(
          `Only ${preCount} theme-relevant product(s) in the exact category "${category.name}" — ` +
            `widening to verified related categories + catalog search (never unrelated products).`
        ),
      });
      candidates = gated.candidates;
      let themeRelevant = gated.themeRelevant;
      logger.info(`After theme relevance gate (+ fallback discovery if triggered): ${candidates.length} total candidate(s), ${themeRelevant.length} theme-relevant.`);

      if (themeRelevant.length < min) {
        throw new ApprovalRequired(
          `${INSUFFICIENT_THEME_RELEVANT_PRODUCTS}: only ${themeRelevant.length} of ${candidates.length} verified product(s) ` +
            `(including related-category + catalog-search fallback) for ${campaignId} support the theme ` +
            `"${campaign.topic_category}" (minimum ${min}). The engine will not backfill with unrelated products (CLAUDE.md §5.1/§9).`,
          { campaignId, themeRelevant: themeRelevant.length, verified: candidates.length, min }
        );
      }
      candidates = themeRelevant;
    } else {
      candidates = await source.getCandidateProducts({ source: options.source, fixturePath: options.fixturePath });
      logger.info(`Candidate products: ${candidates.length}`);
    }
    candidatePool = [...candidates];
    logger.step(3, 'Curate products + generate copy (AI Decision Engine)');
    pkg = buildPackage({ brand, slot, products: candidates, config: platformConfig, campaign, category, targetCount: requiredCount });

    // HERO GATE (SYSTEM PATCH: Weekly Hero Banner Resolution) — a calendar-driven
    // campaign resolves its hero via resolveWeeklyHero: an explicit config/
    // campaign-heroes.json entry first, else an EXACT campaign_id filename match
    // in hosting/<brand>/hero-banners/ (the existing, already-standardized asset
    // workflow) — and REQUIRES one; it never silently falls back to a text-only
    // hero. Content-override campaigns are unaffected (they declare their own
    // hero_image and are already gated by assertHeroMatchesTheme above). A
    // generic, non-calendar-driven call (campaign === null; tests/dev) is also
    // unaffected — there is no resolved theme to require a hero against.
    if (campaign) {
      const declaredHero = await resolveWeeklyHero({
        repoRoot,
        brand: brand.code,
        campaignId,
        altFallback: campaign.campaign_name || themePkg.topicCategory,
        logger,
      });
      if (declaredHero) pkg.heroImage = { ...declaredHero, campaignId };
      requireWeeklyHero(pkg.heroImage, themePkg);

      // Support banner (OPTIONAL, Weekly only): absence never blocks, but a
      // file that DOES exist is held to the same hosted-liveness bar as the
      // hero (support-banner-resolver.js) — it can throw PUBLISH_REQUIRED/FAILED.
      const supportBanner = await resolveSupportBanner({
        repoRoot,
        brand: brand.code,
        campaignId,
        altFallback: campaign.campaign_name || themePkg.topicCategory,
        logger,
      });
      if (supportBanner) pkg.supportBanner = supportBanner;
    }
  }
  logger.info(`Curated ${pkg.products.length} verified product(s). Subject: "${pkg.subject}"`);

  // requiredCount was already resolved once, above (before candidate fetch +
  // curation) — reused here as-is, never re-derived.
  if (pkg.products.length < requiredCount) {
    throw new ApprovalRequired(
      `INSUFFICIENT_IN_STOCK_THEME_RELEVANT_PRODUCTS: initial selection only reached ${pkg.products.length} product(s) ` +
      `for ${campaignId}, but the campaign requires ${requiredCount}. The engine will not export a short grid.`,
      { campaignId, requiredCount, selectedCount: pkg.products.length }
    );
  }

  // ── Pre-export FRESH inventory recheck ─────────────────────────────────────
  // Re-fetch every selected product from BigCommerce by ID to catch inventory
  // changes since discovery. Uses CURRENT API data, not stale in-memory state.
  const fetchFresh = (ids) => source.getProductsByIds(ids, { source: options.source, fixturePath: options.fixturePath });
  try {
    const recheck = await freshInventoryRecheck(
      pkg.products.map((p) => p.id), fetchFresh,
      { brandCode: brand.code, context: `pre-export ${campaignId}` }
    );
    const unavailable = [
      ...recheck.failed.map((f) => ({ id: Number(f.product.id), reason: f.verdict.reason })),
      ...recheck.notFound,
    ];
    if (unavailable.length) {
      logger.warn(`Pre-export fresh recheck: ${unavailable.length} product(s) newly unavailable for ${campaignId}.`);
      const unavailableIds = new Set(unavailable.map((u) => u.id));
      const surviving = pkg.products.filter((p) => !unavailableIds.has(Number(p.id)));

      // Attempt replacement from the candidate pool (not available for override campaigns).
      let replacements = [];
      if (candidatePool.length) {
        const selectedIds = new Set(pkg.products.map((p) => Number(p.id)));
        const poolIds = candidatePool
          .filter((p) => !selectedIds.has(Number(p.id)) && !unavailableIds.has(Number(p.id)))
          .map((p) => p.id);
        if (poolIds.length) {
          const replRecheck = await freshInventoryRecheck(poolIds, fetchFresh, { brandCode: brand.code, context: `replacement ${campaignId}` });
          replacements = replRecheck.passed.map((r) => r.product).slice(0, unavailable.length);
        }
      }

      // requiredCount was resolved above from campaign/config — not pkg.products.length.
      const combined = [...surviving, ...replacements];
      if (combined.length >= requiredCount) {
        pkg.products = combined.slice(0, requiredCount);
        logger.info(`Pre-export replacement: ${unavailable.length} OOS, ${replacements.length} replaced, continuing with ${pkg.products.length} products (required ${requiredCount}).`);
      } else {
        throw new ApprovalRequired(
          `INSUFFICIENT_IN_STOCK_THEME_RELEVANT_PRODUCTS: ${unavailable.length} product(s) became unavailable for ${campaignId}, ` +
          `only ${replacements.length} replacement(s) found. Required: ${requiredCount}, valid: ${combined.length}.\n` +
          `Products lost to inventory:\n` +
          unavailable.map((u) => `  [${u.id}] ${u.reason}`).join('\n') +
          (replacements.length ? `\nReplacement candidates attempted: ${replacements.length} (from ${candidatePool.length} pool)` : '\nNo replacement candidates available.'),
          { campaignId, requiredCount, validCount: combined.length, unavailable, replacements: replacements.length }
        );
      }
    } else {
      // Update products with fresh data (current prices, inventory levels).
      const freshById = new Map(recheck.passed.map((r) => [Number(r.product.id), r.product]));
      pkg.products = pkg.products.map((p) => {
        const fresh = freshById.get(Number(p.id));
        return fresh ? { ...p, ...fresh, desc: p.desc, cardDescription: p.cardDescription, rawDescription: p.rawDescription } : p;
      });
      logger.info('Pre-export fresh inventory recheck: all products confirmed purchasable (fresh BigCommerce data).');
    }
  } catch (err) {
    if (err.code === 'FRESH_RECHECK_FETCH_FAILED') {
      throw new ApprovalRequired(
        `PRE_EXPORT_INVENTORY_BLOCK (fetch failed): ${err.message}`,
        { campaignId }
      );
    }
    if (err instanceof ApprovalRequired) throw err;
    throw err;
  }

  // ── Stage 4: render HTML from existing components ─────────────────────────
  logger.step(4, 'Render HTML from components (Rendering Engine)');
  const rendered = renderWeekly({ repoRoot, brand, pkg });
  logger.info(`Rendered ${rendered.meta.rows} product row(s); ${(Buffer.byteLength(rendered.html, 'utf8') / 1024).toFixed(1)}KB.`);

  // ── Stage 5: QA ───────────────────────────────────────────────────────────
  logger.step(5, 'Automated QA (CLAUDE.md §6/§8 validators)');
  const findings = validators.runAll(rendered.html, { platformConfig });

  // Semantic QA (SYSTEM PATCH: Campaign Theme Coherence). Structural QA PASS
  // must never override a semantic mismatch — this finding merges into the
  // SAME QA gate below, so a theme mismatch blocks Draft approval too.
  findings.push(checkThemeCoherence(pkg, themePkg));
  findings.push(...checkSsWeeklyVisualContract(rendered.html, brand, pkg));

  // INVENTORY SAFETY QA: final product purchasability check (blocker).
  findings.push(validators.checkProductInventory(pkg.products, { brandCode: brand.code }));

  // CURATION BALANCE QA (warn-only): flags an accessory-dominated primary
  // category or a completely-omitted approved supporting category. Never a
  // blocker — a thin-stock-but-valid product is never treated as a defect.
  findings.push(checkCurationBalance(pkg));
  findings.push(...checkGridPairing(pkg));

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

module.exports = { runWeeklyPipeline, resolveRequiredProductCount };
