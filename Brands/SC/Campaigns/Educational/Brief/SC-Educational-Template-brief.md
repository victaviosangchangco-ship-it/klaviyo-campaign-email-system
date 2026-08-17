# Brief — SectorCare Educational Email Template (reusable)

- **Brand:** SectorCare (SC). **Type:** Educational (§5.3) — reusable **template**, not a live campaign.
- **Status:** For review only. No Klaviyo draft created (this is a template, not a send; no audience gate).
- **Files:**
  - Template (tokenised): `Brands/SC/Campaigns/Educational/Draft/SC-Educational-Template-v1.html`
  - Filled example (preview/QA): `Brands/SC/Campaigns/Educational/Output/SC-Educational-Template-example.html`
  - Reference studied: `Brands/SC/Campaigns/Educational/References/ChatGPT Image Aug 16, 2026, 08_24_24 PM.png`

## Design direction taken from the reference

The reference is a full SC educational email mock. Adopted structure/hierarchy, not its content:
- Top slim trust line + SC logo (left, §6.1).
- Warm hero: teal eyebrow pill → two-tone serif headline (black + teal) → supporting line → CTA.
- "Helpful Information for Everyday Independence" context intro.
- Educational value blocks: a main insight + a 2×2 card grid of teaching points (icon badge + title + body).
- A solid-teal takeaway panel with three checkmark benefits.
- One soft, optional product/category nudge (not a hard sell).
- Closing CTA → contact → trust row → footer.

**Deliberate departures (verification / brand accuracy):**
- **Colours/logo/contact from the approved SC system, not the mock.** SC accent teal `#3d7a94`, warm-cream
  `#ece4d8`/`#f5f1ea`, logo + footer from `SC.config.json` and the approved `SC-2026-W30.html`. The mock's
  `1300 765 552` / `enquiries@sectorcare.com.au` were **not** used (unverified); the verified SC contact is
  `sales@sectorcare.com.au` / `02 9172 5607`.
- **No lifestyle photos.** The mock uses stock people/product photos; no approved SC educational imagery exists
  and AI images are not auto-approved (§7), so the hero and cards are typographic + monochrome icon badges
  (the approved SC-W29/W30 fallback). An approved image can be dropped into the hero later.
- **Education-first.** Only one soft product nudge; it is deletable for a pure-education send.

## Reusable token dictionary (32 tokens; `[[TOKEN]]` convention per Components/README)

| Token | Purpose |
|---|---|
| EDUCATIONAL_TOPIC | `<title>` / internal topic label |
| PREHEADER | hidden inbox preview line |
| HERO_EYEBROW | teal pill eyebrow (e.g. "Education. Empowerment. Independence.") |
| HERO_HEADLINE / HERO_HEADLINE_ACCENT | two-tone headline (black part / teal part) |
| HERO_SUPPORTING_TEXT | one-paragraph hero intro |
| HERO_CTA_TEXT / HERO_CTA_URL | hero button |
| SECTION_HEADING / SECTION_INTRO | context-setting intro |
| MAIN_INSIGHT_HEADING / MAIN_INSIGHT_BODY | the core educational insight |
| POINT1..4_TITLE / POINT1..4_BODY | four teaching-point cards |
| TAKEAWAY_HEADING / TAKEAWAY_1..3 | teal panel + three checkmark benefits |
| PRODUCT_SECTION_TITLE / _BODY / _CTA / _URL | optional soft product nudge (delete the block to omit) |
| CLOSING_HEADING / CLOSING_BODY | closing invitation |
| CTA_TEXT / CTA_URL | primary closing CTA |

Static (not tokens): SC logo, contact block, trust row, footer legal (§6.23 URL-form `{% unsubscribe_link %}` /
`{% manage_preferences_link %}`, `{{ organization.name }}` / `{{ organization.full_address }}`), privacy URL.

## Example instance (filled, for preview)

Topic: **"Making Everyday Movement Easier at Home"** — a genuinely useful, non-selling guide (task-first way to
choose mobility support; four teaching points; three takeaways). No fabricated claims, no discount, no dashes
(§6.2), one soft "Browse Range" nudge → sectorcare.com.au.

## QA (both files)

Tag balance OK (table/tr/td/a); 0 empty/nested/table-in anchors; 0 empty cells; 0 dead `href`; 0 RDD/SS/localhost
references; all links → sectorcare.com.au (HTTP 200); valid Klaviyo org vars only; footer uses URL-form
subscription tags; 1 img (logo) with alt; monochrome teal glyph icons (§6.21); ~24 KB (well under Gmail clip).
**Manual multi-client render QA (Gmail/Apple Mail/Outlook, desktop+mobile) still required before any production use.**
