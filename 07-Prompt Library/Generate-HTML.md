# Generate HTML — Runtime Instructions

Short runtime checklist for generating campaign HTML. This is NOT a standards document —
standards live in `Standards/`, components in `Components/`, brand values in `03-Brands MD Files/`.

---

## Steps

1. **Resolve the campaign through the calendar service** — use `getCampaignById`, `getCampaignByWeek`,
   or `getNextCampaign`. Do NOT read the full `config/campaign-calendar.generated.json` into context.
2. **Read the campaign's `cadence` field** to select the Playbook. If cadence is null: **STOP and report.**
3. **Load the brand runtime facts** — `03-Brands MD Files/<CODE>.md` + `config/brands/<CODE>.config.json`.
4. **Load the cadence Playbook** — `Playbooks/<Cadence>-Playbook.md` (e.g. `Weekly-Playbook.md`).
5. **Read the current Brief** — `Brands/<CODE>/Campaigns/<Cadence>/Brief/`.
6. **Assemble from approved components** — `Components/*.html` + `Shared/Snippets/base-head.html` +
   `Templates/<Cadence>/*-skeleton.html`. Do NOT rewrite stable structural HTML.
7. **Use verified product data only** — BigCommerce API, verified on the product's own page
   (active, visible, in stock, real price, live URL HTTP 200, public image).
8. **Replace allowed content tokens** — subject, preview text, copy, products, prices, URLs, images,
   brand tokens, campaign-specific section text.
9. **Omit unused optional components cleanly** — remove the entire HTML block for absent optional
   sections (coupon, category pills, secondary CTA, trust strip). Never leave unresolved `[[TOKEN]]`s,
   empty `<p>`, `<td>`, `<tr>`, `<a>`, or decorative ghost tables.
10. **Never fabricate** product names, prices, URLs, images, coupon codes, or brand values.
11. **Generate into `Draft/`** — versioned `<CODE>-YYYY-<id>-draft-vN.html`. Keep all previous versions.
12. **Run QA** — `07-Prompt Library/QA-Checklist.md`. Fix identified failures.
13. **Update `Output/`** — copy the latest Draft to the un-versioned Output file.
14. **Stop at the Draft/review boundary.** Do not send, schedule, or activate anything.

## Do NOT load during normal generation

- Full `config/campaign-calendar.generated.json` (resolve through the calendar service)
- Full `Shared/design-tokens.md` or `Shared/Fonts/font-stacks.md` (load only when making visual
  system decisions — normal generation uses values already baked into components/templates)
- Full BRD.md (use only if requirements are ambiguous)
- Full Hero Engineering Standard (use the hero contract for normal assembly)
- Full Cerberus documentation (already embodied in components + base-head)
- CLAUDE-LEGACY.md (archival only)
- Other brands' files
- Old campaign Reviews or Drafts (unless comparing/debugging)
