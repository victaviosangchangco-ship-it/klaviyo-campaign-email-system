#!/usr/bin/env node
// ---------------------------------------------------------------------------
// verify-connectivity.js — Klaviyo connectivity smoke test (T4, diagnostic only).
//
// Mirrors the BigCommerce verify.py pattern: a READ-ONLY check that the
// configured private key can reach the Klaviyo API and that the pinned revision
// is accepted. It creates nothing, uploads nothing, and sends nothing.
//
// It NEVER prints the API key. If no key is configured it reports the blocker
// and exits without making a request.
//
// Usage:  node platform/integrations/klaviyo/verify-connectivity.js --brand RDD
// ---------------------------------------------------------------------------

'use strict';

const path = require('path');
const { REPO_ROOT } = require('../../common/config');
const { loadKlaviyoConfig } = require('./config');
const { parseEnvFile, resolveVar } = require('../../common/env');
const { KlaviyoClient } = require('./client');

function argValue(flag, fallback) {
  const i = process.argv.indexOf(flag);
  return i >= 0 && process.argv[i + 1] ? process.argv[i + 1] : fallback;
}

async function main() {
  const brand = String(argValue('--brand', 'RDD')).toUpperCase();
  const cfg = loadKlaviyoConfig(brand);

  console.log('Brand        :', cfg.brand);
  console.log('API base     :', cfg.apiBaseUrl);
  console.log('Revision     :', cfg.revision);
  console.log('API key set  :', cfg.hasApiKey ? 'yes' : 'NO');

  if (!cfg.hasApiKey) {
    console.error(
      `\nBLOCKED: ${cfg.apiKeyEnvVar} is not set in ${cfg.envPath || 'the brand .env'}.\n` +
        `Add it (see Brands/RDD/integration/.env.example), then re-run. No request was made.`
    );
    process.exitCode = 2;
    return;
  }

  // Resolve the actual key here (the config loader intentionally never returns it).
  const fileEnv = parseEnvFile(cfg.envPath ? path.join(REPO_ROOT, cfg.envPath) : null);
  const apiKey = resolveVar(fileEnv, cfg.apiKeyEnvVar);

  const client = new KlaviyoClient({ apiBaseUrl: cfg.apiBaseUrl, revision: cfg.revision, apiKey });

  console.log('\nRequesting: GET /accounts/  (read-only)…');
  try {
    const result = await client.verifyConnectivity();
    console.log('\nConnectivity OK — read-only account access confirmed.');
    console.log('  Account ID   :', result.accountId);
    console.log('  Account Name :', result.accountName || '(not provided by API)');
    console.log('  Test account :', result.testAccount === null ? '(unknown)' : result.testAccount);
    console.log('  API Revision :', result.revision, '(accepted)');
    if (cfg.account.idHint && result.accountId && cfg.account.idHint !== result.accountId) {
      console.warn(`WARNING: account id ${result.accountId} does not match the configured hint ${cfg.account.idHint}.`);
    }
    process.exitCode = 0;
  } catch (err) {
    console.error(`\nConnectivity FAILED: ${err.message}`);
    process.exitCode = 1;
  }
}

// Set exitCode and let the event loop drain naturally — never call process.exit()
// here. Forcing exit while the fetch keep-alive socket is still closing triggers a
// libuv assertion (UV_HANDLE_CLOSING) on Windows/Node. Draining exits cleanly.
main().catch((err) => {
  console.error(err.stack || err.message);
  process.exitCode = 1;
});
