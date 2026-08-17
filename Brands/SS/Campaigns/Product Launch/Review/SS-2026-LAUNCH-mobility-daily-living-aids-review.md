# Review / QA — SS-2026-LAUNCH-mobility-daily-living-aids (assesses Draft v1)

**Draft assessed:** `Draft/SS-2026-LAUNCH-mobility-daily-living-aids-draft-v1.html` (mirrored to `Output/`).
**Send status:** NOT approved to send — **audience pending user confirmation** (§13.1). Draft-only.

## SKU verification (§5.4) — Catalog API, both stores
- 22/22 products verified: `is_visible=true`, in stock, non-zero price, **product URL + image HTTP 200 on
  `safetysector.com.au`**. `THRAL01SIL` corrected to `THRAL01SSIL` (user-confirmed typo).
- All are "SectorCare"-titled and exist in **both** stores; user directed SS + shared store `498h0egvgn`.

## Automated QA
- Validators (CLAUDE.md §6/§8): **PASS — 0 blocker · 0 warn · 12 pass.**
- HTML integrity: anchors **72/72** balanced; **no** `<table>`-in-`<a>`; no nested/empty anchors (§6.6/§8.2).
- Links: **48/48 unique URLs HTTP 200** (products, images, hero/CTA all-products page, logo, privacy).
- No `localhost` / `127.0.0.1` / `file://`; images all HTTPS on `cdn11.bigcommerce.com/s-498h0egvgn`.
- Size **77.6 KB** (< 102 KB Gmail clip, §8.3).
- Grid: 22 fixed-height cards, hybrid 2-col, balanced even grid (no orphan) (§6.8/§6.9/§6.20).
- Platform unit tests unchanged (no platform code modified this task — HTML/config only).

## §5.4 brand-name findings (must resolve before send)
1. **Display names are SS-neutral** — "SectorCare" stripped everywhere visible; **0 visible occurrences**.
2. **Source BigCommerce titles still carry "SectorCare"** → flagged for the store team to rename for SS use.
3. **Product URL slugs still contain `sectorcare`** (e.g. `/sectorcare-adjustable-underarm-crutches/`).
   These are the real live SS URLs (HTTP 200); not altered (changing a URL would breach §6.7). Re-slug at the
   store if fully SS-branded URLs are required before send.
4. **Category departure:** aged-care/mobility products under a site-safety brand — user-directed; recorded.

## Client-render QA (to complete before send, §8.1)
- Not yet verified in a real Klaviyo import / on-device (Gmail mobile, Apple Mail iPhone, Outlook). Required
  pre-send step once the audience is confirmed and the draft is created.

## Blockers to send
- ⛔ Audience not yet confirmed (gate, §13.1).
- ⚠ SectorCare titles/slugs (above) — business decision on renaming/re-slugging.
- ⚠ Klaviyo import + on-device render check outstanding.

---

## Revision v2 — SC-inspired creative (assesses Draft v2; Output mirrors v2)

**What changed vs v1:** re-skinned to the **SectorCare design language** (SC-2026-W30 reference + SC.config
tokens) while **SS remains the sending brand/account**. New: **image Hero Banner** (the SC hosted asset) at
the top, **SC logo placed BELOW the hero** (SC identity pattern), warm-cream intro panel (`#ece4d8`), teal
accent (`#3d7a94`), Georgia serif headlines, beige themed section panels (`#F5F1EA`), soft rounded SC product
cards, dark pill CTAs. Two even themed sections (Walking & Mobility 10; Bathroom, Toileting & Living 12) →
no orphan rows (§6.9). Product data/URLs/prices unchanged (same 22 verified products; SS-neutral names kept).

**Sending brand preserved (SS):** footer legal identity = **Safety Sector Pty Ltd** + SS address; footer
links use the **SS Klaviyo** `{% unsubscribe_link %}` / `{% manage_preferences_link %}` + SS privacy URL.
Klaviyo account/sender remain SS (§12/§13). Only the *creative* is SC-inspired (user-directed).

