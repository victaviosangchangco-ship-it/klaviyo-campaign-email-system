# Product Source

Campaigns are populated with **live product data pulled directly from the
brand's e-commerce platform** at generation time. Product names, prices, sale
prices, stock, images, and URLs are **never hardcoded** into templates — they
are fetched fresh so each send reflects the current catalog.

## RDD — BigCommerce (implemented, read-only)

RDD's product source is the **BigCommerce v3 Catalog API**, accessed through the
ported, proven integration at `Brands/RDD/integration/`.

- **Access mode:** read-only (GET requests only). Nothing ever writes to the store.
- **Credentials:** loaded at runtime from `Brands/RDD/.env` (git-ignored, never
  committed, never logged). Only the "Products: read-only" OAuth scope is required.
- **What it fetches:**
  - Latest products (names, URLs, images)
  - Prices and sale prices (`calculated_price`, `sale_price`)
  - Stock / availability (`inventory_level`, `inventory_tracking`, `availability`,
    `is_visible`)
  - Product updates / freshness (`date_modified`, plus a "recently updated"
    helper sorted `date_modified` desc)
  - Featured categories and a fixed hero product (design → catalog mapping)
- **Design → catalog mapping** is by **category ID** (the v3 API has no slug
  filter). RDD's featured category IDs, sale category, and hero product live in
  `Brands/RDD/integration/rdd.config.js` (non-secret values only).

See `Brands/RDD/integration/README.md` for setup and programmatic usage.

## SS / SC / Stack

**Not yet implemented.** SS (Safety Sector) is documented as BigCommerce but its
store hash / token are still *To be confirmed*; SC and Stack are unconfirmed. The
client (`bigcommerce-client.js`) is already brand-agnostic, so each brand is added
later as a config file plus a per-brand `.env` — no change to the core client.

## Temporary source (pre-connection)

Until a brand's API feed is confirmed, the brand's public website is used only as
a human reference. It is **not** a data source — no product names or prices are
scraped or hardcoded from it.
