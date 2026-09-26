# SS-2026-HOL-fathers-day — Campaign Brief

> **Updated 2026-08-31 (v3):** hero swapped to the supplied **New Banner**, product grid expanded to **18** (4 Infinity scooters first + 14 SC), "Eight days to go" section removed, closing concept + CTA replaced. This brief documents the original v1/v2; see `../Review/SS-2026-HOL-fathers-day-review.md` for the current (v3) state and the **OOS scooter send-blocker**.


**Brand (sender):** Safety Sector (SS)
**Campaign type:** Holiday (CLAUDE.md §5.3 · `Playbooks/Holiday-Playbook.md` · `07-Prompt Library/Generate-Holiday-Campaign.md`)
**Featured products:** SectorCare (SC) — cross-brand send (CLAUDE.md §6.28)
**Event:** Father's Day (Australia) — **Sunday 6 September 2026**
**Brief created:** 2026-08-29 (Saturday, 8 days before the event)
**Campaign id:** `SS-2026-HOL-fathers-day`
**Status:** Draft built · **NOT approved to send** · Klaviyo audience **not yet confirmed** (§13.1)

---

## 1. Objective

Convert a real, dated calendar moment into gift-led action. Position SectorCare mobility and daily-living
products as **Father's Day gifts that give Dad independence**, and drive traffic to `sectorcare.com.au`
before Sunday 6 September 2026.

This is a **gifting/occasion** Holiday send, not a discount send — see §6 below.

## 2. Why this campaign, answered

| Question | Answer |
|---|---|
| Why should the customer care? | Father's Day is in 8 days and a practical gift that restores independence outlasts a novelty gift. |
| Why this theme? | The supplied reference creative sets the theme: freedom, independence, confidence. |
| Why these products? | Every SKU is a genuine SectorCare mobility / daily-living aid, verified in stock, that directly supports getting out, moving safely, and living independently. |
| Why now? | Sunday 6 September 2026 is a fixed date. Ordering has to happen this week. |
| Why buy from this brand? | Australian owned, registered NDIS provider, fast Australia-wide shipping, 30-day returns. |

## 3. Cross-brand structure (CLAUDE.md §6.28)

- **Sender = Safety Sector.** SS header logo, SS contact block, SS legal footer, SS Klaviyo account
  (`T7SuPP`), SS privacy policy, SS subscription merge tags.
- **Featured products = SectorCare.** Every product card image / name / price anchor, the SC section
  header logo, the hero CTA and the closing CTA resolve to **`sectorcare.com.au`** — the product's own
  brand site, never the sender's, per §6.28.
- **A second SectorCare header/logo block sits immediately above the product grid** so the reader
  understands SS is launching the campaign and SC supplies the gifts. It is deliberately smaller and
  quieter than the SS masthead so it never overpowers the sending brand.

## 4. Design Intent

| Field | Value | Owned by |
|---|---|---|
| **Design status** | **PROPOSED** | one of NONE · PROPOSED · LOCKED · SUPERSEDED |
| Fidelity mode | **TARGET** | STD-CREATIVE §4.0 — TARGET · INSPIRATION · LEGACY |
| Hero role | **Offer Hero → Gift/Occasion Hero** (dated occasion, gift-led, no discount) | STD-HERO §15.6 |
| Hero pattern | **Aspect-Locked Band + Colour-Bonded Copy, variant B1** (foreground `<img>` band, zero overlay) | STD-DESIGN · Hero-Pattern-Library.md · STD-HERO §2.1/§2.2 |
| Design language | **Premium editorial / warm lifestyle** — cream ground, deep-navy ink, generous whitespace | STD-DESIGN · Design-Language-Library.md |
| Dominance | **Imagery-dominant above the fold, typography-dominant below the band** | STD-DESIGN · Design-Decision-Matrix.md Q3 |
| Emotional objective | **Warmth, gratitude, restored independence** | STD-DESIGN · Design-Decision-Matrix.md Q2 |
| CTA strength | **Strong single primary**, one destination, repeated at natural scroll points | Flow-Design-Recommendations.md §1.2 |

### Reference Register

