# Weekly Campaign Brief — Retail Display Direct (RDD) 2026-W29

> Stage 1 of the pipeline (WK-P1 / CR-05). Values follow the source-of-truth hierarchy
> (CLAUDE.md §2). Reference screenshots in `../References/` are used for **structure/visual direction only**.
> RDD's brand file (`03-Brands MD Files/RDD.md`) marks nearly all identity values **To be confirmed**;
> where this brief uses a value it states the source and confidence. Nothing invented (CLAUDE.md §5).

## Brand-fact source note (important)
The connected **Klaviyo account is Retail Display Direct** (id `XAUdQX`). This lets us **confirm** several
facts that RDD.md still lists as *To be confirmed*:
- **Brand / org name:** Retail Display Direct **[Confirmed — Klaviyo account]**
- **Sender email:** hello@retaildisplaydirect.com.au **[Confirmed — Klaviyo account]** (reference footer used sales@retaildisplaydirect.com.au — also live)
- **Address:** 3 Wordie Place, Padstow, NSW 2211, Australia **[Confirmed — Klaviyo account]**
- **Currency:** AUD · **Industry:** Ecommerce / Office Supplies **[Confirmed — Klaviyo account]**
- **Website:** https://www.retaildisplaydirect.com.au **[Confirmed]**
- **Legal entity:** Retail Display Direct Pty Ltd **[Confirmed — live privacy policy]**

Visual identity (orange primary, navy headings, white logo) is **[Inferred from the reference campaign]** and
still **To be confirmed** against an official RDD brand guide — RDD.md has no approved `BrandConfig.md`/`Design.md`.

## Campaign meta
- **Brand / code:** Retail Display Direct / RDD
- **Cadence:** Weekly
- **ISO week / send date:** 2026-W29 / target Tue 2026-07-14  *(placeholder — confirm against Content Calendar)*
- **Subject line (WK-S1):** New this week: displays & workspace essentials that work harder
- **Preheader (WK-S2):** Signage, whiteboards, TV stands and storage — best-sellers to sharpen your space. Australia-wide shipping.

## Objective
- **Purpose of this send:** Refreshed weekly featuring a **new, curated set of best-sellers** (retail display +
  workspace), replacing the reference send's product line-up; drive product/category clicks.
- **Primary metric:** Click-through to product/category pages → orders.

## Key message (WK-S4 hero)
- **Eyebrow:** THIS WEEK'S RETAIL & WORKSPACE EDIT
- **Headline:** Fresh Displays. Sharper Spaces.
- **Body:** From presentation-ready displays to workspace storage that keeps you organised, here's this week's pick of retail and office best-sellers — ready to ship across Australia.
- **Hero CTA:** Shop the edit → homepage.

## Offer / incentive (coupon block)
- **Coupon code:** `{{COUPON_CODE_TODO}}` — the reference send had **no** coupon. The only coupon in the RDD Klaviyo
  account is `WELCOMEBACK` (described "valid for 1 year"), which is a **winback** code, not a confirmed weekly-promo
  code — so it is **not** used here. A promo block is included **structurally ready** with a clearly-marked placeholder.
- **Discount / expiry / terms:** **To be confirmed** before send.

## Primary CTA (WK-S5)
- **Label:** Shop the edit / See all best-sellers
- **URL:** https://www.retaildisplaydirect.com.au/

## Featured products (WK-S6) — 6, verified live 2026-07-11
- **Product source:** Live website (RDD.md temporary product source). BigCommerce store hash `s-ugqmr0qfvf`
  (observed on live CDN URLs; RDD.md marks BC config To be confirmed). Klaviyo catalog empty — website used.
  All names/URLs/prices/images **verified live 2026-07-11**.

| # | Product | Price (AUD, inc GST) | Product URL |
|---|---------|------|-------------|
| 1 | Mobile Pedestal 3 Drawer | $166.50 | /mobile-pedestal-3-drawer/ |
| 2 | Glass Whiteboard 1200x900mm White | $134.55 | /glass-whiteboard-writing-board/ |
| 3 | ErgoDC Portable Projector Screen 100" 4:3 | $297.68 | /ergodc-portable-projector-screen-100-4-3/ |
| 4 | TV Floor Stand 65–100" | $588.00 | /tv-floor-stand-65-100/ |
| 5 | Corkboard & Pinboard 1200x900mm | $70.52 | /pinboard-for-sale-sydney-1200x900mm/ |
| 6 | A4 Menu Poster Stand | $49.45 | /a4-menu-poster-stand/ |

> Products deliberately **different** from the reference send (which featured clip frames, a black glass whiteboard,
> exec office chair, brochure stand, acrylic sign holder, projector screen 16:9, heated mouse pad, pegboard,
> children's chair, L-shaped gaming desk).

## Secondary content (WK-S7)
- **Shop by Category (text pills; URLs verified live):** Ergonomic Office Chairs (/ergonomic-office-chair/),
  Sit-Stand Desks (/sit-stand-desk/), Mobile TV Stands (/mobile-tv-stand-for-sale/), Snap Frames (/snap-frames/),
  Acrylic Display (/acrylic-display/), A-Frame Signs (/aframes-sandwich-boards/).
- **Trust strip (from reference; 3-up):** Australia-Wide Shipping (on every order) · Fast & Simple Returns
  (including discounted items) · Expert Customer Service (Mon–Fri, 9am–5pm).
- **Contact block:** sales@retaildisplaydirect.com.au · www.retaildisplaydirect.com.au · (02) 9708 5288.

## Assets required
- **Header logo (verified in RDD Klaviyo library "RDD Logo-White"):**
  `https://d3k81ch9hvuctc.cloudfront.net/company/XAUdQX/images/19434473-b495-4540-8a3c-ffe9c37a879f.png` (white, for the orange hero).
- **Product images:** live BigCommerce CDN `s-ugqmr0qfvf` (see Assets manifest).
- **Trust icons:** asset-free unicode glyphs (verified hosted RDD icons `icon-shipping/returns/service` exist in the
  Klaviyo library and can be swapped in after a visual check).

## Missing / to confirm
- [ ] Official RDD brand guide — confirm orange/navy hex, typefaces, logo usage (all [Inferred] from reference).
- [ ] Current RDD coupon (placeholder used).
- [ ] Phone (02) 9708 5288 against an official source (reference footer).
- [ ] BigCommerce store hash / API config (RDD.md: To be confirmed).
- [ ] Live stock at send time for the 6 featured products.
