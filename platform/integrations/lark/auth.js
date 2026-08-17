// ---------------------------------------------------------------------------
// auth.js — Lark server-side app authentication (tenant access token).
//
// The AI Email Automation System app is an INTERNAL (self-built) Lark app, so it
// authenticates with the app credentials flow:
//
//     POST {baseUrl}/auth/v3/tenant_access_token/internal
//     body: { app_id, app_secret }  →  { tenant_access_token, expire }
//
// The token is cached IN MEMORY only, with an expiry skew so a request never
// races a token that expires in flight. Nothing is written to disk.
//
// SECURITY: the App Secret is injected by the caller (never read from disk here,
// mirroring KlaviyoClient), held only in a closed-over field, sent only in the
// token-request body, and never placed into log data, error messages, or error
// details. The tenant access token itself is treated the same way.
// ---------------------------------------------------------------------------

'use strict';

const { IntegrationError, ConfigError } = require('../../common/errors');

const DEFAULTS = {
  timeoutMs: 8000,
  maxRetries: 3,
  backoffBaseMs: 300,
  // Refresh this many seconds before the server-stated expiry.
  expirySkewSeconds: 120,
};

class LarkAuth {
  // opts: { baseUrl, appId, appSecret, logger?, timeoutMs?, maxRetries?,
  //         backoffBaseMs?, expirySkewSeconds?, fetchImpl?, sleepImpl?, nowImpl? }
  constructor(opts = {}) {
    if (!opts.baseUrl) throw new ConfigError('LarkAuth requires baseUrl.');
    if (!opts.appId) throw new ConfigError('LarkAuth requires appId.');
    if (!opts.appSecret) {
      throw new ConfigError(
        'LarkAuth requires appSecret (inject it; never read from disk here). ' +
          'Set LARK_APP_SECRET in the git-ignored root .env.'
      );
    }

    this.baseUrl = String(opts.baseUrl).replace(/\/$/, '');
    this.appId = opts.appId;
    this._appSecret = opts.appSecret; // closed-over; never logged or serialized
    this.logger = opts.logger || null;
    this.timeoutMs = opts.timeoutMs ?? DEFAULTS.timeoutMs;
    this.maxRetries = opts.maxRetries ?? DEFAULTS.maxRetries;
    this.backoffBaseMs = opts.backoffBaseMs ?? DEFAULTS.backoffBaseMs;
    this.expirySkewSeconds = opts.expirySkewSeconds ?? DEFAULTS.expirySkewSeconds;

    this._fetch = opts.fetchImpl || globalThis.fetch;
    this._sleep = opts.sleepImpl || ((ms) => new Promise((r) => setTimeout(r, ms)));
    this._now = opts.nowImpl || (() => Date.now());

    if (typeof this._fetch !== 'function') {
      throw new ConfigError('No fetch implementation available (Node >= 18 or inject fetchImpl).');
    }

    this._token = null;
    this._expiresAtMs = 0;
    this._inFlight = null;
  }

  _log(level, msg, data) {
    if (this.logger && typeof this.logger[level] === 'function') this.logger[level](msg, data);
  }

  _isRetryableNetworkError(err) {
    return (
      err &&
      (err.name === 'AbortError' ||
        err.name === 'TypeError' ||
        /network|ECONN|ETIMEDOUT|fetch failed/i.test(err.message || ''))
    );
  }

  // True when a cached token is still usable (allowing for the skew).
  _cachedTokenIsValid() {
    return Boolean(this._token) && this._now() < this._expiresAtMs;
  }

  async _requestToken() {
    const url = `${this.baseUrl}/auth/v3/tenant_access_token/internal`;
    let lastErr = null;

    for (let attempt = 0; attempt <= this.maxRetries; attempt++) {
      if (attempt > 0) await this._sleep(this.backoffBaseMs * 2 ** (attempt - 1));

      let res;
      try {
        const controller = new AbortController();
        const timer = setTimeout(() => controller.abort(), this.timeoutMs);
        try {
          res = await this._fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json; charset=utf-8' },
            // The secret appears here and nowhere else.
            body: JSON.stringify({ app_id: this.appId, app_secret: this._appSecret }),
            signal: controller.signal,
          });
        } finally {
          clearTimeout(timer);
        }
      } catch (err) {
        lastErr = err;
        if (this._isRetryableNetworkError(err) && attempt < this.maxRetries) continue;
        throw new IntegrationError(`Lark auth request failed: ${err.message}`, { system: 'lark' });
      }

      if (res.status === 429 || res.status >= 500) {
        lastErr = new IntegrationError(`Lark auth HTTP ${res.status}`, { system: 'lark', status: res.status });
        if (attempt < this.maxRetries) continue;
        throw lastErr;
      }

      let body;
      try {
        body = await res.json();
      } catch (err) {
        throw new IntegrationError(`Lark auth returned a non-JSON response (HTTP ${res.status}).`, {
          system: 'lark',
          status: res.status,
        });
      }

      if (!res.ok || !body || body.code !== 0) {
        // body.msg is Lark's own message; it never contains the secret.
        const code = body && body.code;
        const msg = (body && body.msg) || `HTTP ${res.status}`;
        throw new IntegrationError(
          `Lark authentication failed (code ${code ?? 'n/a'}): ${msg}. ` +
            `Check LARK_APP_ID / LARK_APP_SECRET in the local .env and that the app is enabled.`,
          { system: 'lark', code: code ?? null, status: res.status }
        );
      }

      const token = body.tenant_access_token;
      if (!token) {
        throw new IntegrationError('Lark authentication response contained no tenant_access_token.', {
          system: 'lark',
        });
      }

      const expireSeconds = Number(body.expire) > 0 ? Number(body.expire) : 7200;
      const ttlMs = Math.max(0, (expireSeconds - this.expirySkewSeconds) * 1000);
      this._token = token;
      this._expiresAtMs = this._now() + ttlMs;
      // Log the fact of a refresh and the TTL — never the token.
      this._log('debug', 'Lark tenant access token refreshed.', { expiresInSeconds: expireSeconds });
      return token;
    }

    throw lastErr || new IntegrationError('Lark authentication failed.', { system: 'lark' });
  }

  // Return a valid tenant access token, refreshing only when needed.
  // Concurrent callers share a single in-flight refresh.
  async getTenantAccessToken({ forceRefresh = false } = {}) {
    if (!forceRefresh && this._cachedTokenIsValid()) return this._token;
    if (this._inFlight) return this._inFlight;

    this._inFlight = this._requestToken().finally(() => {
      this._inFlight = null;
    });
    return this._inFlight;
  }

  // Drop the cached token (used after a 401 so the next call re-authenticates).
  invalidate() {
    this._token = null;
    this._expiresAtMs = 0;
  }
}

module.exports = { LarkAuth, DEFAULTS };
