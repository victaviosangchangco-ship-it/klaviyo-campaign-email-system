// ---------------------------------------------------------------------------
// bitable-client.js — READ-ONLY Lark Base (Bitable) transport.
//
// Exposes exactly one operation:
//
//     GET {baseUrl}/bitable/v1/apps/{app_token}/tables/{table_id}/records
//         ?view_id=…&page_size=…&page_token=…
//
// which lists records from a table, optionally through a saved view. Pagination
// follows `has_more` + `page_token` until exhausted.
//
// READ-ONLY BY CONSTRUCTION: this class has no create/update/delete method and
// references no write endpoint. Every request it can issue is an HTTP GET — the
// `_get` helper hard-codes the method, so a write cannot be introduced by a
// caller passing options. A unit test asserts this.
//
// SECURITY: the tenant access token is fetched from the injected LarkAuth per
// request and placed only in the Authorization header. It is never logged and
// never included in error details.
// ---------------------------------------------------------------------------

'use strict';

const { IntegrationError, ConfigError } = require('../../common/errors');

const DEFAULTS = {
  timeoutMs: 15000,
  maxRetries: 3,
  backoffBaseMs: 300,
  pageSize: 500,
  // Hard stop so a pathological has_more loop can never run forever.
  maxPages: 100,
};

class LarkBitableClient {
  // opts: { baseUrl, auth, logger?, timeoutMs?, maxRetries?, backoffBaseMs?,
  //         maxPages?, fetchImpl?, sleepImpl? }
  constructor(opts = {}) {
    if (!opts.baseUrl) throw new ConfigError('LarkBitableClient requires baseUrl.');
    if (!opts.auth || typeof opts.auth.getTenantAccessToken !== 'function') {
      throw new ConfigError('LarkBitableClient requires an auth object with getTenantAccessToken().');
    }

    this.baseUrl = String(opts.baseUrl).replace(/\/$/, '');
    this.auth = opts.auth;
    this.logger = opts.logger || null;
    this.timeoutMs = opts.timeoutMs ?? DEFAULTS.timeoutMs;
    this.maxRetries = opts.maxRetries ?? DEFAULTS.maxRetries;
    this.backoffBaseMs = opts.backoffBaseMs ?? DEFAULTS.backoffBaseMs;
    this.maxPages = opts.maxPages ?? DEFAULTS.maxPages;

    this._fetch = opts.fetchImpl || globalThis.fetch;
    this._sleep = opts.sleepImpl || ((ms) => new Promise((r) => setTimeout(r, ms)));

    if (typeof this._fetch !== 'function') {
      throw new ConfigError('No fetch implementation available (Node >= 18 or inject fetchImpl).');
    }
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

  // Issue one GET. The method is hard-coded — there is no way to send anything else.
  async _get(pathname, query = {}, { allowAuthRetry = true } = {}) {
    const url = new URL(`${this.baseUrl}${pathname}`);
    for (const [k, v] of Object.entries(query)) {
      if (v != null && v !== '') url.searchParams.set(k, String(v));
    }

    let lastErr = null;

    for (let attempt = 0; attempt <= this.maxRetries; attempt++) {
      if (attempt > 0) await this._sleep(this.backoffBaseMs * 2 ** (attempt - 1));

      const token = await this.auth.getTenantAccessToken();

      let res;
      try {
        const controller = new AbortController();
        const timer = setTimeout(() => controller.abort(), this.timeoutMs);
        try {
          res = await this._fetch(url.toString(), {
            method: 'GET', // read-only, always
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json; charset=utf-8',
            },
            signal: controller.signal,
          });
        } finally {
          clearTimeout(timer);
        }
      } catch (err) {
        lastErr = err;
        if (this._isRetryableNetworkError(err) && attempt < this.maxRetries) continue;
        throw new IntegrationError(`Lark Base request failed: ${err.message}`, { system: 'lark' });
      }

      // An expired/revoked token: refresh once, then retry.
      if (res.status === 401 && allowAuthRetry) {
        this.auth.invalidate?.();
        allowAuthRetry = false; // eslint-disable-line no-param-reassign
        continue;
      }

      if (res.status === 429 || res.status >= 500) {
        lastErr = new IntegrationError(`Lark Base HTTP ${res.status}`, { system: 'lark', status: res.status });
        if (attempt < this.maxRetries) continue;
        throw lastErr;
      }

      let body;
      try {
        body = await res.json();
      } catch (err) {
        throw new IntegrationError(`Lark Base returned a non-JSON response (HTTP ${res.status}).`, {
          system: 'lark',
          status: res.status,
        });
      }

      if (!res.ok || !body || body.code !== 0) {
        const code = body && body.code;
        const msg = (body && body.msg) || `HTTP ${res.status}`;
        throw new IntegrationError(`Lark Base read failed (code ${code ?? 'n/a'}): ${msg}`, {
          system: 'lark',
          code: code ?? null,
          status: res.status,
        });
      }

      return body.data || {};
    }

    throw lastErr || new IntegrationError('Lark Base request failed.', { system: 'lark' });
  }

  // List every record in a table (optionally through a view), following pagination.
  // Returns { records: [{ record_id, fields }], pages, total }.
  async listRecords({ appToken, tableId, viewId = null, pageSize = DEFAULTS.pageSize } = {}) {
    if (!appToken) throw new ConfigError('listRecords requires appToken.');
    if (!tableId) throw new ConfigError('listRecords requires tableId.');

    const pathname = `/bitable/v1/apps/${encodeURIComponent(appToken)}/tables/${encodeURIComponent(tableId)}/records`;

    const records = [];
    let pageToken = null;
    let pages = 0;
    let total = null;

    do {
      const data = await this._get(pathname, {
        view_id: viewId,
        page_size: pageSize,
        page_token: pageToken,
      });

      const items = Array.isArray(data.items) ? data.items : [];
      records.push(...items);
      pages += 1;
      if (total == null && Number.isFinite(Number(data.total))) total = Number(data.total);

      pageToken = data.has_more ? data.page_token || null : null;

      if (pageToken && pages >= this.maxPages) {
        throw new IntegrationError(
          `Lark Base pagination exceeded ${this.maxPages} pages — aborting to avoid an unbounded read.`,
          { system: 'lark', pages }
        );
      }
    } while (pageToken);

    this._log('debug', `Lark Base: read ${records.length} record(s) across ${pages} page(s).`, {
      tableId,
      viewId,
    });

    return { records, pages, total: total == null ? records.length : total };
  }
}

module.exports = { LarkBitableClient, DEFAULTS };
