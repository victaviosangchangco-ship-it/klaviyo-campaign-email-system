# QA — Product Launch Checklist

Type-specific QA gate for **Product Launch** sends. Use in the send's `Review/` folder. This extends the
general [`QA-Checklist.md`](QA-Checklist.md) and enforces the email-client compatibility gates in
**CLAUDE.md §8.1**. **No item may be waived to "fix later"** — resolve before the **send** (the latest
build still lives in `Output/` for preview while it is being fixed; §4.1/§9).
Never approve on localhost/desktop rendering alone.

Record, in `Review/`, the actual result of each check and which clients were exercised. If a client
cannot be tested in this environment, say so explicitly and flag it as a required manual pre-send step
(never imply it passed).

---

## A. Product data (BigCommerce API — source of truth)
For **every** SKU in the grid:
- [ ] **SKU** confirmed via API (`/catalog/products?sku=` or `/catalog/variants?sku=`) — exact match recorded.
- [ ] **Product name** correct, and does **not** contain another brand's name.
- [ ] **`visible = true`** (published). A hidden product's live URL 404s — it must not be linked.
- [ ] **Product URL** returns **HTTP 200** (live, no redirect chain) — tested, not assumed.
- [ ] **Stock**: in stock / purchasable (or inventory not tracked). No out-of-stock cards.
- [ ] **Price** is real and non-zero; currency correct (AUD).
- [ ] **Image**: public HTTPS `image/*`, HTTP 200, reasonable weight (email-safe; §8).
- [ ] Only **approved launch SKUs** are present; no auto-added newly-created products.

## B. Launch structure & copy
- [ ] Layout is launch-specific (Hero → Badge → Headline → Intro → Why → Grid → CTA → Trust → Footer),
      not a recycled Weekly grid.
- [ ] Exactly **one introduction**; no repeated messaging across sections (§5.2).
- [ ] **No em dashes / dash interruptions** in intro/supporting copy (§6.2).
- [ ] Launch badge present and subtle; hero is visual-only (no baked-in price, §7).
- [ ] Offer (if any) is approved, freshly-titled (§6.5), placed after the grid; coupon code active or a
      clearly-marked placeholder; no recycled promo heading.
- [ ] No duplicate/redundant CTAs (§6.2).

## C. HTML / email-client safety (CLAUDE.md §6.6)
- [ ] **Zero anchors wrap a `<table>`** (breaks clickability after Klaviyo import).
- [ ] **Zero image anchors use `display:block`** (Apple Mail iOS collapses them; keep anchor inline).
- [ ] Every fixed image has explicit `width`/`height` attributes.
- [ ] Every structural full-width table carries `width:100%` in inline `style` (not attribute only).
- [ ] Hero uses `max-width:100%` + responsive class; does **not** shrink on Gmail mobile.
- [ ] Product cards balanced: equal image area, card height, title/description/price/CTA alignment.
- [ ] Preheader present + hidden (CS-14); dark-mode handling present (CS-12); meaningful `alt` (CS-11).
- [ ] Bulletproof CTA (VML + anchor, CS-08); tap targets ≥44px.

## D. Clickability — AFTER Klaviyo import (behavioural, not source)
Import the template into Klaviyo, then confirm each navigates to the correct live URL:
- [ ] Every product **image** is clickable → correct 200 product page.
- [ ] Every product **title** is clickable → correct 200 product page.
- [ ] Hero banner link.
- [ ] Primary CTA button(s).
- [ ] Logo.
- [ ] Offer/coupon link (if present).

## E. Responsive rendering (all must pass)
- [ ] Desktop  - [ ] Laptop  - [ ] Gmail Mobile  - [ ] Gmail iOS  - [ ] Gmail Android
- [ ] Apple Mail iPhone  - [ ] Outlook  - [ ] Yahoo  - [ ] Klaviyo Preview
- [ ] 2-up → 1-up stack at ~375px; no overflow, shrink, broken stack, or misalignment.

## F. HTML validation
- [ ] Tag balance (table/tr/td/a) verified.
- [ ] No unresolved framework tokens `[[…]]`; Klaviyo Liquid intact (`{% unsubscribe %}`).
- [ ] All `<img src>` are absolute HTTPS, 200, `image/*`, no redirects (§8).

## G. Send-approval gate (CLAUDE.md §8.1 / §9)
The latest build already lives in `Output/` for preview (§4.1). Mark the `Review/` status **approved to
send** — and actually send — only when ALL are verified and noted in `Review/`:
`✓ product data verified via API · ✓ clickability verified post-Klaviyo · ✓ responsive verified ·
✓ images load · ✓ product links 200 · ✓ CTA links work · ✓ coupon link works (if any) · ✓ approver ≠ author (CR-16).`
Any hidden/404/OOS/$0 product **blocks the send** (status stays *not approved to send*) until fixed in
BigCommerce and re-verified — the build may still be previewed from `Output/` in the meantime.
