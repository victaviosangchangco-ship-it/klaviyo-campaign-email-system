# SectorCare (SC) — Brand-Document Gaps & Blockers

Consolidated list of every value in `03-Brands MD Files/SC.md` that is **[Inferred]** or **[To be
confirmed]**, with what would resolve it. Per `CLAUDE.md §5`, a [To be confirmed] value that gates a real
send must be resolved before that send — it does **not** block draft/preview work in `Output/`.

_Generated 2026-09-07 during SC brand-doc population._

## Blockers that gate a real SEND (must be resolved before sending an SC campaign)

| # | Item | Owner | Current state | What resolves it |
|---|---|---|---|---|
| 1 | **Klaviyo verified sender** (`from_email`) | **Jack** | [To be confirmed] — `sales@sectorcare.com.au` is the contact inbox, not yet confirmed as a verified Klaviyo sender | Confirm a verified sending domain/address in the SC Klaviyo account `W2Ua5v` (`§12` / `§13.4`) |
| 2 | **Klaviyo reply-to** (`reply_to_email`) | **Jack** | [To be confirmed] | Defaults to the brand sender once #1 is set (`§13.4`) |
| 3 | **Default Weekly audience** (segment/list) | **Vic / Bruce** | [To be confirmed] | Confirm per campaign — never auto-reuse a prior send's audience (`§13.1`) |
| 4 | **Coupon code** (when a promo runs) | **Bruce** (create in BigCommerce) | Not invented | Real code created + confirmed active in BigCommerce (`§6.3 / §6.5`); offer framing is $20/$200 per `§6.4` |
| 5 | **`featuredCategoryIds` validation** | **Vic** (technical) | [To be confirmed] — ids exist in `SC.config.json` but need validation against the live shared catalog | Verify each id resolves to the correct SC category on store `498h0egvgn` (`§12`) before a product build |

## Design / asset reconciliations (do not block preview; needed for a clean production build)

| # | Item | Owner | Current state | What resolves it |
|---|---|---|---|---|
| 6 | **Email header logo source** | **Maria → Bruce/Jack** | Conflict: Design.md official mark is on account `W2Ua5v` (`.../47898cac-...png`); approved SC email sends used a logo on the prior account `XAUdQX` (`.../f7015926-...png`) | Confirm which asset the email header uses. Recommended: the `W2Ua5v` official mark (same account, brand-official). Re-host/verify HTTPS 200 before use |
| 7 | **Email Poppins fallback stack** | **Maria** (intent) → **Vic** (implement) | Conflict: confirmed brand font is Poppins, but `SC.config.json` carries legacy `Helvetica Neue` (body) / `Georgia` serif (heading) predating that direction | Adopt a Poppins-first web-safe stack (e.g. `'Poppins',Arial,Helvetica,sans-serif`); confirm and update config |
| 8 | **Exact CTA fill / radius** | **Maria / Bruce** | [Inferred] navy `#465669` fill, white text, rectangular | Confirm against the master "SectorCare Brand Guideline" (not yet in-repo) which the positioning doc defers to |
| 9 | **Hosted SC icon set** | **Maria** (design) → **Vic** (host) | [To be confirmed] — no hosted monochrome PNG set yet | Build/host an SC monochrome line-icon set (`§6.21`); until then use single-tone text-presentation glyphs |
| 10 | **Header logo height** | **Maria** | [Inferred] ~32px from SC-2026-W30 | Confirm against the Brand Guideline / approved reference |
| 11 | **Footer postal line** | **Bruce** | [Inferred] — approved SC footer used brand name without the address; confirmed address is `3 Wordie Place, Padstow NSW 2211` | Confirm whether SC footers should carry the postal address |
| 12 | **Palette migration** — SC email adopts Maria's `#465669` navy palette, or stays on the shipped `#3d7a94`/beige? | **Bruce / Maria** | Conflict of scale: **no** approved SC send uses Maria's palette. All three Weekly Outputs (W29/W30/W32) use teal `#3d7a94` + beige `#f5f1ea`; the Father's Day send uses a third palette (`#032a58`/`#4870b5`/warm neutrals). Not a send-blocker (draft/preview works either way), but a real production-build decision. | Decide whether SC email migrates to Maria's palette or keeps the shipped teal/beige; if migrating, update `SC.config.json` design tokens (see `SC.config.json.proposed`) and re-tag the SC.md palette [Confirmed] |

## Master document dependency

- ⚠️ A master **"SectorCare Brand Guideline"** is referenced by Maria's design-system docs but is **not yet
  in this repo**. When it lands it is the authority and **supersedes** every [Inferred] value above (CTA
  treatment, colour sheet, logo usage). Re-review SC.md against it at that time.
- Maria's Design.md and positioning docs are **"Draft for Review — sign-off pending from Bruce & Jack."**
  SC.md's brand-level values are drawn from them but should be re-confirmed at sign-off.

## Scope note

Maria's docs are authored for **social-media product graphics** (4:5 / 1080×1350 five-band canvas). Only
their **brand-level values** (palette, typography family, personality, imagery intent, logo) were carried
into SC.md. Their **canvas/layout rules** (aspect ratio, band structure, icon-disc graphic treatment) are
**social-scoped** and were deliberately **not** applied to email — email layout is governed by `CLAUDE.md
§6` and Cerberus.
