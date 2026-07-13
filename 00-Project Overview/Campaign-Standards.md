# Campaign Standards

This section defines the **quality bar** every weekly and monthly campaign must meet —
the non-functional expectations that govern *how well* a campaign is produced, rather than
*what* it must contain (which is defined in [Campaign Requirements](Campaign-Requirements.md)).

Standards are system-wide and brand-neutral. Where a standard depends on a brand — for
example specific colours, fonts, logos, or tone — this document states the expectation and
defers the specifics to the [Brand documentation](../03-Brands/). Asset-level detail is
governed by the [Assets Library](../06-Assets%20Library/).

Each standard has a stable identifier (`CS-##`) for reference from reviews and QA.

## Brand & consistency

- **CS-01 — On-brand.** Every campaign must comply with the applicable brand rules in
  [03-Brands](../03-Brands/). This document does not restate brand specifics.
- **CS-02 — Structural consistency.** Campaigns of the same type must be structurally
  consistent from cycle to cycle, so recipients experience a predictable format.
- **CS-03 — Unified framework.** Shared standards apply to all brands identically; only
  genuinely brand-dependent elements may differ, and only as defined in the Brand documents.

## Content quality

- **CS-04 — Clear and concise.** Copy must be clear, correct, and free of spelling and
  grammatical errors.
- **CS-05 — Appropriate tone.** Tone of voice must match the applicable brand guidance in
  [03-Brands](../03-Brands/).
- **CS-06 — Accurate.** Product, pricing, and promotional details must be accurate at the
  time of send and sourced as defined in [04-Technical](../04-Technical/).
- **CS-07 — Working links.** All links and calls to action must resolve to the correct,
  live destinations.

## Design & rendering

- **CS-08 — Email-client compatibility.** Campaigns must render correctly across the
  supported email clients and both desktop and mobile viewports. The authoritative client
  matrix is maintained in [04-Technical/Integrations.md](../04-Technical/Integrations.md).
- **CS-09 — Responsive.** Layouts must be responsive and legible on small screens.
- **CS-10 — Asset compliance.** All logos, icons, banners, product images, buttons, and
  social assets must meet the [Assets Library](../06-Assets%20Library/) standards for
  format, dimensions, and quality.
- **CS-11 — Accessibility.** Campaigns should follow accessibility good practice —
  meaningful alt text, sufficient colour contrast, logical reading order, and a usable
  text-to-image balance.
- **CS-12 — Graceful degradation.** Campaigns must remain readable and actionable when
  images are blocked or fail to load.

## Performance & deliverability

- **CS-13 — Reasonable weight.** Total email weight and image sizes must be optimised so
  the campaign loads quickly and avoids clipping in common clients.
- **CS-14 — Deliverability hygiene.** Campaigns must follow good deliverability practice,
  including a valid preheader, balanced content, and a compliant footer.
- **CS-15 — Compliance.** Campaigns must include the legally required elements for
  marketing email (for example sender identity and unsubscribe), consistent with the
  sending platform's configuration.

## Process quality

- **CS-16 — QA before approval.** Every campaign must pass the
  [QA Checklist](../07-Prompt%20Library/QA-Checklist.md) before approval.
- **CS-17 — Reviewed independently.** Review and approval must be performed by someone
  other than the author (see [Stakeholders](stakeholders.md)).
- **CS-18 — Reproducible.** A campaign must be reproducible from its brief, assets, and
  prompts, without relying on undocumented individual knowledge.

## Maintainability & future-proofing

- **CS-19 — Documented over tribal.** Any repeatable decision must be captured in this
  documentation rather than held informally.
- **CS-20 — Extensible without duplication.** Standards must be met by extending the shared
  framework; brand or campaign additions must not fork or copy shared standards.

## Relationship to success metrics

These standards define the qualitative bar; the quantitative targets that indicate whether
the system is succeeding are defined in [Success Metrics](success-metrics.md). Where a
standard cannot yet be met, it should be logged in
[Future Enhancements](../05-Future/roadmap.md).
