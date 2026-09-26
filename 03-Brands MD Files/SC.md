# Brand Specifics — SC

> **SectorCare (SC).** This document holds only what is **specific to SectorCare**. Everything shared by
> every brand (the brand-document contract, the nine attribute categories, confidence-tag meaning, the
> visual-system layers) lives in `03-Brands MD Files/Shared.md` and the BRD — it is **not** restated here.
> Where a rule is project-wide it is **cited** (`CLAUDE.md §x`, `CS-##`), never copied.

## Source & confidence

Every value below carries a confidence tag: **[Confirmed]** (grounded in an approved in-repo source or a
first-party verification this session), **[Inferred]** (derived from an approved output or a design-system
draft, not yet signed off), **[To be confirmed]** (no authoritative source yet — blocks a real send where
noted, per `CLAUDE.md §5`).

**Sources used to populate this document:**

1. **`Desktop/Social Media Content Automation System/Product Featured Graphics Project/Design.md`** — Maria's
   SectorCare visual design system (dated Sep 3 2026). **Status: Draft for Review — sign-off pending from
   Bruce & Jack.** It is authored for **social-media product graphics** (4:5 / 1080×1350 five-band layout),
   so its **brand-level values** (palette, typography family, personality, imagery intent, logo) apply
   **brand-wide including email**, but its **canvas/layout rules** (aspect ratio, band structure, graphic
   icon-disc treatment) are **social-scoped and do NOT carry into email** — email layout is governed by
   `CLAUDE.md §6` and Cerberus.
2. **Brand-purpose / positioning documents** (two `.docx` briefs in the same project folder) — Brand Purpose,
   Tagline, Brand Theme, Visual Personality, CTA wording, imagery direction.
3. **Approved SC email outputs** (SC-2026-W29 / W30) as recorded in project memory `sc-brand-facts` and
   `config/brands/SC.config.json` — used for email-specific facts (privacy URL, contact phone, header
   sizing) where Maria's docs are silent.
4. **First-party verification this session** — `sectorcare.com.au` contact/shipping pages, live
   `GET /accounts` on the SC Klaviyo account.

> ⚠️ **A master "SectorCare Brand Guideline" is referenced by Maria's docs but is NOT yet in this repo.**
> When it lands it is the authority and **supersedes** any [Inferred] value here (notably the exact CTA
> treatment and the colour sheet). Values drawn only from the social design-system draft are tagged
> [Inferred] for that reason.

## Brand identity

| Field | Value | Confidence |
|---|---|---|
| Brand name | SectorCare | [Confirmed] |
| Brand code | SC | [Confirmed] |
| Website | https://sectorcare.com.au | [Confirmed] |
| Category | Mobility & daily-living aids (healthcare / assisted-living) | [Confirmed] |
| Brand purpose | "Provide reliable mobility and daily living solutions that promote independence, comfort, and dignity, helping people live life better every day." | [Confirmed — Brand Purpose doc] |
| Tagline | **Care. Support. Empower.** | [Confirmed — Brand Purpose doc] |
| Brand theme | Caring. Supportive. Empowering. | [Confirmed — Brand Purpose doc] |
| Visual personality | Caring · Professional · Trustworthy · Supportive · Accessible · Reassuring | [Confirmed — Brand Purpose doc] |
| Audience | Older adults, people living with reduced mobility, carers and families; NDIS participants. Readability-first — larger, high-contrast type (see `CLAUDE.md §6.4`). | [Inferred] |
| NDIS | Registered NDIS Provider | [Confirmed — sectorcare.com.au] |

## Logo

