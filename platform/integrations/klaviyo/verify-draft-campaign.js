#!/usr/bin/env node
// ---------------------------------------------------------------------------
// verify-draft-campaign.js — live DRAFT creation smoke test (T7).
//
// Runs the full workflow against the real account and creates ONE clearly-named
// DRAFT campaign, then prints its id + Klaviyo URL. It NEVER schedules and NEVER
// sends (no send-job is ever created). Re-asserts the no-send guard first.
//
// Sender resolution: uses klaviyo.sender.fromEmail from config if set, otherwise
// falls back to the ACCOUNT'S OWN default sender (read-only GET /accounts) —
// never an invented address. If neither exists, it reports the blocker and makes
// no write.
//
// Usage:  node platform/integrations/klaviyo/verify-draft-campaign.js --brand RDD [--week 2026-W33]
// ---------------------------------------------------------------------------

'use strict';

const path = require('path');
const { REPO_ROOT } = require('../../common/config');
const { loadKlaviyoConfig } = require('./config');
const { parseEnvFile, resolveVar } = require('../../common/env');
const { KlaviyoClient } = require('./client');
const { createListService } = require('./list-service');
const { createSegmentService } = require('./segment-service');
const { createDraftCampaignService } = require('./draft-campaign-service');
const { guardKlaviyoDir } = require('./safety');
const { createCalendarService } = require('../calendar/calendar-service');
const { JsonCalendarProvider } = require('../calendar/providers/json-provider');

function argValue(flag, fallback) {
  const i = process.argv.indexOf(flag);
  return i >= 0 && process.argv[i + 1] ? process.argv[i + 1] : fallback;
}

async function main() {
  guardKlaviyoDir(REPO_ROOT); // safety first — fail if any send capability exists

  const brand = String(argValue('--brand', 'RDD')).toUpperCase();
  const week = argValue('--week', null);
  const cfg = loadKlaviyoConfig(brand);

  console.log('Brand        :', cfg.brand);
  console.log('Revision     :', cfg.revision);
  console.log('API key set  :', cfg.hasApiKey ? 'yes' : 'NO');
  if (!cfg.hasApiKey) {
    console.error(`\nBLOCKED: ${cfg.apiKeyEnvVar} is not set in ${cfg.envPath}. No request made.`);
    process.exitCode = 2;
    return;
  }

  const fileEnv = parseEnvFile(cfg.envPath ? path.join(REPO_ROOT, cfg.envPath) : null);
  const apiKey = resolveVar(fileEnv, cfg.apiKeyEnvVar);
  const client = new KlaviyoClient({ apiBaseUrl: cfg.apiBaseUrl, revision: cfg.revision, apiKey });

  // Resolve the sender: config first, then the account's own default (read-only).
  let fromEmail = cfg.sender.fromEmail;
  let fromLabel = cfg.sender.fromLabel;
  let replyTo = cfg.sender.replyToEmail;
  if (!fromEmail) {
    const acct = await client.get('/accounts/');
    const ci = (acct && acct.data && acct.data[0] && acct.data[0].attributes && acct.data[0].attributes.contact_information) || {};
    fromEmail = ci.default_sender_email || null;
    fromLabel = fromLabel || ci.default_sender_name || null;
    if (fromEmail) console.log('Sender       : using account default sender (config sender is To be confirmed).');
  }
  replyTo = replyTo || fromEmail;
  console.log('From email   :', fromEmail || '(none)');
  console.log('From label   :', fromLabel || '(none)');

  if (!fromEmail) {
    console.error('\nBLOCKED: no verified sender (from_email) in config or the account default. No draft created.');
    process.exitCode = 2;
    return;
  }

  // Wire the four services.
  const calendarService = createCalendarService({ provider: new JsonCalendarProvider() });
  const listService = createListService({ client });
  const segmentService = createSegmentService({ client });
  const draftService = createDraftCampaignService({ client, calendarService, listService, segmentService, logger: console });

  console.log('\n--- creating DRAFT (never sent) ---');
  try {
    const r = await draftService.createDraftForWeek({
      brand,
      week,
      sender: { fromEmail, fromLabel, replyToEmail: replyTo },
      namePrefix: 'DEMO —',
    });
    console.log('\n✅ DRAFT CAMPAIGN CREATED (not sent):');
    console.log('  Calendar     :', r.calendarCampaignId);
    console.log('  Campaign ID  :', r.campaignId);
    console.log('  Status       :', r.status);
    console.log('  Name         :', r.name);
    console.log('  Subject      :', r.subject);
    console.log('  Preview      :', r.previewText);
    console.log('  Audience     :', [r.audience.list && `list:${r.audience.list.name} (${r.audience.list.id})`, r.audience.segment && `segment:${r.audience.segment.name} (${r.audience.segment.id})`].filter(Boolean).join(' + '));
    console.log('  Send status  :', r.sendStatus);
    console.log('  Klaviyo URL  :', r.url);
    console.log('\n  (Review it in Klaviyo. It has NO template/HTML yet — that is the next sprint. Delete this DEMO draft when done.)');
    process.exitCode = 0;
  } catch (err) {
    console.error(`\nDRAFT creation FAILED: ${err.name}: ${err.message}`);
    process.exitCode = 1;
  }
}

// exitCode + drain (never process.exit() — avoids the libuv teardown assertion).
main().catch((err) => {
  console.error(err.stack || err.message);
  process.exitCode = 1;
});
