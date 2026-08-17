// ---------------------------------------------------------------------------
// client.js — Klaviyo API transport layer (T4).
//
// A thin, read-capable HTTP client for the Klaviyo JSON:API. Its ONLY job in
// this sprint is to prove the Automation Engine can safely reach Klaviyo:
// authenticate with the configured private key, send the pinned `revision`
// header, and confirm account connectivity — with production-grade timeouts,
// 429/5xx retry + backoff, and typed error mapping.
//
// SCOPE (T4): read-only. It exposes GET + a connectivity check ONLY. There is no
// campaign creation, template upload, list/segment selection, scheduling, or
// send — and, per the no-send guard (safety.js), it references no send endpoint.
//
// SECURITY: the API key is injected by the caller (never read from disk here),
// held only in a closed-over field, sent only in the Authorization header, and
// never placed into log data or error details.
// ---------------------------------------------------------------------------

'use strict';

const { IntegrationError, ConfigError } = require('../../common/errors');

const DEFAULTS = {
  timeoutMs: 8000,
  maxRetries: 3,
  backoffBaseMs: 300,
  accept: 'application/json',
};

class KlaviyoClient {
  // opts: { apiBaseUrl, revision, apiKey, logger?, timeoutMs?, maxRetries?,
  //         backoffBaseMs?, fetchImpl?, sleepImpl? }
  // fetchImpl/sleepImpl are injectable so the client is unit-testable offline.
  constructor(opts = {}) {
    if (!opts.apiBaseUrl) throw new ConfigError('KlaviyoClient requires apiBaseUrl.');
    if (!opts.revision) throw new ConfigError('KlaviyoClient requires a pinned API revision.');
    if (!opts.apiKey) throw new ConfigError('KlaviyoClient requires an apiKey (inject it; never read from disk here).');

    this.apiBaseUrl = String(opts.apiBaseUrl).replace(/\/$/, '');
    this.revision = opts.revision;
    this._apiKey = opts.apiKey; // closed-over; never logged or serialized
    this.logger = opts.logger || null;
    this.timeoutMs = opts.timeoutMs ?? DEFAULTS.timeoutMs;
    this.maxRetries = opts.maxRetries ?? DEFAULTS.maxRetries;
    this.backoffBaseMs = opts.backoffBaseMs ?? DEFAULTS.backoffBaseMs;
    this._fetch = opts.fetchImpl || globalThis.fetch;
    this._sleep = opts.sleepImpl || ((ms) => new Promise((r) => setTimeout(r, ms)));

    if (typeof this._fetch !== 'function') {
      throw new ConfigError('No fetch implementation available (Node >= 18 or inject fetchImpl).');
    }
  }

  _headers() {
    return {
      Authorization: `Klaviyo-API-Key ${this._apiKey}`,
      revision: this.revision,
      Accept: DEFAULTS.accept,
    };
  }

  _log(level, msg, data) {
    if (this.logger && typeof this.logger[level] === 'function') this.logger[level](msg, data);
  }

  _isRetryableNetworkError(err) {
    // AbortError (timeout) and generic network failures are transient.
    return err && (err.name === 'AbortError' || err.name === 'TypeError' || /network|ECONN|ETIMEDOUT|fetch failed/i.test(err.message || ''));
  }

  async _backoff(attempt, retryAfterSeconds) {
    const ms = retryAfterSeconds != null ? retryAfterSeconds * 1000 : this.backoffBaseMs * 2 ** (attempt - 1);
    if (ms > 0) await this._sleep(ms);
  }

