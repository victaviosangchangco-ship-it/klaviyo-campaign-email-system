#!/usr/bin/env node
// ---------------------------------------------------------------------------
// verify-segments.js — live Segment Service smoke test (T6, read-only diagnostic).
//
// Retrieves the real Klaviyo Segments for a brand and prints id + name + active
// state, so we can confirm the read-only Segment Service works end-to-end and
// choose a demo audience later. Creates nothing, writes nothing, sends nothing,
// and never prints the API key. Re-asserts the no-send guard before any call.
//
// Usage:  node platform/integrations/klaviyo/verify-segments.js --brand RDD
// ---------------------------------------------------------------------------

'use strict';

const path = require('path');
const { REPO_ROOT } = require('../../common/config');
const { loadKlaviyoConfig } = require('./config');
const { parseEnvFile, resolveVar } = require('../../common/env');
const { KlaviyoClient } = require('./client');
const { createSegmentService } = require('./segment-service');
const { guardKlaviyoDir } = require('./safety');

function argValue(flag, fallback) {
  const i = process.argv.indexOf(flag);
  return i >= 0 && process.argv[i + 1] ? process.argv[i + 1] : fallback;
}

async function main() {
  guardKlaviyoDir(REPO_ROOT); // safety first

  const brand = String(argValue('--brand', 'RDD')).toUpperCase();
  const cfg = loadKlaviyoConfig(brand);

  console.log('Brand        :', cfg.brand);
  console.log('API base     :', cfg.apiBaseUrl);
  console.log('Revision     :', cfg.revision);
  console.log('API key set  :', cfg.hasApiKey ? 'yes' : 'NO');

  if (!cfg.hasApiKey) {
    console.error(`\nBLOCKED: ${cfg.apiKeyEnvVar} is not set in ${cfg.envPath || 'the brand .env'}. No request was made.`);
    process.exitCode = 2;
    return;
  }

  const fileEnv = parseEnvFile(cfg.envPath ? path.join(REPO_ROOT, cfg.envPath) : null);
  const apiKey = resolveVar(fileEnv, cfg.apiKeyEnvVar);
  const client = new KlaviyoClient({ apiBaseUrl: cfg.apiBaseUrl, revision: cfg.revision, apiKey });
  const segments = createSegmentService({ client });

  console.log('\nRequesting: GET /segments/  (read-only)…');
  try {
    const all = await segments.listAll();
    console.log(`\nRetrieved ${all.length} segment(s):\n`);
    for (const s of all) {
      const flags = [s.isActive === false ? 'inactive' : null, s.isProcessing ? 'processing' : null].filter(Boolean).join(', ');
      console.log(`  • ${s.id}  ${s.name}${flags ? `  [${flags}]` : ''}`);
    }
    if (cfg.audience && cfg.audience.type === 'segment' && (cfg.audience.id || cfg.audience.name)) {
      const v = await segments.validateConfiguredSegment(cfg.audience);
      console.log('\nConfigured segment:', v.ok ? `OK → ${v.segment.id} (${v.segment.name})` : `NOT FOUND — ${v.reason}`);
    } else {
      console.log('\nConfigured segment: none set (klaviyo.audience is not a segment / To be confirmed).');
    }
    process.exitCode = 0;
  } catch (err) {
    console.error(`\nSegment retrieval FAILED: ${err.message}`);
    process.exitCode = 1;
  }
}

// exitCode + drain (never process.exit() — avoids the libuv teardown assertion).
main().catch((err) => {
  console.error(err.stack || err.message);
  process.exitCode = 1;
});