| File | Mode | Note |
|---|---|---|
| `References/Father's Day Campaign.png` | **TARGET** | The supplied campaign creative. Implemented faithfully: layout intent, visual hierarchy, palette, typography hierarchy, CTA style + placement, decorative heart divider, badge/accent treatment. **Preserved untouched**; the hosted production asset is an optimisation of it (§5). |
| `Brands/SS/Campaigns/Product Launch/Output/SS-2026-LAUNCH-everyday-mobility-accessories.html` | INSPIRATION | The approved SS-sends-SC cross-brand precedent. Supplies the structural pattern (SS masthead → hero → SC attribution mark → SC grid → SS trust/contact/footer) only. |

### 4.1 Hero geometry gate (STD-HERO §12.1 — computed before build)

- **Variant: B1 (foreground image band).** There is **no HTML text overlaid on the artwork**, therefore
  the drift term does not exist, `k` and `W*` are **not applicable**, and §2.3's B2 gate is not invoked.
  No VML background, no `background-size`, no proportional left/right positioning (§13.1, §13.5, §13.7
  all satisfied by construction).
- **Aspect lock:** master 1536×1024 → ratio **0.6667 (3:2)**. At the 600px container the band renders
  **600 × 400**, declared with real `width`/`height` HTML attributes. Delivered **@2x (1200×800)**.
- **Copy surface:** flat cream `#f3f0eb` carried on the `bgcolor` **attribute** as well as inline
  `background`, so it survives Gmail mobile dropping CSS backgrounds (§6.16).

### 4.2 Recorded deviation — baked typography inside the supplied artwork (STD-HERO §4.4)

**The standard forbids text baked into hero artwork. The supplied TARGET creative contains baked
typography** (headline, subhead, body line, CTA shape, badge) across its left half, and a baked badge
over the scooter's wheel area at bottom-right.

