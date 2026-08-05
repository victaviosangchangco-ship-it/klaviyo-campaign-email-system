# SC-2026-W30 — Weekly Campaign Brief

- **Brand:** SectorCare (SC)
- **Cadence:** Weekly · **ISO week:** 2026-W30 (20–26 Jul 2026) · **Send date:** week of 2026-07-21
- **Current build:** `Draft/SC-2026-W30-draft-v1.html` (mirrored to `Output/SC-2026-W30.html`, §4.1/§9).
- **Approval status:** **NOT approved to send.** First draft awaiting user review (§5.1.1 / §9).
- **Continuous-improvement baseline (§5.1.1):** the last approved SC send `Output/SC-2026-W29.html`
  ("Ready for Wherever the Day Takes You" — outings / rollator-led, lifestyle hero, MOVE20 promo).
- **Brand values:** `[Inferred]` from the approved W29 send — SC still has **no approved
  `Design.md` / `BrandConfig.md`** in repo (`03-Brands MD Files/SC.md` is a stub). Header logo
  **LEFT-aligned** (§6.1 SC default). Links point to `sectorcare.com.au`. Prices AUD, GST-inclusive.
- **Product source:** SectorCare BigCommerce store `s-498h0egvgn`, live site `sectorcare.com.au`
  (no BigCommerce/Klaviyo API for SC this session — Klaviyo's connected account is RDD, see
  [[product-source-mapping]]). Every product re-checked at **product-page level** 2026-07-22 (see
  `Assets/SC-2026-W30-assets.md`).

## Campaign concept (fresh for W30) — "The Comfort at Home Edit"

W29 sold **getting out and about** (outings, rollators, a lifestyle waterfront hero). W30 deliberately
pivots to a **different customer intent: comfort and confidence at home**. Deep-winter weeks are when
customers spend the most time indoors, so the edit leads with the home environment — steadier bathrooms,
surer everyday support, and comfortable seating for longer days in.

- **Eyebrow:** The Comfort at Home Edit
- **Headline:** *Comfortable, Confident Living at Home.*
- **Support (one concise line, no dashes, §6.2):** "Thoughtful mobility and daily-living support to make
  everyday life at home feel easier, steadier and more independent, chosen and backed by our friendly
  Australian team."
- **Primary CTA:** "Explore the Comfort Edit" → `sectorcare.com.au/` (broad shop-all, as W29's hero CTA).
- **First-glance hierarchy (§6.3):** logo → warm-cream typographic hero (eyebrow + headline + one support
  line + one primary CTA) → three product sections → promo → category pills → trust → footer.

### How W30 improves on / differs from the W29 baseline (§5.1.1 / §5.2)
1. **New theme + intent** — "comfort at home" vs W29's "out and about". Genuinely new angle.
2. **New hero treatment** — warm-cream (`#ece4d8`) typographic hero with a teal accent rule, vs W29's
   lifestyle photo band. Fresh eyebrow, headline, support and CTA (0 reuse of W29 hero copy).
3. **Re-sequenced narrative** — the story now *starts in the bathroom* (home core) and works outward to
   walking support then comfortable seating, with three **all-new section names + sub-copy**
   ("Start in the Bathroom" · "Steady on Your Feet" · "Comfort That Goes the Distance").
4. **Fresh promo** — new eyebrow "A Little Extra Comfort" (W29's "Your Week, Your Way" dropped), same
   SC-standard $20/$200 offer (§6.4).

## Product plan — exactly 14, 2-column grid (all product-page verified 2026-07-22)

The SC in-stock catalogue is narrow (W29 recorded the scooter range + many chairs/rollators as OOS; the
14 below are the proven in-stock options). Reuse of the W29 set is a deliberate, permitted merchandising
decision (§5.1: strong reason + re-verified stock) — the **campaign around them is new**. All 14 re-checked
on their **own product pages** 2026-07-22: page HTTP 200, image HTTP 200, add-to-cart present / no
out-of-stock marker (see Assets manifest). **Live stock must be re-confirmed at send time (§8.1 gate).**

**1 · Start in the Bathroom (6)**
1. Height Adjustable Aluminium Shower Stool — $35.10
2. U-Shaped Shower Chair with Backrest — $52.20
3. Wall Mounted Folding Shower Seat — $54.00
4. Lightweight Aluminium Commode Chair with Removable Armrests — $81.00
5. 3-in-1 Folding Shower Chair, Commode & Walker – White — $84.60
6. 360° Swivel Transfer Shower Chair with Armrests — $162.00

**2 · Steady on Your Feet — Rollators (4)**
7. LiteRoll Aluminium Rollator Walker – Red — $99.00
8. ComfortRoll Rollator Walker with Backrest – Grey — $202.50
9. GlideRoll Premium Rollator Walker – Champagne — $289.00
10. GlideRoll Heavy Duty Rollator Walker – Black — $261.90

**3 · Comfort That Goes the Distance — Wheelchairs (4)**
11. Aero Portable Wheelchair — $520.00
12. Infinity Aluminum Alloy Electric Wheelchair — $999.00
13. Infinity Air 2 Electric Wheelchair — $1,199.00
14. Infinity Carbon Ergo Electric Wheelchair – Mesh Back — $2,950.00

Grid is all-even (6·4·4) so every row is a full pair — no lone/orphan card (§6.9); equal-height cards via
`.prod-name`/`.prod-sub` reserved heights (§6.8).

## Coupon — PROPOSED (do not send until confirmed — §6.3/§6.4/§6.5)

- **Offer:** SC standard fixed-dollar **"Save $20 on orders over $200"** (§6.4; no percentage discount).
- **Code:** `MOVE20` (carried from W29, still **PROPOSED**). **Fresh promo title** for this send
  ("A Little Extra Comfort") — W29's "Your Week, Your Way" not reused (§6.5).
- **Validity shown:** "Valid until 5 August 2026 · One-time use" — **PROPOSED placeholder date; confirm.**
- **Required before send:** create + confirm `MOVE20` **ACTIVE** in SC BigCommerce (`s-498h0egvgn`),
  confirm the offer mechanics and the real expiry date. No code, discount or date is invented as final.

## Assets
- **Header logo (verified 200):** `.../company/XAUdQX/images/f7015926-fe41-4710-8b2f-d8ec95626866.png`.
- **Product images:** live BigCommerce CDN `s-498h0egvgn`, 1280×1280 stencil (14/14 verified 200).
- **Hero:** typographic (no photo) — no approved on-theme SC lifestyle artwork exists for the "comfort at
  home" concept, and reusing W29's outings photo would break freshness (§5.2). An approved single embedded
  hero artwork (§6.15) can be supplied and dropped in for a later rev (as W29 did v1→v2).

## Missing / to confirm
- [ ] `MOVE20` created + confirmed ACTIVE in SC BigCommerce; confirm real expiry date (5 Aug placeholder).
- [ ] Live stock re-check on all 14 product pages at send time (§5.1/§8.1).
- [ ] §8.1 client render + post-Klaviyo clickability (Klaviyo Preview · Gmail web/mobile · Apple Mail ·
      Outlook) — cannot be exercised in this environment.
- [ ] Independent reviewer/approver sign-off (≠ author, CR-16).
- [ ] Optional: approved on-theme SC hero artwork to replace the typographic hero (§6.15).
