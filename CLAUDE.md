# CLAUDE.md — Klaviyo Campaign Email System (Production)

Lean operational router. Read only the files required for the current task — never recursively load
every linked document. Detailed standards live in `Standards/`, components in `Components/`, brand
facts in `03-Brands MD Files/`, playbooks in `Playbooks/`. Full legacy reference: `Archive/CLAUDE-LEGACY.md`
(archival — MUST NOT be loaded during normal campaign generation).

---

## 1. Project Role

- **Production** workspace for email campaigns — briefed, generated, reviewed, shipped.
- **Completely separate** from the Klaviyo Flow project.
- The BRD defines *what/why/standards*; this workspace *executes* them. Never blur the two.

## 2. Source of Truth Hierarchy

On conflict, the higher source wins:

1. **BRD** — `BRD.md` (compiled, read-only). Edit sources in `00-…`–`09-…` folders, never BRD.md.
2. **Brand facts** — `03-Brands MD Files/<CODE>.md`.
3. **Visual system** — `Shared/design-tokens.md` + `Shared/Fonts/font-stacks.md`.
4. **The send's `Brief/`** — the specific campaign instance.

Shared governance layers (`Shared/Engineering/`) and standards (STD-CREATIVE, STD-DESIGN, STD-HERO,
Cerberus) sit above this list on conflict. See `Shared/Engineering/Engineering-Document-Relationships.md`.

> `BrandConfig.md` and `Design.md` do not exist here — they are Flow-project documents.

## 3. Context-Efficiency Policy

**Read only files required for the current task.**

- Do not recursively read every linked document.
- Do not read previous campaigns or historical reviews unless the task requires comparison/debugging.
- Prefer targeted sections/searches over loading an entire large reference document.
- `Archive/CLAUDE-LEGACY.md` is archival. MUST NOT be loaded during normal campaign generation.
- Reusable findings belong in the appropriate canonical standard or runtime contract.
  Do not grow CLAUDE.md unless the rule applies to nearly every task in this repository.
- Do not load the full BRD.md for every campaign — use only if requirements are ambiguous.
- Do not load the full `config/campaign-calendar.generated.json` — resolve campaigns through the
  calendar service (`getCampaignById`, `getCampaignByWeek`, `getNextCampaign`).
- Do not automatically load `Shared/design-tokens.md` or `Shared/Fonts/font-stacks.md` — normal
  generation uses values already baked into components/templates. Load only for visual system decisions.

## 4. Task Router — load ONLY what the task needs

**Cadence vs topic_category_slug vs campaign_type — THREE separate concepts, not two
(disambiguated 2026-09 — a prior version of this section used "campaign_type" for two
different things):**
- **`cadence`** = structural workflow (weekly, monthly, product-launch, holiday, seasonal,
  category, clearance, brand-story, educational, automation). Determines: playbook, template
  family, folder path, structural workflow. Use cadence to select the Playbook.
- **`topic_category_slug`** (Calendar Service field; was named `campaign_type` before the
  2026-09 rename) = a slug DERIVED from the calendar's topic/type text (product-insights,
  promotional-sale, holiday-gifting, clearance, educational-tips, etc.). Determines: messaging
  approach, content emphasis, promotional vs editorial treatment. Use it for content decisions.
- **`campaign_type`** (a real Lark planning-taxonomy column, added 2026-09-18) = a human
  SINGLE_SELECT: Product Focus / Seasonal / BAU / Promo / Educational. Planning-tier only
  today — carried through import as a passthrough extra, not read by any generation/Klaviyo
  code path. Do not confuse it with `topic_category_slug` above; they come from different Lark
  columns and mean different things despite once sharing a name.
- **Resolve campaigns through the calendar service** (`getCampaignById`, `getCampaignByWeek`,
  `getNextCampaign`). Do NOT load the full `config/campaign-calendar.generated.json` into prompt
  context.