**Hero hosting (Vercel, §7.1):** SC hero published to the **live SS host** `hosting/ss/` as
`ss-2026-launch-mobility-hero.jpg` (validator OK). Target URL
`https://assets-ss-wheat.vercel.app/ss-2026-launch-mobility-hero.jpg`. ⛔ **Not yet deployed** — the file must
be committed + pushed to trigger the Vercel redeploy; **hero returns 404 until then** (verified). All other
47 URLs = HTTP 200; no localhost/local paths.

**QA (v2):** validators **PASS — 0 blocker · 1 warn · 11 pass**. Warn = `image-dims` (22 product images +
logo use SC's fluid `width:100%` pattern without explicit height — faithful to the SC reference; for a real
send, add explicit pixel width/height per §6.6). 22 SC cards, 73/73 anchors, 45 KB, no localhost. Tests
**195/195**; publish-assets selftest 7/7.

**Brand-representation flag (user-directed, recorded):** this email shows SectorCare hero + SC logo + SC
design but is **sent by Safety Sector** (footer identifies SS as the legal sender). Confirmed as the explicit
instruction; noted for stakeholder awareness.

**Outstanding before send:** ⛔ audience confirmation · ⛔ deploy the hero + verify HTTP 200 · ⚠ Klaviyo
import + on-device render check · ⚠ image-dims refinement (§6.6) · ⚠ SC titles/slugs business decision.

---

## Revision v3 — SS header + light-teal palette (assesses Draft v3; Output mirrors v3)

**What changed vs v2 (branding/header/colour only; structure preserved):**
- **SS header added, top-left** — official Safety Sector logo `…/company/T7SuPP/…/f4045d61-…gif` (122×31,
  left-aligned, white bg, 1px bottom border), reproducing the SS Weekly header pattern (§6.1). Hierarchy is
  now **SS header → Hero Banner → SectorCare logo → SC content → SS footer** (verified DOM order).
- **SectorCare logo BELOW the hero retained** unchanged (`…/company/XAUdQX/…/f7015926-…png`, 34px) — the
  intentional SC identity element.
- **Brown/beige → light-teal system** (visual hierarchy, not one flat teal): intro panel + footer
  `#ece4d8`/`#f0ebe4` → **`#E8F5F3`** (very light teal); section panels `#F5F1EA` → **`#D6EDE9`** (slightly
  deeper light teal); teal accent (eyebrow, accent bars, trust icons) `#3d7a94` → **`#2B8C89`** (stronger
  teal). Headlines stay dark `#1a1a1a`; CTAs stay the dark `#1a1a1a` pills (prominent). No brown/beige left.
- **Hero image unchanged** (same SS-hosted Vercel asset). Products/URLs/prices/footer/CTA destinations
  unchanged.

**QA (v3):** validators **PASS — 0 blocker · 1 warn · 11 pass** (warn = same `image-dims`, SC fluid pattern).
22 cards, 74/74 anchors, **50/50 links + images HTTP 200** (incl. SS logo, SC logo, hero), no localhost,
45.5 KB. v1 and v2 preserved (v3 is a new file). **Klaviyo not touched this task** — the existing SS draft
still holds v2's HTML and will pick up v3 on the next user-authorised draft refresh.

---

## Revision v4 — "We've got you covered" trust cards + muted SectorCare-slate palette (assesses Draft v4; Output mirrors v4)

**Two changes only (footer/trust + box colour); everything else preserved.**

**A. Footer/trust redesign:** removed the old closing-CTA block ("Comfort and independence, delivered." /
"Shop the Full Range →") and the flat 4-item trust row. New hierarchy: **"We've got you covered"** heading →
**4 trust cards** (white card, 1px border, 12px radius; 46px circular light-slate icon disc `#DCE1E7` with a
monochrome glyph in slate `#405060`; bold title; small sub) → divider → **SS legal footer (unchanged links)**.
Cards: **Australian Owned** / proudly local · **Registered NDIS Provider** / approved provider · **Fast
Australia-wide Shipping** / on every order · **Trusted Customer Support** / here when you need us. 4-up on
desktop, 2×2 on mobile (`.trust-card`).

