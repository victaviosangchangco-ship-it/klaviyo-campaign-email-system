#!/usr/bin/env node
// ---------------------------------------------------------------------------
// imagekit-upload.js — ImageKit CDN asset upload tool.
//
// Uploads images from "Image kit hosting/<brand>/<category>/" to ImageKit,
// preserving the brand/category folder path. Returns the hosted CDN URL.
//
// Credentials are read from the root .env (git-ignored). The private key is
// NEVER logged, printed, or included in any output.
//
// Usage:
//   node Scripts/imagekit-upload.js upload --brand RDD --src <path>
//   node Scripts/imagekit-upload.js upload-all [--brand RDD]
//   node Scripts/imagekit-upload.js validate [BRAND]
//   node Scripts/imagekit-upload.js selftest
//   node Scripts/imagekit-upload.js watch          # auto-upload on save
// ---------------------------------------------------------------------------

'use strict';

const fs = require('fs');
const path = require('path');
const ImageKit = require('imagekit');

const REPO_ROOT = path.resolve(__dirname, '..');
const IMAGEKIT_ROOT = path.join(REPO_ROOT, 'Image kit hosting');
const BRANDS = ['RDD', 'SS', 'SC'];
const IMAGE_EXTS = new Set(['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg', '.avif']);

// ---------------------------------------------------------------------------
// Env loader — reads root .env without exposing secrets
// ---------------------------------------------------------------------------

function loadEnv() {
  const envPath = path.join(REPO_ROOT, '.env');
  if (!fs.existsSync(envPath)) {
    throw new Error('Root .env not found. ImageKit credentials must be in the root .env file.');
  }
  const lines = fs.readFileSync(envPath, 'utf8').split(/\r?\n/);
  const env = {};
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eq = trimmed.indexOf('=');
    if (eq < 0) continue;
    env[trimmed.slice(0, eq).trim()] = trimmed.slice(eq + 1).trim();
  }
  return env;
}

function createImageKitClient() {
  const env = loadEnv();
  const urlEndpoint = env.IMAGEKIT_URL_ENDPOINT;
  const publicKey = env.IMAGEKIT_PUBLIC_KEY;
  const privateKey = env.IMAGEKIT_PRIVATE_KEY;

  if (!urlEndpoint || !publicKey || !privateKey) {
    throw new Error(
      'Missing ImageKit credentials in root .env. Required: IMAGEKIT_URL_ENDPOINT, IMAGEKIT_PUBLIC_KEY, IMAGEKIT_PRIVATE_KEY'
    );
  }

  return new ImageKit({ urlEndpoint, publicKey, privateKey });
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function brandDirName(brand) {
  const up = String(brand || '').toUpperCase();
  if (!BRANDS.includes(up)) throw new Error(`Unknown brand "${brand}". Expected one of ${BRANDS.join(', ')}.`);
  return up.toLowerCase();
}

function isImage(name) {
  return IMAGE_EXTS.has(path.extname(name).toLowerCase());
}

function resolveImageKitFolder(filePath) {
  const rel = path.relative(IMAGEKIT_ROOT, filePath).replace(/\\/g, '/');
  const parts = rel.split('/');
  if (parts.length < 2) return { folder: '/', fileName: parts[0] };
  const fileName = parts.pop();
  const folder = '/' + parts.join('/');
  return { folder, fileName };
}

function collectImages(dir) {
  const results = [];
  if (!fs.existsSync(dir)) return results;
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...collectImages(full));
    } else if (isImage(entry.name)) {
      results.push(full);
    }
  }
  return results;
}

// ---------------------------------------------------------------------------
// Commands
// ---------------------------------------------------------------------------

async function uploadFile(imagekit, filePath) {
  if (!fs.existsSync(filePath)) throw new Error(`File not found: ${filePath}`);
  if (!isImage(path.basename(filePath))) throw new Error(`Not an image file: ${filePath}`);

  const { folder, fileName } = resolveImageKitFolder(filePath);
  const fileBuffer = fs.readFileSync(filePath);

  const result = await imagekit.upload({
    file: fileBuffer,
    fileName,
    folder,
    useUniqueFileName: false,
  });

  return {
    name: result.name,
    filePath: result.filePath,
    url: result.url,
    fileId: result.fileId,
    size: result.size,
  };
}

