#!/usr/bin/env node
// ---------------------------------------------------------------------------
// publish-assets.js — Phase 1 asset publishing + isolation validator.
//
// Copies an APPROVED image into a brand's public publish folder (hosting/<brand>/)
// and validates that a publish folder contains ONLY that brand's approved public
// images — never source, config, docs, .env, credentials, or another brand's
// assets. This is the controlled, allow-list gate in front of the per-brand Vercel
// static hosts (see hosting/README.md).
//
// It is a STANDALONE tool. It is NOT wired into campaign generation (that is a
// later, separately-approved phase). It never touches Klaviyo, Cloudinary,
// BigCommerce, the network, or existing campaign HTML.
//
// Usage:
//   node Scripts/publish-assets.js validate [BRAND]         # validate one or all
//   node Scripts/publish-assets.js publish --brand SS --src <path> [--subdir weekly] [--name x.jpg]
//   node Scripts/publish-assets.js selftest                 # offline isolation proofs (temp dir)
// ---------------------------------------------------------------------------

'use strict';

const fs = require('fs');
const path = require('path');
const os = require('os');

const REPO_ROOT = path.resolve(__dirname, '..');
const BRANDS = ['RDD', 'SS', 'SC'];
const IMAGE_EXTS = new Set(['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg', '.avif']);
// Infra files that are allowed to live in a publish folder alongside images.
const ALLOWED_INFRA = new Set(['vercel.json', '.gitkeep']);

function brandDirName(brand) {
  const up = String(brand || '').toUpperCase();
  if (!BRANDS.includes(up)) throw new Error(`Unknown brand "${brand}". Expected one of ${BRANDS.join(', ')}.`);
  return up.toLowerCase();
}
function hostingDir(brand, repoRoot = REPO_ROOT) {
  return path.join(repoRoot, 'hosting', brandDirName(brand));
}
function isImage(name) {
  return IMAGE_EXTS.has(path.extname(name).toLowerCase());
}

// Make a filename URL-safe. Already-clean names (no spaces/odd chars) are kept
// verbatim so versioned campaign names like SS-2026-W32-hero-banner.jpg survive;
// messy names are slugified. Extension is lowercased.
function slugifyAssetName(name) {
  const ext = path.extname(name).toLowerCase();
  let base = path.basename(name, path.extname(name));
  if (!/^[A-Za-z0-9._-]+$/.test(base)) {
    base = base.toLowerCase().replace(/[^a-z0-9._-]+/g, '-').replace(/-+/g, '-').replace(/^[-.]+|[-.]+$/g, '');
  }
  if (!base) throw new Error(`Asset name "${name}" reduces to an empty base name.`);
  return base + ext;
}