**Why it was not cropped out:** no text-free landscape crop exists that keeps both faces and the scooter
intact — the copy occupies the full left half vertically and the badge sits over the lower right.
Cropping would damage the approved creative, which **§8 forbids without approval** ("any visual
substitution is a design change and requires approval").

**Accepted, with the risk mitigated rather than ignored:** **every campaign message and the CTA are live,
editable HTML** in the colour-bonded panel below the band — headline, supporting copy, primary CTA button
and the badge are all real text/anchors. Consequences of §13.2 are therefore neutralised:

- **Images-off still communicates the whole offer** — the live panel below carries headline, copy and a
  working CTA. Only decorative typography is lost.
- **The CTA is a real anchor** with a ≥44px tap target and an editable destination; it is not the image.
- **Copy, date and destination can be changed without an artwork re-export.**
- The band carries meaningful `alt` and a styled alt box.

**Decision owner:** user-directed (campaign request, 2026-08-29). To be confirmed at review; if the
baked typography is to be removed, a **text-free re-export** of the same composition is the correct fix
(STD-HERO §14.1–§14.2 artwork brief), not an HTML workaround.

### 4.3 Campaign-scoped palette (sampled from the TARGET reference)

Deliberate, user-directed, **campaign-scoped** holiday palette. SS's standard tokens
(`config/brands/SS.config.json`: black/white, red `#e11b22`, 0 radius) remain the default for all other
SS sends and are **not** changed by this campaign. The Holiday Playbook permits event-specific styling
within the brand system; SS brand identity is carried by the masthead, contact block and footer.

| Token | Hex | Sampled from |
|---|---|---|
| Cream ground (bond hex / copy surface) | `#f3f0eb` | reference background, modal |
| Deep navy (headline, eyebrow, badge, rules) | `#032a58` | headline / badge / wave, modal |
| CTA navy (button fill) | `#142f66` | CTA brush fill, modal |
| Accent blue (sub-headline) | `#4870b5` | "Freedom to Enjoy Every Moment", modal |
| Body text | `#3a3936` | supporting copy |

## 5. Reference asset and hosting (CLAUDE.md §7.1, §8)

| Item | Value |
|---|---|
| Original reference (**preserved, untouched**) | `Brands/SS/Campaigns/Holiday/References/Father's Day Campaign.png` — 1536×1024 PNG, 2,169,791 B |
| Hosted production asset | `hosting/ss/hero-banners/ss-2026-hol-fathers-day-hero-v1.jpg` — 1200×800 JPEG q88, 194,457 B |
| Optimisation | Same crop, same composition, PNG → quality-tuned JPEG, downscaled to @2x for the 600px container (§8: optimise the same asset, never substitute) |
| Published by | `node Scripts/publish-assets.js publish --brand SS --src … --subdir hero-banners --name ss-2026-hol-fathers-day-hero-v1.jpg` |
| Isolation validator | `node Scripts/publish-assets.js validate SS` → **OK (22 files, 0 violations)** |
| Deploy | branch `ss-2026-hol-fathers-day-hero` → PR #6 → merged to `main` → Vercel (SS project, Root Directory `hosting/ss`) |
| **Production URL** | **`https://assets-ss-wheat.vercel.app/hero-banners/ss-2026-hol-fathers-day-hero-v1.jpg`** |
| **Verification** | **HTTP 200 · `image/jpeg` · 194,457 B · no redirect** (2026-08-29) |

No new hosting architecture was created; the existing shared per-brand Vercel tree was reused.

## 6. Offer / coupon — deliberately none (BLOCKER-FREE by design)

**No coupon code is used in this campaign, and none was invented.**

- There is **no approved, active Father's Day coupon** for SS or SC. `config/brands/SC.config.json`
  carries `MOVE20` at confidence **PROPOSED**, explicitly "must be created + ACTIVE in BigCommerce before
  send" — it is **not** confirmed active, so under §6.3/§6.5 it cannot ship.
- The TARGET reference is itself **gift-led, not discount-led** ("SHOP FATHER'S DAY GIFTS", no price, no
  percentage), so an occasion-led campaign is faithful to the approved creative.
- The Holiday deadline is therefore carried by the **real event date** (Sunday 6 September 2026) and an
  honest "order early so it arrives in time" line — **no invented shipping cut-off date**.

> **Open decision for the user:** if a real Father's Day discount is wanted, supply a code that is
> **created and confirmed active in BigCommerce** and it will be added as a fresh, event-specific promo
> block (§6.5). Until then the campaign ships without one. For SC the standard offer structure would be
> the fixed-dollar **"$20 off orders over $200"**, never a percentage (§6.4).

## 7. Product strategy — 16 SectorCare products, organised by category

Sourced from the **shared BigCommerce store `498h0egvgn`, SectorCare channel 1786273 / category tree 2**
(`config/brands/SC.config.json`). Selected for genuine Father's Day gifting relevance: independence,
getting out, moving safely, everyday comfort.

**Every product below was verified individually (2026-08-29):** `is_visible=true`, `availability=available`,
inventory > 0, non-zero price, live product URL **HTTP 200 with Add-to-Cart present and no out-of-stock
state**, and image URL **HTTP 200 `image/jpeg`**. Prices are BigCommerce `calculated_price`, spot-checked
against the storefront-rendered price.

### Category 1 — Out and About · Rollators & Walkers
| # | ID | SKU | Product | Price (AUD) | Stock |
|---|---|---|---|---|---|
| 1 | 862 | RLT02HDBLA | SectorCare GlideRoll Heavy Duty Rollator Walker – Black | 235.80 | 38 |
| 2 | 863 | RLT03GRE | SectorCare ComfortRoll Rollator Walker with Backrest – Grey | 137.70 | 42 |
| 3 | 861 | RLT02CHA | SectorCare GlideRoll Premium Rollator Walker – Champagne | 298.00 | 5 |
| 4 | 871 | FWALSEATMSIL | SectorCare Foldable Aluminium Walker with Detachable Seat | 69.97 | 86 |

### Category 2 — Every Step, Steady · Walking Aids
| # | ID | SKU | Product | Price (AUD) | Stock |
|---|---|---|---|---|---|
| 5 | 874 | BQCALBRO | SectorCare Adjustable Quad Cane | 28.31 | 79 |
| 6 | 927 | CALTR02BLA | SectorCare Adjustable Walking Cane with TPR Grip – Black | 21.20 | 96 |
| 7 | 926 | CALTR01BRO | SectorCare Large Rubber Tip Adjustable Walking Cane – Bronze | 20.47 | 97 |
| 8 | 922 | FCTAL01 | SectorCare Adjustable Forearm Crutch | 26.15 | 97 |

### Category 3 — Confidence in the Bathroom · Bath & Toilet Aids
| # | ID | SKU | Product | Price (AUD) | Stock |
|---|---|---|---|---|---|
| 9 | 878 | SBST36001MSIL | SectorCare 360° Swivel Transfer Shower Chair with Armrests | 91.90 | 93 |
| 10 | 933 | SCAL03SSIL | SectorCare Foldable Shower Chair with Backrest and Handles | 72.82 | 34 |
| 11 | 931 | SBAL01SSIL | SectorCare Transfer Bath Bench with Backrest | 58.31 | 46 |
| 12 | 940 | THRAL02SSIL | SectorCare Height-Adjustable Raised Toilet Seat with Flip-Up Armrests | 103.49 | 85 |

### Category 4 — Comfort Around the Home · Daily Living
| # | ID | SKU | Product | Price (AUD) | Stock |
|---|---|---|---|---|---|
| 13 | 883 | SSFAL01WHI | SectorCare Standing Assist Frame | 32.82 | 37 |
| 14 | 884 | FBRST01WHI | SectorCare Folding Bed Rail with Safety Handle | 33.67 | 41 |
| 15 | 942 | BTST01 | SectorCare Portable Bedside Table | 72.17 | 44 |
| 16 | 943 | SCRCO01GRE | SectorCare Rotating Seat Cushion | 25.48 | 46 |

**Total: 16 products · 4 categories · 4 per category** (even counts → clean 2-column grid, no orphan
row, no odd-card centering required, §6.9).

### 7.1 Categories deliberately excluded, and why

| SC category | Excluded because |
|---|---|
| Mobility Scooter (140) | **All 10 visible products have inventory 0.** Cannot be featured (§5.1). Notable because the reference creative pictures a scooter — the hero remains valid as lifestyle imagery, but no scooter is linked or sold in the grid. |
| Electric Wheelchair (141) | 10 of 11 visible products have inventory 0; the one exception has inventory 1. Too thin to feature. |
| Manual Wheelchair (139) | In stock and valid, but big-ticket and less giftable than the four chosen categories; held back to keep the grid coherent at 16. |
| Disability Ramps (145) | In stock and valid, but an access-infrastructure purchase rather than a Father's Day gift. |
| Hidden categories (158–174, 192, 193, …) | `is_visible=false` in the catalogue. |

## 8. Messaging (all live HTML, recreated from the TARGET reference)

- **Eyebrow:** `HAPPY FATHER'S DAY · SUNDAY 6 SEPTEMBER`
- **Headline (H1):** `Give Dad the Freedom to Enjoy Every Moment.`
- **Supporting copy:** `Comfort, independence and confidence so he can go wherever life takes him.`
- **Primary CTA:** `SHOP FATHER'S DAY GIFTS →` → `https://sectorcare.com.au/`
- **Badge/accent:** `A GIFT THAT KEEPS DAD GOING`
- **Urgency (HOL-S6):** honest, no invented cut-off — Father's Day is Sunday 6 September; order early.
- **Subject line:** `Give Dad the Freedom to Enjoy Every Moment`
- **Preview text (§6.24, non-empty, campaign-specific, complements the subject):**
  `Father's Day is Sunday 6 September. Mobility and daily living gifts from SectorCare that help Dad stay independent, in stock and shipping Australia wide.`

Copy constraints applied: **no em dashes or dash interruptions** (§6.2), one introduction only (§5.2),
short and scannable (§6.25), no recycled promo title (§6.5).

## 9. Approval status

| Gate | Status |
|---|---|
| Draft built | ✅ `Draft/SS-2026-HOL-fathers-day-draft-v1.html` |
| Output synced to latest draft | ✅ `Output/SS-2026-HOL-fathers-day.html` |
| Automated QA (structure, links, images, ghost, merge tags) | ✅ see `Review/` |
| Real-client verification (Gmail mobile, Apple Mail iOS, Outlook, Klaviyo Preview) | ⛔ **Not exercisable in this environment — required manual pre-send step** |
| Independent reviewer ≠ author (CR-16) | ⛔ Pending |
| Recorded approval (CR-17) | ⛔ Pending |
| Klaviyo audience confirmed (§13.1) | ⛔ **Pending — must be confirmed by the user before any draft is created** |
| **Approved to send** | ⛔ **NO** |

---

_Created 2026-08-29. Campaign type Holiday. Sender SS. Products SC._
