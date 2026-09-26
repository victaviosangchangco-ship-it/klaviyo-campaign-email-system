// ---------------------------------------------------------------------------
// image-dimensions.js — deterministic, zero-dependency real pixel-dimension
// reader (PNG/JPEG/GIF). Reads the actual image header bytes — never guesses,
// never infers from a filename. Returns null for an unsupported/unrecognized
// format (WEBP/SVG/AVIF today) so the caller can treat "cannot verify" as
// invalid rather than silently accepting an unknown size.
// ---------------------------------------------------------------------------

'use strict';

const fs = require('fs');

function readPngDimensions(buf) {
  if (buf.length < 24 || buf.toString('hex', 0, 8) !== '89504e470d0a1a0a') return null;
  return { width: buf.readUInt32BE(16), height: buf.readUInt32BE(20) };
}

function readGifDimensions(buf) {
  const sig = buf.length >= 6 ? buf.toString('ascii', 0, 6) : '';
  if (sig !== 'GIF87a' && sig !== 'GIF89a') return null;
  return { width: buf.readUInt16LE(6), height: buf.readUInt16LE(8) };
}

// Walk JPEG segments to the first SOFn (frame-start) marker, which carries the
// real decoded width/height. Skips markers with no length field (RST/TEM);
// every other marker's segment length tells us where the next one starts.
function readJpegDimensions(buf) {
  if (buf.length < 4 || buf[0] !== 0xff || buf[1] !== 0xd8) return null;
  let offset = 2;
  while (offset + 3 < buf.length) {
    if (buf[offset] !== 0xff) { offset += 1; continue; }
    const marker = buf[offset + 1];
    if (marker === 0x01 || (marker >= 0xd0 && marker <= 0xd9)) { offset += 2; continue; } // no length field
    if (offset + 9 > buf.length) break;
    const isSof = marker >= 0xc0 && marker <= 0xcf && marker !== 0xc4 && marker !== 0xc8 && marker !== 0xcc;
    if (isSof) {
      return { height: buf.readUInt16BE(offset + 5), width: buf.readUInt16BE(offset + 7) };
    }
    const segmentLength = buf.readUInt16BE(offset + 2);
    if (segmentLength < 2) break; // malformed; avoid an infinite loop
    offset += 2 + segmentLength;
  }
  return null;
}

// Read the real pixel { width, height } of a local image file, or null if the
// format isn't one of the supported, deterministically-parsed types.
function readImageDimensions(filePath) {
  const buf = fs.readFileSync(filePath);
  return readPngDimensions(buf) || readJpegDimensions(buf) || readGifDimensions(buf) || null;
}

module.exports = { readImageDimensions, readPngDimensions, readJpegDimensions, readGifDimensions };
