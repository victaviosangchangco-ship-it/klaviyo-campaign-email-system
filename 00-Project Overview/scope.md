# Scope

This section defines the boundary of the Weekly & Monthly Email Campaign System: what
this BRD governs, and what it explicitly does not. It exists to prevent overlap with
adjacent work — most importantly the **Klaviyo Flow** project.

## In scope

The following are covered by this documentation:

- **Weekly email campaigns** — their process, cadence, and structure. See [01-Weekly Campaign](../01-Weekly%20Campaign/).
- **Monthly email campaigns** — their process, cadence, and structure. See [02-Monthly Campaign](../02-Monthly%20Campaign/).
- **A unified production framework** applied consistently across all supported brands
  (RDD, SS, SC, Stack).
- **Campaign requirements and standards** — the functional behaviour and quality bar every
  campaign must meet. See [Campaign Requirements](Campaign-Requirements.md) and
  [Campaign Standards](Campaign-Standards.md).
- **Shared brand application** — how brand rules are referenced during production, sourced
  from the [Brand documentation](../03-Brands/).
- **Supporting libraries** — reusable assets and prompts. See [Assets Library](../06-Assets%20Library/)
  and [Prompt Library](../07-Prompt%20Library/).
- **Technical implementation of campaigns** — assets, product source, dynamic content,
  integrations, and data/segments. See [04-Technical](../04-Technical/).

## Out of scope

The following are **not** covered by this documentation:

- **Klaviyo Flows.** All automated, event- or trigger-based journeys (for example welcome,
  browse/abandoned-cart, and win-back flows) are owned by the separate Klaviyo Flow
  project. This BRD does not modify, reference, or depend on that work.
- **Brand identity definition.** The BRD applies brand rules but does not define them; the
  source of truth for each brand is its [Brand document](../03-Brands/).
- **Email platform selection and administration.** The underlying sending platform, its
  account configuration, and its native reporting are assumed to exist and are not
  specified here beyond the integration points noted in [04-Technical/Integrations.md](../04-Technical/Integrations.md).
- **One-off or ad-hoc campaigns** that do not follow the recurring weekly or monthly
  cadence, unless later brought under this framework.
- **Non-email channels** (for example SMS and push), except where a social media asset is
  produced as a by-product and governed by [06-Assets Library/Social-Media.md](../06-Assets%20Library/Social-Media.md).

## Relationship to the Klaviyo Flow project

Scheduled campaigns (this BRD) and automated flows (the Klaviyo Flow project) are distinct
bodies of work with separate documentation and separate lifecycles. Where a topic could
appear to belong to both, it is documented here only if it is specific to scheduled weekly
or monthly campaigns. Anything trigger-driven belongs to the Flow project.

## Scope changes

Scope is not fixed for all time. Proposed additions (for example a new campaign cadence or
a new channel) should be raised as [Future Enhancements](../05-Future/roadmap.md) and moved
into scope only after review and approval by the stakeholders listed in
[Stakeholders](stakeholders.md).
