# SS-2026-W29 — Review & QA Notes (draft v1)

Improved SS Weekly, refreshed from the single existing SS reference campaign
(`../References/CampaignSS1–5.png` = ONE email: "Built Tough. Finished Beautifully.").

- **Draft:** `Draft/SS-2026-W29-draft-v1.html` · **Output:** `Output/SS-2026-W29.html`
- **Brand values:** from `03-Brands MD Files/SS.md` ([Confirmed]/[Inferred] as tagged there).
- **Author:** engine generation. **Reviewer/approver:** _pending_ — must differ from author (CR-16). Approval not yet recorded (CR-17).

## Reference campaign structure (reconstructed)
Header (SAFETY SECTOR wordmark) → photographic hero (building/bollards) → grey headline panel + intro →
**red coupon panel (NEWFY15)** → black full-width CTA ("Explore our full range") → 2×2 category image tiles →
"Exquisite craftsmanship…" heading → large product grid (red prices) → 3 black CTAs (Browse/On Sale/Get Quote) →
"We provide professional services…" 2×2 trust grid → "Got a question?" phone+email → light footer.

## Preserved (brand familiarity)
- Centered wordmark header; **red coupon panel** as the promo centrepiece; **black, sharp-cornered, full-width**
  primary CTA (SS.md [Confirmed] button style); **red prices**; 2-line product descriptions; trust grid; contact
  block (phone + email); brand voice (factual, credibility-led).

## Improvements made
- **Hero:** replaced the missing/unavailable photo hero with a **blush (#FBEAEA) typographic panel** (red eyebrow +
  heavy headline + intro) — cleaner, no fabricated asset, stronger hierarchy.
- **Promo hierarchy:** coupon chip in a dashed white box on the red panel; explicit fine-print line.
- **Curated grid:** tightened the reference's long, mixed grid to a **focused 2×2 of 4 in-stock compliance products**
  (equal-height cards, consistent gutters).
- **Secondary nav:** reference's 3 ad-hoc buttons → 3 outline pills mapped to **confirmed SS URLs** (All products /
  Government orders / Bulk deals).
- **Trust strip:** now uses SS.md **[Confirmed] trust claims** (10-yr warranty · Australia-wide delivery · 100,000+
  customers · 30-day returns) instead of generic reference copy.
- **Footer:** promoted to the SS.md **[Confirmed] black footer** (red mark logo, brand blurb, amber links, social).
- Consistent spacing rhythm, ≥44px tap targets, dark-mode handling, meaningful alt text throughout.

## Distinct from RDD
Black/red/white + blush, heavy `Arial Black` headings, **sharp-cornered** black buttons, **red** prices, black footer —
none shared with RDD's orange/navy/rounded system.

## Automated QA — PASS
| Check | Result |
|-------|--------|
| Unresolved framework tokens `[[…]]` | 0 |
| Klaviyo Liquid intact | `{% unsubscribe_link %}` present |
| Table/tr/td balance | 28/28 · 29/29 · 36/36 |
| Product cards | 4 (2 rows × 2), all in-stock (verified live 2026-07-11) |
| Images with non-empty `alt` (CS-11) | 7/7 |
| Image URLs resolve (HTTP 200) | 7/7 (2 logos + 4 products + footer mark) |
| Preheader (CS-14) | present + hidden |
| Bulletproof CTA (CS-08) | VML + anchor (×2 CTAs) |
| Dark mode (CS-12) | `color-scheme` meta + `prefers-color-scheme` + `[data-ogsc]` (stable-light palette) |

## Products (verified live 2026-07-11 — website source, store `s-498h0egvgn`)
Tactile Plate 300x600mm $136.50 · Tactile Plate Carborundum 300x300mm $76.50 · Anti-Slip Stair Nosing Rubber 10mm
$31.95 · Anti-Slip Stair Nosing Heavy Duty Black 10mm $29.48. All names/URLs/prices/images verified; all **in stock**.
Excluded because **out of stock**: Wheel Stop Australian Compliance, Rubber Wheel Stop 1650mm, SS Tactile Plate 300x300mm.

## Blocking follow-ups / TODOs (before send)
- **Coupon:** `{{COUPON_CODE_TODO}}` — no verified current SS coupon (SS Klaviyo account not connected; `NEWFY15`
  not reused). Confirm code + discount % + expiry + terms, then replace the placeholder.
- **Phone** `02 9790 2182` — observed in the SS reference footer + SS.md [Confirmed] email; SS.md lists phone
  "To be confirmed". Confirm against an official source.
- **Live stock** for all 4 products at send time.
- **Brand hex** (accent red, blush, footer amber) — currently [Inferred] in SS.md; confirm.
- **BigCommerce store hash** `s-498h0egvgn` observed on live CDN URLs; not documented in SS.md — confirm.
- **Manual render** (per QA-Checklist): Gmail/Apple Mail (light+dark)/Outlook (VML); 2-up→1-up stack at 375px; Klaviyo test send resolves `{% unsubscribe_link %}`.