**B. Palette — teal → muted SectorCare "Sector" slate.** The "Sector" colour was sampled directly from the
SC logo (dominant left-portion colour = **`#405060`**, muted blue-grey slate). Applied as a hierarchy, not
one flat colour: intro panel + footer `#E8F5F3` → **`#EBEEF1`** (very light slate); section heading panels
`#D6EDE9` → **`#DCE1E7`** (deeper light slate); teal accent `#2B8C89` → **`#405060`** (eyebrow, accent bars,
trust glyphs). Headlines/CTAs stay dark. **No teal remains** in any box/background.

**Unchanged:** SS header logo (T7SuPP, top-left), SectorCare logo below the hero, Hero Banner image, product
data/URLs/images, product cards, CTA destinations, SS legal footer links/address, 600px width + mobile
stacking + Outlook conditionals.

**QA (v4):** validators **PASS — 0 blocker · 1 warn · 11 pass** (warn = same `image-dims`). 22 product cards +
4 trust cards, 73/73 anchors, **50/50 links + images HTTP 200**, no localhost, 47.4 KB. v1–v3 preserved (v4
new). **Klaviyo not touched.**

**Flag (unchanged from prior):** "Registered NDIS Provider" is a SectorCare trust claim (matches the SC
reference); on an SS-sent email, confirm SS's NDIS-provider status (or that the SC-branded framing covers it)
before a real send.

**v4 alignment fix (trust cards only):** the 4 trust cards were a plain auto-layout `<table width="100%">`,
so differing title lengths distributed columns unequally (misaligned vs the product grid) and mobile risked
overflow. Rebuilt the trust row **only** as the §6.20 hybrid pattern inside the **same product-grid outer
container** (16px row inset): 4 fixed `inline-block` columns of 142px (6px side padding → 12px gaps) in a
`font-size:0` centred parent + MSO ghost (`width="568"`, 4×142) for Outlook. First card left = 22px, last
card right = 578px — **identical to the product cards**. Mobile: `.tcol{max-width:50%}` → clean 2×2, no
overflow. Product grid and all other sections unchanged. New permanent rule: CLAUDE.md §6.27.

