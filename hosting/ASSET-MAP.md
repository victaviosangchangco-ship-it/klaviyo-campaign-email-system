# hosting/ — Asset Map

Per-brand Vercel static hosts, reorganized **by brand → purpose** (2026-08-27). Each brand deploys from
its own Vercel project (Root Directory `hosting/<brand>`) off this repo's `main`. This file is **not served**
(it sits outside every brand Root Directory).

**Categories:** `hero-banners/` (banner/hero-banner sections) · `hero-images/` (main hero images) ·
`featured-images/` (featured product/content) · `flow-assets/` (Klaviyo *flow*-specific) · `other/`.
Infra (`healthcheck.png`, `vercel.json`, `.gitkeep`) stays at each brand root.

**Backward compatibility:** every file that had a **live flat URL** was moved AND a `rewrites` entry was
added to that brand's `vercel.json` mapping the **old flat path → new subfolder path**, so previously-published
URLs (incl. already-sent campaign emails) keep returning HTTP 200. New canonical URLs also resolve. Both verified.

Hosts: SS `https://assets-ss-wheat.vercel.app/` · RDD `https://assets-rdd.vercel.app/` · SC `https://assets-sc.vercel.app/`

---

## SS (assets-ss-wheat.vercel.app)

| Type | Filename | New path (canonical URL) | Old flat URL (rewrite→new) | Referenced by |
|---|---|---|---|---|
| hero-banners | ss-2026-w32-hero-banner.jpg | /hero-banners/ss-2026-w32-hero-banner.jpg | /ss-2026-w32-hero-banner.jpg ✓ | SS-2026-W32 Brief/Draft/Output/Review; Campaign CLAUDE.md |
| hero-banners | Edit_banner_lower_text_202608161332.jpeg | /hero-banners/Edit_banner_lower_text_202608161332.jpeg | /Edit_banner_lower_text_202608161332.jpeg ✓ | SS/SC-2026-LAUNCH (everyday-mobility) Brief/Draft/Output/Review |
| hero-banners | Designing_new_product_launch_banner_202608161941.jpeg | /hero-banners/Designing_new_product_launch_banner_202608161941.jpeg | (was never deployed — no rewrite) | (none) |
| hero-images | ss-2026-launch-mobility-hero.jpg | /hero-images/ss-2026-launch-mobility-hero.jpg | /ss-2026-launch-mobility-hero.jpg ✓ | SS-2026-LAUNCH mobility-daily-living-aids Draft/Output/Review |
| hero-images | ss-2026-launch-mobility-hero-v2.jpg | /hero-images/ss-2026-launch-mobility-hero-v2.jpg | /ss-2026-launch-mobility-hero-v2.jpg ✓ | SS-2026-LAUNCH review |
| featured-images | ss-2026-w32-wth-{durability,industrial,masonry,wheelstop}-photo-v1/v2.jpg (8) | /featured-images/… | /ss-2026-w32-wth-…-photo-v*.jpg ✓ | SS-2026-W32-v2 Output |
| featured-images | ss-2026-w32-wth-{durability,industrial,masonry,wheelstop}-v1.png (4) | /featured-images/… | /ss-2026-w32-wth-…-v1.png ✓ | SS-2026-W32-v2 Output |
| flow-assets | ss-flow-abandoned-checkout-hero-v1.jpg | /flow-assets/ss-flow-abandoned-checkout-hero-v1.jpg | /ss-flow-abandoned-checkout-hero-v1.jpg ✓ | Flow project: SS Abandoned Checkout E1/E2/E3 (templates VRmL3n/TSMC4R/Xp28Jr, updated to new URL) |

## RDD (assets-rdd.vercel.app)

| Type | Filename | New path | Old flat URL (rewrite→new) | Referenced by |
|---|---|---|---|---|
| hero-banners | Replace_product_in_design_template_202608162013.jpeg | /hero-banners/… | /Replace_product_in_design_template_202608162013.jpeg ✓ | RDD-2026-37 Brief/Draft/Output/Review |
| hero-banners | Refine_hero_banner_typography_202608251701.jpeg | /hero-banners/… | (was never deployed — no rewrite) | (none) |
| hero-images | rdd-bottle-stay-cool-hero-v1.jpg | /hero-images/… | /rdd-bottle-stay-cool-hero-v1.jpg ✓ | RDD-2026-W35 Brief/Draft; RDD-2026-56 Output/Review |
| hero-images | rdd-bottle-stay-cool-hero-v2.jpg | /hero-images/… | /rdd-bottle-stay-cool-hero-v2.jpg ✓ | RDD-2026-W35 review |
| featured-images | reference-to-copy.png (renamed from "Reference to Copy.png") | /featured-images/reference-to-copy.png | (was never deployed — no rewrite) | (none) |
| **LEFT IN PLACE** | Environmental Images/{Boardroom Presentation, Conference and Venues, POP-UP & ON-SITE EVENTS, Training and Workshops}.jpeg (4) | /Environmental Images/… (unchanged) | n/a — not moved | RDD-2026-37 Draft/Output/Review |

> **Why left in place:** these live/deployed URLs contain **spaces and `&`**, which make Vercel `rewrites` source-matching unreliable. Moving them risked a silent 404 on the RDD-2026-37 (approved/possibly-sent) email. They are already grouped in `Environmental Images/`. Move deferred until each rewrite can be individually tested. (Candidate target: `featured-images/`.)

## SC (assets-sc.vercel.app)

| Type | Filename | New path | Old URL | Referenced by |
|---|---|---|---|---|
| hero-banners | Replace_products_in_design_reference_202608102117.jpeg (renamed from "…refer…" ellipsis) | /hero-banners/… | (was never deployed — no rewrite) | SC-2026-LAUNCH Output referenced the SS `Edit_banner_lower_text` asset, not this file |

---

*Generated 2026-08-27. Rollback point (pre-reorg commit): `ffb8898`. Reorg commit: `1a71185`.*
