# SC-2026-W28 — Review & QA Notes (draft v1)

First validation draft produced by the matured Weekly engine, benchmarked against
`References/SC-2026-W28-ref-benchmark.html` (the hand-built SC "Winter Mobility Event" send).

- **Draft:** `Draft/SC-2026-W28-draft-v1.html`
- **Brand values:** `[Inferred]` from the benchmark (no approved SC `Design.md` yet — see below).
- **Author:** engine generation. **Reviewer/approver:** _pending_ (must differ from author — CR-16).

## Automated QA — PASS

| Check | Result |
|-------|--------|
| Unresolved framework tokens `[[…]]` | 0 |
| Klaviyo Liquid intact | `{% unsubscribe_link %}`, `{{ organization.name }}`, `{{ organization.full_address }}` |
| Table/td/tr balance | 55/55 · 72/72 · 58/58 |
| Product cards | 12 (2 sections × 3 rows × 2) |
| Images with `alt` (CS-11) | 15/15, none empty |
| Preheader (CS-14) | present + hidden |
| Bulletproof CTA (CS-08) | VML + anchor present |
| Dark mode (CS-12) | `color-scheme` meta + `prefers-color-scheme` + `[data-ogsc]` |

## Real issues found during assembly → fixed in the engine

1. **trust-strip required icon image assets** we don't have (would render broken images). Switched the
   component to asset-free unicode glyphs (the benchmark's own approach). No fabricated assets.
2. **footer used `{{ manage_preferences_url }}`** — not a standard Klaviyo variable; would render as junk.
   Aligned to the proven Klaviyo tags (`{% unsubscribe_link %}` + privacy link), matching the benchmark.

## Intentional deltas vs benchmark (engine choices — NOT bugs; confirm or close)

- **Dark mode:** engine adds it (benchmark had none). SC uses a *stable* palette (dark tokens = light)
  to avoid white-on-white on white product cards. Confirm SC wants stable-light vs a true dark theme.
- **Primary CTA:** engine renders a centred pill; benchmark used a full-width black bar. Both production-
  valid. If full-width is preferred, add an optional full-width mode to `CTA.html` (small change).
- **Header logo:** engine centres a width-based logo (150px); benchmark left-aligned a height-based
  (32px) logo. Watch the rendered logo height in-client; may want a height-based option.
- **Page gutter:** benchmark framed the email on a `#f2f2f0` page background; engine renders on white.
  Cosmetic. Add a `[[PAGE_BG]]` token later if the framed look is wanted.
- **Footer:** engine omits the benchmark's "Got questions?" contact block and the "© 2026" line (content,
  not compliance). Add as optional footer tokens if desired.

## Manual render checklist (before approval → Output)

- [ ] Open draft + benchmark side-by-side in a browser (desktop + 375px mobile).
- [ ] Send a Klaviyo test: confirm `{% unsubscribe_link %}` and `{{ organization.* }}` resolve.
- [ ] Litmus/Email-on-Acid or client spot-check: Gmail (web/app), Apple Mail (light+dark), Outlook (VML button).
- [ ] Verify 2-up product grid stacks to 1-up on mobile; pills go 3-up → 2-up; trust 4-up → 2×2.
- [ ] Confirm BigCommerce product image URLs load (they are live `cdn11.bigcommerce.com/s-498h0egvgn` links).

## Blocking follow-ups

- **No approved SC `Design.md` / `BrandConfig.md`** in the repo → all brand values are `[Inferred]`.
  To promote past QA, confirm the real SC palette/fonts/logo and tag `[Confirmed]`.
- **Klaviyo connector** was unavailable this session — needed for a live test send.