**v4 final fix (trust alignment + SS contact):** the hybrid inline-block trust row still rendered narrower
than the grid in preview (inline-block `width:100%`+`max-width` shrank toward content in some renderers).
Switched the trust strip to the **exact product-grid primitive**: a plain `<table width="100%">` with
**`table-layout:fixed`** and 4 `<td width="25%">` cells (grid's `padding:0 6px` gutters). Fixed layout forces
equal columns despite differing titles; one `<tr>` gives auto equal-height cells (inner card `height:100%`).
First card left = 22px, last card right = 578px — identical to the product cards. Mobile: `.tc{display:block;
width:100%}` → 1-col stack (same as the product grid `.pc`), no overflow. Added the **approved SS contact
block** after the trust cards: *"Got a question? We're here to help."* + `02 9790 2182` +
`sales@safetysector.com.au` (approved SS details, unchanged; slate accent to stay visually connected), then
the existing legal links + address. Order: grid → "We've got you covered" → trust cards → SS contact → legal
links → address. QA: 0 blockers, 1 warn (image-dims), 50/50 links 200, product grid untouched, 75/75 anchors.
Rules refined: CLAUDE.md §6.27 (plain-table primitive) + §6.26 (approved SS footer/contact block + order).

**v4 logo relocation:** removed the SectorCare logo **and its dedicated white container row** from directly
below the hero (no empty white strip remains — hero now transitions straight into the slate intro panel).
Moved the **same** SC logo (`…/XAUdQX/…/f7015926-…png`) into the **Walking & Mobility** category header,
upper-right, `valign:middle` beside the heading (2-cell table inside the existing `#DCE1E7` panel, right cell
`width:140`, logo `height:24` `max-width:140`), not overlapping the heading/subtitle, inside the existing
container. Only this one category carries the logo. Hero image, SS header, product grid, trust cards, SS
footer unchanged. QA: 0 blockers, SC-logo count = 1, no `padding:22px 24px 6px` white box, 50/50 links 200,
74/74 anchors. (No CLAUDE.md change — layout-only task.)

**v4 hero refresh + logo re-position:** (1) Hero updated to the **new final** approved asset from
`hosting/sc/` — published to the live SS host via the §7.1 workflow as
`ss-2026-launch-mobility-hero-v2.jpg` (1376×768, same 16:9 as before), deployed (scoped commit + push →
`e2a02d4..46524f5`) and verified **HTTP 200** at `assets-ss-wheat.vercel.app/ss-2026-launch-mobility-hero-v2.jpg`.
Hero image itself not modified/regenerated. (2) Removed the SC logo from the Walking & Mobility header (now
text-only, no gap). (3) Moved the same SC logo to a **centered standalone row in the gap between the intro
section and the Walking & Mobility card** (height 30, centered, `max-width:200`, padding 28px above /14px
below → visually separated, not inside any card). SC-logo count = 1. Product grid, trust cards, SS footer,
SS header unchanged. QA: 0 blockers, 50/50 links 200, no localhost, 74/74 anchors. SS remains the operational
sender (SS footer/legal + SS Klaviyo tags unchanged).

## Klaviyo push (v4 → Drafts, draft-only)

Pushed the v4 HTML (via approved-attach; Output is byte-identical to v4) to the SS Klaviyo account (T7SuPP).
The prior draft `01KZN542…` had been deleted (404), so a fresh draft was created — **no duplicate**
(enumerated all 52 SS email campaigns; exactly one launch draft matches). Campaign
`01KZNY3W27XT3VG5WK6TNS8ZN5`, status **Draft**, not scheduled/sent, audience segment `60D Active Customers`
[UuyeSE], sender hello@safetysector.com.au. Readback confirms the attached HTML is the v4 creative (hero v2
URL, SC logo in the gap, SS header, 22 product cards, 4 trust cards, SS footer) with no localhost; hero
`assets-ss-wheat.vercel.app/ss-2026-launch-mobility-hero-v2.jpg` = HTTP 200. Hardening note:
`findDraftForCampaign` reads only page 1 of `/campaigns/` — fine now (52 campaigns = 1 page) but should
paginate if the SS account exceeds one page, to keep dedup reliable.

## Product-brand routing fix (§6.28) + re-push (draft-only)

The featured products are SectorCare-branded, so per the new §6.28 rule their customer-facing links now
resolve to the **SectorCare website**: 66 product-card links → `sectorcare.com.au/<slug>/` and the hero
image + hero CTA → `sectorcare.com.au/` (SC collection). All 22 SC product URLs + the SC collection verified
**HTTP 200** before routing. **Sender assets stay SS:** header logo → `safetysector.com.au/`, footer Privacy
Policy → SS, Klaviyo `{% unsubscribe_link %}`/`{% manage_preferences_link %}` = SS account. No SS product
links, no RDD links, no localhost. Re-pushed to Klaviyo: **reused** draft `01KZNY3W27XT3VG5WK6TNS8ZN5`
(no duplicate), status **Draft**, audience `60D Active Customers` [UuyeSE], sender hello@safetysector.com.au.
Readback confirms 66 SC product links + 2 SC hero links + 2 SS sender links, hero v2 image, no localhost,
RDD-key access 404 (isolation). New permanent rule: CLAUDE.md §6.28.

---

## Revision v5 — SectorCare section alignment + partnership intro (assesses Draft v5; Output mirrors v5)

**Two changes only; hero, products, links, trust cards, contact and footer all preserved.**

**A. SectorCare section alignment (Task 1).** The SC logo, category headers and product grid previously sat
at three different horizontal edges — logo `24px`, category headers `28px` (with a `.mp` clamp to `16px` on
mobile), product cards effectively `22px` (16px row inset + 6px card padding). They read as separate stacked
elements. Fix: the SectorCare **logo, the new intro block, and BOTH category headers** (Walking & Mobility;
Bathroom, Toileting & Living) now use a flat **22px** horizontal padding — identical to the product-card
content edge — on **desktop and mobile**. Removed the `.mp` class from the two category-header rows so they no
longer drop to 16px on mobile (which would have re-misaligned them vs the 22px cards). Vertical rhythm set
intentionally: logo (34px above) → intro heading/copy → 28px → Walking & Mobility panel → grid; 32px above the
Bathroom panel for section separation. The whole SectorCare portion now reads as one cohesive branded section.

**B. Partnership intro (Task 2).** Added a centred intro block between the SC logo and the first category,
replacing the standalone-logo gap. Heading **"Explore the SectorCare Range"**; copy: *"Through our partnership
with SectorCare, we're bringing you practical mobility and daily living solutions designed to support comfort,
independence and everyday living."* Positions SectorCare as the **partner brand** behind this range while SS
stays the campaign/sender. No repeat of the earlier "We're proud to introduce SectorCare…" intro. No em/en
dashes (§6.2/§6.25). SC logo remains associated specifically with the SC product section.

**Unchanged:** SS header (T7SuPP, top-left), Hero Banner image + hero CTA, intro hero panel, all 22 product
cards (names/prices/images/URLs → `sectorcare.com.au`, §6.28), "We've got you covered" trust cards, SS contact
block, SS legal footer (SS Klaviyo `{% unsubscribe_link %}` / `{% manage_preferences_link %}` + SS privacy +
address), 600px width, mobile stacking, Outlook conditionals.

**QA (v5, source-level):** HTML integrity **PASS** — tags balanced (table 49/49, tr 71/71, td 85/85, a 74/74);
**0** `<table>`-in-`<a>`, `href`-with-tag-inside, empty/nested anchors, empty `<td>`, literal `…`, bad
`{% unsubscribe %}`-in-href, or `{{ }}` vars in href (§6.6/§6.23/§8.2). Logo + intro + both category headers
confirmed at the 22px content edge (matches the 22px product-card edge). Products/links/images unchanged from
v4, so the v4 link set (50/50 HTTP 200, no localhost) carries forward. v1–v4 preserved; v5 is a new file;
Output mirrors v5. **Klaviyo not touched this task.**

**Outstanding before send (unchanged, §8.1):** ⚠ real Klaviyo import +
on-device render check (Gmail mobile Android/iOS, Apple Mail iPhone, Outlook) to confirm the new 22px alignment
holds in-client, not only at source · ⚠ SC titles/slug + NDIS-claim business decisions.

## Klaviyo push (v5 → Drafts, draft-only)

**Audience confirmed by the user (§13.1):** `60D Active Customers` [UuyeSE] — confirmed for this push, not
auto-assumed (calendar row supplies no segment/list; both null). Pushed the **v5** creative via the shared
orchestrator in approved-attach mode (`config/approved-html.json` → `Output/…mobility-daily-living-aids.html`,
byte-identical to draft-v5), so the QA-approved Output HTML was attached **verbatim** (no regeneration).

- **New Draft campaign:** `01KZQHGK8Z3BDDD17WHKGDHHAE` (status **Draft**), sender
  `hello@safetysector.com.au` (SS account T7SuPP), audience segment `60D Active Customers` [UuyeSE],
  recipients ~4,651. Template `Skfm3d` **updated** (no duplicate template); message clone `RNhX9M`,
  HTML attached + readback **verified=true** (49,259 bytes). **Nothing sent** — `NOT_APPROVED_TO_SEND`.
- **Dedup (§13.1) verified by read-only enumeration** (reused engine `loadKlaviyoConfig('SS')` + `KlaviyoClient`,
  GET only): **53** SS email campaigns on **1 page**; exactly **2** launch-named campaigns — the new
  `01KZQHGK8Z…` (**Draft**) and the prior `01KZNY3W27XT3VG5WK6TNS8ZN5` (**Cancelled**). The prior draft was
  **Cancelled** (not an active draft), which is why the orchestrator created a fresh one rather than reusing it,
  so there is **exactly one active Draft** for this launch — no duplicate. The Cancelled record is inert (cannot
  send) and left as history; not deleted.
- **Note on the `--campaign` approved-attach path:** this orchestrator path POSTs a new campaign without a
  reuse/dedup search step (unlike a same-id active-draft reuse). Fine here because the only prior launch draft
  was Cancelled, but if a future push finds an existing **active** Draft it should reuse it — verify by
  enumeration after each push until the path itself dedups active drafts.
- SS account isolation intact: SS key resolved from `Brands/SS/.env` (`SS_KLAVIYO_API_KEY`); no RDD/SC keys used.
