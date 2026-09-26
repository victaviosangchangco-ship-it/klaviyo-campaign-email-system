// ---------------------------------------------------------------------------
// import-xlsx.js — convert the exported Lark Base calendar (XLSX) into the
// generated runtime calendar JSON the Content Calendar Service reads.
//
//   Calendar Campaign/RDD Campaign Calendar.xlsx   (human source, replaced on export)
//        │  npm run calendar:import
//        ▼
//   config/campaign-calendar.generated.json        ({ campaigns:[…] } shape)
//
// This is a DEV-TIME tool. It is the ONLY place the `xlsx` devDependency is
// required — the runtime engine never loads it. Read-only against the XLSX; it
// only writes the generated JSON. Idempotent: same input → same campaigns.
//
// The pure field map + row filters live in ./xlsx-mapping.js (unit-tested
// without the xlsx library). This file owns workbook reading, the summary, and
// the file write.
// ---------------------------------------------------------------------------

'use strict';

const fs = require('fs');
const path = require('path');
const XLSX = require('xlsx');

const { REPO_ROOT } = require('../../../common/config');
const { ConfigError } = require('../../../common/errors');
const mapping = require('./xlsx-mapping');

const DEFAULT_INPUT = path.join(REPO_ROOT, 'Calendar Campaign', 'RDD Campaign Calendar.xlsx');
const DEFAULT_OUTPUT = path.join(REPO_ROOT, 'config', 'campaign-calendar.generated.json');
const CADENCE_DEFAULTS_PATH = path.join(REPO_ROOT, 'config', 'cadence-defaults.json');

function loadCadenceDefaults() {
  if (!fs.existsSync(CADENCE_DEFAULTS_PATH)) return {};
  const raw = JSON.parse(fs.readFileSync(CADENCE_DEFAULTS_PATH, 'utf8'));
  return raw.defaults || {};
}

// Read the worksheet as an array-of-arrays with RAW values (date cells come back
// as Excel serial numbers, which xlsx-mapping.toIsoDate converts timezone-safely).
function readSheetRows(inputPath, sheetName) {
  if (!fs.existsSync(inputPath)) {
    throw new ConfigError(`Calendar XLSX not found: ${inputPath}`, { path: inputPath });
  }
  const wb = XLSX.read(fs.readFileSync(inputPath), { type: 'buffer', cellDates: false });
  const ws = wb.Sheets[sheetName];
  if (!ws) {
    throw new ConfigError(
      `Worksheet "${sheetName}" not found in ${path.basename(inputPath)}. Sheets: ${wb.SheetNames.join(', ')}.`,
      { sheet: sheetName, available: wb.SheetNames }
    );
  }
  // header:1 → array-of-arrays; raw:true → numbers/serials, not formatted strings.
  return XLSX.utils.sheet_to_json(ws, { header: 1, raw: true, blankrows: false, defval: null });
}

// Build a header-name → column-index map and validate the expected columns exist.
function indexHeaders(headerRow) {
  const idx = {};
  (headerRow || []).forEach((name, i) => {
    const key = name == null ? '' : String(name).trim();
    if (key) idx[key] = i;
  });
  const missing = mapping.EXPECTED_HEADERS.filter((h) => !(h in idx));
  if (missing.length) {
    throw new ConfigError(
      `Calendar XLSX is missing expected column(s): ${missing.join(', ')}. ` +
        `Found: ${Object.keys(idx).join(', ')}. Re-export the calendar from Lark.`,
      { missing }
    );
  }
  return idx;
}

