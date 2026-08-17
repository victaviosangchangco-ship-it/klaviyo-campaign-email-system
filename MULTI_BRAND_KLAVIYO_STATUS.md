# Multi-Brand Klaviyo Integration — Status

_Last updated: 2026-08-09. Companion to CLAUDE.md §12. No credentials appear in this file._

**RDD is the reference implementation.** SS and SC reuse the identical, already brand-parameterized
architecture (`loadBrandConfig` → `loadKlaviyoConfig` → `KlaviyoClient` → `live-orchestrator`). Adding a
brand is **config + a git-ignored `.env`**, not new code.

## Credential model (IMPLEMENTED, all brands)

| Brand | Klaviyo account (live-verified) | Key env var | Secret file (git-ignored) | Config |
|-------|--------------------------------|-------------|---------------------------|--------|
| RDD | `XAUdQX` — Retail Display Direct | `KLAVIYO_API_KEY` | `Brands/RDD/.env` | `config/brands/RDD.config.json` |
| SS  | `T7SuPP` — Safety Sector | `SS_KLAVIYO_API_KEY` | `Brands/SS/.env` | `config/brands/SS.config.json` |
| SC  | `W2Ua5v` — Sector Care | `SC_KLAVIYO_API_KEY` | `Brands/SC/.env` | `config/brands/SC.config.json` |

- Keys live ONLY in `Brands/<CODE>/.env` (`.gitignore` → `Brands/**/.env`). Never in source/config/tests/
  logs/docs/diffs. The config loader exposes a `hasApiKey` flag only — never the key value.
- **Brand-prefixed env var names** = strict isolation: a stray global var cannot satisfy two brands, and a
  brand never resolves another brand's key. Proven by `platform/tests/brand-isolation.test.js`.

## Per-brand capability status

| Capability | RDD | SS | SC |
|---|---|---|---|
| Klaviyo key resolution + isolation | ✅ IMPLEMENTED | ✅ IMPLEMENTED | ✅ IMPLEMENTED |
| Live read-only account/audience/template access | ✅ | ✅ | ✅ |
| Brand config (identity, tokens, klaviyo block) | ✅ full | ✅ grounded, partial¹ | ✅ grounded, partial¹ |
| Draft-only safety (`NOT_APPROVED_TO_SEND`) | ✅ | ✅ | ✅ |
| Preview Text auto-generation (§6.24) | ✅ | ✅ (brand-agnostic) | ✅ (brand-agnostic) |
| Product source (BigCommerce) | ✅ (own store) | ⏳ shared store²  | ⏳ shared store² |
| Calendar rows | ✅ | ✅ (SS-2026-32, W32) | ✅ (SC-2026-32, W32) |
| End-to-end `--klaviyo` DRAFT creation | ✅ | ✅ (draft created 2026-08-10) | ✅ (draft created 2026-08-10) |

¹ Grounded in each brand's approved in-repo outputs + brand doc, confidence-tagged. `[Inferred]` /
  `To be confirmed` values (verified sender, audience/list, SS privacy URL, exact design tokens) must be
  confirmed before a real send; they do NOT block credential resolution or read-only validation.
² SS and SC SHARE one BigCommerce store (`498h0egvgn`) — see the "VERIFIED architecture" section below.
  Config + shared credential scaffolding are in place; the shared read-only token + each brand's category
  ids are still pending. Until then, invoking the product pipeline STOPS with an actionable
  `IntegrationError` rather than fabricating products (CLAUDE.md §5.1).