async function cmdUpload(args) {
  const brandIdx = args.indexOf('--brand');
  const srcIdx = args.indexOf('--src');

  if (brandIdx < 0 || srcIdx < 0) {
    console.error('Usage: upload --brand <BRAND> --src <path>');
    process.exit(1);
  }

  const brand = args[brandIdx + 1];
  const srcRaw = args[srcIdx + 1];
  brandDirName(brand); // validates

  const src = path.resolve(REPO_ROOT, srcRaw);
  if (!src.replace(/\\/g, '/').includes('Image kit hosting')) {
    throw new Error('Source file must be inside "Image kit hosting/" folder.');
  }

  const imagekit = createImageKitClient();
  console.log(`Uploading: ${path.relative(REPO_ROOT, src)}`);

  const result = await uploadFile(imagekit, src);
  console.log(`\n  UPLOADED SUCCESSFULLY`);
  console.log(`  Name:     ${result.name}`);
  console.log(`  Path:     ${result.filePath}`);
  console.log(`  URL:      ${result.url}`);
  console.log(`  Size:     ${result.size} bytes`);
  console.log(`  File ID:  ${result.fileId}`);
  return result;
}

async function cmdUploadAll(args) {
  const brandIdx = args.indexOf('--brand');
  const brands = brandIdx >= 0 ? [args[brandIdx + 1]] : BRANDS;

  const imagekit = createImageKitClient();
  const results = [];

  for (const brand of brands) {
    const dir = path.join(IMAGEKIT_ROOT, brandDirName(brand));
    const files = collectImages(dir);
    if (!files.length) {
      console.log(`${brand}: no images found in ${path.relative(REPO_ROOT, dir)}`);
      continue;
    }

    console.log(`\n${brand}: uploading ${files.length} image(s)...`);
    for (const f of files) {
      try {
        const result = await uploadFile(imagekit, f);
        console.log(`  OK  ${result.url}`);
        results.push({ brand, file: path.relative(REPO_ROOT, f), url: result.url, status: 'ok' });
      } catch (err) {
        console.error(`  FAIL  ${path.relative(REPO_ROOT, f)}: ${err.message}`);
        results.push({ brand, file: path.relative(REPO_ROOT, f), status: 'error', error: err.message });
      }
    }
  }

  console.log(`\n--- Summary: ${results.filter((r) => r.status === 'ok').length} uploaded, ${results.filter((r) => r.status === 'error').length} failed ---`);
  return results;
}

function cmdValidate(args) {
  const brand = args[0];
  const brands = brand ? [brand] : BRANDS;
  let errors = 0;

  for (const b of brands) {
    const dir = path.join(IMAGEKIT_ROOT, brandDirName(b));
    if (!fs.existsSync(dir)) {
      console.log(`${b}: directory not found (${path.relative(REPO_ROOT, dir)})`);
      continue;
    }

    const allFiles = collectAllFiles(dir);
    for (const f of allFiles) {
      const name = path.basename(f);
      if (name === 'README.md' || name === '.gitkeep') continue;
      if (!isImage(name)) {
        console.error(`  VIOLATION [${b}]: non-image file: ${path.relative(REPO_ROOT, f)}`);
        errors++;
      }
      if (/\.env/i.test(name)) {
        console.error(`  VIOLATION [${b}]: secret/env file detected: ${path.relative(REPO_ROOT, f)}`);
        errors++;
      }
    }

    const images = allFiles.filter((f) => isImage(path.basename(f)));
    console.log(`${b}: ${images.length} image(s), ${errors} violation(s)`);
  }

  if (errors) {
    console.error(`\nVALIDATION FAILED: ${errors} violation(s).`);
    process.exit(1);
  }
  console.log('\nValidation passed.');
}

function collectAllFiles(dir) {
  const results = [];
  if (!fs.existsSync(dir)) return results;
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...collectAllFiles(full));
    } else {
      results.push(full);
    }
  }
  return results;
}

// ---------------------------------------------------------------------------
// Selftest — creates a tiny PNG, uploads, verifies URL, then deletes.
// ---------------------------------------------------------------------------

async function cmdSelftest() {
  console.log('ImageKit selftest — upload a 1x1 test PNG, verify URL, then delete.\n');
  const imagekit = createImageKitClient();

  // 1x1 red PNG (67 bytes)
  const png = Buffer.from(
    'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==',
    'base64'
  );
  const testDir = path.join(IMAGEKIT_ROOT, 'rdd', 'hero-banners');
  const testFile = path.join(testDir, '_selftest-delete-me.png');

  try {
    fs.mkdirSync(testDir, { recursive: true });
    fs.writeFileSync(testFile, png);
    console.log('  1. Created test file.');

    const result = await uploadFile(imagekit, testFile);
    console.log(`  2. Uploaded: ${result.url}`);

    if (!result.url || !result.fileId) throw new Error('Upload returned no URL or fileId.');
    console.log(`  3. URL returned: ${result.url}`);

    await imagekit.deleteFile(result.fileId);
    console.log(`  4. Deleted from ImageKit (fileId: ${result.fileId}).`);

    console.log('\n  SELFTEST PASSED');
  } finally {
    if (fs.existsSync(testFile)) fs.unlinkSync(testFile);
  }
}

