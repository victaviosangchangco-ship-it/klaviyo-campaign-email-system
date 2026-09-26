# Review / QA — RDD-2026-W35 Bottle Hydration (assesses draft-v1)

Draft assessed: `Draft/RDD-2026-W35-bottle-hydration-draft-v1.html` → mirrored to canonical
`Output/RDD-2026-56.html` (calendar campaign_id RDD-2026-56, confirmed).

## Automated QA — PASS
- Anchor balance 17/17; zero `<table>` inside `<a>`; zero `display:block` on any image-wrapping `<a>` (§6.6).
- Zero empty `<td>`, zero `href="#"`/empty, zero localhost/local paths, zero literal `...` (§8.2).
- Footer merge tags are URL-form `{% unsubscribe_link %}` / `{% manage_preferences_link %}` (§6.23); no tag inside an `href` attribute.
- **Every URL returns HTTP 200** (verified live): hero (assets-rdd), both BigCommerce product images, both product pages, /products/, /privacy-policy/, homepage, logo, brandmark.
- Product grid: RDD approved card (brandmark, fixed-height cells §6.8, shrink-to-fit orange price button §6.17), 2-col balanced (§6.9).
- File size 31 KB — well under Gmail's ~102 KB clip (§8.3).

## Content accuracy — PASS (no invention)
- Products, prices ($37.26 / $86.67), names, URLs, images all verified on the live product pages (§5.1).
- Specs limited to verified claims (304 stainless, double wall vacuum, long-lasting cold retention, leakproof steel lid, carry handle, 25oz/64oz).
- **"24 hours" NOT asserted in HTML copy** — appears only in the user-approved hero art; flagged for substantiation before send.
- No dashes in copy (§6.2/§6.25); intro does not restate the hero headline (§5.2); no duplicate CTA to the same destination (§6.2 — hero→bottle, card A→bottle, card B→flask, closing→/products/).

## Brand consistency — PASS
- Header/hero-shell/product-card/trust/footer reused verbatim from approved `RDD-2026-37` (INSPIRATION); RDD orange `#f47c20`, text `#2a2e34`, panels `#f2f1ee`/`#ece9e3`.
- Hero used exactly (Part 2); edge-to-edge (§6.14), one inline anchor, img is the block element (§6.6).

## Still required before SEND (not done here)
- ☐ Real email-client render checks: Gmail web+mobile, Apple Mail (incl. iPhone), Outlook, Klaviyo import (§8.1) — cannot be exercised in this environment.
- ☐ Audience/segment confirmation (§13.1).
- ☐ Substantiate or drop the hero's "24 hours" claim.
- ☐ Calendar campaign_id (RDD-2026-36) assignment — pending the reconciliation decision.

**Status: built + hosted + link-verified; NOT approved to send.**

---

## Update — 2026-08-25 (hero v2 + 16-product review)

- **Hero replaced with the approved v2** (`Refine_hero_banner_typography_202608251701.jpeg`) → hosted
  `https://assets-rdd.vercel.app/rdd-bottle-stay-cool-hero-v2.jpg` (HTTP 200, image/jpeg, 411,262 B,
  1376×768, dims preserved). Draft-v2 created; Output/RDD-2026-56.html updated; v1 fully removed from the file.
- **Lark RDD-2026-56 metadata refreshed** (verified write): key_topic, tone, notes(→hero v2). scheduled_date
  2026-08-27, campaign_id, name, topic_category (Category spotlight), subject_line preserved. audience_* deferred (§13.1).
- **16-product grid: NOT achievable.** Exhaustive live-catalogue search (bottle/flask/tumbler/mug/coffee/
  thermos/cooler/lunch/jug/dispenser/kettle/cup holder) returns only **6 SKUs reasonably connected to the
  hydration/everyday theme**, converged across independent searches:
  1. 25oz Vacuum Insulated Stainless Steel Water Bottle Black — $37.26 — on-theme, RDD-branded, page-verified
  2. 64oz Stainless Steel Vacuum Insulated Flask, Army Green — $86.67 — on-theme, RDD-branded, page-verified
  3. SectorCare 3-in-1 Rotating Cup & Phone Holder Black — $34.83 — cross-brand, tangential (drink accessory)
  4. SectorCare 360° Adjustable Universal Cup Holder — Grey — $23.49 — cross-brand, tangential
  5. SectorCare 360° Adjustable Universal Cup Holder — Black & Grey — $23.49 — cross-brand, tangential
  6. SectorCare 360° Adjustable Universal Cup Holder — Black — $23.49 — cross-brand, tangential
  RDD is a retail-display/office company; no further hydration/drinkware SKUs exist. Per user instruction,
  STOPPED at the verified count (6 max; only 2 unambiguously on-theme + RDD-branded) rather than fabricate or
  substitute. Current Output grid = the 2 verified bottles. Grid composition (2 bottles only vs +cup holders
  with brand-neutral names §5.4/§6.28) awaiting user decision.