³ RESOLVED 2026-08-10. The only gaps were DATA, not code: (a) no SS/SC rows in the runtime calendar, and
  (b) no SS/SC weekly `defaults` in config/content-calendar.json (so the pipeline's `resolveSlot` threw).
  Adding SS/SC rows to the source XLSX (`npm run calendar:import`) + SS/SC `defaults` produced real Klaviyo
  drafts via the SAME shared orchestrator — SS→segment "60D Active Customers", SC→list "SC - All
  Subscribers", each in its own account, status Draft, nothing sent. SS also needed its (previously null)
  `privacyUrl` populated from the live HTTP-200 page to clear a footer `bad-hrefs` QA blocker; confirm with
  SS before a real send.

## BigCommerce product source — VERIFIED architecture (SS + SC share ONE store)

**SS and SC share a single BigCommerce store** (hash `498h0egvgn`), served as **two storefronts**. RDD is a
**separate** store. Verified from project files: product image URLs in the approved SS **and** SC sends all
resolve to `cdn11.bigcommerce.com/s-498h0egvgn/`, while product links go to `safetysector.com.au` (SS) vs
`sectorcare.com.au` (SC). Confirmed by the stated business setup.

```
RDD store (ugqmr0qfvf) ─────────────────────► RDD ──► RDD Klaviyo (XAUdQX)

Shared store (498h0egvgn)
   ├─ storefront safetysector.com.au ──► SS ──► SS Klaviyo (T7SuPP)   [isolated]
   └─ storefront sectorcare.com.au   ──► SC ──► SC Klaviyo (W2Ua5v)   [isolated]
```

| Brand | Storefront | BigCommerce store | Credential file | Klaviyo account |
|-------|-----------|-------------------|-----------------|-----------------|
| RDD | retaildisplaydirect.com.au | `ugqmr0qfvf` (own) | `Brands/RDD/.env` (present, unchanged) | `XAUdQX` |
| SS  | safetysector.com.au | `498h0egvgn` (shared) | `Brands/_shared/.env` (shared, ❌ token pending) | `T7SuPP` |
| SC  | sectorcare.com.au | `498h0egvgn` (shared) | `Brands/_shared/.env` (shared, ❌ token pending) | `W2Ua5v` |

**Credentials are NOT duplicated.** SS and SC both point `bigcommerce.envPath` at the single shared file
`Brands/_shared/.env` (git-ignored). One read-only token for store `498h0egvgn` serves both.

**Klaviyo stays strictly isolated** — a shared product source does NOT mean a shared Klaviyo account. Each
brand keeps its own Klaviyo key file + brand-prefixed env var (`Brands/SS/.env` / `SS_KLAVIYO_API_KEY`,
`Brands/SC/.env` / `SC_KLAVIYO_API_KEY`). Proven by `platform/tests/bigcommerce-isolation.test.js`.

**No code change was needed** — the integration already supports this:
- `Brands/RDD/integration/bigcommerce-client.js` is a brand-agnostic `createBcClient(config)` factory; its
  `loadEnv` reads the file only (no `process.env`), so there is no global-var leakage.
- `platform/integrations/bigcommerce/adapter.js` loads creds from `brand.bigcommerce.envPath` and builds
  product URLs from each brand's own `storeDomain` — so two brands can share a store yet resolve URLs to
  their own storefront. It throws `IntegrationError` **before any network call** when creds are absent, and
  never fabricates products (CLAUDE.md §5.1).

**Brand separation — VALIDATED live (read-only) 2026-08-09.** The store (`498h0egvgn`, org name "Safety
Sector") separates SS and SC by **BigCommerce channel + category tree**:

| Brand | Channel | Category tree | Storefront | Scope in config |
|-------|---------|---------------|-----------|-----------------|
| SS | `1` | tree `1` "Default catalog tree" | safetysector.com.au | `channelId:1`, `categoryTreeId:1`, SS-clean `featuredCategoryIds` |
| SC | `1786273` | tree `2` "SectorCare" | sectorcare.com.au | `channelId:1786273`, `categoryTreeId:2`, tree-2 `featuredCategoryIds` |

Catalog size: 603 variants; primary category "Access Ramp". Live retrieval through the real adapter returned
SS products (bollards, tactiles) at `safetysector.com.au` and SC products (rollators, bath aids) at
`sectorcare.com.au`, all images from `cdn11.bigcommerce.com/s-498h0egvgn/`.

**Cross-listing caveat (handled).** Most SC products are *also* assigned into tree-1 categories (38/45
sampled), specifically `120 Access Ramp` (MIXED), `137 Healthcare` (all-SC) and `195 Mobility Aids` (all-SC).
Those three are **excluded** from SS's `featuredCategoryIds`; SS's configured categories were each verified to
return **0** SectorCare-tagged products. SS and SC `featuredCategoryIds` are disjoint (test-enforced). A few
category *names* exist in both trees (e.g. "Mobility Aids"), so calendars should use brand-specific category
names; the `channelId`/`categoryTreeId` are recorded as the authoritative separator.

**Active mixing guard.** SS/SC set `bigcommerce.requireExplicitScoping: true`; the adapter refuses the generic
store-wide candidate/recently-updated pool for them up front (any source, before any network), so a campaign
can never be built from a brand-ambiguous set. RDD is unflagged and unaffected.

**Channels API note.** The read-only token does not carry Channels-read scope (`GET /channels` → 403), but the
authoritative `channel↔tree` mapping is readable via `GET /catalog/trees`, which is what the separation relies
on. No Channels scope is required for product retrieval.

**Remaining (retrieval-phase) note.** Category-name resolution in the adapter is not yet tree-scoped, so a name
that exists in two trees resolves to the lowest category id. It works today because SS/SC use brand-specific
category names, but making resolution `categoryTreeId`-aware is a recommended hardening for the retrieval phase
(no change made this turn — validation + config only).

## To enable an end-to-end SS or SC draft (future work)

1. Add BigCommerce (or another approved) read-only creds to `Brands/<CODE>/.env` (`API PATH`,
   `ACCESS TOKEN`) and `featuredCategoryIds` (+ `storeHashHint` for SS) to the brand config.
2. Add SS/SC rows to the calendar source (Lark XLSX → `npm run calendar:import`), including a
   `list`/`segment` name that exists in that brand's Klaviyo account (see below).
3. Confirm a verified Klaviyo sender (`from_email`) and audience for the brand.
4. Run `node platform/engine/cli.js create --brand SS|SC --klaviyo` → review the draft. Nothing sends.

## Audience note (from live read-only enumeration)

Each account's audiences are its own. Example live audiences: SS lists include `Role Accounts (Cautious)`,
segments `Engaged 240D` / `60D Active Customers`; SC lists include `SectorCare Subscribers` / `Email List`,
segments `SC - VIP Eligible` / `SC - Winback Eligible`. When SS/SC calendar rows are added, their
`list`/`segment` names must map to real audiences in the matching account, or the draft build fails safely
(never picks an unrelated audience — draft-campaign-service `resolveAudience`).

## Out of scope / still future

- **Lark Base API is NOT connected.** Calendar flow remains: Lark Base → export XLSX →
  `npm run calendar:import` → `config/campaign-calendar.generated.json`.
- No scheduling, no sending, no approve-for-send — permanently (safety.js no-send guard).