- **Official brand mark** (the only permitted logo; preserve proportions, never recolour, never distort):
  `https://d3k81ch9hvuctc.cloudfront.net/company/W2Ua5v/images/47898cac-310d-44a3-8d9a-29791b93b07d.png`
  — [Confirmed — Design.md §5, hosted on SC's own Klaviyo account `W2Ua5v`].
- **Header alignment: LEFT** by default, per `CLAUDE.md §6.1` (SC is named there). This is a default, not a
  restriction — a specific campaign may request otherwise. [Confirmed]
- **Header height** ~32px per approved SC-2026-W30 header. [Inferred]
- ⚠️ **Logo-source reconciliation needed.** The approved SC email sends (SC-2026-W29/W30 and this session's
  Father's Day build) referenced an SC logo hosted on a **different, previously-connected** Klaviyo account
  (`XAUdQX`), not SC's own account `W2Ua5v`. For SC's own emails the **`W2Ua5v` official mark above is the
  correct same-account choice.** Which asset the email header should use going forward is **[To be
  confirmed]** — see `SC-BRAND-DOC-GAPS.md`.

## Colour palette

Six-digit hex only (`CLAUDE.md §6.20`).

> **Palette agrees across Maria's design-system draft and both positioning docs — but NO approved SC email
> send to date has adopted it.** All three Weekly Outputs (SC-2026-W29 / W30 / W32) use a teal `#3d7a94` +
> beige `#f5f1ea` system, and the stashed Father's Day send uses a third palette (`#032a58` / `#4870b5` /
> warm neutrals). Whether SC email migrates to Maria's palette or continues on the shipped teal/beige is an
> open decision pending Bruce/Maria — see `SC-BRAND-DOC-GAPS.md`.

| Role | Name | Hex | Usage | Confidence |
|---|---|---|---|---|
| Dominant / primary | Gray Blue (navy) | `#465669` | Headings, primary text, icon discs, caption bars, primary CTA fill | [Inferred — Design.md + positioning docs (Draft for Review, sign-off pending); no approved SC send has yet adopted this palette] |
| Accent | Gray Cyan (teal) | `#466464` | Accent details, secondary emphasis | [Inferred — Design.md + positioning docs (Draft for Review, sign-off pending); no approved SC send has yet adopted this palette] |
| Secondary (soft) | Gray Turquoise | `#8FA3A1` | Soft secondary / muted supporting elements | [Inferred — Design.md + positioning docs (Draft for Review, sign-off pending); no approved SC send has yet adopted this palette] |
| Supporting text | Dark Gray | `#232323` | Body / supporting text where higher contrast than navy is wanted | [Inferred — Design.md + positioning docs (Draft for Review, sign-off pending); no approved SC send has yet adopted this palette] |
| Background | White | `#FFFFFF` | Primary visual foundation; white/light backgrounds carry the layout | [Inferred — Design.md + positioning docs (Draft for Review, sign-off pending); no approved SC send has yet adopted this palette] |

- White and light backgrounds provide the **main visual foundation**; navy `#465669` is the dominant brand
  colour on type and the primary CTA. [Inferred — Design.md]
- **Product-specific colours must remain accurate** — never re-tint or recolour product imagery. [Confirmed]

## Typography

- **Brand typeface: Poppins** (geometric sans), used across the brand. Email delivery uses a web-safe
  fallback stack because custom web fonts are unreliable in email (`CLAUDE.md §6.20`); Poppins is the design
  intent and the fallback approximates it. [Confirmed — Design.md; email-fallback note Inferred]
- **Weight hierarchy** [Confirmed — Design.md]:
  | Level | Poppins weight |
  |---|---|
  | Hero / major headline | Black / ExtraBold |
  | Section & product titles | SemiBold / Bold |
  | Body / supporting copy | Medium / Regular |
- **Use uppercase for major product headings where appropriate.** [Confirmed — Brand Purpose doc]
- Email fallback stack: **[To be confirmed]** — the current `SC.config.json` carries a legacy
  `'Helvetica Neue',Helvetica,Arial,sans-serif` (body) / `Georgia,serif` (heading) pair that predates the
  confirmed Poppins direction and **conflicts with it**; reconcile before the next SC build (see
  `SC-BRAND-DOC-GAPS.md`). A Poppins-first web-safe stack (e.g. `'Poppins',Arial,Helvetica,sans-serif`) is
  the intended replacement, pending confirmation.

## Tone of voice

Warm, respectful and reassuring; plain, dignified language that centres **independence, comfort and
dignity**. Professional and trustworthy without being clinical or cold; supportive and encouraging, never
patronising. Copy leads with the customer benefit and everyday living outcome. No em/en dashes in campaign
copy (`CLAUDE.md §6.2` / §6.25). [Confirmed — Brand Purpose doc + Design.md personality]

## Imagery style

- High-resolution product photography on white / light backgrounds; product colours accurate and never
  re-tinted. [Confirmed — Design.md, Brand Purpose doc]
- **Lifestyle imagery uses environments relevant to home, mobility, comfort, care and everyday living.**
  [Confirmed — Brand Purpose doc]
- Clean, uncluttered, reassuring composition consistent with the "Accessible / Reassuring" personality.
  [Inferred]

## Button / CTA styling

- **Primary CTA label: `SHOP NOW`.** [Confirmed — both positioning docs]
- **Style: rectangular** (squared / lightly-rounded corners), high-contrast, generous padding, ≥44px tap
  target, never pill-shaped, never cartoonish. Bulletproof table+VML build per `CLAUDE.md §6.20`. [Confirmed
  — Design.md CTA direction; §6.26 restraint]
- **Colour: navy `#465669` fill with white `#FFFFFF` text** (the dominant brand pairing, high contrast for
  the readability-first audience). [Inferred — derived from the confirmed palette + contrast rule; the
  positioning doc says "use the approved SectorCare CTA treatment from the Brand Guideline", which is not
  yet in-repo, so the exact fill/radius is pending that guideline.]
- Uppercase label is on-brand (matches the "uppercase major headings" direction). [Inferred]

## Sender identity & footer

Footer build mechanics (mobile-safe table+cell `bgcolor`, merge-tag validity) are governed by `CLAUDE.md
§6.16 / §6.23 / §6.26` and not restated. SC facts:

| Field | Value | Confidence |
|---|---|---|
| Contact email | sales@sectorcare.com.au | [Confirmed — sectorcare.com.au] |
| Phone | 02 9172 5607 · `tel:+61291725607` | [Confirmed — sectorcare.com.au] |
| Business address | 3 Wordie Place, Padstow NSW 2211 | [Confirmed — sectorcare.com.au] |
| Trading hours | Mon–Fri 9:30am–5:00pm | [Confirmed — sectorcare.com.au] |
| ABN | 12 622 753 388 | [Confirmed — sectorcare.com.au] |
| Instagram | https://www.instagram.com/sectorcare.au | [Confirmed — sectorcare.com.au] |
| Facebook | https://www.facebook.com/sectorcare | [Confirmed — sectorcare.com.au] |
| Privacy policy | https://sectorcare.com.au/privacy-policy/ | [Confirmed — SC-2026-W30 footer, HTTP 200; the old `/privacy` path 404s — do not reuse] |
| Footer legal line | Follow the approved SC minimalist footer (`CLAUDE.md §6.26`). The approved SC email footer used the brand name without the postal address; the confirmed address above may be added if a send calls for it. | [Inferred] |
| Klaviyo `from_email` | **[To be confirmed]** — must be a verified sender in the SC Klaviyo account before any real send (`CLAUDE.md §12`). `sales@sectorcare.com.au` is the contact inbox; confirm it is a verified Klaviyo sender before use. | [To be confirmed] |
| Klaviyo `reply_to_email` | **[To be confirmed]** (default: same as brand sender, `CLAUDE.md §13.4`). | [To be confirmed] |
| From label | SectorCare | [Inferred] |

## Promotions

- SC promo standard is governed by **`CLAUDE.md §6.4`** (SC-only): fixed-dollar **$20 off orders over $200**,
  **no percentage discounts** unless an approved special arrangement requires one; readability-first promo
  hierarchy for the older audience. Not restated here. [Confirmed — §6.4]
- Coupon **codes** are never invented; a real code must be created and confirmed **active** in BigCommerce
  before send (`CLAUDE.md §6.3 / §6.5`). [Confirmed]

## Iconography

- Email icons follow the project standard: **minimalist monochrome outline / line icons only, never emoji or
  cartoon** (`CLAUDE.md §6.21`). SC's brand tone for icons is the navy `#465669` (Maria's graphic treatment
  uses a navy disc with a white line icon — that **disc treatment is social-scoped**; email uses flat
  monochrome line icons per §6.21). [Confirmed — §6.21; navy tone Inferred from Design.md]
