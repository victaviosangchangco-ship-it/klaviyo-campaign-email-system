#!/usr/bin/env node
// ---------------------------------------------------------------------------
// cli.js — command-line entry to the Automation Engine.
//
// Usage:
//   node platform/engine/cli.js create --brand RDD --type weekly [flags]
//   node platform/engine/cli.js "Create this week's RDD campaign"   (natural phrase)
//
// Flags:
//   --brand <CODE>     brand code (default RDD)
//   --type  <type>     campaign type (MVP: weekly)
//   --source <mode>    live | snapshot | fixture   (default live)
//   --fixture <path>   fixture JSON path (with --source fixture)
//   --verify-links     run the live HTTP-200 link check (network)
//   --debug            verbose logging
//
// The natural phrase is parsed only for a create intent + a brand token; it
// never guesses beyond that (CLAUDE.md §5 STOP rule).
// ---------------------------------------------------------------------------

'use strict';

const { createCampaign } = require('./run');
const { parseCampaignIdFromText, KNOWN_BRANDS } = require('./natural-generate');
const { fork } = require('child_process');
const path = require('path');

function parseArgs(argv) {
  const opts = { brand: 'RDD', type: 'weekly', source: 'live', fixturePath: null, verifyLinks: false, debug: false, allowStaleCalendar: false, imagekitWatch: true };
  const positional = [];

  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--brand') opts.brand = argv[++i];
    else if (a === '--type') opts.type = argv[++i];
    else if (a === '--source') opts.source = argv[++i];
    else if (a === '--fixture') { opts.source = 'fixture'; opts.fixturePath = argv[++i]; }
    else if (a === '--verify-links') opts.verifyLinks = true;
    else if (a === '--dry-run') opts.dryRun = true;
    else if (a === '--commit') opts.dryRun = false;
    else if (a === '--klaviyo') opts.klaviyo = true;
    else if (a === '--week') opts.week = argv[++i];
    else if (a === '--campaign') opts.campaign = argv[++i];
    else if (a === '--calendar') opts.calendarSource = argv[++i];
    else if (a === '--allow-stale-calendar') opts.allowStaleCalendar = true;
    else if (a === '--segment') opts.segment = argv[++i];
    else if (a === '--list') opts.list = argv[++i];
    else if (a === '--no-imagekit-watch') opts.imagekitWatch = false;
    else if (a === '--debug') opts.debug = true;
    else if (a === 'create' || a === 'help' || a === '--help' || a === '-h') positional.push(a);
    else positional.push(a);
  }

  // Natural-phrase support: detect a brand token anywhere in the free text.
  const phrase = positional.join(' ').toUpperCase();
  const brandFromPhrase = KNOWN_BRANDS.find((b) => new RegExp(`\\b${b}\\b`).test(phrase));
  if (brandFromPhrase && !argv.includes('--brand')) opts.brand = brandFromPhrase;

  // One-command production UX (SYSTEM PATCH: Campaign ID → Hosted Hero →
  // Klaviyo Draft): "Please generate this Weekly Campaign RDD-2026-14" should
  // need nothing else. An EXACT campaign_id found in free text (never an
  // explicit --campaign flag, which is left exactly as the caller specified)
  // determines the brand and auto-enables the full --klaviyo pipeline — the
  // same one --klaviyo already runs; no second implementation.
  if (!argv.includes('--campaign')) {
    const parsedId = parseCampaignIdFromText(positional.join(' '));
    if (parsedId) {
      opts.campaign = parsedId.campaignId;
      if (!argv.includes('--brand')) opts.brand = parsedId.brand;
      if (!argv.includes('--klaviyo')) opts.klaviyo = true;
    }
  }

  const wantsHelp = positional.some((p) => p === 'help' || p === '--help' || p === '-h');
  const wantsCreate = positional.some((p) => /create|generate/i.test(p)) || positional.length === 0;

  return { opts, wantsHelp, wantsCreate };
}

