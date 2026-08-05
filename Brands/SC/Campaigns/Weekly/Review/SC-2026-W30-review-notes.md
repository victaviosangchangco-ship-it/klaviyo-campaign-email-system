# SC-2026-W30 — Review & QA Notes

## Draft v1 — 2026-07-22 (new Weekly send; theme: "The Comfort at Home Edit") — PROMOTED TO OUTPUT
Authored as `Draft/SC-2026-W30-draft-v1.html`; mirrored to `Output/SC-2026-W30.html` (byte-identical, §4.1/§9).
**Status: NOT approved to send** — first draft awaiting user review. Author = engine; reviewer/approver must
differ (CR-16) and sign off after the §8.1 client-render checks.

### Continuous-improvement baseline (§5.1.1)
Analysed the last approved SC send `Output/SC-2026-W29.html` ("Ready for Wherever the Day Takes You" —
outings / rollator-led, lifestyle photo hero, 14 products, MOVE20 $20/$200 promo, category pills after promo).
W30 keeps SC's proven structure and brand vibe but is a **fresh campaign**:
- **New intent/theme** — "comfort & confidence at home" vs W29's "out and about".
- **New hero** — warm-cream (`#ece4d8`) typographic hero with a teal accent rule + fresh eyebrow/headline/
  support/CTA (0 reuse of W29 hero copy), vs W29's lifestyle photo band.
- **Re-sequenced story with 3 all-new section names + sub-copy** — "Start in the Bathroom" → "Steady on Your
  Feet" → "Comfort That Goes the Distance" (W29 used "Bathroom & Everyday Safety" / "Getting Around, Made
  Easy" / "Wheelchairs, Manual To Powered").
- **Fresh promo eyebrow** "A Little Extra Comfort" (W29's "Your Week, Your Way" retired), same SC-standard
  $20/$200 offer (§6.4).

### Products — 14, re-verified on their own product pages 2026-07-22 (§5.1)
All 14 = page HTTP 200, image HTTP 200, add-to-cart present / no OOS marker. These are the W29-verified
in-stock SC set (narrow in-stock catalogue; scooters + many chairs/rollators remain OOS) — reuse is a
deliberate, permitted merchandising decision (§5.1) under a **new campaign**. No product/price/URL/image
invented. Full table in `Assets/SC-2026-W30-assets.md`. **Live stock must be re-confirmed at send (§8.1).**

### Coupon — PROPOSED (gate to send)
SC standard **$20 off orders over $200** (§6.4; **0** percentage discounts). Code **MOVE20** (from W29, still
PROPOSED) with a **fresh promo title**. Validity shown "Valid until 5 August 2026 · One-time use" is a
**PROPOSED placeholder date**. Before send: create + confirm MOVE20 **ACTIVE** in SC BigCommerce
(`s-498h0egvgn`) and confirm the real expiry. Nothing about the code/discount/date is treated as final (§6.5).

### Automated QA — PASS
- **Links:** 36 unique https URLs, **0 non-200** (14 product pages, 14 product images, logo, 6 category
  pills incl. Shop All, privacy-policy) — pages checked with a browser UA, images with the GoogleImageProxy
  UA. **Privacy link corrected to `/privacy-policy/` (200)** — W29's `/privacy` now returns **404** and must
  not be reused (recorded so a future rule/fix can address the W29 Output file separately).
- **Structure:** **14 product cards**, **15 images** (14 products + logo), **6 category pills**, 3 sections
  (6·4·4 — all even, no orphan card, §6.9).
- **§6.6 email-safety:** anchors wrapping a `<table>` = **0**; image anchors with `display:block` = **0**;
  empty/`#`/placeholder anchors = **0**. Product image + name/price sit in a card with the anchor wrapping
  inline content only (approved W29 pattern).
- **§6.8 equal-height grid:** `.prod-name` (min 34px) + `.prod-sub` (min 53px, two `<br>` spec lines) keep
  every card equal height so prices align across each desktop row; min-heights reset to 0 on mobile so
  stacked cards size naturally.
- **Copy (§6.2/§6.4):** **0** em dashes in visible copy; **0** `% off` (SC fixed-dollar only); 14 AUD prices;
  fresh hero + promo + section copy (0 hits for W29's "Ready for Wherever" / "Your Week, Your Way").
- **Tags balanced:** table 42/42 · tr 64/64 · td 78/78 · a 27/27 · p 66/66.
- **Compliance:** preheader present + hidden; `{% unsubscribe_link %}` + `{{ organization.name }}` +
  `{{ organization.full_address }}` intact (3 org tokens); `color-scheme` meta + `prefers-color-scheme` +
  `[data-ogsc]` (SC stable-light palette). Logo LEFT-aligned (§6.1).
- **Ghost Element Inspection (§8.2):** no empty anchors/cells, no nested anchors, no ghost tables, no
  zero-size/hidden links, no literal `...`/`…`, comments free of tag-like prose. Clean.

### ⚠️ Outstanding §8.1 GATE (required before send — cannot be exercised in this environment)
- Render + post-Klaviyo clickability on **Klaviyo Preview · Gmail Web · Gmail Mobile · Apple Mail (iPhone) ·
  Outlook** (desktop + mobile): confirm all product cards, category pills, hero CTA and promo CTA navigate to
  the correct live URL **after Klaviyo import** (Klaviyo rewrites links); confirm the grid stacks 2-up → 1-up,
  pills 3-up → 2-up, trust 4-up → 2×2, and the hero headline scales cleanly.
- Re-confirm live stock on all 14 product pages at send time.
- Create + confirm **MOVE20** ACTIVE in SC BigCommerce; confirm the real expiry date.
- Independent reviewer/approver sign-off (≠ author, CR-16).
- Optional: supply an approved on-theme SC hero **artwork** to replace the typographic hero (§6.15).

### Note on SC brand sources
SC still has **no approved `Design.md` / `BrandConfig.md`** (`03-Brands MD Files/SC.md` is a stub). All brand
values (palette #3d7a94 teal / beige / #1a1a1a, Georgia + Helvetica type, footer, trust claims, logo) are
`[Inferred]` from the approved W29 send. Confirm against an official SC source before treating as authoritative.
