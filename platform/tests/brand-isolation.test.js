// Brand-isolation tests (multi-brand Klaviyo extension). Offline, no network.
//
// Proves the credential mechanism keeps RDD / SS / SC strictly separate:
//   - each brand resolves its OWN, distinctly-named key env var (a single stray
//     global var can never satisfy more than one brand — cross-brand protection);
//   - a brand whose var is absent reports NO key (fail-safe), even when ANOTHER
//     brand's var IS present;
//   - the resolved key value is never exposed on the returned config object;
//   - the live orchestrator refuses to reach Klaviyo when a brand has no key.
//
// The resolution tests point loadKlaviyoConfig at a TEMP repoRoot containing
// fake .env files, so they never read (or print) the real brand keys on disk.

'use strict';

const { test } = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const os = require('os');
const path = require('path');

const { loadKlaviyoConfig } = require('../integrations/klaviyo/config');
const { runLiveCampaign } = require('../workflow/live-orchestrator');
const { ApprovalRequired } = require('../common/errors');

// A temp repo whose Brands/<CODE>/.env files we control. loadBrandConfig always
// reads the REAL config/brands/<CODE>.config.json (which declares the env var
// name + relative envPath); loadKlaviyoConfig joins that envPath against the
// repoRoot we pass here — so this swaps ONLY the secret files, not the config.
function tempRepoWith(envFiles) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'brand-iso-'));
  for (const [rel, contents] of Object.entries(envFiles)) {
    const abs = path.join(root, rel);
    fs.mkdirSync(path.dirname(abs), { recursive: true });
    fs.writeFileSync(abs, contents);
  }
  return root;
}

// Guard: these tests assume no real brand key is injected via process.env.
function withCleanProcessEnv(fn) {
  const saved = {};
  for (const k of ['KLAVIYO_API_KEY', 'SS_KLAVIYO_API_KEY', 'SC_KLAVIYO_API_KEY']) {
    saved[k] = process.env[k];
    delete process.env[k];
  }
  try {
    return fn();
  } finally {
    for (const [k, v] of Object.entries(saved)) if (v !== undefined) process.env[k] = v;
  }
}

test('each brand declares a DISTINCT key env var (a global var cannot satisfy two brands)', () => {
  const names = ['RDD', 'SS', 'SC'].map((b) => loadKlaviyoConfig(b).apiKeyEnvVar);
  assert.deepStrictEqual(names, ['KLAVIYO_API_KEY', 'SS_KLAVIYO_API_KEY', 'SC_KLAVIYO_API_KEY']);
  assert.strictEqual(new Set(names).size, 3, 'the three brand key env vars must be pairwise distinct');
});

test('each brand resolves its OWN key from its OWN .env (fake keys, temp repo)', () => {
  withCleanProcessEnv(() => {
    const root = tempRepoWith({
      'Brands/RDD/.env': 'KLAVIYO_API_KEY: pk_fake_rdd\n',
      'Brands/SS/.env': 'SS_KLAVIYO_API_KEY: pk_fake_ss\n',
      'Brands/SC/.env': 'SC_KLAVIYO_API_KEY: pk_fake_sc\n',
    });
    for (const b of ['RDD', 'SS', 'SC']) {
      assert.strictEqual(loadKlaviyoConfig(b, { repoRoot: root }).hasApiKey, true, `${b} should see its own key`);
    }
  });
});

test('cross-brand protection: SS reads NO key when only SC/RDD vars are present', () => {
  withCleanProcessEnv(() => {
    // SS's own .env is empty of the SS var; the OTHER brands' vars are present.
    const root = tempRepoWith({
      'Brands/RDD/.env': 'KLAVIYO_API_KEY: pk_fake_rdd\n',
      'Brands/SS/.env': '# no SS key here\nSC_KLAVIYO_API_KEY: pk_fake_sc\n',
      'Brands/SC/.env': 'SC_KLAVIYO_API_KEY: pk_fake_sc\n',
    });
    const ss = loadKlaviyoConfig('SS', { repoRoot: root });
    assert.strictEqual(ss.hasApiKey, false, 'SS must NOT resolve a key from another brand\'s var');
    assert.ok(ss.pending.includes('env:SS_KLAVIYO_API_KEY'), 'SS reports its own missing key');
  });
});

test('missing-credentials fail-safe: no key → config reports pending, not a fabricated key', () => {
  withCleanProcessEnv(() => {
    const root = tempRepoWith({ 'Brands/SS/.env': '# intentionally empty\n' });
    const ss = loadKlaviyoConfig('SS', { repoRoot: root });
    assert.strictEqual(ss.hasApiKey, false);
    assert.strictEqual(ss.ready.forDraft, false);
    assert.strictEqual(/pk_/.test(JSON.stringify(ss)), false);
  });
});

test('orchestrator refuses to touch Klaviyo when a brand has no key (ApprovalRequired)', async () => {
  const ctx = {
    repoRoot: process.cwd(),
    brand: { code: 'SS', identity: { displayName: { value: 'Safety Sector' } } },
    platformConfig: {}, calendarConfig: {}, logger: null,
    options: {}, runId: 't', generatedAt: 't',
  };
  // Inject a config with hasApiKey:false and NO client → the orchestrator must
  // stop before building any service or reaching the network.
  const deps = {
    skipGuard: true,
    klaviyoConfig: { hasApiKey: false, apiKeyEnvVar: 'SS_KLAVIYO_API_KEY', envPath: 'Brands/SS/.env', sender: {} },
  };
  await assert.rejects(() => runLiveCampaign(ctx, deps), ApprovalRequired);
});
