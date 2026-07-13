# RDD BigCommerce integration (read-only)

Proven BigCommerce v3 Catalog integration ported from *RDD Project 2* and
refactored into a per-brand factory for the unified campaign system. **All
access is read-only (GET only). No credentials are hardcoded or logged.**

## Files

| File | Purpose |
|---|---|
| `bigcommerce-client.js` | Brand-agnostic, read-only v3 Catalog client. `createBcClient(config)` factory. No store-specific values. |
| `rdd.config.js` | RDD non-secret mapping (category IDs, hero, domain) + `loadRddConfig()` / `createRddClient()`. Reads credentials from `../.env` at runtime. |
| `verify.py` | Read-only connectivity smoke test. Never prints secrets. |
| `.env.example` | Credential template (key names only). Copy to `../.env`. |

## Setup

1. Copy the template and fill in the real values (never commit `.env`):
   ```
   cp "Brands/RDD/integration/.env.example" "Brands/RDD/.env"
   ```
   Fill in `API PATH:` and `ACCESS TOKEN:`.

2. Run the live connectivity test:
   ```
   python "Brands/RDD/integration/verify.py"
   ```

## Programmatic use (read-only)

```js
const { createRddClient } = require('./rdd.config');
const bc = createRddClient();

const content = await bc.fetchEdmContent({ saleLimit: 8 }); // hero + categories + sale
const updates = await bc.getRecentlyUpdatedProducts(12);     // latest product updates
```

Each shaped product exposes: `id, name, price, salePrice, imageUrl, url,
inventoryLevel, inventoryTracking, availability, isVisible, dateModified`.

## Scope note

Only **RDD** is wired here. SS / SC / Stack are intentionally **not** implemented
yet — the client is already brand-agnostic, so adding them later is a config file
plus a per-brand `.env`, with no changes to `bigcommerce-client.js`.