- **Klaviyo push + template: HELD** per user ("hold until grid final"); no existing RDD-2026-56 draft and the
  documented sync is update-only. Audience unconfirmed (§13.1).

---

## Update — 2026-08-25 (broadened grid, draft-v3, FINAL)

User approved broadening the theme to real on-brand RDD "everyday workplace" products. Grid rebuilt to
**13 live-verified products** (draft-v3 → Output). **16 not reached** — exhaustive live verification found no
more relevant in-stock RDD SKUs; per user instruction, stopped at the exact verified count (did not force 16).

**Every product verified on its live RDD product page 2026-08-25** (title, current GST-inc price, in stock,
URL 200, image 200). Prices taken LIVE (they differ from the Aug-12 feed, e.g. footrest $36.13→$32.51).

Stay Hydrated (2): 25oz Vacuum Insulated Water Bottle Black $37.26 · 64oz Vacuum Insulated Flask Army Green $86.67
Desk Essentials (5): ErgoDC Under Desk Adjustable Footrest $32.51 · ErgoDC Desktop Pegboard Organizer $30.29 ·
  ErgoDC Desktop Whiteboard $25.35 · Sit Stand Mat $34.42 · ErgoDC Desktop Buddy $43.05
Ergonomic Workspace (6): ErgoDC Ergonomic Office Chair High Back Full Mesh Grey $213.84 · Sit Stand Desk White
  1400mm $386.71 · Electric Sit Stand Desk Black 1600mm $403.71 · Sit Stand Desk Bamboo 1400mm $484.84 ·
  Ergonomic Desk Black 1400mm $386.71 · Ergonomic Office Desk Black 1600mm $403.71

### Update — 2026-08-25 (final refinement, draft-v4)

User requested a tighter premium layout. Final campaign = **6 live-verified products, two sections**:
- Intro heading: **"Designed for Everyday Use"** (no "Stay Hydrated"/"Built for the Workday" in the intro;
  the only "Stay Hydrated" left is the `<title>`/subject echo, outside the intro body).
- **Insulated Drinkware (2):** 25oz Water Bottle Black $37.26 · 64oz Flask Army Green $86.67.
- **Workspace Upgrades (4, clean 2×2):** ErgoDC Under Desk Adjustable Footrest $32.51 · ErgoDC Desktop
  Pegboard Organizer $30.29 · ErgoDC Desktop Whiteboard $25.35 · Sit Stand Mat $34.42.
- Dropped from the prior 13: ErgoDC Desktop Buddy + all 6 ergonomic desks/chair (per user "tight 4-tile" choice).
- **No NEW SKU added (rule #4 fallback):** exhaustive live search (monitor stand/riser, laptop stand, seat
  cushion, lumbar, wrist rest, keyboard tray, cable tray, drawer, desk lamp, monitor arm) found NO suitable
  non-SectorCare RDD workspace accessory beyond those already verified. The only new candidates were
  SectorCare (excluded per instruction) or bulky desks/chairs/children's lamp (poor fit). Reported rather
  than substitute a SectorCare/fabricated product. The 2×2 is completed with 4 already-verified RDD accessories.
- Hero unchanged (v2). QA (draft-v4/Output): anchors 33/33; no ghost/nested/`href="#"`/localhost; every URL
  (hero v2 + 6 product images + 6 product pages + CTA + logo + footer) HTTP 200; merge tags URL-form; ~37 KB.
  Lark product_categories + notes refreshed (verified). Klaviyo/template still HELD (audience §13.1). Real-client
  render still required before send.

---

## Update — 2026-08-25 (Klaviyo draft + template created; audience verified)

