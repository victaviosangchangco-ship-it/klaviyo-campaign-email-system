// ---------------------------------------------------------------------------
// rdd.config.js — RDD-specific (non-secret) BigCommerce mapping + wiring.
//
// This file contains ONLY non-secret, store-structural values (category IDs,
// hero product, canonical domain). Credentials are NEVER stored here — they are
// read at runtime from Brands/RDD/.env via loadEnv().
//
// Values below are carried over from the proven RDD Project 2 integration.
// ---------------------------------------------------------------------------

'use strict';

const path = require('path');
const { loadEnv, parseStoreHashFromApiPath, createBcClient } = require('./bigcommerce-client');

// --- Design -> BigCommerce mapping (RDD; non-secret) -----------------------
// Resolved by category ID, not slug (the v3 catalog API has no slug filter).
const FEATURED_CATEGORY_IDS = [
  460, // Aframe Sign and Sandwich Board
  505, // Snap Frames
  560, // Ergonomic Office Chair
  541, // Sit Stand Desk
  554, // Desk Accessories
  558, // Mobile Pedestal
];

const SALE_CATEGORY_ID = 579; // "On Sale Now"
const HERO_PRODUCT_ID = 1379; // ErgoDC Ergonomic Office Chair (fixed hero)
const STORE_DOMAIN = 'https://www.retaildisplaydirect.com.au';

// Path to the RDD brand .env (one brand, one credentials file).
const ENV_PATH = path.join(__dirname, '..', '.env');

// Build the resolved config from .env (secrets) + the mapping above (non-secret).
// Throws (via the client) only when a network call is attempted without creds,
// but we also surface a clear early error here for the verify/wiring path.
function loadRddConfig({ envPath = ENV_PATH } = {}) {
  const raw = loadEnv(envPath);

  const apiPath = raw['API PATH'] || raw['API_PATH'] || raw['BIGCOMMERCE_API_PATH'];
  const token =
    raw['ACCESS TOKEN'] || raw['BIGCOMMERCE_ACCESS_TOKEN'] || raw['X-Auth-Token'] || raw['ACCESS_TOKEN'];
  const storeHash =
    raw['STORE HASH'] ||
    raw['BIGCOMMERCE_STORE_HASH'] ||
    raw['STORE_HASH'] ||
    parseStoreHashFromApiPath(apiPath);

  return {
    token,
    storeHash,
    storeDomain: raw['STORE DOMAIN'] || raw['STORE_DOMAIN'] || STORE_DOMAIN,
    featuredCategoryIds: FEATURED_CATEGORY_IDS,
    saleCategoryId: SALE_CATEGORY_ID,
    heroProductId: HERO_PRODUCT_ID,
    // convenience flags for callers/QA — booleans only, never the values.
    hasToken: Boolean(token),
    hasStoreHash: Boolean(storeHash),
  };
}

// Convenience factory: a ready-to-use, read-only RDD client.
function createRddClient(options) {
  return createBcClient(loadRddConfig(options));
}

module.exports = {
  FEATURED_CATEGORY_IDS,
  SALE_CATEGORY_ID,
  HERO_PRODUCT_ID,
  STORE_DOMAIN,
  ENV_PATH,
  loadRddConfig,
  createRddClient,
};
