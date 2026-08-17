// ---------------------------------------------------------------------------
// fs-utils.js — small filesystem helpers shared across the platform.
// No behaviour beyond read/write/ensure; keeps the other modules clean.
// ---------------------------------------------------------------------------

'use strict';

const fs = require('fs');
const path = require('path');

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
  return dir;
}

function readText(absPath) {
  return fs.readFileSync(absPath, 'utf8');
}

function writeText(absPath, contents) {
  ensureDir(path.dirname(absPath));
  fs.writeFileSync(absPath, contents, 'utf8');
  return absPath;
}

function writeJson(absPath, obj) {
  return writeText(absPath, JSON.stringify(obj, null, 2));
}

function exists(absPath) {
  return fs.existsSync(absPath);
}

function byteLength(str) {
  return Buffer.byteLength(str, 'utf8');
}

module.exports = { ensureDir, readText, writeText, writeJson, exists, byteLength };