- **Calendar source of truth: live Lark (default), generated JSON is an explicit fallback
  only.** `--calendar json` opts into `config/campaign-calendar.generated.json`, which is
  refused if it is >= 10 days stale (`--allow-stale-calendar` overrides). A stale JSON export
  previously caused a wrong date/topic/audience to resolve for a live campaign — never trust it
  as current without checking `_generatedAt`.
- **Only `pending`/unset-status calendar rows resolve automatically.** `sent`, `superseded`,
  `archived`, and `cancelled` rows are excluded from week/next-campaign auto-resolution (not
  from an explicit `--campaign <id>` lookup, which always works). Never hand-pick a superseded
  row's content for a new send — check `status` first.
- **Minimum fields a calendar row needs for a reliable Klaviyo draft:** `campaign_id`,
  `scheduled_date`, `subject_line`, `product_categories` (resolvable to a real in-stock
  BigCommerce category), `audience_type` + `audience_name`/`audience_id` for at least one of
  list/segment, `key_topic`, and a cadence signal (a structural id token or an explicit
  `cadence` column). `audience_name` must match a REAL, currently-live Klaviyo list/segment —
  the draft service refuses loudly (never silently substitutes) if it doesn't resolve.
- **Multi-category `product_categories` is supported** (comma-separated, e.g. "Rope Barriers
  and Posts, Retractable Barriers and Posts, Expandable Barriers") — products are resolved and
  merged across every named category. If ANY part fails to resolve, the whole campaign STOPS
  rather than silently dropping part of the stated theme.
- **If cadence is null or unresolvable: STOP and report.** Never guess a cadence.

**Campaign resolution precedence:**
- **`--campaign <id>`** = exact campaign_id lookup. Authoritative. Always preferred.
- **`--week <YYYY-Www>`** = ISO send-date week lookup. Convenience only. If multiple
  same-brand campaigns exist in that week: STOP and require `--campaign`.
- **Neither flag** = soonest upcoming campaign for the brand.
- **Both flags** = exact campaign_id is used, but its send_date must fall in the
  requested ISO week or the system stops (consistency check).
- Campaign sequence numbers are NOT ISO week numbers. `RDD-2026-38` means campaign
  #38 in the sequence — its ISO week is determined by its `send_date`.

Start from `07-Prompt Library/00-START-HERE.md` to select the cadence and playbook.

| Task | Load |
|------|------|
| **Any campaign** | This file → brand facts → campaign-type Playbook → Brief → Components |
| **HTML generation** | + `07-Prompt Library/Generate-HTML.md` + `Standards/email-safety-contract.md` |
| **Product grid** | + `Standards/product-grid-contract.md` (impl: `Components/product-grid.html`) |
| **Hero assembly** | + `Standards/hero-contract.md` (impl: `Components/hero-image.html`) |
| **QA / review** | + `07-Prompt Library/QA-Checklist.md` (self-contained) |
| **Klaviyo draft** | + `Standards/klaviyo-contract.md` |
| **Coupon/promo** | + `Standards/coupon-contract.md` (ONLY when the campaign has a promotion) |
| **GIF campaign** | + `Standards/gif-contract.md` (ONLY when a GIF is involved) |
| **Navigation** | + `Standards/navigation-contract.md` (ONLY when the user requests a nav) |
| **New Hero arch** | + `Shared/Email-Hero-Engineering-Standard.md` (full 1,422-line standard) |
| **New design** | + `Shared/Creative-Workflow-Standard.md` + `Shared/Email-Design-System/` |
| **Cerberus ref** | + `Shared/Frameworks/Cerberus/FRAMEWORK-README.md` → relevant analysis doc |
| **Engineering** | + `Shared/Engineering/` (governance, ADRs, change management) |
| **BRD questions** | + `BRD.md` (only when business requirements are ambiguous) |

## 5. Brand Router

| Brand | Facts | Config | Product source | Klaviyo key var |
|-------|-------|--------|----------------|-----------------|
| **RDD** | `03-Brands MD Files/RDD.md` | `config/brands/RDD.config.json` | BigCommerce `ugqmr0qfvf` | `KLAVIYO_API_KEY` |
| **SS** | `03-Brands MD Files/SS.md` | `config/brands/SS.config.json` | BigCommerce `498h0egvgn` (shared w/ SC) | `SS_KLAVIYO_API_KEY` |
| **SC** | `03-Brands MD Files/SC.md` | `config/brands/SC.config.json` | BigCommerce `498h0egvgn` (shared w/ SS) | `SC_KLAVIYO_API_KEY` |

- One brand = one Klaviyo account = one key in `Brands/<CODE>/.env` (git-ignored).
- SS + SC share one BigCommerce store; separate brands by `featuredCategoryIds` + `storeDomain`.
- Brand-specific rules (logo alignment, product exclusions, RDD design defaults, SC promo rules)
  live in each brand's MD file — not in this router.

## 6. Global Non-Negotiable Safety Rules

These apply to EVERY task, EVERY campaign type, EVERY brand. No exceptions.

1. **Never invent** product names, prices, SKUs, URLs, images, coupon codes, or brand values.
   Missing information → STOP and request clarification.
2. **Never send, schedule, or activate** a Klaviyo campaign. Draft creation is the maximum automation.
3. **Every link must be live and verified** — HTTP 200, no `#`/empty/placeholder/localhost.
4. **Every product verified on its own product page** — active, visible, in stock, real price.
5. **Brand isolation** — never use one brand's Klaviyo key, audience, or product source for another.
6. **Draft-only Klaviyo** — `safety.js` no-send guard. Every result `NOT_APPROVED_TO_SEND`.
7. **Separation of duties** — reviewer/approver ≠ author.
8. **Never edit BRD.md** from production work. Raise issues against the modular sources.
9. **No fabricated products** to reach a count. Report the blocker instead.
10. **Credentials** live ONLY in git-ignored `.env` files. Never in source, config, tests, logs, or docs.
11. **Verify live product-level stock before a send, not just category presence.** A category
    listing can show "Add to Cart" while individual products are out of stock — check
    `inventory_level` per product. This matters most for a broad-audience send (a large list
    or a Storewide/holiday audience): weigh product/category value against audience size, and
    flag a low-depth or low-value category on a broad send for commercial review rather than
    shipping it unexamined.
12. **A blocked write/tool call is a hard stop — never retried via a different tool, shell, or
    API to route around the denial.** Switching from Bash to PowerShell (or any other tool)
    after a permission denial is a bypass, not a workaround. Wait for explicit approval.

## 7. Structure Lock

Existing proven campaign architecture MUST NOT be casually rewritten during normal generation.

**Content/data MAY change:** subject, preview text, copy, products, verified prices/URLs/images,
approved brand tokens, campaign-specific section text, optional section inclusion/exclusion.

**Structure MUST remain locked** (change only with explicit approval):
- Email container architecture + base-head client resets
- MSO conditionals + table hierarchy
- Header architecture + responsive classes
- Hero fluid-image architecture
- Product-card architecture + product-grid fixed-height regions
- Mobile stacking mechanism + price badge architecture
- Dark-mode handling + Gmail/Outlook fixes
- Footer compliance architecture

**Claude must ASSEMBLE from approved components, not rewrite stable HTML.**

If a normal campaign appears to require new structural HTML: **STOP and report why** before
changing the architecture.

## 8. File-Driven Workflow

Every send moves through stages in `Brands/<CODE>/Campaigns/<Type>/`:

| Stage | Folder | Purpose |
|-------|--------|---------|
| 1 | `Brief/` | Capture brief from Content Calendar |
| 2 | `References/` | Visual direction (reference images) |
| 3 | `Assets/` | This send's image files |
| 4 | `Draft/` | Build HTML — versioned `-draft-vN.html` (**keep all versions**) |
| 5 | `Review/` | QA notes, feedback, approval status |
| 6 | `Output/` | Approved artifact only — populated by an explicit approval step, never by automatic generation |

### Pipeline rules

- **Never skip Draft.** HTML is authored in `Draft/` first, always.
- **Automatic generation writes Draft/ only.** Output/ is populated ONLY by an explicit, human-gated
  approval step — never automatically mirrored on every draft.
- **Output ≠ approval.** Approval is tracked in `Brief/` + `Review/`, not by file presence.
- **Blockers never reach Output.** An unreviewed/blocked Draft is never promoted; only an
  explicitly-approved Draft is copied to Output/.
- **Revisions are new Draft versions.** Never hand-edit Output directly.

### Campaign cadences (structural workflow types)

Weekly · Monthly · Product Launch · Holiday · Seasonal · Category · Clearance · Brand Story ·
Educational · Automation. Each has its own Playbook and (where populated) Generate prompt in
`07-Prompt Library/`. The campaign's `cadence` field selects the Playbook; its `campaign_type`
field selects the content/theme approach. Start from `00-START-HERE.md` to route.

Holiday campaigns live in `Campaigns/Holiday/<Event>/` (one folder per event, reused yearly).
Holiday lead time: **≥ 14 days** before the event.

## 9. Campaign Content Rules

- **No repeated messaging** across sections. Each section has a distinct purpose.
- **Fresh each week** — new theme, hero, headline. Carry forward structure and brand vibe only.
- **One introduction** — hero establishes the theme; later sections support, not restate.
- **Review as one experience** — read end-to-end, remove redundancy.
- **Intro copy:** one short paragraph max. No em dashes. Does not restate the hero.
- **Product count:** 10 default (Weekly), 14–16 for range coverage, per Brief.
- **Theme consistency mandatory.** Every product in a send matches the campaign theme.
- **Preview text:** calendar value if present (verbatim); else generate from campaign context.
  Never empty. Never duplicates the subject.
- **Icons:** monochrome outline/line only (Apple/Stripe aesthetic). Never emoji or cartoon.
- **Footer:** minimalist, professional, compact. Unsubscribe + Privacy Policy.
  Manage Preferences only when explicitly requested.

## 10. Naming Conventions

| Artifact | Pattern | Example |
|----------|---------|---------|
| Weekly HTML | `<CODE>-YYYY-Www.html` | `RDD-2026-W39.html` |
| Monthly HTML | `<CODE>-YYYY-MM.html` | `SS-2026-07.html` |
| Draft | `<CODE>-YYYY-<id>-draft-vN.html` | `RDD-2026-W39-draft-v1.html` |
| Brief | `<CODE>-YYYY-<id>-brief.md` | `SS-2026-W38-brief.md` |

Type tokens: `LAUNCH` · `HOL` · `SEA` · `CAT` · `CLR` · `STORY` · `EDU` · `AUTO`.

## 11. QA & Approval

QA checklist: `07-Prompt Library/QA-Checklist.md` (self-contained — no need to reopen CLAUDE.md).

**Send gate** — a campaign may be sent only when:
- User approval recorded
- Clickability verified post-Klaviyo import
- Responsive rendering verified (incl. price badges on Gmail mobile)
- All images, product/CTA/coupon links verified
- No unresolved blockers (404, hidden products, missing assets)
- Preview text non-empty and campaign-specific

**Client matrix:** Klaviyo Preview · Gmail Web · Gmail Android · Gmail iOS ·
Apple Mail (incl. iPhone) · Outlook. Never approve on localhost/desktop alone.

## 12. Asset & Hosting

- **Evergreen brand assets** → `Brands/<CODE>/Assets/`. Per-send assets → `Campaigns/<Type>/Assets/`.

### Hosting providers (dual-provider model)

| Provider | Role | Source folder | Deploy method | CDN URL pattern |
|----------|------|---------------|---------------|-----------------|
| **ImageKit** (primary) | Default for **all new** campaign assets | `Image kit hosting/{rdd,ss,sc}/` | API upload via `Scripts/imagekit-upload.js` or watcher | `https://ik.imagekit.io/5jjsemhse/<brand>/<category>/<filename>` |
| **Vercel** (legacy/fallback) | Existing campaigns; use only when ImageKit is unavailable or explicitly requested | `hosting/{ss,sc,rdd}/` | `Scripts/publish-assets.js` → git push → PR → merge to `main` | `https://assets-{rdd,ss,sc}*.vercel.app/<path>` |

**New campaign assets default to ImageKit.** Do not commit images to `hosting/` for Vercel
unless ImageKit is unavailable or the task specifically requires Vercel. Existing Vercel URLs
in shipped campaigns remain untouched — do not migrate them unless explicitly requested.

### ImageKit workflow (new assets)

```
Image kit hosting/<brand>/<category>/<filename>
  → npm run imagekit:upload (single file) or imagekit:upload-all (batch)
  → verify public HTTP 200 at the returned ImageKit CDN URL
  → use the ACTUAL returned URL in campaign HTML (never construct/assume)
```

For manual campaign drafting (outside the automated engine), start the standalone watcher:
```
npm run imagekit:watch
```
The watcher monitors `Image kit hosting/` for new/changed images, auto-uploads them to
ImageKit CDN, and prints the live URL. It runs until Ctrl+C. During automated engine runs
(`npm run campaign`), the watcher is auto-forked as a background process (disable with
`--no-imagekit-watch`).

**ImageKit credentials** live in the root `.env` (git-ignored): `IMAGEKIT_URL_ENDPOINT`,
`IMAGEKIT_PUBLIC_KEY`, `IMAGEKIT_PRIVATE_KEY`. Never log or commit the private key.

### Vercel workflow (legacy/fallback)

`hosting/{ss,sc,rdd}/` → `Scripts/publish-assets.js` → git commit → push → PR → merge to
`main` → Vercel auto-deploys. Use only for maintaining existing Vercel-hosted assets or when
ImageKit is explicitly unavailable.

### Common rules (both providers)

- **Final HTML must NEVER contain** `localhost`, `127.0.0.1`, local paths, or VS Code Live Server URLs.
- **Image optimisation** preserves the approved creative. Compress/resize the same asset, never
  substitute a different image for file size.
- **Every image URL must be verified HTTP 200** with a valid image content type before use in HTML.
- **Never construct or assume a CDN URL** — use only the URL returned by the upload tool or
  confirmed live via HTTP verification.

## 13. Product-Brand Routing

The campaign's sending brand and a product's actual brand are independent. A campaign sent under
one brand may feature another brand's products. Product/promotional links resolve to the
**product's own brand website** (e.g. SC product → `sectorcare.com.au`). Sender-brand assets
(header logo, contact, footer legal, Klaviyo tags) stay on the sending brand.

## 14. Escalation Rules

- Missing product data → STOP, report.
- Hidden/unpublished product (404) → STOP, report. Never link dead URLs.
- Missing brand values → mark `To be confirmed`, STOP if critical.
- Coupon code not verified → placeholder only, flag as blocker.
- Campaign requires new structural HTML → STOP, report why.
- Ambiguous campaign type → check Brief, ask if unclear.
- Cross-brand key usage → refuse before any API call.

## 15. Test Classification

Tests are machine validation, not prompt context. Normal generation should **run** tests, not
**read** their source.

```
npm test                    # full suite (332 tests)
npm run sync:campaign       # Klaviyo sync (with --dry-run for validation)
```

Read test source only when a test fails. Integration tests (Lark, Klaviyo transport) are not
campaign-generation context.

## 16. Standards Directory

| Contract | When to load |
|----------|--------------|
| `Standards/email-safety-contract.md` | Every HTML build |
| `Standards/product-grid-contract.md` | Every product-grid build |
| `Standards/hero-contract.md` | Every hero assembly |
| `Standards/klaviyo-contract.md` | Klaviyo draft operations |
| `Standards/coupon-contract.md` | Promo campaigns only |
| `Standards/gif-contract.md` | GIF campaigns only |
| `Standards/navigation-contract.md` | When nav is requested |

---

_Refactored 2026-09-17 from 2,170-line monolith to lean router. Full legacy preserved in
`Archive/CLAUDE-LEGACY.md`. Zero knowledge deleted — redistributed to runtime contracts and
canonical standard homes. 332/332 tests pass before and after._
