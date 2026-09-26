# SC-2026-HOL-fathers-day — Campaign Brief

**Brand (sender + products):** SectorCare (SC) — single brand
**Campaign type:** Holiday (§5.3) · **Event:** Father's Day AU — **Sunday 6 September 2026**
**Campaign id:** `SC-2026-HOL-fathers-day` · **Created:** 2026-08-31
**Status:** Draft built (v1) · Output synced · **NOT approved to send** · audience not confirmed (§13.1)

## 1. Objective
The SectorCare-sent version of the Father's Day mobility campaign. Same Father's Day concept and product story
as the SS cross-brand send, but sent **under SectorCare's own brand** (SC logo, SC contact, SC footer, SC
privacy, SC Klaviyo account, SC hero host). Drives to `sectorcare.com.au`. Gift-led, no discount.

## 2. Relationship to the SS send (§6.28)
The SS-2026-HOL-fathers-day send is a **cross-brand** email: Safety Sector is the *sender*, SectorCare supplies
the *products*. This SC send is the **single-brand** equivalent — SectorCare is both sender and product brand.
Structure/design reused from the completed SS v3 (INSPIRATION); **all SS branding stripped** (0 SS leftovers,
verified): header logo, hero host, contact block, footer legal, privacy URL, subscription-tag account, title,
aria-label all now SC. The cross-brand "Father's Day gifts by SectorCare" attribution row was removed (SC is the
sender) and replaced with a "The Father's Day Gift Guide" lead.

## 3. Design Intent
| Field | Value |
|---|---|
| Design status | **PROPOSED** |
| Fidelity mode | INSPIRATION (from SS v3) |
| Hero role | Offer / Gift-Occasion Hero (STD-HERO §15.6) |
| Hero pattern | Aspect-Locked Band + Colour-Bonded Copy, B1 |
| Design language | Premium editorial / warm lifestyle (navy + cream, from the New Banner) |
| CTA strength | Strong single primary → `sectorcare.com.au` |

### Reference Register
| File | Mode | Note |
|---|---|---|
| `References/SC-fathers-day-hero-New-Banner.png` | TARGET | Same supplied New Banner artwork as the SS send (mobility-scooter Father's Day hero), hosted on the SC host. |
| SS-2026-HOL-fathers-day-draft-v3 | INSPIRATION | Structural/design source; branding fully re-based to SC. |

## 4. Branding (all SC)
- Header: SC logo (`…/XAUdQX/images/f7015926-…png`), left-aligned (§6.1), → `sectorcare.com.au`.
- Palette: campaign navy/cream (from the New Banner) — the hero is the same navy scooter banner; navy links.
- Contact: `Got a question? We're here to help.` · `02 9172 5607` (`tel:0291725607`) · `sales@sectorcare.com.au`.
- Footer: `Unsubscribe · Manage Preferences · Privacy Policy` (URL-form tags, §6.23) → `sectorcare.com.au/privacy-policy/`; legal line **"SectorCare"** (SC has no approved postal address — not invented, §5).
- Klaviyo subscription tags resolve to the **SC** account at send (SC sends from SC's Klaviyo, §12/§13).

## 5. Hosting (§7.1)
| Item | Value |
|---|---|
| Hosted asset | `hosting/sc/hero-banners/sc-2026-hol-fathers-day-hero-v1.jpg` (1200×847, q88, 215,878 B — same New Banner bytes as SS v2) |
| Published/validate | `publish-assets.js` → SC host OK, 0 violations |
| Production URL | `https://assets-sc.vercel.app/hero-banners/sc-2026-hol-fathers-day-hero-v1.jpg` |
| Deploy | **PR #7**, merge pending → re-verify HTTP 200 after merge |

## 6. Products — 18 SC SKUs (identical set to the SS send; verified 2026-08-31)
4 Infinity mobility scooters (801/783/784/802) first, then Rollators (862/863/861/871), Walking Aids
(874/927/926/922), Bath & Toilet (878/933/931/940), Daily Living (942/943). All product-page URLs HTTP 200; all
resolve to `sectorcare.com.au`. **⛔ Same OOS blocker as SS:** the 4 Infinity scooters are `inventory=0` — see Review.

## 7. Offer — none (gift-led; SC standard offer if ever added is $20 off orders over $200, §6.4 — not used here).

## 8. Messaging
Subject `Give Him the Freedom to Enjoy What Matters Most` · Preview (§6.24) `Father's Day is Sunday 6 September.
Mobility and daily living gifts from SectorCare that help Dad stay independent and get out and about.`

## 9. Approval status
Draft ✅ · Output ✅ · automated QA ✅ (0 SS leftovers) · client checks ⛔ · hero URL ⛔ (PR #7) · scooter stock ⛔ OOS ·
independent review ⛔ · approval ⛔ · audience ⛔. **Approved to send: NO.**