// If a source path lives under Brands/<X>/, return that brand code (upper), else null.
function brandOfSourcePath(src) {
  const m = String(src).replace(/\\/g, '/').match(/(?:^|\/)Brands\/([^/]+)\//i);
  return m ? m[1].toUpperCase() : null;
}

// Copy ONE approved image into hosting/<brand>/[subdir]/. Enforces: image-only,
// no cross-brand source, no path traversal. Returns { dest, relPath }.
function publishAsset({ brand, src, subdir = '', name = null, repoRoot = REPO_ROOT } = {}) {
  const dir = hostingDir(brand, repoRoot);
  const brandUp = String(brand).toUpperCase();

  if (!src || !fs.existsSync(src) || !fs.statSync(src).isFile()) {
    throw new Error(`Source image not found: ${src}`);
  }
  if (!isImage(src)) {
    throw new Error(`Refusing to publish non-image "${path.basename(src)}" — only ${[...IMAGE_EXTS].join(', ')} are allowed.`);
  }
  // Cross-brand protection: a source under Brands/<X>/ must match the target brand.
  const srcBrand = brandOfSourcePath(src);
  if (srcBrand && srcBrand !== brandUp) {
    throw new Error(`Cross-brand publish blocked: source belongs to ${srcBrand} but target is ${brandUp}. Never copy one brand's asset into another's host.`);
  }
  // Subdir must be relative and stay inside the brand dir (no traversal).
  const safeSub = String(subdir || '').replace(/\\/g, '/').replace(/^\/+/, '');
  if (safeSub.split('/').some((seg) => seg === '..')) {
    throw new Error(`Unsafe subdir "${subdir}".`);
  }
  const safeName = slugifyAssetName(name || path.basename(src));
  const destDir = path.join(dir, safeSub);
  const dest = path.join(destDir, safeName);
  const rel = path.relative(dir, dest);
  if (rel.startsWith('..') || path.isAbsolute(rel)) {
    throw new Error(`Resolved destination escapes hosting/${brandDirName(brand)} (${rel}).`);
  }
  fs.mkdirSync(destDir, { recursive: true });
  fs.copyFileSync(src, dest);
  return { dest, relPath: rel.replace(/\\/g, '/') };
}

// Validate a brand's publish folder. Returns { ok, brand, files, violations }.
function validateHostingDir({ brand, repoRoot = REPO_ROOT } = {}) {
  const dir = hostingDir(brand, repoRoot);
  const brandUp = String(brand).toUpperCase();
  const otherBrands = BRANDS.filter((b) => b !== brandUp);
  const violations = [];
  const files = [];

  if (!fs.existsSync(dir)) return { ok: false, brand: brandUp, files, violations: [`missing hosting dir: ${dir}`] };

  const walk = (d) => {
    for (const entry of fs.readdirSync(d, { withFileTypes: true })) {
      const full = path.join(d, entry.name);
      if (entry.isDirectory()) { walk(full); continue; }
      const rel = path.relative(dir, full).replace(/\\/g, '/');
      files.push(rel);
      const base = entry.name;
      // 1) allow-list: images + explicit infra files only.
      if (!isImage(base) && !ALLOWED_INFRA.has(base)) {
        violations.push(`non-image / disallowed file: ${rel}`);
      }
      // 2) never a secret / dotfile (except .gitkeep).
      if (base.startsWith('.') && base !== '.gitkeep') {
        violations.push(`hidden/secret-like file: ${rel}`);
      }
      // 3) no other brand's code prefix in the filename (cross-brand leak).
      for (const ob of otherBrands) {
        if (new RegExp(`(^|[^A-Za-z])${ob}[-_]`, 'i').test(base)) {
          violations.push(`cross-brand filename (${ob}) in ${brandUp} host: ${rel}`);
        }
      }
    }
  };
  walk(dir);
  return { ok: violations.length === 0, brand: brandUp, files, violations };
}

// --- offline isolation self-test (temp dir; no repo mutation) --------------
function selftest() {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'publish-selftest-'));
  const results = [];
  const check = (name, fn) => { try { fn(); results.push(['PASS', name]); } catch (e) { results.push(['FAIL', name + ' — ' + e.message]); } };
  // scaffold a fake repo
  fs.mkdirSync(path.join(tmp, 'hosting', 'ss'), { recursive: true });
  fs.mkdirSync(path.join(tmp, 'hosting', 'rdd'), { recursive: true });
  fs.mkdirSync(path.join(tmp, 'Brands', 'SS', 'X'), { recursive: true });
  fs.mkdirSync(path.join(tmp, 'Brands', 'RDD', 'X'), { recursive: true });
  const ssImg = path.join(tmp, 'Brands', 'SS', 'X', 'SS Hero Banner.jpg');
  const rddImg = path.join(tmp, 'Brands', 'RDD', 'X', 'RDD-hero.jpg');
  const secret = path.join(tmp, 'Brands', 'SS', 'X', '.env');
  fs.writeFileSync(ssImg, 'JPEGDATA'); fs.writeFileSync(rddImg, 'JPEGDATA'); fs.writeFileSync(secret, 'ACCESS TOKEN: nope');

  check('publishes an SS image (slugified) into hosting/ss', () => {
    const r = publishAsset({ brand: 'SS', src: ssImg, repoRoot: tmp });
    if (r.relPath !== 'ss-hero-banner.jpg') throw new Error('unexpected relPath ' + r.relPath);
  });
  check('rejects a non-image (.env) publish', () => {
    let threw = false; try { publishAsset({ brand: 'SS', src: secret, repoRoot: tmp }); } catch { threw = true; }
    if (!threw) throw new Error('non-image was NOT rejected');
  });
  check('blocks cross-brand publish (RDD source → SS host)', () => {
    let threw = false; try { publishAsset({ brand: 'SS', src: rddImg, repoRoot: tmp }); } catch { threw = true; }
    if (!threw) throw new Error('cross-brand publish was NOT blocked');
  });
  check('blocks path traversal via subdir', () => {
    let threw = false; try { publishAsset({ brand: 'SS', src: ssImg, subdir: '../rdd', repoRoot: tmp }); } catch { threw = true; }
    if (!threw) throw new Error('traversal was NOT blocked');
  });
  check('validate: clean SS host passes', () => {
    fs.writeFileSync(path.join(tmp, 'hosting', 'ss', 'vercel.json'), '{}');
    const v = validateHostingDir({ brand: 'SS', repoRoot: tmp });
    if (!v.ok) throw new Error('clean host flagged: ' + v.violations.join('; '));
  });
  check('validate: a planted .env is caught', () => {
    fs.writeFileSync(path.join(tmp, 'hosting', 'ss', '.env'), 'x');
    const v = validateHostingDir({ brand: 'SS', repoRoot: tmp });
    if (v.ok) throw new Error('planted .env NOT caught');
    fs.rmSync(path.join(tmp, 'hosting', 'ss', '.env'));
  });
  check('validate: a cross-brand filename (RDD-*) in SS host is caught', () => {
    fs.writeFileSync(path.join(tmp, 'hosting', 'ss', 'RDD-leak.png'), 'x');
    const v = validateHostingDir({ brand: 'SS', repoRoot: tmp });
    if (v.ok) throw new Error('cross-brand filename NOT caught');
  });

  fs.rmSync(tmp, { recursive: true, force: true });
  const failed = results.filter((r) => r[0] === 'FAIL');
  for (const [status, name] of results) console.log(`  [${status}] ${name}`);
  console.log(`\nselftest: ${results.length - failed.length}/${results.length} passed`);
  return failed.length === 0;
}

