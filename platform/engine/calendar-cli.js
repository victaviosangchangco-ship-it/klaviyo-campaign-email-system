#!/usr/bin/env node
// ---------------------------------------------------------------------------
// calendar-cli.js — guarded Lark Campaign Calendar UPDATE command.
//
// DRY RUN IS THE DEFAULT. Without --write it reads the record, prints the exact
// CURRENT → PROPOSED change set, and writes NOTHING. Only --write performs the
// Lark update, and it always re-reads and verifies the result afterwards.
//
//   node platform/engine/calendar-cli.js update --brand RDD --campaign RDD-2026-37 \
//        --set status=planned --set notes="theme confirmed" [--reason "..."] [--write]
//
//   node platform/engine/calendar-cli.js update --brand SS --record-id recXX:updates by record id
//
// Flags:
//   --brand <CODE>        required. Resolves that brand's calendar only.
//   --campaign <id>       target campaign_id (e.g. RDD-2026-37), OR
//   --record-id <id>      target Lark record id directly.
//   --set field=value     repeatable. Only Campaign Calendar fields are allowed;
//                         scheduled_date takes YYYY-MM-DD.
//   --reason "<text>"     recorded on the plan (audit trail).
//   --write               ACTUALLY write. Omit for a dry run (the default).
//
// SAFETY: never deletes; never writes an unknown/cross-brand field or record;
// never touches another brand's Base; never sends or schedules anything in
// Klaviyo. Secrets are never printed.
// ---------------------------------------------------------------------------

'use strict';

const { createCalendarUpdater } = require('../integrations/lark/calendar-update-service');
const { ApprovalRequired } = require('../common/errors');

function parseArgs(argv) {
  const o = { set: {}, write: false };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === 'update' || a === 'help' || a === '--help' || a === '-h') {
      o.command = a === 'update' ? 'update' : 'help';
    } else if (a === '--brand') o.brand = argv[++i];
    else if (a === '--campaign') o.campaign = argv[++i];
    else if (a === '--record-id') o.recordId = argv[++i];
    else if (a === '--reason') o.reason = argv[++i];
    else if (a === '--write') o.write = true;
    else if (a === '--set') {
      const kv = argv[++i] || '';
      const eq = kv.indexOf('=');
      if (eq < 0) throw new Error(`--set expects field=value, got "${kv}"`);
      o.set[kv.slice(0, eq).trim()] = kv.slice(eq + 1);
    }
  }
  return o;
}

function printHelp() {
  console.log(`Usage:
  node platform/engine/calendar-cli.js update --brand <CODE> (--campaign <id> | --record-id <id>) --set field=value [...] [--reason "..."] [--write]

DRY RUN is the default (no --write): prints CURRENT -> PROPOSED and writes nothing.
Only --write performs the Lark update, then re-reads and verifies it.
Never deletes, never writes cross-brand or unknown fields, never sends in Klaviyo.`);
}

async function main() {
  const o = parseArgs(process.argv.slice(2));
  if (!o.command || o.command === 'help') { printHelp(); return; }

  if (!o.brand) { console.error('ERROR: --brand is required.'); process.exitCode = 2; return; }
  if (!o.campaign && !o.recordId) { console.error('ERROR: --campaign <id> or --record-id <id> is required.'); process.exitCode = 2; return; }
  if (!Object.keys(o.set).length) { console.error('ERROR: at least one --set field=value is required.'); process.exitCode = 2; return; }

  const updater = createCalendarUpdater({ brand: o.brand });

  // READ → VALIDATE → PLAN (dry-run; no write)
  const planned = await updater.planUpdate({
    campaignId: o.campaign || null,
    recordId: o.recordId || null,
    set: o.set,
    reason: o.reason || null,
  });

  console.log(`\nCampaign Calendar update — brand ${planned.brand}`);
  console.log(`Record ${planned.record.recordId}  (campaign ${planned.record.campaignId})`);
  console.log('─'.repeat(60));
  for (const c of planned.changes) {
    const flag = c.unchanged ? '  (no change)' : '';
    console.log(`  ${c.field}`);
    console.log(`      CURRENT  : ${c.current == null ? '(empty)' : c.current}`);
    console.log(`      PROPOSED : ${c.proposed == null ? '(empty)' : c.proposed}${flag}`);
  }
  console.log('─'.repeat(60));

  if (!planned.plan.ok) {
    console.error('PLAN INVALID — refusing to write:');
    for (const e of planned.plan.errors) console.error('  •', JSON.stringify(e));
    process.exitCode = 1;
    return;
  }

  if (!o.write) {
    console.log('DRY RUN — nothing was written. Re-run with --write to apply.\n');
    return;
  }

  // WRITE → RE-READ → VERIFY
  console.log('Writing to Lark…');
  const { verify, ok } = await updater.apply({ plan: planned.plan, confirm: true });
  if (ok) {
    console.log(`WRITE VERIFIED — ${verify.verified} field(s) confirmed in a re-read of the record.\n`);
  } else {
    console.error(`WRITE VERIFICATION FAILED — ${verify.mismatches.length} field(s) did not match after re-read:`);
    for (const m of verify.mismatches) {
      console.error(`  • ${m.field}: requested ${JSON.stringify(m.requested)} but Base has ${JSON.stringify(m.actual)}`);
    }
    process.exitCode = 1;
  }
}

// Drain the event loop naturally (never process.exit while a keep-alive socket
// is closing). ApprovalRequired / ConfigError surface as a clean message.
main().catch((err) => {
  if (err instanceof ApprovalRequired) console.error(`STOP: ${err.message}`);
  else console.error(`ERROR: ${err.message}`);
  process.exitCode = 1;
});

module.exports = { parseArgs };
