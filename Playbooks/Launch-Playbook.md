# Product Launch — Campaign Playbook

**One line:** Introduce a new product or range with a confident, premium announcement that educates and
builds desire — **not** a discount push.

**Not to be confused with:** the **Weekly** (recurring broad product coverage), **Category** (deep dive
on an existing range), or **Clearance** (urgency + markdowns). A launch is an *event*: it presents
something new as news. Never reuse the Weekly grid-first layout for a launch — the launch leads with the
story of the product, then proves it with a curated grid.

Read alongside: [`../07-Prompt Library/00-START-HERE.md`](../07-Prompt%20Library/00-START-HERE.md) ·
[`../07-Prompt Library/Generate-Product-Launch-Campaign.md`](../07-Prompt%20Library/Generate-Product-Launch-Campaign.md) ·
[`../07-Prompt Library/QA-Launch-Checklist.md`](../07-Prompt%20Library/QA-Launch-Checklist.md) ·
[`../CLAUDE.md`](../CLAUDE.md).

---

## 1. Purpose

Announce a new product or range to the existing audience as a genuine event. The email's job is to make
the reader **aware**, **understand why it exists**, and **want to see it** — then send them to a live,
in-stock product page. Launches carry the brand's premium credibility, so presentation quality matters
more than offer size.

## 2. Business Goal

- Primary: drive **first-wave traffic and first sales** to the new product page(s) and seed reviews.
- Secondary: reinforce brand authority (we build/curate quality), grow consideration for the wider range.
- A launch is a **retention + reactivation** play against a warm list, not a discount-acquisition play.

## 3. Customer Psychology

- **Novelty + curiosity:** "there's something new" earns the open; the hero must pay it off instantly.
- **Relevance:** B2B buyers ask "does this solve my problem?" — lead benefit-first, not spec-first.
- **Confidence over pressure:** premium framing ("engineered", "built for", "now available") beats
  "SALE". Urgency is *availability* ("now in stock", "first run"), not a countdown discount.
- **Proof:** trust signals (Australian-owned, shipping, warranty, returns) de-risk trying something new.

## 4. Copywriting Style

- Confident, clean, benefit-led Australian B2B. Short scannable sentences.
- **No em dashes or dash-based interruptions in intro/supporting copy** (CLAUDE.md §6.2); write clean
  natural sentences.
- One introduction only — the hero establishes the theme; later sections **support**, they don't restate
  (CLAUDE.md §5.2).
- Length: launches justify slightly richer copy than a normal Weekly, but stay disciplined (§6.3).
  Eyebrow → headline → 1 short intro paragraph → "why" bullets → product proof.
- Avoid discount language unless a launch offer is explicitly approved. If there is an offer, it is a
  *welcome/introductory* framing with a freshly-written title (§6.5), never a recycled coupon heading.

## 5. Design Direction

- Reuse the shared framework (600px, table-based, inline CSS, dark-mode aware). Do not restate mechanics —
  follow CLAUDE.md §6 and the email-client safety rules §6.6 and §8.1.
- **Premium feel:** generous whitespace, strong hierarchy, one accent colour used deliberately, balanced
  cards. Launch ≠ busy. Let the hero and the first product breathe.
- Layout order (distinct from Weekly): **Hero banner → Launch badge → Headline → Introduction →
  "Why these products" (benefit bullets) → Product grid → CTA → Trust section → Footer.**
- Product grid must be perfectly balanced (equal image area, card height, title/desc/price/CTA alignment)
  per §5.1 / §6.2, even with mixed source image dimensions.

## 6. Hero Strategy

- The hero sells the *idea* of the launch, not a price. A clean product-in-context or studio hero with a
  short, bold headline. **Visual-only by default — no baked-in price in the hero** (CLAUDE.md §7).
- If AI-generated, use `07-Prompt Library/Hero-Banner-Generator.md`; AI output is never auto-approved.
- Build the hero with email-safe responsive containers (full-width table width in inline `style`,
  `max-width:100%` image, defensive responsive class) so it does not shrink on Gmail mobile (§6.6, §8.1).
