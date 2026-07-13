# Email Platform Requirements

## Integrations overview

| System | Role | Status | Access |
|---|---|---|---|
| BigCommerce v3 Catalog API | Live product/pricing/stock/image source | **RDD implemented**; SS/SC/Stack pending | Read-only (GET) |
| Klaviyo | Email platform (templates, dynamic tags, send) | Existing docs/components | — |

## BigCommerce (RDD)

The RDD integration is a **read-only** port of the proven *RDD Project 2* code,
refactored into a per-brand factory. It lives at `Brands/RDD/integration/`.

- **No writes.** Every call is a GET against the v3 Catalog API.
- **No secrets in code.** Credentials are read at runtime from `Brands/RDD/.env`
  (git-ignored). The access token is never printed or logged; error messages name
  the missing **keys**, never values.
- **Credential template:** `Brands/RDD/integration/.env.example`.
- **Connectivity check:** `python "Brands/RDD/integration/verify.py"`.
- **Runtime:** Node ≥ 18 (built-in `fetch`) for the JS client; Python 3 stdlib
  only for the verifier (no third-party dependencies).

### OAuth scope

The store API account only needs **Products: read-only** (Content / Products read).
No write, order, or customer scopes are required or requested.

## Klaviyo

Standard, brand-agnostic dynamic tags remain as documented elsewhere
(`{% catalog … %}`, `{% coupon_code … %}`, `{{ manage_preferences_url }}`,
`{% unsubscribe %}`, `event.*`, `person.*`). Wiring the BigCommerce product data
into the Klaviyo generation workflow is the **next** step (see the blockers noted
in `Product-Source.md` and the integration README) and is intentionally not done
yet.
