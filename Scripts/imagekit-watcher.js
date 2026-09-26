#!/usr/bin/env node
// ---------------------------------------------------------------------------
// imagekit-watcher.js — standalone ImageKit watch process.
//
// Watches "Image kit hosting/" for new/changed images and auto-uploads them
// to the matching ImageKit CDN path. Designed to be:
//   1. Run directly:  node Scripts/imagekit-watcher.js
//   2. Forked by cli.js as a background child during campaign runs.
//
// When forked (process.send exists), it signals readiness via IPC and logs
// with a prefix so output is distinguishable from the main engine. When run
// standalone it behaves identically to `imagekit-upload.js watch`.
//
// Credentials come from root .env (git-ignored). The private key is NEVER
// logged, printed, or included in any output.
// ---------------------------------------------------------------------------

'use strict';

const fs = require('fs');
const path = require('path');
const ImageKit = require('imagekit');

const REPO_ROOT = path.resolve(__dirname, '..');
const IMAGEKIT_ROOT = path.join(REPO_ROOT, 'Image kit hosting');
const BRANDS = ['RDD', 'SS', 'SC'];
const IMAGE_EXTS = new Set(['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg', '.avif']);
const DEBOUNCE_MS = 500;

const isForked = typeof process.send === 'function';
const PREFIX = isForked ? '[imagekit-watch]' : '';

function log(msg) {
  const ts = new Date().toLocaleTimeString('en-AU', { hour12: false });
  console.log(`${PREFIX}[${ts}] ${msg}`);
}

// ---------------------------------------------------------------------------
// Env + ImageKit client (same loader as imagekit-upload.js)
// ---------------------------------------------------------------------------

function loadEnv() {
  const envPath = path.join(REPO_ROOT, '.env');
  if (!fs.existsSync(envPath)) throw new Error('Root .env not found.');
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

function createClient() {
  const env = loadEnv();
  const urlEndpoint = env.IMAGEKIT_URL_ENDPOINT;
  const publicKey = env.IMAGEKIT_PUBLIC_KEY;
  const privateKey = env.IMAGEKIT_PRIVATE_KEY;
  if (!urlEndpoint || !publicKey || !privateKey) {
    throw new Error('Missing ImageKit credentials in root .env.');
  }
  return new ImageKit({ urlEndpoint, publicKey, privateKey });
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function brandDirName(b) { return String(b).toLowerCase(); }
function isImage(name) { return IMAGE_EXTS.has(path.extname(name).toLowerCase()); }

function collectImages(dir) {
  const results = [];
  if (!fs.existsSync(dir)) return results;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) results.push(...collectImages(full));
    else if (isImage(entry.name)) results.push(full);
  }
  return results;
}

function resolveFolder(filePath) {
  const rel = path.relative(IMAGEKIT_ROOT, filePath).replace(/\\/g, '/');
  const parts = rel.split('/');
  if (parts.length < 2) return { folder: '/', fileName: parts[0] };
  const fileName = parts.pop();
  return { folder: '/' + parts.join('/'), fileName };
}

function fingerprint(filePath) {
  try { const st = fs.statSync(filePath); return `${st.size}:${st.mtimeMs}`; }
  catch { return null; }
}

// ---------------------------------------------------------------------------
// Upload
// ---------------------------------------------------------------------------

async function uploadFile(imagekit, filePath) {
  const { folder, fileName } = resolveFolder(filePath);
  const result = await imagekit.upload({
    file: fs.readFileSync(filePath),
    fileName,
    folder,
    useUniqueFileName: false,
  });
  return { name: result.name, filePath: result.filePath, url: result.url, fileId: result.fileId, size: result.size };
}

// ---------------------------------------------------------------------------
// Watch loop
// ---------------------------------------------------------------------------

async function startWatch() {
  if (!fs.existsSync(IMAGEKIT_ROOT)) {
    const msg = `"Image kit hosting/" folder not found — watcher not started.`;
    if (isForked) { process.send({ type: 'skip', reason: msg }); }
    else { log(msg); }
    return;
  }

  let imagekit;
  try {
    imagekit = createClient();
  } catch (err) {
    const msg = `ImageKit credentials missing — watcher not started: ${err.message}`;
    if (isForked) { process.send({ type: 'skip', reason: msg }); }
    else { log(msg); }
    return;
  }

  const fingerprints = new Map();
  const pending = new Map();

  // Seed fingerprints for existing images
  for (const brand of BRANDS) {
    for (const f of collectImages(path.join(IMAGEKIT_ROOT, brandDirName(brand)))) {
      const fp = fingerprint(f);
      if (fp) fingerprints.set(f, fp);
    }
  }

  log(`ImageKit watch started — monitoring "Image kit hosting/" for new/changed images.`);
  log(`${fingerprints.size} existing image(s) fingerprinted (will not re-upload).`);
  if (!isForked) log(`Press Ctrl+C to stop.\n`);

  if (isForked) process.send({ type: 'ready', images: fingerprints.size });

  async function handleFile(filePath) {
    if (!fs.existsSync(filePath)) return;
    if (!isImage(path.basename(filePath))) return;

    const rel = path.relative(IMAGEKIT_ROOT, filePath).replace(/\\/g, '/');
    const brandDir = rel.split('/')[0];
    if (!BRANDS.includes(brandDir.toUpperCase())) return;

    const fp = fingerprint(filePath);
    if (!fp || fingerprints.get(filePath) === fp) return;

    // Wait for size to stabilise (editors write in chunks)
    let prevSize = -1;
    for (let i = 0; i < 5; i++) {
      try {
        const st = fs.statSync(filePath);
        if (st.size > 0 && st.size === prevSize) break;
        prevSize = st.size;
      } catch { return; }
      await new Promise((r) => setTimeout(r, 300));
    }

    const fpStable = fingerprint(filePath);
    if (!fpStable || fingerprints.get(filePath) === fpStable) return;

    log(`Change detected: ${path.relative(REPO_ROOT, filePath)}`);
    try {
      const result = await uploadFile(imagekit, filePath);
      fingerprints.set(filePath, fpStable);
      log(`  UPLOADED  ${result.url}`);
      log(`  Size: ${result.size} bytes | FileID: ${result.fileId}`);
    } catch (err) {
      log(`  FAILED  ${path.relative(REPO_ROOT, filePath)}: ${err.message}`);
    }
  }

  fs.watch(IMAGEKIT_ROOT, { recursive: true }, (_eventType, filename) => {
    if (!filename) return;
    const filePath = path.join(IMAGEKIT_ROOT, filename);
    if (pending.has(filePath)) clearTimeout(pending.get(filePath));
    pending.set(filePath, setTimeout(() => {
      pending.delete(filePath);
      handleFile(filePath).catch((err) => log(`ERROR ${filename}: ${err.message}`));
    }, DEBOUNCE_MS));
  });

  await new Promise(() => {});
}

startWatch().catch((err) => {
  if (isForked) { process.send({ type: 'error', message: err.message }); }
  else { console.error(`FATAL: ${err.message}`); process.exit(1); }
});
