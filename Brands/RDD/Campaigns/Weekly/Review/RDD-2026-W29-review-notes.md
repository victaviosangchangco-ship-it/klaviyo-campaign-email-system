# RDD-2026-W29 — Review & QA Notes

## Revision — 2026-07-13 (rev 3, layout + product edit)
Authored as `Draft/RDD-2026-W29-draft-v2.html`, QA'd, then promoted to `Output/RDD-2026-W29.html`
(per user task instruction; reviewer/approver still ≠ author — human sign-off pending, CR-16/CR-17).
Four scoped changes only; no unrelated sections touched.

1. **Product-card price layout (ref Screenshot 2).** Detached the orange price from the white card.
   The white card now holds **image + product name only**; the orange price is a **separate linked
   badge sitting below** the card with a 12px gap so the grey field shows between them (no white
   background behind the price). `.prod-name` min-height 44→52px so all 10 square-stencil (180px)
   white cards are equal height and the badges share one baseline per row. Verified desktop 2-col +
   mobile 1-col renders.
2. **Product swap.** Removed **ErgoDC Heated Mouse Pad Black** (BC 1393). Replaced with the hero's
   featured product **Electric Sit Stand Desk Black 1600mm** (BC id 1240, AUD $403.71, inv 46,
   `availability=available`, `is_visible=true` — verified 2026-07-12; product-on-white 1000×1000
   stencil `.../products/1240/5262/SSDW16B__69704.1718865231.jpg`, HTTP 200). No invented data.
3. **Desk = grid product #1.** Moved to the first card, creating Hero banner → featured product →
   first grid card continuity. Not duplicated elsewhere; still exactly 10 unique products.
4. **Hero→grid spacing (ref Screenshot 3).** Added breathing room below the overlapping hero banner
   by increasing the "Limited Time Sale" heading cell top padding 36→54px (grey space; hero overlap
   gradient left unchanged).

- **Validation:** 10 prod-name blocks · 10 detached orange price badges · 0 old inline `<span>` pills ·
  0 `heated-mouse-pad` refs · desk is card #1 · 0 `[[…]]` tokens · `{% unsubscribe_link %}` intact ·
  tables/tr/td balanced 36/36 · 47/47 · 58/58 · all 12 images + all 19 product/site links HTTP 200 ·
  desktop + mobile screenshots reviewed (match Screenshot 2 card style + improved hero spacing).

---

## Revision — 2026-07-12 (rev 2, BigCommerce-sourced)
Update applied directly to `Output/RDD-2026-W29.html` per task instruction. **Product data now
sourced live from the RDD BigCommerce v3 Catalog API** (read-only client, store `s-ugqmr0qfvf`),
not the website. Connectivity confirmed via `Brands/RDD/.env` credentials.

- **Added a featured-pick product banner** (spotlight) between hero and grid: **Electric Sit Stand
  Desk Black 1600mm** (BC id 1240, AUD $403.71, inventory 46, `availability=available`, `is_visible=true`).
  Clean product-on-white image (1000×1000 stencil) mirroring the reference's chair-into-white treatment.
  Fits the Featured Picks / workspace theme; verified image + product URL return HTTP 200.
- **Grid expanded 6 → 10** (2 col × 5 rows). 4 new products, all BigCommerce-verified in stock 2026-07-12:
  Ergonomic Office Chair High Back Full Mesh Fabric Grey (1383, $220.00, inv 28); Heated Mouse Pad Black
  (1393, $54.82, inv 455); Desktop Pegboard Organizer (1396, $33.66, inv 10); Desktop Whiteboard
  (1399, $24.61, inv 70). All `available` + `is_visible=true`.
- **Card balancing:** `.prod-name` min-height 38→52px so all 10 price pills share one baseline; new cards
  use identical markup + 532×532 stencil images as the original 6. Verified 2-col desktop + 1-col mobile.
- **Copy:** eyebrow → "This week's featured picks"; product heading → "Limited Time Sale"; section button →
  "Learn more →" (→ verified `/on-sale-now/`, HTTP 200); hero intro em dash removed (natural rewrite).
- **Coupon section removed entirely** (no code, no placeholder, no empty container); lower flow now matches
  the reference (grid → Learn more → Shop by Category → See full range → trust → footer). No coupon anywhere.
- **Validation:** 10 grid cards; tables/tr/td balanced 28/28·41/41·52/52; 0 `[[…]]` tokens; `{% unsubscribe_link %}`
  intact; all 12 images + all 20 links HTTP 200; rendered desktop + mobile screenshots reviewed.

---

## Original notes (draft v1)

Improved RDD Weekly, refreshed from the single existing RDD reference campaign
(`../References/RDDCampaign1–6.png` = ONE email: "Upgrade Your Workspace, Boost Every Workday").