// Core, testable: read a workbook file → normalized calendar object + summary.
// opts: { inputPath?, outputPath?, write? (default true), logger? }
function importCalendar(opts = {}) {
  const inputPath = opts.inputPath || DEFAULT_INPUT;
  const outputPath = opts.outputPath || DEFAULT_OUTPUT;
  const write = opts.write !== false;

  const rows = readSheetRows(inputPath, mapping.SHEET_NAME);
  if (!rows.length) throw new ConfigError(`Calendar XLSX "${mapping.SHEET_NAME}" sheet is empty.`);

  const headerIdx = indexHeaders(rows[0]);
  const dataRows = rows.slice(1);

  const campaigns = [];
  const skipped = [];
  const skipReasons = {};

  for (const row of dataRows) {
    const get = (name) => {
      const i = headerIdx[name];
      return i == null ? null : (row[i] === undefined ? null : row[i]);
    };
    // A wholly-empty array-of-arrays row (all null) → silent structural skip.
    const allEmpty = mapping.EXPECTED_HEADERS.every((h) => {
      const v = get(h);
      return v == null || (typeof v === 'string' && v.trim() === '');
    });
    if (allEmpty) {
      skipReasons['blank row'] = (skipReasons['blank row'] || 0) + 1;
      skipped.push({ campaign_id: null, reason: 'blank row' });
      continue;
    }

    const reason = mapping.classifyRow(get);
    if (reason) {
      skipReasons[reason] = (skipReasons[reason] || 0) + 1;
      skipped.push({ campaign_id: mapping.str(get('campaign_id')), reason });
      continue;
    }
    campaigns.push(mapping.mapRow(get));
  }

  // Backfill cadence from cadence-defaults.json for plain-numeric-ID campaigns
  // where cadenceFromId() returned null (no structural type token in the ID).
  const cadenceDefaults = loadCadenceDefaults();
  for (const c of campaigns) {
    if (!c.cadence && c.campaign_id && cadenceDefaults[c.campaign_id]) {
      c.cadence = cadenceDefaults[c.campaign_id];
    }
  }

  // Deterministic order: by send_date then campaign_id (stable across re-imports).
  campaigns.sort((a, b) => {
    if (a.send_date !== b.send_date) return String(a.send_date).localeCompare(String(b.send_date));
    return String(a.campaign_id).localeCompare(String(b.campaign_id));
  });

  const relSource = path.relative(REPO_ROOT, inputPath).split(path.sep).join('/');
  const doc = {
    _doc:
      'GENERATED runtime calendar — do not edit by hand. Produced from the exported Lark Base ' +
      'calendar by `npm run calendar:import`. Same {campaigns:[…]} shape the Content Calendar ' +
      'Service reads. config/content-calendar.json is a separate, hand-authored file and is untouched.',
    _generatedFrom: relSource,
    _generatedAt: new Date().toISOString(),
    _importer: 'platform/integrations/calendar/import/import-xlsx.js',
    _counts: { read: dataRows.length, written: campaigns.length, skipped: skipped.length },
    campaigns,
  };

  if (write) {
    fs.writeFileSync(outputPath, `${JSON.stringify(doc, null, 2)}\n`, 'utf8');
  }

  return {
    doc,
    outputPath,
    inputPath,
    summary: { read: dataRows.length, written: campaigns.length, skipped: skipped.length, skipReasons },
    skipped,
  };
}

// ── CLI ────────────────────────────────────────────────────────────────────
function parseCliArgs(argv) {
  const opts = {};
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--in' || a === '--input') opts.inputPath = argv[++i];
    else if (a === '--out' || a === '--output') opts.outputPath = argv[++i];
  }
  return opts;
}

function printSummary(result) {
  const { summary, inputPath, outputPath } = result;
  const rel = (p) => path.relative(REPO_ROOT, p).split(path.sep).join('/');
  /* eslint-disable no-console */
  console.log('\n──────────────────────────────────────────────────────────────');
  console.log(' ✔ CALENDAR IMPORT — Lark XLSX → generated runtime JSON');
  console.log('──────────────────────────────────────────────────────────────');
  console.log(`  Source     : ${rel(inputPath)}`);
  console.log(`  Output     : ${rel(outputPath)}`);
  console.log(`  Rows read  : ${summary.read}`);
  console.log(`  Written    : ${summary.written}  (email campaigns)`);
  console.log(`  Skipped    : ${summary.skipped}`);
  const reasons = Object.entries(summary.skipReasons);
  if (reasons.length) {
    console.log('  Skip reasons:');
    for (const [reason, n] of reasons.sort((a, b) => b[1] - a[1])) {
      console.log(`     • ${n.toString().padStart(3)} × ${reason}`);
    }
  }
  console.log('──────────────────────────────────────────────────────────────\n');
  /* eslint-enable no-console */
}

function main() {
  const result = importCalendar(parseCliArgs(process.argv.slice(2)));
  printSummary(result);
}

if (require.main === module) {
  try {
    main();
  } catch (err) {
    /* eslint-disable no-console */
    console.error(`\n✗ CALENDAR IMPORT FAILED — ${err.name || 'Error'}: ${err.message}\n`);
    /* eslint-enable no-console */
    process.exit(1);
  }
}

module.exports = { importCalendar, DEFAULT_INPUT, DEFAULT_OUTPUT, readSheetRows, indexHeaders };
