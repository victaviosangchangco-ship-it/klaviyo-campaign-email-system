# QA Checklist (all brands, all campaign types)

Run before promoting any build and before send. This checklist is **self-contained** — it has the
actual pass/fail conditions. You do NOT need to open CLAUDE.md or any other document to run it.
Record the outcome in the send's `Review/` notes (which Draft version, which clients checked,
pass/fail per item). **Never approve on localhost/desktop/browser preview alone.**

---

## 1. Content & Brand

- [ ] Correct campaign **type** chosen and the matching Playbook followed.
- [ ] Fresh theme vs. the last approved send; no repeated hero/eyebrow/headline/intro concept.
- [ ] Intro copy concise (one short paragraph max), no em dashes, does not restate the hero.
- [ ] Only approved brand values used. Nothing invented. Confidence tags carried.
- [ ] Preview text present, campaign-specific, does not duplicate the subject line.

## 2. Product Data (never invented)

- [ ] Every product from the approved source (BigCommerce API).
- [ ] Each product verified on its **own product page**: `is_visible=true`, in stock, real price,
      live URL **HTTP 200**, public image.
- [ ] No hidden/unpublished product linked (its live URL returns 404 = dead link).
- [ ] Prices match the storefront (GST-inclusive as displayed).
- [ ] Products match the campaign theme/category — no unrelated SKUs mixed in.

## 3. Links & Containment

- [ ] Every `href` returns **HTTP 200**. No `#`, empty, placeholder, localhost, or local paths.
- [ ] **Zero `<table>` inside any `<a>`**. Product card = image / title / price as **separate
      sibling anchors** to the same URL.
- [ ] **Zero `display:block` on an image-wrapping `<a>`**. Anchor stays inline, `<img>` is block.
- [ ] **Zero nested anchors** (`<a>` inside `<a>`).
- [ ] Clickability verified **after Klaviyo test import**, not just editor/localhost.

## 4. Hero

- [ ] Edge-to-edge in the 600px container. No white strips, gaps, or gutters.
- [ ] Real pixel `width`/`height` attributes. `display:block` on the `<img>`.
- [ ] If linked: one inline `<a>`, anchor NOT `display:block`. Correct destination.
- [ ] Does not shrink or collapse on Gmail mobile or Apple Mail iOS.
- [ ] Hero cell: `font-size:0; line-height:0; padding:0`. Zero whitespace between tags.

## 5. Product Grid & Price Badges (desktop + mobile)

- [ ] Equal-height cards via fixed-height `<td>` cells (not `min-height` / not flexbox).
- [ ] Image, title, description, price begin at the same vertical position across each row.
- [ ] 2-column default. Odd last card centred with `colspan` spanning full grid width.
- [ ] **Price badges = shrink-to-fit centred `<table>`** (content-width, fill/radius on `<td>`,
      inline `<a>` inside). NOT a bare `display:inline-block` anchor. NOT `%` or fixed width.
- [ ] **Gmail mobile (Android & iOS): price badges stay compact/centred, NOT full card width.**
- [ ] Desktop appearance unchanged vs the approved baseline.
- [ ] Mobile `.pc img{width:100%}` does NOT enlarge brand marks/icons (exclusion class present).
- [ ] Tap targets ≥ 44px via padding, not by widening.

## 6. Mobile / Rendering

- [ ] Mobile-safe fluid wrapper + table **AND** cell `bgcolor` on every coloured section.
- [ ] No white gutters or seams on Gmail mobile (Android & iOS).
- [ ] Body never scrolls horizontally.
- [ ] Built HTML well under Gmail's ~102 KB clip threshold. Footer not clipped.
- [ ] Non-functional HTML comments stripped. Only MSO conditionals remain.

## 7. Ghost Element Inspection

- [ ] Zero empty/whitespace-only anchors.
- [ ] Zero empty `<td>`, `<tr>`, ghost tables.
- [ ] Zero hidden links (zero-width, zero-height, `display:none`).
- [ ] No literal `…` / `...` in the markup.
- [ ] Tag balance: `<table>` open == close; `<tr>` open == close; `<td>` open == close;
      `<a>` open == close.

## 8. Footer & Merge Tags

- [ ] Footer uses `{% unsubscribe_link %}` in `href` (NOT `{% unsubscribe %}`).
- [ ] No `{{ manage_preferences_url }}` or other invented merge variables.
- [ ] Links: **Unsubscribe · Privacy Policy**. Manage Preferences only if explicitly requested.
- [ ] No HTML attributes or tag fragments visible as text in the footer.
- [ ] Footer compact, professional, matches the brand's approved footer design.

## 9. Accessibility & Images

- [ ] Meaningful `alt` on every content image. `alt=""` on decorative images.
- [ ] Every `<img src>` is public absolute HTTPS, HTTP 200, `image/*`, no redirects.
- [ ] Image payload reasonable (no multi-hundred-KB PNG photos; favour compressed JPEG).
- [ ] Icons are monochrome line style (Apple/Stripe aesthetic). No emoji, no cartoon icons.

## 10. Coupon / Promo (CONDITIONAL — skip if no promotion in this campaign)

- [ ] Coupon code verified created + active in BigCommerce.
- [ ] Promo title is unique to this campaign (not recycled from a previous send).
- [ ] SC-specific: fixed-dollar discount "$20 off orders over $200" unless explicitly overridden.
- [ ] No invented coupon code. Placeholder clearly marked if code not yet provided.

## 11. Client Matrix — verify & record which were checked

- [ ] Klaviyo Preview
- [ ] Gmail Web
- [ ] **Gmail Android**
- [ ] **Gmail iOS**
- [ ] Apple Mail (incl. iPhone)
- [ ] Outlook
- [ ] Desktop layout identical to approved baseline; mobile matches desktop intent.

## 12. Send Gate — send only when ALL true and recorded in `Review/`

- [ ] User approval recorded.
- [ ] Clickability verified post-Klaviyo import.
- [ ] Responsive rendering verified (incl. price badges on Gmail mobile).
- [ ] All images load correctly.
- [ ] All product/CTA/coupon links work.
- [ ] No unresolved blockers (404, hidden products, missing assets, failing QA).
- [ ] Preview text is non-empty and campaign-specific.

---

_Self-contained QA. If a check reveals a reusable lesson, fix the root cause and add it to the
appropriate Standards/ contract or CLAUDE.md._
