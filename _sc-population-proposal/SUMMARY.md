# SC Brand-Doc Population — Phase 1 Summary

**Branch:** `sc-brand-doc-population-2026-09-07`  ·  **Base SHA:** `d4dcc30ff75412fbc138da5e23993acd84524fac` (main)
**Date:** 2026-09-07  ·  **Status:** Phase 1 (proposal only — NO canonical files changed)

## What this does

Populates `03-Brands MD Files/SC.md` (currently an empty stub) so SectorCare (SC) satisfies the
brand-document contract in `Shared.md` / BRD §5.1 and becomes buildable for Weekly Campaign generation.
Every value is confidence-tagged ([Confirmed] / [Inferred] / [To be confirmed]) and follows the `SS.md`
structure exactly. Shared Standards and CLAUDE.md rules are **cited, never restated**.

## Sources mined (read-only)

| Source | What it contributed | Status |
|---|---|---|
| `Desktop/…/Product Featured Graphics Project/Design.md` (Maria) | Palette (5 hexes), Poppins + weight hierarchy, official logo URL (W2Ua5v), imagery intent, personality reinforcement | **Draft for Review — sign-off pending (Bruce & Jack)**; social-scoped canvas rules NOT carried into email |
| Brand Purpose `.docx` | Brand purpose, tagline "Care. Support. Empower.", theme, visual personality (6 traits), CTA "SHOP NOW", "uppercase major headings", lifestyle imagery direction | Confirmed source |
| Positioning `.docx` | Confirms same 4 hexes + positioning rules + "SHOP NOW" | Confirmed source |
| Approved SC emails (W29/W30) via memory + `SC.config.json` | Email-specific facts: privacy URL, header height, prior-send logo host | Approved in-repo (indirect — see note) |
| `sectorcare.com.au` + live `GET /accounts` (this session) | Contact email/phone/address/hours/ABN/socials; Klaviyo account `W2Ua5v` | First-party verified |

> **Note on stashed SC email folders.** This session's SC campaign folders under
> `Brands/SC/Campaigns/` were stashed with the pre-task working tree (stash message
> "pre-SC-task working tree state 2026-09-07"), so the SC email sends themselves are not in the working
> tree right now. Email-specific facts here come from **tracked** sources (`SC.config.json`, project
> memory) and this-session first-party verification, and are source-tagged accordingly.

**Skill.md** was cross-referenced for consistency only; **no skill instructions were copied** into SC.md.

## Conflicts flagged (do NOT silently resolve — carried into `SC-BRAND-DOC-GAPS.md`)

1. **Logo source.** Design.md's official mark is on SC's own account `W2Ua5v` (`…/47898cac…png`); the
   approved SC emails referenced a logo on the prior account `XAUdQX` (`…/f7015926…png`). SC.md recommends
   the `W2Ua5v` official mark for SC's own email header, but flags the choice as **[To be confirmed]** and
   requires an HTTPS-200 re-verify. (GAP #6)
2. **Typography.** Confirmed brand font is **Poppins**; `SC.config.json` carries a legacy
   `Helvetica Neue` / `Georgia` serif pair inferred from the render. SC.md records Poppins as the brand
   font and flags the email fallback stack as [To be confirmed]. (GAP #7)
3. **Palette / CTA colour.** `SC.config.json`'s design tokens (single teal `#3d7a94`, beige panels) were
   **inferred from the rendered W29/W30 emails** and diverge from Maria's authoritative palette (navy
   `#465669` dominant, teal `#466464` accent, white foundation). SC.md uses Maria's confirmed palette;
   the config reconciliation is documented in `SC.config.json.proposed` as a deliberate visual-direction
   decision for Bruce/Maria — **not** an automatic edit. (GAP #8)
4. **Master Brand Guideline not in-repo.** Maria's docs defer the exact CTA treatment + colour sheet to a
   master "SectorCare Brand Guideline" that is not yet in the repo; it **supersedes** [Inferred] values
   when it lands.

## Scope discipline

Maria's docs are **social-media product-graphic** specs (4:5 / 1080×1350 five-band). Only **brand-level**
values were carried into SC.md (palette, type family, personality, imagery intent, logo). **Canvas/layout
rules were deliberately excluded** — email layout is governed by `CLAUDE.md §6` + Cerberus.

## Buildable vs blocked (one paragraph)

After Phase 2, **SC is buildable for design/draft/preview work** (`Output/` build for QA): the brand
identity, confirmed palette, typography direction, tone, imagery, CTA wording, footer/contact facts,
product source, hosting and Klaviyo account are all populated. **A real SEND is still blocked** on the
[To be confirmed] items in `SC-BRAND-DOC-GAPS.md` — chiefly a **verified Klaviyo sender + reply-to**
(GAP #1/#2), a **confirmed per-campaign audience** (GAP #3, never auto-reused), **`featuredCategoryIds`
validation** against the shared catalog (GAP #5), and any **coupon code** created + active in BigCommerce
(GAP #4). The logo-source, Poppins fallback, exact CTA colour, and hosted icon-set reconciliations
(GAP #6–#10) do not block preview but should be settled for a clean production build.

## Files in this proposal (quarantined)

- `SC.md.proposed` — the populated brand doc (→ `03-Brands MD Files/SC.md` in Phase 2)
- `SC-BRAND-DOC-GAPS.md.proposed` — blocker/gap list (→ repo-root `SC-BRAND-DOC-GAPS.md` in Phase 2)
- `SC.config.json.proposed` — partial-patch config proposal (**stays quarantined**; manual apply only)
- `BRD-status-update.diff` — unified diff for the BRD status table (verified `git apply --check` clean)
- `MANIFEST.md` — full change map + files read + rollback commands
- `SUMMARY.md` — this file
