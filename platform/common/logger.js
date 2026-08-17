// ---------------------------------------------------------------------------
// logger.js — structured, secret-safe run logging (Architecture V2 §2.8).
//
// One logger per run. It writes:
//   - human-readable lines to the console (so a live demo reads well), and
//   - a structured JSON event array to runtime/logs/<runId>.json (the audit
//     trail: what was built, verified, and found).
//
// SECRET-SAFE: the platform never passes tokens through here, but as a
// defence-in-depth the logger redacts anything that looks like a BigCommerce
// token or an "ACCESS TOKEN" value before it is written or printed. This
// generalises the discipline already in Brands/RDD/integration.
// ---------------------------------------------------------------------------

'use strict';

const fs = require('fs');
const path = require('path');

const LEVELS = { debug: 10, info: 20, warn: 30, error: 40 };

// Redact obvious secrets from any string before it is printed or persisted.
function redact(value) {
  if (typeof value !== 'string') return value;
  return value
    .replace(/(ACCESS[_ ]?TOKEN\s*[:=]\s*)\S+/gi, '$1[REDACTED]')
    .replace(/(X-Auth-Token['"\s:=]+)\S+/gi, '$1[REDACTED]')
    // Klaviyo: the private key format and the auth header value (added T3;
    // underscore included in the char class — keys look like pk_<acct>_<secret>).
    .replace(/\bpk_[A-Za-z0-9_]+/g, '[REDACTED]')
    .replace(/(Klaviyo-API-Key\s+)\S+/gi, '$1[REDACTED]')
    .replace(/(KLAVIYO_API_KEY\s*[:=]\s*)\S+/gi, '$1[REDACTED]')
    // long opaque token-like strings (>=24 word chars)
    .replace(/\b[a-z0-9]{24,}\b/gi, (m) => (m.length >= 24 ? '[REDACTED]' : m));
}

function redactDeep(obj) {
  if (obj == null) return obj;
  if (typeof obj === 'string') return redact(obj);
  if (Array.isArray(obj)) return obj.map(redactDeep);
  if (typeof obj === 'object') {
    const out = {};
    for (const [k, v] of Object.entries(obj)) out[k] = redactDeep(v);
    return out;
  }
  return obj;
}

class Logger {
  constructor({ runId, level = 'info', logDir = null, writeRunLog = true } = {}) {
    this.runId = runId;
    this.threshold = LEVELS[level] ?? LEVELS.info;
    this.logDir = logDir;
    this.writeRunLog = writeRunLog;
    this.events = [];
    this._seq = 0;
  }

  _emit(level, msg, data) {
    const event = {
      seq: this._seq++,
      level,
      runId: this.runId,
      msg: redact(msg),
      ...(data ? { data: redactDeep(data) } : {}),
    };
    this.events.push(event);
    if (LEVELS[level] >= this.threshold) {
      const tag = level.toUpperCase().padEnd(5);
      const line = `  [${tag}] ${event.msg}`;
      // eslint-disable-next-line no-console
      (level === 'error' ? console.error : console.log)(line);
    }
    return event;
  }

  debug(msg, data) { return this._emit('debug', msg, data); }
  info(msg, data) { return this._emit('info', msg, data); }
  warn(msg, data) { return this._emit('warn', msg, data); }
  error(msg, data) { return this._emit('error', msg, data); }

  // Narrator line for the demo — a visible step header.
  step(n, msg) {
    // eslint-disable-next-line no-console
    console.log(`\n▶ Step ${n}: ${msg}`);
    return this._emit('info', `Step ${n}: ${msg}`);
  }

  // Persist the full structured log at the end of a run.
  flush() {
    if (!this.writeRunLog || !this.logDir) return null;
    fs.mkdirSync(this.logDir, { recursive: true });
    const file = path.join(this.logDir, `${this.runId}.json`);
    fs.writeFileSync(
      file,
      JSON.stringify({ runId: this.runId, events: this.events }, null, 2),
      'utf8'
    );
    return file;
  }
}

module.exports = { Logger, redact, redactDeep };