- A hosted monochrome PNG icon set for SC is **[To be confirmed]** — until one exists, use single-tone
  text-presentation glyphs per §6.21.

## Brand-specific data (product source, hosting, Klaviyo)

Credential **isolation** and the shared-store rules are owned by `CLAUDE.md §12` and
`config/brands/SC.config.json` — not restated. SC specifics:

| Field | Value | Confidence |
|---|---|---|
| Product source | **BigCommerce store `498h0egvgn`**, SHARED with SS (two storefronts on one store). SC URLs use `sectorcare.com.au`; brand separation is by SC category ids, never the store-wide pool (`§12`). | [Confirmed] |
| Store domain | https://sectorcare.com.au | [Confirmed] |
| Product categories | Electric Wheelchair · Mobility Scooter · Manual Wheelchair · Rollators · Walker Frame · Bath Aids · Toilet Aids · Walking Aids · Bed Aids · Disability Ramps (mobility & daily-living aids) | [Confirmed — sectorcare.com.au] |
| `featuredCategoryIds` | Live in `SC.config.json`; validate against the live catalog before a build (`§12`). | [To be confirmed] |
| Image hosting | **Primary: ImageKit CDN** — place assets in `Image kit hosting/sc/`, upload via `npm run imagekit:upload --brand SC --src <path>` or `npm run imagekit:watch`, verify HTTPS 200 at the returned `ik.imagekit.io` URL (`CLAUDE.md §12`). **Fallback/legacy: Vercel** — `hosting/sc/` → `Scripts/publish-assets.js --brand SC` → git deploy → `assets-sc.vercel.app`. Existing Vercel URLs in shipped campaigns remain valid; new assets default to ImageKit. | [Confirmed] |
| Klaviyo account | `W2Ua5v` ("Sector Care") | [Confirmed — live `GET /accounts`] |
| Klaviyo key env var | `SC_KLAVIYO_API_KEY` in `Brands/SC/.env` (`§12`) | [Confirmed] |
| Default Weekly audience | **[To be confirmed]** — never auto-reuse a prior send's segment/list; confirm per campaign (`CLAUDE.md §13.1`). | [To be confirmed] |

## Outstanding items to confirm

See `SC-BRAND-DOC-GAPS.md` (repo root) for the consolidated blocker list. Summary: **palette migration
decision** (Maria's `#465669` vs the shipped `#3d7a94`/beige — pending Bruce/Maria), email header logo source
(`W2Ua5v` official vs `XAUdQX` prior-send), email Poppins fallback stack (conflicts with legacy config
fonts), exact CTA fill/radius (pending master Brand Guideline), Klaviyo verified sender + reply-to, SC
`featuredCategoryIds` validation, hosted SC icon set, default Weekly audience.

---
_Status: **Drafted** from approved SC sources + Maria's design-system draft (Draft for Review, sign-off
pending from Bruce & Jack). Some values are [Inferred] / [To be confirmed] and are listed above. Populated
2026-09-07. A master "SectorCare Brand Guideline" is not yet in-repo and supersedes [Inferred] values when
it lands._
