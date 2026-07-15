# SC-2026-W29 — Review & QA Notes

## Revision — 2026-07-14 (draft v3 — SC promo rule + readability; PROMOTED TO OUTPUT)
Authored as `Draft/SC-2026-W29-draft-v3.html`, QA'd, promoted to `Output/SC-2026-W29.html` (byte-identical).
SC-only; no other brand/campaign touched.

- **Fixed-dollar promo (Bruce's SC standard).** Offer changed from "15% off your order" to
  **"Save $20 on orders over $200"**. No percentage discount remains (grep `% off` = 0). Code **MOVE15**
  kept (the code provided for this campaign; still PROPOSED — must be created + confirmed ACTIVE in SC
  BigCommerce `s-498h0egvgn` before send). Reviewer note: if the "15" in MOVE15 is undesirable alongside a
  $20/$200 offer, SC team can confirm a preferred code — not renamed here to avoid inventing a code.
- **Readability bump for older audience** (promo section only): eyebrow 10→13px, coupon code 26→30px
  (mobile 24→28px), offer 16→19px, CTA 12→15px (mobile 14→15px), validity 9→12px (colour #999→#777 for
  contrast). Hierarchy kept clean, not oversized; balanced desktop + mobile.
- No other section changed. QA: table/tr/td 41/41·64/64·78/78 · 14 cards · 16 images · MOVE15 present ·
  0 winter/`15% off` hits. New CLAUDE.md §6.4 (SC-only promo/coupon rule) added.

## Revision — 2026-07-14 (draft v2 — approved changes; PROMOTED TO OUTPUT)
Authored as `Draft/SC-2026-W29-draft-v2.html`, QA'd, promoted to `Output/SC-2026-W29.html` (byte-identical).
New campaign direction: **featured rollator + everyday outings**. All prior winter / "independence" /
"Winter Safety Edit" / "Stay Safe, Steady And Independent" messaging removed (grep: 0 hits).

**Changes applied:**
1. **New hero** — approved hosted lifestyle banner
   `d3k81ch9hvuctc.cloudfront.net/company/W2Ua5v/images/574d58d7-67ae-450a-a919-7928e85d8bbf.jpeg`
   (used exactly, not modified; verified 200, 1167×651, image/jpeg). Replaced the v1 typographic charcoal
   band. New copy: eyebrow "Made for Everyday Outings", headline "Ready for Wherever the Day Takes You.",
   concise warm intro, primary CTA "Explore Mobility Solutions". Hero image links to `/rollators/`.
2. **Category capsules moved** from near the top to **after** the promo section (new "Shop by Category"
   heading), giving the flow: Hero → Intro/CTA → Product sections → Promo → Category nav → Trust → Footer.
   All 6 capsules kept (Bathroom Safety, Rollators, Access Ramps, Manual Wheelchairs, Electric
   Wheelchairs, Shop All), same links/labels.
3. **Two products replaced** (the two ramps) with in-stock, on-theme rollators, product-page verified 2026-07-14:
   - Aluminium Wheelchair Ramp Foldable 3ft → **ComfortRoll Rollator with Backrest – Grey** — $202.50,
     In Stock, `/sectorcare-comfortroll-rollator-walker-with-backrest-grey/`
   - Telescopic Wheelchair Ramps 6ft → **GlideRoll Premium Rollator Walker – Champagne** — $289.00,
     In Stock, `/sectorcare-glideroll-premium-rollator-walker-champagne/`
   Still exactly **14 products**; no duplicates; Section 2 is now four cohesive rollators.
4. **New promo section** — "Your Week, Your Way", code **MOVE15**, "15% off your order", "Valid until
   22 July 2026 · One-time use", CTA "Shop Now". All old Winter/WINTER20/placeholder coupon content removed.

⚠️ **COUPON MOVE15 IS PROPOSED — NOT VERIFIED.** It must be **created and confirmed ACTIVE in SC
BigCommerce (store `s-498h0egvgn`) before the campaign is sent.** No BigCommerce write/API access this
session, so it could not be auto-verified. Do not send until confirmed. (The 15% / 22 Jul 2026 / one-time
values are user-supplied, not invented.)

**QA — PASS.** table/tr/td 41/41 · 64/64 · 78/78 · **14** product cards · 16/16 images HTTP **200** with
`image/*` (verified with Gmail's GoogleImageProxy UA — hero + both new rollators included) · 14 prices ·
6 capsules positioned after promo · Klaviyo Liquid intact (`{% unsubscribe_link %}`, `{{ organization.* }}`) ·
0 winter/independence/Safety Edit/WINTER20 hits · 0 `{{COUPON_*_TODO}}` placeholders · em dashes only in
HTML comments (0 in visible copy). First-glance: lifestyle hero + eyebrow/headline/CTA, strong and clean.
Manual client render (Gmail/Apple/Outlook, desktop+mobile) + independent reviewer sign-off (CR-16) remain
recommended pre-send steps.

---

## draft v1 (superseded by v2 above)

Fresh Weekly send for ISO 2026-W29, benchmarked structurally against
`References/SC-2026-W28-ref-benchmark.html` but with **new theme, copy, sections and product mix**.

- **Draft:** `Draft/SC-2026-W29-draft-v1.html`
- **Brief:** `Brief/SC-2026-W29-brief.md` · **Products/stock:** `Assets/SC-2026-W29-assets.md`
- **Brand values:** `[Inferred]` from the benchmark (still no approved SC `Design.md`/`BrandConfig.md`).
- **Author:** engine generation. **Reviewer/approver:** _pending_ — must differ from author (CR-16).

## Theme & content changes vs W28 benchmark

- **New concept:** "Winter Safety Edit" — stay safe, steady and independent at home (home-safety +
  independence), replacing W28's broad "Winter Mobility Event" discount framing.
- **New headline / eyebrow / preheader / support line**, all rewritten.
- **First-glance tightened (CLAUDE.md §6.3):** W28's 3-paragraph intro replaced by a single concise
  support line inside a bold typographic hero (eyebrow → headline → one line → primary CTA). Products
  reached faster.
- **New hero treatment:** typographic charcoal hero band with a teal/orange accent rule — no baked-text
  raster banner (avoids reusing the old "Winter Mobility Event" image and needs no unapproved AI/hero
  asset). Strong, image-free first impression.
- **CTA de-duplication (CLAUDE.md §6.2):** one broad primary CTA in the hero ("Shop the Safety Edit")
  plus the coupon CTA (distinct purpose = redeem offer). W28's extra mid-email "Shop the Full Range"
  outline button was dropped as redundant.
- **New section structure (3):** Bathroom & Everyday Safety (6) → Getting Around, Made Easy
  (rollators + a brand-new **Ramps** category, 4) → Wheelchairs, Manual to Powered (4).

## Product set — 14, all product-page verified In Stock

See `Assets/SC-2026-W29-assets.md` for the full verified table (name/URL/image/price/stock).
**8 of 14 are new** vs the benchmark (incl. 2 ramps — a category not previously featured); the 6 reused
items are the only in-stock options left in their categories and are proven bestsellers (permitted reuse,
CLAUDE.md §5.1). **Scooters excluded** — the entire scooter range is currently Out of Stock.

## Automated QA — PASS

| Check | Result |
|-------|--------|
| Product cards | **14** (6 + 4 + 4) |
| Table / tr / td balance | 42/42 · 64/64 · 79/79 |
| Images with `alt` (CS-11) | 15/15, none empty (14 products + logo) |
| Product images load (HTTP) | 14/14 → **200 OK** + logo 200 (no broken images) |
| Prices rendered | 14/14 AUD, GST-inclusive matching live site |
| Product links | 14/14 correct product pages + 5 in-stock category pills + Shop All |
| Coupon | placeholder only (`{{COUPON_*_TODO}}`) + visible red "to be confirmed" flag |
| Klaviyo Liquid intact | `{% unsubscribe_link %}`, `{{ organization.name }}`, `{{ organization.full_address }}` |
| Em dashes in campaign copy (§6.2) | 0 (2 hits are placeholder-scaffold/comment only, removed pre-Output) |
| Unresolved framework tokens `[[…]]` | 0 |
| Preheader (CS-14) | present + hidden |
| Dark mode (CS-12) | `color-scheme` meta + `prefers-color-scheme` + `[data-ogsc]` (SC stable-light) |
| Header logo | LEFT-aligned (CLAUDE.md §6.1 SC default) |

## Stock validation — the key finding

Category listing pages are **unreliable** for stock: many products shown with an "Add to Cart" button on
a category page are actually **Out of Stock** on their own product page. Every one of the 14 was therefore
verified on its **individual product page**. Rejected-as-OOS list is recorded in the Assets doc
(LiteRoll Champagne, TrailGlide, both Airflex, both Propel, the full scooter range, and 6 electric
wheelchairs). No empty cards, no placeholders, no fabricated products.

## Card-quality self-check (CLAUDE.md §6.2)

- Uniform card shell (1px #ececec, 12px radius, 12/16 padding) across all 14.
- `.prod-name` (min 34px) + `.prod-sub` (min 53px) fixed heights keep prices aligned across each desktop
  row; heights reset to auto when cards stack on mobile.
- Full-width product images (`width:100%`, 8px radius) — consistent scale, none tiny/cornered.
- Tight, intentional text→price spacing (`margin-bottom:8px` on sub, price immediately below).

## Manual render checklist (before approval → Output)

- [ ] Open draft + benchmark side-by-side in a browser (desktop + 375px mobile).
- [ ] Confirm 2-up grid stacks to 1-up on mobile; pills 3-up → 2-up; trust 4-up → 2×2; hero headline scales.
- [ ] Litmus/Email-on-Acid or client spot-check: Gmail (web/app), Apple Mail (light+dark), Outlook.
- [ ] Send a Klaviyo test: confirm `{% unsubscribe_link %}` and `{{ organization.* }}` resolve.

## Blocking follow-ups (gate to Output — CR-16/CR-17)

1. **Coupon unconfirmed.** Provide code, offer/discount, min spend, expiry, and any usage restriction —
   or confirm the send goes out with **no** coupon (then remove the promo block). Do not publish the
   placeholder. Do not reuse the benchmark's `WINTER20`.
2. **Independent reviewer/approver** (≠ author) must sign off after the manual render checks.
3. **No approved SC `Design.md`/`BrandConfig.md`** — brand values remain `[Inferred]`; confirm to promote.
4. **Klaviyo connector** unavailable this session — needed for the live test send.