Audience confirmed by user (§13.1) after resolving live RDD (XAUdQX) audiences: **Segment "60D Active
Customers" (RJbEzz)**. Draft created via the documented orchestrator (`cli.js create --brand RDD --campaign
RDD-2026-56 --klaviyo --segment "60D Active Customers" --calendar lark`) in APPROVED-ATTACH mode (registered
in `config/approved-html.json`, attaching Output/RDD-2026-56.html verbatim). No parallel/MCP creation path used.

- **Klaviyo DRAFT:** `01M0WAYZSDW5RBQRPKYYNMN3CQ` — "RDD-2026-56: Stay Cool, Stay Fresh, Stay Hydrated" — **status Draft**, scheduled_at null, exactly one (no duplicate).
- **Template:** `UBhSUy` "Automation: RDD-2026-56" (created) + attached to the draft message (verified, html ~36 KB).
- **Audience:** included=[RJbEzz] (segment 60D Active Customers, ~5129 recipients). Sender sales@retaildisplaydirect.com.au (config, §13.4). Tracking: add_tracking_params=true, clicks+opens on (§13.4).
- **Send status:** NOT_APPROVED_TO_SEND — nothing sent or scheduled.
- **Lark RDD-2026-56 audience fields written (verified):** audience_type=segment, audience_name="60D Active Customers", audience_id=RJbEzz. campaign_id + scheduled_date (2026-08-27) unchanged.
- Remaining: real email-client render (Gmail/Outlook/Apple Mail) before any send — cannot be exercised here.

---

## Update — 2026-08-25 (18-product rebuild, draft-v5, APPROVED)

User approved expansion to **18 verified RDD products** in a **5-section** structure. Rebuilt to draft-v5 →
Output. Exhaustive live catalogue re-search (desk accessories, workspace organisation/storage, ergonomic
chairs, sit-stand/standing desks & converters, monitor/laptop stands, whiteboards, notice/pin/cork boards,
lecterns) — **19 in-stock verified found; 18 used** (Lectern Portable $175.20 held as spare; Corkboard
1200×900 dropped OOS; monitor/laptop stands = none non-SectorCare; SectorCare excluded).

**All 18 re-verified live 2026-08-25** (exact title, current GST-inc price, in stock, page 200, image 200):

- **Insulated Drinkware (2):** 25oz Water Bottle Black $37.26 · 64oz Flask Army Green $86.67
- **Workspace Upgrades (6):** Under Desk Footrest $32.51 · Desktop Pegboard Organizer $30.29 · Desktop
  Whiteboard $25.35 · Sit Stand Mat $34.42 · Desktop Buddy $43.05 · Mobile Pedestal 3 Drawer $171.50
- **Ergonomic Seating (2):** Ergonomic Office Chair High Back Full Mesh Grey $213.84 · Ergonomic Executive
  Office Chair High Back Full Mesh Grey $269.10
- **Sit-Stand Desks (6):** Sit Stand Desk White 1400mm $386.71 · Electric Sit Stand Desk Black 1600mm $403.71
  · Sit Stand Desk Bamboo 1400mm $484.84 · Ergonomic Desk Black 1400mm $386.71 · Ergonomic Office Desk Black
  1600mm $403.71 · Electric Standing Desk Black 1800mm $420.71
- **Whiteboards (2):** Glass Whiteboard 1200x900mm WHITE $161.69 · Glass Whiteboard 1500x900mm WHITE $229.95
  (the 1500 lives at the /magnetic-glass-whiteboard/ slug; verified live title is "Glass Whiteboard 1500x900mm WHITE")

**QA (draft-v5/Output) PASS:** 18 products; every section even → clean 2-col grids, no orphan/spacer cards;
anchors 81/81; no ghost `<td>`/nested/`href="#"`/localhost; merge tags URL-form; **all 36 URLs (18 pages +
18 images) HTTP 200**; hero v2 unchanged (200, 411,262 B); 77 KB (< Gmail clip). Intro "Designed for Everyday
Use", hero v2, RDD design system / orange CTAs / logo / footer / card styling all unchanged.

**Files updated:** Output/RDD-2026-56.html, Draft/…-draft-v5.html, Output/RDD-2026-56-products.json + .csv, this Review.

**Klaviyo: UNTOUCHED this turn** (held per instruction). NOTE: the existing Klaviyo draft
`01M0WAYZSDW5RBQRPKYYNMN3CQ` + template UBhSUy still carry the PREVIOUS 6-product creative — now stale vs
this 18-product Output. A re-sync (`sync:campaign`) is REQUIRED before send but is HELD until the user says.

---

**[Superseded — prior 13-product build] Dropped after live verification (OOS/404) — not shipped:** ErgoDC Ergonomic Office Chair $104.50 (OOS),
ErgoDC Ergonomic Computer Chair $159.50 (OOS), ErgoDC Ergonomic Designer Office Chair High Back Mesh $209 (OOS),
ErgoDC Ergonomic Office Chair High Back Full Mesh Black $297 (OOS), ErgoDC Ergonomic Executive Office Chair High
Back Full Mesh Black $319 (OOS), ErgoDC L Shaped Ergonomic Gaming Desk 1600mm $139.20 (OOS),
/ergodc-ergonomic-office-chair-high-back-full-mesh-grey/ (404).

**QA (draft-v3/Output) PASS:** anchors 61/61; no ghost `<td>`/nested-table/`href="#"`/localhost; odd last card
(Desk Essentials) centered via center-half (§6.9); every URL (hero v2 + 13 product images + 13 product pages +
CTA + logo + footer) HTTP 200; merge tags URL-form; 59.3 KB (< Gmail clip). Hero v2 used everywhere.
Lark RDD-2026-56 product_categories + notes refreshed (verified). Klaviyo HELD (audience §13.1). Real-client
render still required before send.
