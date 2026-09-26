# SS-2026-W36 — Weekly Campaign Brief

**Brand:** Safety Sector (SS) · **Type:** Weekly · **Campaign id:** `SS-2026-W36` (ISO week 36, 2026)
**Created:** 2026-09-01 · **Status:** Draft built (v1) · Output synced · **NOT approved to send**

## 1. Creative direction — driven by the supplied hero `WheelChock.png`
Hero analysis (the campaign's single source of creative direction):
- **Headline (baked):** "SECURE YOUR LOAD. STAY IN CONTROL." (SS red/black/white, condensed uppercase, red brush accents).
- **Subhead:** "Heavy-duty rubber wheel chock designed to keep vehicles and equipment firmly in place."
- **CTA (baked):** "SHOP RUBBER WHEEL CHOCKS →".
- **Product/hero image:** a black-and-yellow heavy-duty rubber wheel chock against a truck/trailer wheel at a loading yard.
- **Theme:** vehicle & wheel safety — load securing, keeping vehicles/equipment stationary and protected. Industrial B2B (trucks, trailers, warehouses, loading docks, workplace vehicle safety).
- **Tone:** strong, safety-first, industrial. **Not** a Father's Day / promotional-discount send.

## 2. Objective
Convert the "Secure Your Load. Stay in Control." creative into a cohesive Weekly product guide, led by the
hero's exact product (rubber wheel chocks) and extending into the adjacent SS **vehicle & site safety** range.
Every section, heading, CTA and product continues the hero theme (§5.2). No Father's Day content.

## 3. Hero asset & hosting (§7.1)
| Item | Value |
|---|---|
| Source | `hosting/ss/hero-banners/WheelChock.png` (1536×1024) |
| Hosted asset | `hosting/ss/hero-banners/ss-2026-w36-hero-banner.jpg` (1200×800, q86, 195,545 B) |
| Published | `node Scripts/publish-assets.js publish --brand SS --subdir hero-banners --name ss-2026-w36-hero-banner.jpg` → validate SS OK (0 violations) |
| Deploy | branch `ss-2026-w36-hero` → merged to `main` → `git push origin main` → Vercel |
| **Production URL** | `https://assets-ss-wheat.vercel.app/hero-banners/ss-2026-w36-hero-banner.jpg` |
| **Verified** | **HTTP 200 · image/jpeg · 195,545 B · served bytes == local (2026-09-01)** |
| Hero link | image + baked CTA → `https://www.safetysector.com.au/rubber-wheel-chock/` (verified 200) |

## 4. Design Intent (§4.2)
| Field | Value |
|---|---|
| Design status | PROPOSED |
| Fidelity mode | INSPIRATION (structure) — the built SS-2026-W32-v2 supplies the SS Weekly design system; `WheelChock.png` is the TARGET creative |
| Hero role | Offer/Product Hero (STD-HERO §15.6) — baked artwork band (grandfathered §6.15 for supplied creative) |
| Design language | SS industrial: white ground, black Arial-Black headings, red `#e11b22` accent + CTA |
| CTA strength | Strong single primary per section; one closing CTA |

## 5. Products — 18 SS SKUs, 4 theme sections (store 498h0egvgn / SS channel; verified 2026-09-01)
All `is_visible=true`, in stock (inv>0), real price, product URL **HTTP 200**, image on the BigCommerce CDN.

**01 · Wheel Chocks & Wheel Stops** (the hero's core) — 719 ($12.61), 720 ($25.09), 721 ($46.49), 623 ($47.74)
**02 · Traffic Calming & Speed Humps** — 123 ($11.47), 913 ($121.74), 605 ($184.94), 682 ($75.73)
**03 · Dock & Impact Bumpers** — 677 ($35.69), 678 ($64.61), 674 ($55.15), 675 ($31.66)
**04 · Safety Bollards & Parking Protection** — 112 ($56.74), 116 ($125.55), 117 ($102.43), 545 ($59.05), 551 ($217.00), 604 ($41.31)

Excluded as off-theme/OOS: SC-tagged categories (Healthcare/Mobility), convex mirrors/corner guards (tangential), wheel-stop 126 (inv 0), several bollards (inv 0). No product was forced to hit a count — all 18 are genuine vehicle/load/site-safety SKUs.

## 6. Structure (follows SS-2026-W32-v2 conventions exactly)
Header (SS logo left, §6.1) → Hero (edge-to-edge, one inline anchor, §6.6/§6.14) → 4 category sections
(red accent + Arial-Black h2 + sub, Cerberus hybrid `col-2` 2-up grid, fixed-height card cells `.pimg/.pnc/.pdc/.ppc`
§6.8) → Closing CTA ("Keep every load under control." → `/products/`, §6.22) → Trust (2×2, SS claims) →
Contact (02 9790 2182 / sales@safetysector.com.au) → Footer (URL-form merge tags §6.23, SS legal).

## 7. QA
Automated all PASS: tag balance (table/tr/a; the `<td>` count carries the same 1-off MSO-conditional artifact as the
approved W32-v2 template — render verified clean), no `<table>` in `<a>`, no ghost/empty nodes, `{% *_link %}`
footer tags, every `<img>` sized, no localhost/dev URLs, **66.9 KB** (< clip), 18 cards. Desktop render verified
(headless Edge): hero loads, all 4 sections + product images render, cards aligned, closing/trust/contact/footer intact.
Zero Father's Day / cross-brand / fixings leftovers. Manual pre-send: real-client checks (Gmail mobile, Apple Mail,
Outlook, Klaviyo Preview) + audience confirmation (§13.1).

_Created 2026-09-01. Weekly. Brand SS. Theme: Secure Your Load. Stay in Control._
