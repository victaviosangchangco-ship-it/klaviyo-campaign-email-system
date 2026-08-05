# RDD Product Launch — Review & QA Notes

**Send:** `RDD-2026-LAUNCH-access-safety-range` · **Draft:** `Draft/RDD-2026-LAUNCH-access-safety-range-draft-v1.html`
**Type:** Product Launch (not Weekly). **Author:** engine generation. **Reviewer/approver:** _pending_ (≠ author, CR-16).
**Date:** 2026-07-16. **Branding:** RDD [Inferred] from live site (accent `#fd7f01`, ink `#131313`), logo from RDD CDN.

## Status: PREVIEW BUILD IN OUTPUT — **NOT approved to send**
- **Draft:** `Draft/RDD-2026-LAUNCH-access-safety-range-draft-v1.html` (this note assesses **v1**).
- **Output:** `Output/RDD-2026-LAUNCH-access-safety-range.html` — latest build, kept in sync with the newest
  Draft; available for browser/Klaviyo preview, QA and stakeholder review (CLAUDE.md §4.1/§9).
- **Approval-to-send:** **NOT approved** — blocked by the 9 hidden products (see below). Presence in
  `Output/` is for preview only; it does not authorise sending.

Built per approved decision: full 13-product draft with **placeholder links on the 9 hidden products**.
Nothing 404s silently (hidden products link to in-page `#launching-soon` and show a "Launching soon" badge).

## Product verification (BigCommerce API, store ugqmr0qfvf, 2026-07-16)
See the full table in the [brief](../Brief/RDD-2026-LAUNCH-access-safety-range-brief.md). Summary:
- **4 Expandable Barriers** — `visible=true`, in stock, live URL **200**, real price → **live links in the draft**.
- **9 products** (7 Modular Rubber Ramps + Speed Hump + Bollard) — `visible=false`, live URL **404** →
  **placeholder links + "Launching soon" badge**. Images are public (200) so they render.
- **BSMYEL90ECO**: $0 price → shown as "Price to be confirmed"; **SPEHPM50** OOS.
- **SPEHPM50 / BSMYEL90ECO** BigCommerce titles contain **"Safety Sector"** (competing brand) — the draft
  shows RDD-neutral display names ("Metal Speed Hump 500mm", "Surface-Mount Fixed Bollard 89mm"). The
  official BigCommerce product titles still need renaming by the RDD admin.

## Automated markup QA — PASS
| Check | Result |
|-------|--------|
| Block-level image anchors (`<a display:block><img>`) — Apple Mail killer (§6.6) | **0** |
| Anchors wrapping a `<table>` — Klaviyo clickability killer (§6.6) | **0** |
| Images with explicit `width`+`height` attrs | **14 / 14** |
| Product images fixed 150×150 (balanced grid) | 13 / 13 |
| Full-width structural tables with `width:100%` in inline style (§6.6) | 29 |
| Em dashes in copy (§6.2) | **0** |
| Hidden-product placeholder anchors (no 404) | 9 products (18 anchors) → `#launching-soon` |
| Live product/CTA links (HTTP 200 targets) | 4 barriers + CTA verified 200 |
| Tag balance (table/td/a) | 43/43 · 62/62 · 30/30 |
| Preheader hidden (CS-14) · dark-mode (CS-12) · Liquid (`{% unsubscribe %}`, `manage_preferences_url`) | present |
| Bulletproof CTA (VML + anchor, CS-08) · ≥44px tap | present |

## Blockers before send / approval (owner: RDD / BigCommerce admin)
1. Publish products 5–13 (`is_visible=true`) so live URLs return 200; then re-verify via API.
2. Set BSMYEL90ECO price (currently $0) + stock; restock SPEHPM50.
3. Rename the two "Safety Sector"-titled products to RDD-neutral names in BigCommerce.
4. Replace placeholder links with the verified live product URLs once published.
5. Consider a dedicated "Access & Safety" collection URL for the primary CTA (currently points to a live
   barrier product page).

## Outstanding §8.1 gate (required before send — not exercisable in this environment)
Not yet rendered on physical devices here. Before send, verify on **Apple Mail iPhone · Gmail Web/iOS/Android ·
Outlook · Yahoo · Klaviyo Preview**, and confirm clickability of every card **after Klaviyo import**. Do not
mark the §8.1 responsive/clickability gate PASS until done. Record clients checked here.

## Confirm-before-send (brand)
RDD colour/type are **[Inferred]** from the live site; footer sender identity (address, phone, socials) is
**To be confirmed** (RDD.md). Company name + support email taken from the connected RDD Klaviyo org
("Retail Display Direct", hello@retaildisplaydirect.com.au).