function printHelp() {
  // eslint-disable-next-line no-console
  console.log(`
Klaviyo Campaign Automation Platform (MVP) — Automation Engine

  node platform/engine/cli.js create --brand RDD --type weekly
  node platform/engine/cli.js "Create this week's RDD campaign"

Flags:
  --brand <CODE>    RDD (default). SS/SC/Stack are not buildable yet (CLAUDE.md §2).
  --type  <type>    weekly (MVP).
  --source <mode>   live (default) | snapshot | fixture
  --fixture <path>  fixture JSON (implies --source fixture; tests/dev only).
  --verify-links    run the live HTTP-200 link check (network).
  --dry-run         write the package to a sandbox (runtime/exports/), NOT Brands/.
  --commit          force writing into the governed Brands/ pipeline.
  --klaviyo         FINAL MVP — also create/reuse a Klaviyo DRAFT + upload HTML (never sends).
  --week <id>       target a specific ISO week (e.g. 2026-W33); default = this week / next planned.
  --campaign <id>   target a specific planned campaign by id (e.g. RDD-2026-32).
                    Required when a week has more than one planned campaign.
  --calendar <src>  lark (default) = read the brand's calendar LIVE from the Lark
                    Base API (read-only); json = EXPLICIT fallback to the generated
                    runtime calendar (XLSX import) — refused if >= 10 days stale
                    unless --allow-stale-calendar is also passed. Applies to every
                    generation path (plain create and --klaviyo).
  --allow-stale-calendar  override the JSON fallback's staleness block (still warns).
  --segment <name>  run-scoped audience override: use this Klaviyo SEGMENT name
                    instead of the calendar's (does NOT edit the calendar/XLSX).
  --list <name>     run-scoped audience override: use this Klaviyo LIST name.
  --no-imagekit-watch  disable the automatic ImageKit asset watcher.
  --debug           verbose logging.

Every run resolves an EXACT calendar campaign first (by --campaign, --week, or
the soonest upcoming one) before generating — there is no generic/unresolved
generation path. No matching campaign → the run stops rather than guess.

Full live end-to-end (draft ready for review, nothing sent):
  node platform/engine/cli.js create --brand RDD --klaviyo

Write target: fixture/--dry-run → runtime/exports/<id>/ (safe sandbox);
live/snapshot → Brands/<CODE>/Campaigns/Weekly/ (governed pipeline, new Draft vN).

Scope: builds and QAs a campaign package (HTML, subject, preview, product data,
QA report) into the send's Output/. Klaviyo / campaign creation / scheduling are
intentionally OUT of MVP scope.
`);
}

// ---------------------------------------------------------------------------
// ImageKit watcher — forked as a background child so it runs in parallel
// with campaign generation and dies when the parent exits.
// ---------------------------------------------------------------------------

function startImageKitWatcher() {
  const watcherScript = path.resolve(__dirname, '../../Scripts/imagekit-watcher.js');
  const fs = require('fs');
  if (!fs.existsSync(watcherScript)) return null;

  const child = fork(watcherScript, [], {
    stdio: ['ignore', 'pipe', 'pipe', 'ipc'],
    detached: false,
  });

  child.stdout.on('data', (data) => {
    const lines = data.toString().split(/\r?\n/).filter(Boolean);
    for (const line of lines) console.log(line);
  });
  child.stderr.on('data', (data) => {
    const lines = data.toString().split(/\r?\n/).filter(Boolean);
    for (const line of lines) console.error(line);
  });

  child.on('message', (msg) => {
    if (msg.type === 'ready') {
      console.log(`[imagekit-watch] Watcher active (${msg.images} images fingerprinted).`);
    } else if (msg.type === 'skip') {
      console.log(`[imagekit-watch] ${msg.reason}`);
    } else if (msg.type === 'error') {
      console.error(`[imagekit-watch] ${msg.message}`);
    }
  });

  child.on('error', () => {});
  child.unref();
  return child;
}

function stopWatcher(child) {
  if (!child || child.killed) return;
  try { child.kill('SIGTERM'); } catch {}
}

async function main() {
  const { opts, wantsHelp, wantsCreate } = parseArgs(process.argv.slice(2));
  if (wantsHelp || !wantsCreate) {
    printHelp();
    process.exit(0);
  }
  if (String(opts.type).toLowerCase() !== 'weekly') {
    // eslint-disable-next-line no-console
    console.error(`Only "weekly" is supported in the MVP (requested "${opts.type}").`);
    process.exit(2);
  }

  const watcher = opts.imagekitWatch ? startImageKitWatcher() : null;

  try {
    const result = await createCampaign(opts);
    stopWatcher(watcher);
    process.exit(result && result.ok ? 0 : 1);
  } catch (err) {
    stopWatcher(watcher);
    throw err;
  }
}

// Run only when invoked directly (`node platform/engine/cli.js ...`) — never
// as a side effect of another module requiring this file (e.g. to reuse
// parseArgs), which would otherwise fire a REAL generation run unexpectedly.
if (require.main === module) {
  main().catch((err) => {
    // eslint-disable-next-line no-console
    console.error(err.stack || err.message);
    process.exit(1);
  });
}

module.exports = { parseArgs };
