# Stakeholders

This section identifies the roles involved in the Weekly & Monthly Email Campaign System
and their responsibilities. Roles are described generically so the documentation remains
valid as individuals change. Named owners for each role are recorded and maintained by the
project owner and are intentionally not hard-coded into this document.

## Roles

| Role | Description |
|------|-------------|
| **Project Sponsor** | Owns the business case and provides final approval on scope and direction. |
| **Project Owner / Lead** | Accountable for the system overall; maintains this documentation and the list of named role owners. |
| **Campaign Manager** | Plans the campaign calendar and briefs each weekly and monthly campaign. |
| **Content Author** | Produces campaign copy and content, using the [Prompt Library](../07-Prompt%20Library/). |
| **Designer / Asset Owner** | Produces and maintains assets to the standards in the [Assets Library](../06-Assets%20Library/). |
| **Developer / Builder** | Produces campaign HTML and implements the [Technical](../04-Technical/) requirements. |
| **Brand Owner** | Owns the rules for a given brand in the [Brand documentation](../03-Brands/); consulted whenever behaviour is brand-dependent. |
| **Reviewer / QA** | Reviews content and HTML against [Campaign Standards](Campaign-Standards.md) and the QA checklist before publication. |
| **Approver** | Signs off the final campaign for release. |

## Responsibility model (RACI)

The matrix below shows involvement per activity, using **R**esponsible, **A**ccountable,
**C**onsulted, **I**nformed. It describes responsibilities at the system level; detailed
per-campaign steps live in the [Weekly](../01-Weekly%20Campaign/) and
[Monthly](../02-Monthly%20Campaign/) sections.

| Activity | Sponsor | Project Owner | Campaign Mgr | Content Author | Designer | Developer | Brand Owner | Reviewer/QA | Approver |
|----------|:------:|:-------------:|:------------:|:--------------:|:--------:|:---------:|:-----------:|:-----------:|:--------:|
| Maintain this documentation | I | A/R | C | C | C | C | C | C | I |
| Plan campaign calendar | I | A | R | C | I | I | C | I | I |
| Brief a campaign | I | I | A/R | C | C | I | C | I | I |
| Produce content | I | I | C | A/R | C | I | C | C | I |
| Produce / supply assets | I | I | C | C | A/R | C | C | C | I |
| Build campaign HTML | I | I | C | I | C | A/R | C | C | I |
| Apply brand rules | I | I | C | C | C | C | A/R | C | I |
| Review & QA | I | I | C | C | C | C | C | A/R | I |
| Final approval to send | A | I | C | I | I | I | C | C | R |

## Notes

- A single person may hold more than one role, provided the review and approval of a
  campaign are performed by someone other than its author.
- Brand-dependent decisions always involve the relevant **Brand Owner**; this document
  never records brand-specific rules inline (see [03-Brands](../03-Brands/)).
- The current holder of each role is maintained by the Project Owner outside this BRD so
  the documentation does not require updating when personnel change.
