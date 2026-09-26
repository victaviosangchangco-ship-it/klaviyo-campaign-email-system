# RDD-2026-HOL-fathers-day — Campaign Brief

**Brand (sender + products):** Retail Display Direct (RDD) — single brand
**Campaign type:** Holiday (§5.3) · **Event:** Father's Day AU — **Sunday 6 September 2026**
**Campaign id:** `RDD-2026-HOL-fathers-day` · **Created:** 2026-08-31
**Status:** Draft built (v1) · Output synced · **NOT approved to send** · Klaviyo audience not confirmed (§13.1)

## 1. Objective
Turn Father's Day into gift-led action for RDD's **home-office / ergonomic workspace** range. Position an
ergonomic chair, a sit-stand desk and the desk upgrades around them as practical Father's Day gifts, and
drive traffic to the RDD all-products collection before Sun 6 Sep 2026. Gifting occasion, **no discount**.

## 2. Why this campaign
Why care: a gift Dad uses every working day beats a novelty. Why this theme: the supplied hero creative is a
home-office scene ("Made for Dad, Built for Every Day"). Why these products: every SKU is a verified in-stock
RDD workspace product. Why now: Sun 6 Sep is fixed. Why RDD: Australian owned, fast Australia-wide shipping.

## 3. Design Intent
| Field | Value | Owned by |
|---|---|---|
| **Design status** | **PROPOSED** | NONE · PROPOSED · LOCKED · SUPERSEDED |
| Fidelity mode | **TARGET** | STD-CREATIVE §4.0 |
| Hero role | **Offer / Gift-Occasion Hero** | STD-HERO §15.6 |
| Hero pattern | **Aspect-Locked Band + Colour-Bonded Copy, B1** | STD-HERO §2.1/§2.2 |
| Design language | **Premium editorial / warm home-office** | STD-DESIGN |
| Dominance | Imagery above the fold, typography below the band | Design-Decision-Matrix Q3 |
| Emotional objective | Gratitude, everyday comfort, practical care | Design-Decision-Matrix Q2 |
| CTA strength | Strong single primary, one destination | Flow-Design-Recommendations §1.2 |

### Reference Register
| File | Mode | Note |
|---|---|---|
| `References/ChatGPT Image Aug 30, 2026, 07_50_37 PM.png` | **TARGET** | Supplied hero creative (1536×1024). Optimised to the hosted asset (§8); baked typography kept, all copy also live HTML below the band. |
| `Brands/SS/Campaigns/Holiday/Fathers-Day/Output/SS-2026-HOL-fathers-day.html` | INSPIRATION | Sibling Father's Day structure (shell, sections, closing/trust pattern). RDD card style + palette are RDD's own (§6.13). |

## 4. Palette (RDD, sampled from approved RDD sends + the hero)
Cream `#f2f1ee` ground · charcoal `#2a2e34` ink · RDD orange `#f47c20` accent/CTA · body `#55534f` / sub `#6f6f6f`.
White logo header (avoids orange-on-orange with the orange hero); charcoal deadline strip. RDD approved card
style: white card, brandmark, fixed `pimg` height, **orange price badge** (§6.13/§6.17).

## 5. Hosting (§7.1)
| Item | Value |
|---|---|
| Hosted asset | `hosting/rdd/hero-banners/rdd-2026-hol-fathers-day-hero-v1.jpg` (1200×800, q88, 186,054 B) |
| Published by | `publish-assets.js publish --brand RDD` → validate RDD = OK (0 violations) |
| Production URL | `https://assets-rdd.vercel.app/hero-banners/rdd-2026-hol-fathers-day-hero-v1.jpg` |
| Deploy | branch `hol-fathers-day-2026-heroes` → **PR #7** → **merge pending** → Vercel (RDD project) |
| Verification | ⛔ 404 until PR #7 merges; re-verify HTTP 200 `image/jpeg` after merge |

## 6. Offer — none (gift-led, no invented coupon, §6.3/§6.5).

## 7. Products — 18 RDD home-office SKUs (verified 2026-08-31, store ugqmr0qfvf)
All `is_visible=true`, `availability=available`, `inventory>0`, non-zero price, product URL **HTTP 200**, image
via `stencil/500x500` (200 `image/jpeg`). Grouped 4·4·4·6.

- **01 Ergonomic Office Chairs — "The Chair That Has His Back":** 1353 ($218.70), 1354 ($213.84), 1375 ($229.68), 1350 ($531.90)
- **02 Sit-Stand Desks — "Room to Move All Day":** 1240 ($403.71), 1244 ($420.71), 1228 ($386.71), 1503 ($484.84)
- **03 Desk Comfort — "Comfort in the Details":** 1397 ($29.27), 1393 ($44.41), 1325 ($30.98), 1326 ($44.75)
- **04 Finishing Touches — "Set Up His Space":** 1216 ($30.26), 1217 ($89.23), 1396 ($27.27), 1400 ($44.34), 1341 ($154.35), 1342 ($145.78)

Categories excluded as off-theme for a Father's Day home-office gift send: signage/acrylic/barriers/safety/mobility ranges.

## 8. Messaging (all live HTML; no dashes in copy, §6.2/§6.25)
- Eyebrow: `HAPPY FATHER'S DAY` · Deadline strip: `Father's Day · Sunday 6 September · Order early`
- Script + H1: `Made for Dad,` / `Built for Every Day.`
- Sub: `Thoughtful gifts that support his day to day and everything in between.`
- Hero CTA: `Explore Gift Ideas` → `https://www.retaildisplaydirect.com.au/products/` · Badge: `Great gifts, greater memories`
- Intro: `Skip the socks this year. Give Dad a workspace that looks after him, from a chair that supports his back to a desk that rises when he does.`
- Closing: `Everything He Needs to Work in Comfort` → CTA `Shop the Full Range` → `/products/`
- Subject: `Made for Dad, Built for Every Day` · Preview: `Father's Day is Sunday 6 September. Ergonomic chairs, sit stand desks and desk upgrades to make Dad's home office work as hard as he does.`

## 9. Approval status
Draft built ✅ (`Draft/RDD-2026-HOL-fathers-day-draft-v1.html`) · Output synced ✅ · automated QA ✅ ·
real-client checks ⛔ pending · hero URL ⛔ pending PR #7 merge · independent review ⛔ · recorded approval ⛔ ·
audience ⛔. **Approved to send: NO.**
