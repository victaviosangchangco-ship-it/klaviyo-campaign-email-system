# QA Checklist (all brands, all campaign types)

Run this before promoting any build and before send. It **cites** the CLAUDE.md gates rather than
restating them — open each referenced section and apply it. Record the outcome in the send's `Review/`
notes (which Draft version, which clients checked, pass/fail per item). **Never approve on a
localhost/desktop/browser preview alone** (CLAUDE.md §8.1.1).

## 1. Content & brand
- [ ] Correct campaign **type** chosen first (§5.3) and the matching playbook/generate prompt followed.
- [ ] Fresh theme vs. the last approved send; no repeated hero/eyebrow/headline/intro (§5.2); improves on the baseline (§5.1.1).
- [ ] Intro copy concise, business-outcome led, **no em dashes / dash interruptions** (§6.2); does not restate the hero.
- [ ] Only approved brand values; confidence tags carried; nothing invented (§5).

## 2. Product data (never invented — §5.1)
- [ ] Every product retrieved from the approved source (BigCommerce API = source of truth).
- [ ] Each product **verified on its own product page / via API**: `is_visible=true`, in stock, real price, live URL **HTTP 200**, public image.
- [ ] No hidden/unpublished product linked (its live URL 404s = dead link, §5.4/§6.7). Blockers reported, not fabricated.
- [ ] Prices match the storefront (GST-inclusive as displayed).

## 3. Links & containment (§6.6, §6.7, §8.1.2)
- [ ] Every `href` returns **HTTP 200** (product, category, hero, CTA, coupon, logo, image `src`). No `#`/empty/placeholder.
- [ ] **Zero `<table>` inside any `<a>`**; product card = image / title / price as **separate sibling anchors** to the same URL.
- [ ] **Zero `display:block` on an image-wrapping `<a>`**; anchor stays inline, `<img>` is the block element.
- [ ] Clickability verified **after a real Klaviyo test import**, not just the editor/localhost.

## 4. Hero (§6.14, §6.15, §8.1.4)
- [ ] Single embedded artwork, one clickable anchor, edge-to-edge (no white strips/gaps), correct destination.
- [ ] Full pixel `width`/`height` attributes; `display:block`; does not shrink/collapse on Gmail mobile or Apple Mail iOS.

## 5. Product grid & price badges — RESPONSIVE (§6.8, §6.9, §6.17)  ← mandatory, desktop + mobile
- [ ] Equal-height cards via fixed-height `<td>` cells (not `min-height`); image/title/price begin at the same vertical position across a row (§6.8).
- [ ] 2-column default, balanced; odd last card centred with `colspan` (§6.9).
- [ ] **Price badges are shrink-to-fit centred `<table>`s (§6.17)** — content-width, never a bare `display:inline-block` anchor, never `%`/fixed width.
- [ ] **On Gmail mobile (Android & iOS): price badges stay compact/centred and do NOT stretch to card width** (§6.17).
- [ ] Desktop appearance unchanged vs the approved baseline after any mobile fix.
- [ ] Mobile `.pc img{width:100%}` does **not** enlarge brand marks/icons (exclusion class present, §6.17).
- [ ] Tap targets ≥44px via padding, not by widening.

## 6. Mobile / rendering reliability (§6.16, §8.3)
- [ ] Mobile-safe fluid wrapper + table **and** cell `bgcolor` on every coloured section (no white gutters/seams on Gmail mobile).
- [ ] Body never scrolls horizontally; wide content contained.
- [ ] File well under Gmail's ~102 KB clip; footer not clipped.

## 7. Ghost Element Inspection (§8.2) & Gmail QA (§8.3)
- [ ] Zero empty/nested/whitespace-only anchors, empty `<td>`/`<tr>`, ghost tables, zero-size/hidden links, literal `…`/`...`.
- [ ] Tag balance (`<table>/<tr>/<td>/<a>` open == close).
- [ ] No Gmail "…" expansion bubble on a **fresh subject/thread**; production comments stripped to functional MSO conditionals only.

## 8. Accessibility & images (§8, CS-11)
- [ ] Meaningful `alt` on every image; images are public absolute **HTTPS**, 200, `image/*`, no redirects; payload modest (Gmail-mobile safe).
- [ ] Optimising an image preserved the approved creative (same asset re-encoded/resized, not substituted).

## 9. Client matrix — verify & record which were checked (§8.1.1, §6.16)
- [ ] Klaviyo Preview · Gmail Web · **Gmail Android** · **Gmail iOS** · Apple Mail (incl. iPhone) · Outlook · Yahoo.
- [ ] Desktop layout identical to the approved baseline; mobile visually matches desktop intent.

## 10. Send gate (§8.1.6, §9) — send only when ALL true and recorded in `Review/`
- [ ] Approval recorded (CR-17) · clickability verified post-Klaviyo · responsive verified (incl. §6.17 price badges) · images load · product/CTA/coupon links work · no unresolved blockers.

_Cite-don't-restate. If a check reveals a reusable lesson, fix root cause and promote it to a permanent
CLAUDE.md rule (§8.1.7)._