- A small **"New" / "Just launched" badge** is the signature launch device — subtle, on-brand, not a
  starburst.

## 7. CTA Strategy

- One clear **primary CTA intent**: see/shop the new range ("Shop the range", "Discover [product]").
- Bulletproof button (VML + anchor) per CLAUDE.md §6 / CS-08; ≥44px tap target.
- **No duplicate/redundant CTAs** (§6.2): if the hero CTA already says "Shop the range", don't add a
  second generic "See full range" later unless it goes somewhere genuinely different.
- Every product card is fully clickable (image anchor + separate text anchor; never an anchor around a
  table — §6.6) and verified after Klaviyo import (§8.1).

## 8. Product Strategy

- Feature the **approved launch SKUs only** — do **not** auto-add other newly-created products (§5.1).
- Verify every SKU **via the BigCommerce API** (not storefront search, which hides unpublished items):
  confirm `visible=true`, in stock, real (non-zero) price, live URL returns **HTTP 200**, public image.
- A product with `visible=false` returns **404** on its customer URL — it is a **dead link** and must not
  ship. Report it and wait for the product to be published + re-verified.
- Group variants sensibly (e.g. colour/size/height families) so the grid reads as a coherent range.
- Balance the grid; shorten long descriptions to keep card heights equal (§6.2). Never leave an empty card.
- Never feature a product whose title carries **another brand's name** on this brand's send — flag it.

## 9. KPIs

| Metric | Note |
|--------|------|
| **Unique CTR** (primary) | The launch's #1 success metric — did people go look? Target above the brand's Weekly CTR. |
| Open rate | Subject/hero curiosity; benchmark vs recent sends. |
| Product-page sessions from email | New-product page traffic first wave. |
| Conversion rate / first-run units sold | Early demand signal. |
| Revenue per recipient | Secondary; launches monetise over the following weeks, not only on send day. |
| Unsubscribe / spam rate | Must stay at or below baseline — a launch should feel like value, not spam. |

## 10. Bruce Feedback (standing)

- **Hook first, offer later:** hero + products should hook the reader before any promo (offer, if any,
  comes after the grid).
- **Prepare a draft first** for launches; nothing goes out without review (separation of duties, CR-16).
- **Clickability is non-negotiable:** product cards must actually navigate **after Klaviyo import**, not
  just on localhost (root cause of the SS-2026-W29 failure; §6.6/§8.1).
- **Preserve what works:** keep the established brand vibe and any proven launch structure unless new
  feedback requires a change.
- **Do not auto-select newly created BigCommerce products** — use only the approved SKU list; present a
  verification/mapping table for approval before building.

## 11. Common Mistakes

- Treating a launch like a Weekly (grid-first, no story) or like a sale (discount-led).
- Linking hidden/unpublished products (live URL 404) — dead links that pass a localhost preview.
- Featuring a product whose BigCommerce title contains a different brand's name.
- Over-crowding the top; burying the "why" below the fold.
- Wrapping a `<table>` inside an `<a>` (breaks clickability after Klaviyo import) or hero shrinking on
  Gmail mobile (§6.6).
- Recycling a coupon/promo title from a previous send (§6.5).
- Approving on desktop/localhost only (§8.1).

## 12. Lessons Learned

- **API is the source of truth for product state**, not storefront search — newly-created products are
  often `visible=false` and invisible to search/sitemap yet returned by the API (RDD launch, 2026-07:
  all 13 SKUs existed via API but 9 were hidden → 404 live URLs). Always verify visibility + live HTTP
  status before a product enters the grid.
- **Apple Mail iOS** collapses a block-level anchor (`<a style="display:block">`) wrapping an image and
  never paints it; give fixed images explicit `width`/`height` and keep image anchors inline (§6.6).
- Each completed launch should push one reusable finding back into CLAUDE.md (§8.1.7).