  async _fetchWithTimeout(url, method, body) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), this.timeoutMs);
    try {
      return await this._fetch(url, {
        method,
        headers: { ...this._headers(), ...(body ? { 'Content-Type': 'application/json' } : {}) },
        ...(body ? { body: JSON.stringify(body) } : {}),
        signal: controller.signal,
      });
    } finally {
      clearTimeout(timer);
    }
  }

  async _safeErrorBody(res) {
    try {
      const json = await res.json();
      if (json && Array.isArray(json.errors) && json.errors.length) {
        return json.errors.map((e) => e.detail || e.title).filter(Boolean).join('; ');
      }
    } catch {
      /* ignore parse errors */
    }
    return null;
  }

  _mapError(status, statusText, detail, method, pathname) {
    const where = `${method} ${pathname}`;
    const tail = detail ? ` — ${detail}` : '';
    switch (status) {
      case 401:
        return new IntegrationError(`Klaviyo rejected the API key (401) on ${where}. Check the key is current and correct in the brand .env.${tail}`, { status });
      case 403:
        return new IntegrationError(`Klaviyo denied access (403) on ${where}. The key likely lacks a required scope (e.g. Accounts:Read).${tail}`, { status });
      case 404:
        return new IntegrationError(`Klaviyo resource not found (404) on ${where}.${tail}`, { status });
      case 400:
        return new IntegrationError(`Klaviyo rejected the request (400) on ${where}. This can indicate an invalid or unsupported "revision" header (currently ${this.revision}).${tail}`, { status, revision: this.revision });
      case 429:
        return new IntegrationError(`Klaviyo rate limit (429) on ${where} — retries exhausted.${tail}`, { status });
      default:
        return new IntegrationError(`Klaviyo request failed (${status} ${statusText || ''}) on ${where}.${tail}`, { status });
    }
  }

  // Core request with retry/backoff.
  //
  // Idempotency safety: only GET is safely retryable on 5xx / network errors
  // (those are ambiguous for a write — the request may have reached the server
  // and created a resource). A POST therefore retries ONLY on 429, which means
  // the request was rejected and definitely NOT processed — so no duplicate
  // campaign can ever be created by a retry.
  async _request(method, pathname, { body } = {}) {
    const url = `${this.apiBaseUrl}${pathname}`;
    const idempotent = method === 'GET';
    let attempt = 0;
    // total tries = maxRetries + 1
    for (;;) {
      attempt += 1;
      let res;
      try {
        res = await this._fetchWithTimeout(url, method, body);
      } catch (err) {
        if (attempt <= this.maxRetries && idempotent && this._isRetryableNetworkError(err)) {
          this._log('warn', `Klaviyo ${method} ${pathname} network error (attempt ${attempt}), retrying`, { error: err.name });
          await this._backoff(attempt);
          continue;
        }
        const reason = err && err.name === 'AbortError' ? `timed out after ${this.timeoutMs}ms` : (err && err.message) || 'network error';
        throw new IntegrationError(`Klaviyo unreachable on ${method} ${pathname} (${reason}).`, { cause: err && err.name });
      }

      // 429 is always safe to retry (rejected, not processed). 5xx is retried
      // only for idempotent GETs (a write 5xx is ambiguous → surface it).
      const retryable = res.status === 429 || (res.status >= 500 && idempotent);
      if (retryable && attempt <= this.maxRetries) {
        const ra = res.headers && typeof res.headers.get === 'function' ? Number(res.headers.get('retry-after')) : NaN;
        this._log('warn', `Klaviyo ${method} ${pathname} ${res.status} (attempt ${attempt}), retrying`, { status: res.status });
        await this._backoff(attempt, Number.isFinite(ra) ? ra : undefined);
        continue;
      }

      if (!res.ok) {
        const detail = await this._safeErrorBody(res);
        throw this._mapError(res.status, res.statusText, detail, method, pathname);
      }

      this._log('debug', `Klaviyo ${method} ${pathname} ${res.status}`, { status: res.status });
      try {
        return await res.json();
      } catch {
        return null; // some 2xx responses have no body
      }
    }
  }

  // Public: read-only GET.
  get(pathname) {
    return this._request('GET', pathname);
  }

  // Public: write POST (used to CREATE a draft campaign / template / assignment —
  // never to send). The no-send guard (safety.js) ensures no send/schedule
  // endpoint is ever posted.
  post(pathname, body) {
    return this._request('POST', pathname, { body });
  }

  // Public: write PATCH (used to UPDATE an existing template — the no-duplicate
  // path). Like POST it is not retried on 5xx/network (idempotency safety).
  patch(pathname, body) {
    return this._request('PATCH', pathname, { body });
  }

  // Prove connectivity: authenticate + confirm the revision is accepted +
  // return the account id. Read-only. This is the ONLY "verify" surface in T4.
  async verifyConnectivity() {
    const json = await this.get('/accounts/');
    const account = Array.isArray(json && json.data) ? json.data[0] : json && json.data;
    const attrs = (account && account.attributes) || {};
    const contact = attrs.contact_information || {};
    return {
      ok: true,
      accountId: (account && account.id) || null,
      accountName: contact.organization_name || attrs.organization_name || null,
      testAccount: attrs.test_account ?? null,
      revision: this.revision,
      apiBaseUrl: this.apiBaseUrl,
    };
  }
}

module.exports = { KlaviyoClient, DEFAULTS };