// ---------------------------------------------------------------------------
// Watch mode — auto-upload new/changed images, skip unchanged files.
// Uses Node's built-in fs.watch (recursive). Tracks size+mtime to detect
// real changes. Debounces rapid saves (editors often write twice).
// ---------------------------------------------------------------------------

async function cmdWatch() {
  const crypto = require('crypto');
  const imagekit = createImageKitClient();

  // fingerprint = size:mtimeMs — cheap and sufficient for detecting saves
  const fingerprints = new Map();
  const DEBOUNCE_MS = 500;
  const pending = new Map(); // filePath → timeout

  function fingerprint(filePath) {
    try {
      const st = fs.statSync(filePath);
      return `${st.size}:${st.mtimeMs}`;
    } catch {
      return null;
    }
  }

  // Seed fingerprints for every image already present so we don't re-upload
  // the entire tree on startup.
  for (const brand of BRANDS) {
    const dir = path.join(IMAGEKIT_ROOT, brandDirName(brand));
    for (const f of collectImages(dir)) {
      const fp = fingerprint(f);
      if (fp) fingerprints.set(f, fp);
    }
  }

  const ts = () => new Date().toLocaleTimeString('en-AU', { hour12: false });

  console.log(`[${ts()}] ImageKit watch started — monitoring "Image kit hosting/" for new/changed images.`);
  console.log(`[${ts()}] ${fingerprints.size} existing image(s) fingerprinted (will not re-upload).`);
  console.log(`[${ts()}] Press Ctrl+C to stop.\n`);

  async function handleFile(filePath) {
    if (!fs.existsSync(filePath)) return;
    if (!isImage(path.basename(filePath))) return;

    // Ensure the file is inside a brand subfolder
    const rel = path.relative(IMAGEKIT_ROOT, filePath).replace(/\\/g, '/');
    const brandDir = rel.split('/')[0];
    const brandUpper = brandDir.toUpperCase();
    if (!BRANDS.includes(brandUpper)) return;

    const fp = fingerprint(filePath);
    if (!fp) return;

    // Skip if unchanged
    if (fingerprints.get(filePath) === fp) return;

    // Wait for the file to be fully written (size stable over 300ms)
    let prevSize = -1;
    for (let i = 0; i < 5; i++) {
      try {
        const st = fs.statSync(filePath);
        if (st.size > 0 && st.size === prevSize) break;
        prevSize = st.size;
      } catch { return; }
      await new Promise((r) => setTimeout(r, 300));
    }

    // Re-fingerprint after stabilisation
    const fpStable = fingerprint(filePath);
    if (!fpStable || fingerprints.get(filePath) === fpStable) return;

    const relDisplay = path.relative(REPO_ROOT, filePath);
    console.log(`[${ts()}] Change detected: ${relDisplay}`);

    try {
      const result = await uploadFile(imagekit, filePath);
      fingerprints.set(filePath, fpStable);
      console.log(`[${ts()}]   UPLOADED  ${result.url}`);
      console.log(`[${ts()}]   Size: ${result.size} bytes | FileID: ${result.fileId}`);
    } catch (err) {
      console.error(`[${ts()}]   FAILED  ${relDisplay}: ${err.message}`);
    }
  }

  // Watch the entire tree recursively
  fs.watch(IMAGEKIT_ROOT, { recursive: true }, (eventType, filename) => {
    if (!filename) return;
    const filePath = path.join(IMAGEKIT_ROOT, filename);

    // Debounce: clear any pending timer for this file, set a new one
    if (pending.has(filePath)) clearTimeout(pending.get(filePath));
    pending.set(filePath, setTimeout(() => {
      pending.delete(filePath);
      handleFile(filePath).catch((err) => {
        console.error(`[${ts()}]   ERROR  ${filename}: ${err.message}`);
      });
    }, DEBOUNCE_MS));
  });

  // Keep the process alive
  await new Promise(() => {});
}

// ---------------------------------------------------------------------------
// CLI router
// ---------------------------------------------------------------------------

async function main() {
  const args = process.argv.slice(2);
  const cmd = args.shift();

  switch (cmd) {
    case 'upload':      return cmdUpload(args);
    case 'upload-all':  return cmdUploadAll(args);
    case 'validate':    return cmdValidate(args);
    case 'selftest':    return cmdSelftest();
    case 'watch':       return cmdWatch();
    default:
      console.log('Usage:');
      console.log('  node Scripts/imagekit-upload.js upload --brand <BRAND> --src <path>');
      console.log('  node Scripts/imagekit-upload.js upload-all [--brand <BRAND>]');
      console.log('  node Scripts/imagekit-upload.js validate [BRAND]');
      console.log('  node Scripts/imagekit-upload.js selftest');
      console.log('  node Scripts/imagekit-upload.js watch          # auto-upload on save');
      process.exit(1);
  }
}

main().catch((err) => {
  console.error(`FATAL: ${err.message}`);
  process.exit(1);
});
