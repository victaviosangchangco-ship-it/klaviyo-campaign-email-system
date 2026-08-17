// ---------------------------------------------------------------------------
// recipient-estimation.js — best-effort recipient estimate for a draft campaign.
//
// Creates a recipient-estimation JOB, polls until it completes, then reads the
// estimated recipient count. This is a compute (read-oriented) operation — it
// does NOT send or schedule. It is BEST-EFFORT ("if available"): any error or a
// timeout returns { available:false, count:null } so it never blocks the
// orchestrator.
//
// Endpoints:
//   POST /campaign-recipient-estimation-jobs/   { data:{ type, id: campaignId } }
//   GET  /campaign-recipient-estimation-jobs/{campaignId}   → attributes.status
//   GET  /campaign-recipient-estimations/{campaignId}       → estimated_recipient_count
//
// Client is injected; sleep is injectable for offline tests.
// ---------------------------------------------------------------------------

'use strict';

const JOBS_PATH = '/campaign-recipient-estimation-jobs/';
const ESTIMATES_PATH = '/campaign-recipient-estimations/';

function createRecipientEstimator({ client, logger = null, maxWaitMs = 12000, pollMs = 1500, sleepImpl } = {}) {
  const sleep = sleepImpl || ((ms) => new Promise((r) => setTimeout(r, ms)));

  function log(level, msg) {
    if (logger && typeof logger[level] === 'function') logger[level](msg);
  }

  async function estimate(campaignId) {
    try {
      // 1. kick off the estimation job (id = campaignId)
      await client.post(JOBS_PATH, { data: { type: 'campaign-recipient-estimation-job', id: campaignId } });

      // 2. poll the job until complete (bounded)
      let waited = 0;
      let status = 'queued';
      // total polls bounded by maxWaitMs / pollMs
      // eslint-disable-next-line no-constant-condition
      while (true) {
        const jobRes = await client.get(`${JOBS_PATH}${encodeURIComponent(campaignId)}/`);
        status = (jobRes && jobRes.data && jobRes.data.attributes && jobRes.data.attributes.status) || 'unknown';
        if (status === 'complete' || status === 'failed' || status === 'error') break;
        if (waited >= maxWaitMs) break;
        await sleep(pollMs);
        waited += pollMs;
      }
      if (status !== 'complete') {
        log('warn', `Recipient estimate not ready (status=${status}); reporting unavailable.`);
        return { available: false, count: null, status };
      }

      // 3. read the estimate
      const estRes = await client.get(`${ESTIMATES_PATH}${encodeURIComponent(campaignId)}/`);
      const count = estRes && estRes.data && estRes.data.attributes && estRes.data.attributes.estimated_recipient_count;
      if (typeof count !== 'number') return { available: false, count: null, status };
      return { available: true, count, status };
    } catch (err) {
      log('warn', `Recipient estimate failed (${err.message}); reporting unavailable.`);
      return { available: false, count: null, status: 'error', error: err.message };
    }
  }

  return { estimate };
}

module.exports = { createRecipientEstimator, JOBS_PATH, ESTIMATES_PATH };
