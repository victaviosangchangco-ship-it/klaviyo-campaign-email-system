# RDD-2026-CAT-sit-stand-workspace — Review / QA (assesses RDD-2026-CAT-sit-stand-workspace-draft-v2.html)

**Draft assessed:** `Draft/RDD-2026-CAT-sit-stand-workspace-draft-v2.html` (mirrored to `Output/RDD-2026-CAT-sit-stand-workspace.html`).
**Supersedes:** the v1 assessment below. **v1 is retained** in `Draft/` as the rollback trail (§4.1).
**Approval status:** NOT approved to send (draft for human review, §9). Send gate not cleared.

## Update round 2 (product correction + stock hardening + Klaviyo sync)
- **Removed `Cable Protector 2 Channel` (CABL02)** at the user's request (off-theme for the send), and **replaced with `ErgoDC Desktop Whiteboard` (SSDDWBW, id 1399, AUD $27.02)** — a genuine RDD BigCommerce product, an ErgoDC ergonomic desk accessory that fits the Sit-Stand / Ergonomic Workspace theme; slotted into the Desk Accessories section (keeps 6). Product page + image verified HTTP 200.
- **Authoritative stock audit (BigCommerce read-only Catalog API, `getProductById` → availability/is_visible/inventory):** **RDD 18/18 IN STOCK** (each product's `availability=available`, `is_visible=true`, inventory tracked>0 or untracked). Not from cached values.
- **Klaviyo:** existing Draft `01M1Y342ZGAPKA2DFF14TJ3JM6` updated via `sync-campaign-draft.js` (UPDATE-only). Template `Automation: RDD-2026-CAT-sit-stand-workspace` (id `RYJtmu`) upserted with the new HTML. Verify-after-write: status **Draft**, 18 cards, whiteboard present + cable-protector absent, audience `["RJbEzz"]` **unchanged**, no `send_strategy`, exactly 1 draft (no duplicate). NOT sent/scheduled.
- Re-rendered (desktop + mobile) after the swap; Desk Accessories row balanced, whiteboard card renders.

## Root cause — why v1 looked visually poor / inconsistent vs `Weekly/Output/RDD-2026-56.html`
v1 was built from a **generic flat-grid template**, not the approved RDD design system that
`RDD-2026-56.html` uses. Concretely, v1 had dropped every RDD signature element:
- **Header** — v1 used a plain white header. The approved RDD system is an **orange bar
  (`#f47c20`) with a centred logo + dark-mode logo swap**. (The logo was present, but the
  orange-bar treatment that makes it read as RDD was missing.)
- **In-stock presentation** — v1 had **no "In Stock" indicator at all**; it was one flat 18-card
  grid. RDD-2026-56 groups products under grey rounded **section panels, each with an orange
  "In Stock" pill** (h2 title + one-line sub).
- **Product cards** — v1 dropped the **brand-mark (top-right), the one-line sub-description, and
  the card box-shadow**, and used heavy 1280px square images.
- **Dark mode** — v1 had **no `dm-*` dark-mode classes**.
- **Trust strip** — v1 used a bordered/circle-icon block instead of the approved borderless
  monochrome **"We've got you covered"** strip.
- **Footer** — v1 used a thin footer missing the **"Got questions? We're here to help."** heading,
  email/website/phone, and copyright line.
None of this was a product-selection problem — see below.

## Fix applied in v2 (reproduces the RDD-2026-56 pattern; theme/hero/products preserved)
- Orange header bar + centred RDD logo + dark-mode logo swap (verbatim from RDD-2026-56).
- Sit-stand hero preserved exactly (`assets-rdd.vercel.app/hero-banners/rdd-2026-sit-stand-thrive-hero.png`, HTTP 200); edge-to-edge, one inline anchor (§6.14/§6.6).
- Orange accent rule + h1 ("Everything for a healthier desk setup", does not restate the hero, §5.2) + one short intro (§6.25).
- 4 **In-Stock section panels**: Sit-Stand Desks & Frames (7) · Monitor Arms & Mounts (3) · Ergonomic Seating (2) · Desk Accessories (6). Odd sections centre the trailing card (§6.9).
- Cards: brand-mark + image + name + one-line sub + orange price badge; equal-height reserved cells (§6.8); shrink-to-fit price badge (§6.17). Images use the verified BigCommerce path at `.500.500` for weight.
- Closing CTA "Explore the Workspace Range" → `/products/`; "We've got you covered" trust strip; approved RDD footer verbatim (URL-form subscription tags, §6.23).

## Automated QA — PASS
- Structure: anchor balance 81/81; **0** `<table>`-in-`<a>`; **0** nested/empty anchors; **0** empty `<td>`/`<tr>`; **0** literal `...`/`…` (§6.6/§8.2).
- Grid: exactly **18** cards; 2-col with centred odd last card (§6.9); fixed-height cells (§6.8).
- Links: all 18 product pages + 18 images + hero + collection CTA + logo return **HTTP 200** (re-verified). No `#`/empty/placeholder/localhost/`file://`; no `{{ }}` or anchor-emitting tag in any `href` (§6.7/§6.23/§8).
- Size 71.5KB, under the ~102KB Gmail clip (§8.3); no descriptive comments (only functional MSO).
- Rendered verification (headless Edge): desktop 720px and mobile 390px — header/hero/sections/cards/trust/footer all render; cards stack 1-col on mobile; price badges stay compact (not stretched, §6.17).

## Product audit — 18/18 valid, on-theme, all RDD
Every product is an RDD (`retaildisplaydirect.com.au`, store `ugqmr0qfvf`) item and belongs to the
Sit-Stand / Ergonomic Workspace theme (7 desks/frames, 3 monitor arms/mounts, 2 ergonomic chairs,
6 desk accessories). **No SS, no SC, no unrelated/filler products.** Full list in the brief's verified set.

## Manual review still required before SEND (cannot be exercised here)
- Real-client render pass: Klaviyo Preview, Gmail Web + Mobile (Android & iOS), Apple Mail (incl. iPhone), Outlook, Samsung (§8.1). Only source-level + live-URL + local-render checks were automated here.
- Post-Klaviyo-import clickability of every card/CTA (§8.1.2).
- Audience to be confirmed by the user before the draft is created (§13.1).

---
## (v1 assessment — superseded, retained for history)
- v1 passed automated structure QA but used the generic template described under Root Cause above.
