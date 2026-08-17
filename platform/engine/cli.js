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

const KNOWN_BRANDS = ['RDD', 'SS', 'SC', 'STACK'];

function parseArgs(argv) {
  const opts = { brand: 'RDD', type: 'weekly', source: 'live', fixturePath: null, verifyLinks: false, debug: false };
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
    else if (a === '--segment') opts.segment = argv[++i];
    else if (a === '--list') opts.list = argv[++i];
    else if (a === '--debug') opts.debug = true;
    else if (a === 'create' || a === 'help' || a === '--help' || a === '-h') positional.push(a);
    else positional.push(a);
  }

  // Natural-phrase support: detect a brand token anywhere in the free text.
  const phrase = positional.join(' ').toUpperCase();
  const brandFromPhrase = KNOWN_BRANDS.find((b) => new RegExp(`\\b${b}\\b`).test(phrase));
  if (brandFromPhrase && !argv.includes('--brand')) opts.brand = brandFromPhrase;

  const wantsHelp = positional.some((p) => p === 'help' || p === '--help' || p === '-h');
  const wantsCreate = positional.some((p) => /create/i.test(p)) || positional.length === 0;

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
  --calendar <src>  json (default) = generated runtime calendar (XLSX import);
                    lark = read the brand's calendar LIVE from the Lark Base API
                    (read-only). Applies to --klaviyo runs.
  --segment <name>  run-scoped audience override: use this Klaviyo SEGMENT name
                    instead of the calendar's (does NOT edit the calendar/XLSX).
  --list <name>     run-scoped audience override: use this Klaviyo LIST name.
  --debug           verbose logging.

Full live end-to-end (draft ready for review, nothing sent):
  node platform/engine/cli.js create --brand RDD --klaviyo

Write target: fixture/--dry-run → runtime/exports/<id>/ (safe sandbox);
live/snapshot → Brands/<CODE>/Campaigns/Weekly/ (governed pipeline, new Draft vN).

Scope: builds and QAs a campaign package (HTML, subject, preview, product data,
QA report) into the send's Output/. Klaviyo / campaign creation / scheduling are
intentionally OUT of MVP scope.
`);
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
  const result = await createCampaign(opts);
  process.exit(result && result.ok ? 0 : 1);
}

main().catch((err) => {
  // eslint-disable-next-line no-console
  console.error(err.stack || err.message);
  process.exit(1);
});