- **Draft:** `Draft/RDD-2026-W29-draft-v1.html` · **Output:** `Output/RDD-2026-W29.html`
- **Brand values:** `03-Brands MD Files/RDD.md` marks nearly all identity **To be confirmed**. Facts here are
  **[Confirmed via the connected Klaviyo account `XAUdQX`]** (org name, sender email, address, currency) or
  **[Inferred from the reference]** (orange/navy palette, logo usage) — see the Brief. No approved RDD
  `BrandConfig.md`/`Design.md` exists yet.
- **Author:** engine generation. **Reviewer/approver:** _pending_ — must differ from author (CR-16). Approval not yet recorded (CR-17).

## Reference campaign structure (reconstructed)
Orange hero (white RD logo + eyebrow + headline + subcopy + tan EXPLORE button) with a chair breaking into white →
"Limited Time Sale" centered heading + rule → product grid (navy names, **orange price pills**) → LEARN MORE →
"Shop by Category" + rule + image tiles (orange labels) → SEE FULL RANGE → "We've got you covered" 3-up trust →
light footer (email/site/phone, address, unsubscribe/privacy, © line).

## Preserved (brand familiarity)
- **Orange hero with white logo**; centered section headings with a short **orange underline rule**; **orange price
  pills** on white product cards; grey product-section background; "Shop by Category"; 3-up "We've got you covered";
  the light contact footer with © line.

## Improvements made
- **Hero:** rebuilt as a clean **editable orange text panel** (live HTML text, not a baked-in composite image) — new
  headline "Fresh Displays. Sharper Spaces.", crisp **white** CTA button (vs the low-contrast tan reference button),
  divider rule, tighter hierarchy.
- **Curated grid:** replaced all reference products with a **new 6-best-seller edit** (3×2), equal alignment, price pills.
- **Promo hierarchy:** added a **structurally-ready offer block** (dashed placeholder chip) the reference lacked.
- **Shop by Category:** reference image tiles (assets unavailable) → **orange-outline text pills** to **verified live
  category URLs** — no fabricated tile images.
- Consistent spacing, ≥44px taps, dark-mode handling, meaningful alt text.

## Distinct from SS
Orange (#f47c20) + navy (#2a2e34) + light grey, rounded (6px) buttons, **orange price pills**, centered headings with
rule, light footer — none shared with SS's black/red/white, sharp buttons, red prices, black footer.

## Automated QA — PASS
| Check | Result |
|-------|--------|
| Unresolved framework tokens `[[…]]` | 0 |
| Klaviyo Liquid intact | `{% unsubscribe_link %}` present |
| Table/tr/td balance | 23/23 · 31/31 · 40/40 |
| Product cards | 6 (3 rows × 2) |
| Images with non-empty `alt` (CS-11) | 7/7 |
| Image URLs resolve (HTTP 200) | 7/7 (1 logo + 6 products) |
| Preheader (CS-14) | present + hidden |
| Bulletproof CTA (CS-08) | VML + anchor (×3 CTAs) |
| Dark mode (CS-12) | `color-scheme` meta + `prefers-color-scheme` + `[data-ogsc]` (stable palette) |

## Products (verified live 2026-07-11 — website source, store `s-ugqmr0qfvf`)
Mobile Pedestal 3 Drawer $166.50 · Glass Whiteboard 1200x900mm White $134.55 · ErgoDC Portable Projector Screen
100" 4:3 $297.68 · TV Floor Stand 65–100" $588.00 · Corkboard & Pinboard 1200x900mm $70.52 · A4 Menu Poster Stand
$49.45. All names/URLs/prices/images verified; logo (`RDD Logo-White`) + all product images return HTTP 200.

## Blocking follow-ups / TODOs (before send)
- **Coupon:** `{{COUPON_CODE_TODO}}` — reference had no coupon; the only account coupon `WELCOMEBACK` is a winback
  code (not reused). Confirm a real weekly code + discount + expiry + terms, or remove the offer block.
- **Official RDD brand guide** — confirm orange/navy hex, typefaces and logo usage (currently [Inferred]); promote
  RDD.md values to [Confirmed].
- **Phone** `(02) 9708 5288` — from the reference footer; confirm against an official source.
- **Live stock** for all 6 products at send time (RDD catalog in Klaviyo is empty; website used).
- **BigCommerce store hash** `s-ugqmr0qfvf` observed on live CDN URLs; RDD.md marks BC config To be confirmed.
- **Trust icons** — asset-free glyphs used; hosted RDD icons (`icon-shipping/returns/service`) exist and can be
  swapped in after a visual check.
- **Manual render** (per QA-Checklist): Gmail/Apple Mail (light+dark)/Outlook (VML); pills 3-up→2-up and trust
  3-up→stack at 375px; Klaviyo test send resolves `{% unsubscribe_link %}`.