// --- CLI -------------------------------------------------------------------
function parseFlags(argv) {
  const o = {};
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === '--brand') o.brand = argv[++i];
    else if (argv[i] === '--src') o.src = argv[++i];
    else if (argv[i] === '--subdir') o.subdir = argv[++i];
    else if (argv[i] === '--name') o.name = argv[++i];
    else if (!o._pos) o._pos = argv[i];
  }
  return o;
}

function main() {
  const [cmd, ...rest] = process.argv.slice(2);
  if (cmd === 'selftest') { process.exit(selftest() ? 0 : 1); }
  if (cmd === 'validate') {
    const which = rest[0] ? [rest[0].toUpperCase()] : BRANDS;
    let ok = true;
    for (const b of which) {
      const v = validateHostingDir({ brand: b });
      console.log(`hosting/${brandDirName(b)}: ${v.ok ? 'OK' : 'VIOLATIONS'} (${v.files.length} file(s))`);
      for (const f of v.files) console.log(`   • ${f}`);
      for (const x of v.violations) console.log(`   ✗ ${x}`);
      ok = ok && v.ok;
    }
    process.exit(ok ? 0 : 1);
  }
  if (cmd === 'publish') {
    const o = parseFlags(rest);
    if (!o.brand || !o.src) { console.error('Usage: publish --brand <RDD|SS|SC> --src <path> [--subdir d] [--name x.jpg]'); process.exit(2); }
    const r = publishAsset({ brand: o.brand, src: o.src, subdir: o.subdir || '', name: o.name || null });
    console.log(`published → hosting/${brandDirName(o.brand)}/${r.relPath}`);
    process.exit(0);
  }
  console.log('Commands: validate [BRAND] | publish --brand <B> --src <path> [--subdir d] [--name x] | selftest');
  process.exit(cmd ? 1 : 0);
}

if (require.main === module) main();

module.exports = {
  BRANDS, IMAGE_EXTS, ALLOWED_INFRA, REPO_ROOT,
  brandDirName, hostingDir, isImage, slugifyAssetName, brandOfSourcePath,
  publishAsset, validateHostingDir, selftest,
};
