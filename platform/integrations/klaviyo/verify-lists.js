#!/usr/bin/env node
// ---------------------------------------------------------------------------
// verify-lists.js — live List Service smoke test (T5, read-only diagnostic).
//
// Retrieves the real Klaviyo Lists for a brand and prints id + name, so we can
// confirm the read-only List Service works end-to-end and see which list to use
// as the audience (klaviyo.audience) in a later sprint. It creates nothing,
// writes nothing, sends nothing, and never prints the API key.
//
// Before any network call it re-asserts the no-send safety guard over the
// Klaviyo source tree (reuse of safety.js).
//
// Usage:  node platform/integrations/klaviyo/verify-lists.js --brand RDD
// ---------------------------------------------------------------------------

'use strict';

const path = require('path');
const { REPO_ROOT } = require('../../common/config');
const { loadKlaviyoConfig } = require('./config');
const { parseEnvFile, resolveVar } = require('../../common/env');
const { KlaviyoClient } = require('./client');
const { createListService } = require('./list-service');
const { guardKlaviyoDir } = require('./safety');

function argValue(flag, fallback) {
  const i = process.argv.indexOf(flag);
  return i >= 0 && process.argv[i + 1] ? process.argv[i + 1] : fallback;
}

async function main() {
  // Safety first: fail loudly if any send capability has crept into the tree.
  guardKlaviyoDir(REPO_ROOT);

  const brand = String(argValue('--brand', 'RDD')).toUpperCase();
  const cfg = loadKlaviyoConfig(brand);

  console.log('Brand        :', cfg.brand);
  console.log('API base     :', cfg.apiBaseUrl);
  console.log('Revision     :', cfg.revision);
  console.log('API key set  :', cfg.hasApiKey ? 'yes' : 'NO');

  if (!cfg.hasApiKey) {
    console.error(
      `\nBLOCKED: ${cfg.apiKeyEnvVar} is not set in ${cfg.envPath || 'the brand .env'}. No request was made.`
    );
    process.exitCode = 2;
    return;
  }

  const fileEnv = parseEnvFile(cfg.envPath ? path.join(REPO_ROOT, cfg.envPath) : null);
  const apiKey = resolveVar(fileEnv, cfg.apiKeyEnvVar);
  const client = new KlaviyoClient({ apiBaseUrl: cfg.apiBaseUrl, revision: cfg.revision, apiKey });
  const lists = createListService({ client });

  console.log('\nRequesting: GET /lists/  (read-only)…');
  try {
    const all = await lists.listAll();
    console.log(`\nRetrieved ${all.length} list(s):\n`);
    for (const l of all) console.log(`  • ${l.id}  ${l.name}`);

    // If an audience is configured, report whether it resolves (still read-only).
    if (cfg.audience && (cfg.audience.id || cfg.audience.name)) {
      const v = await lists.validateConfiguredList(cfg.audience);
      console.log('\nConfigured audience:', v.ok ? `OK → ${v.list.id} (${v.list.name})` : `NOT FOUND — ${v.reason}`);
    } else {
      console.log('\nConfigured audience: none set yet (klaviyo.audience is To be confirmed).');
    }
    process.exitCode = 0;
  } catch (err) {
    console.error(`\nList retrieval FAILED: ${err.message}`);
    process.exitCode = 1;
  }
}

// Set exitCode and let the event loop drain (never process.exit() — avoids the
// libuv teardown assertion while the fetch socket is closing).
main().catch((err) => {
  console.error(err.stack || err.message);
  process.exitCode = 1;
});
