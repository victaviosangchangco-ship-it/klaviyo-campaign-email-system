# Shared Brand Standards (All Brands)

This document defines everything about branding that is **common across all supported brands**
(RDD, SS, SC, Stack). It is the single home for shared brand rules, in line with the
"write once, reference everywhere" convention: anything that applies to every brand lives here,
and is never repeated in the individual brand documents.

It is deliberately **brand-neutral**. It defines *how* branding works within the campaign
framework and *what* every brand document must specify — but it contains **no brand-specific
values** (no colours, typography, logos, tone, assets, domains, or segments). Those live only in
[RDD.md](RDD.md), [SS.md](SS.md), [SC.md](SC.md), and [Stack.md](Stack.md).

It also does not restate the campaign rules. Functional requirements are in
[Campaign Requirements](../00-Project%20Overview/Campaign-Requirements.md), the quality bar in
[Campaign Standards](../00-Project%20Overview/Campaign-Standards.md), and the per-cadence
structure and process in [01-Weekly Campaign](../01-Weekly%20Campaign/overview.md) and
[02-Monthly Campaign](../02-Monthly%20Campaign/overview.md).

## Purpose of the brand layer

The brand layer is the **source of truth for brand identity** within this system. Campaigns do
not define brand identity; they *apply* it. When a weekly or monthly campaign is produced, the
correct brand's rules are pulled from that brand's document and applied to the shared campaign
structure ([CR-09](../00-Project%20Overview/Campaign-Requirements.md),
[CS-01](../00-Project%20Overview/Campaign-Standards.md)).

This separation keeps the framework unified: one production process, one set of standards, and a
thin brand layer that varies only the genuinely brand-dependent details
([CS-03](../00-Project%20Overview/Campaign-Standards.md),
[CR-19](../00-Project%20Overview/Campaign-Requirements.md)).

## Shared branding principles

These principles hold identically for every brand:

- **Single source of truth.** Each brand's identity is defined once, in its own brand document.
  No brand value is duplicated here or in any campaign document.
- **Unified framework, thin brand layer.** All brands share the same campaign structure
  (`WK-S#` / `MO-S#`) and process (`WK-P#` / `MO-P#`); only brand-dependent elements differ, and
  only as defined in the brand documents ([CS-03](../00-Project%20Overview/Campaign-Standards.md)).
- **Brand-neutral by default.** Shared documents reference "the applicable brand" and link to the
  brand layer rather than naming or hard-coding any one brand.
- **Extensible without duplication.** A new brand is added by creating one brand document that
  fulfils the contract below — not by forking the shared framework
  ([CR-19](../00-Project%20Overview/Campaign-Requirements.md),
  [CS-20](../00-Project%20Overview/Campaign-Standards.md)).

## Where brand identity is applied

Brand identity maps onto the shared campaign structure at defined points. This mapping is the
same for every brand; the values applied at each point come from the brand document.

| Applied at | Shared structure block | Brand document supplies |
|------------|------------------------|-------------------------|
| Header / logo | [WK-S3](../01-Weekly%20Campaign/overview.md) / [MO-S3](../02-Monthly%20Campaign/overview.md) | The brand's logo and header treatment |
| Copy & messaging | [WK-S4](../01-Weekly%20Campaign/overview.md)–WK-S7 / [MO-S4](../02-Monthly%20Campaign/overview.md)–MO-S8 | The brand's tone of voice and messaging guidance |
| Calls to action | [WK-S5](../01-Weekly%20Campaign/overview.md) / [MO-S6](../02-Monthly%20Campaign/overview.md) | The brand's button/CTA styling |
| Colour, typography, imagery | All visual blocks | The brand's palette, fonts, and imagery style |
| Footer / sender identity | [WK-S8](../01-Weekly%20Campaign/overview.md) / [MO-S9](../02-Monthly%20Campaign/overview.md) | The brand's sender identity and footer details |

## The brand document contract

Every brand document (RDD, SS, SC, Stack) must define the **same set of attributes**, so the
brand layer is consistent and any campaign can apply any brand the same way. This section defines
*which attributes* each brand document must specify; it does **not** specify their values.

Each brand document is expected to cover:

- **Brand identity** — name, brand code, and a short description of positioning.
- **Logo** — the brand's logo(s) and rules for their use, consistent with the
  [Logo Standards](../06-Assets%20Library/Logo-Standards.md).
- **Colour palette** — the brand's colours and how they are used, applied within the accessibility
  expectations of [CS-11](../00-Project%20Overview/Campaign-Standards.md).
- **Typography** — the brand's fonts and hierarchy, with email-safe fallbacks.
- **Tone of voice** — how the brand speaks, so copy meets
  [CS-05](../00-Project%20Overview/Campaign-Standards.md).
- **Imagery style** — the brand's photographic/graphic style, applied within the
  [Assets Library](../06-Assets%20Library/) standards.
- **Button / CTA styling** — the brand's treatment for calls to action, within the
  [Button Standards](../06-Assets%20Library/Button-Standards.md).
- **Sender identity & footer** — the brand's from-name, sender details, and footer content needed
  to satisfy compliance ([CS-15](../00-Project%20Overview/Campaign-Standards.md)).
- **Brand-specific data** — any brand-specific segments, product sources, or domains, cross-
  referenced to [04-Technical](../04-Technical/) and
  [Audience & Segmentation](../00-Project%20Overview/audience-segmentation.md).

> Attribute **values** are owned exclusively by the individual brand documents. Where a brand has
> not yet documented an attribute from an approved source, it is recorded there as
> "To be confirmed" — never assumed in this shared document.

## Shared standards that apply identically to all brands

The following are governed by [Campaign Standards](../00-Project%20Overview/Campaign-Standards.md)
and apply to every brand without variation. They are listed here so brand documents do **not**
restate them:

- **Accessibility** — meaningful alt text, sufficient contrast, logical reading order
  ([CS-11](../00-Project%20Overview/Campaign-Standards.md)).
- **Responsive rendering** — legible on desktop and mobile across supported clients
  ([CS-08](../00-Project%20Overview/Campaign-Standards.md),
  [CS-09](../00-Project%20Overview/Campaign-Standards.md)).
- **Graceful degradation** — readable and actionable when images are blocked
  ([CS-12](../00-Project%20Overview/Campaign-Standards.md)).
- **Compliance & deliverability** — valid preheader, compliant footer, required marketing-email
  elements ([CS-14](../00-Project%20Overview/Campaign-Standards.md),
  [CS-15](../00-Project%20Overview/Campaign-Standards.md)).
- **Asset compliance** — all assets meet the [Assets Library](../06-Assets%20Library/) standards
  ([CS-10](../00-Project%20Overview/Campaign-Standards.md)).

Where a brand needs to *differ* from a shared standard, that difference must be justified and
recorded in the brand document and, if it is a lasting decision, logged as an Architecture
Decision (`ADR-###`) in [09-Architecture Decisions](../09-Architecture%20Decisions/Decision-Log.md).

## What is shared vs brand-specific

To keep the boundary clean:

- **Shared (defined here):** the role of the brand layer, the shared branding principles, the
  brand-to-structure application mapping, the brand document contract, and the standards that
  apply identically to all brands.
- **Brand-specific (defined only in the brand documents):** every actual value — logo, colours,
  typography, tone, imagery, CTA styling, sender identity, and brand-specific data. See
  [RDD.md](RDD.md), [SS.md](SS.md), [SC.md](SC.md), and [Stack.md](Stack.md).

---

_Status: Draft for review. Last updated: 2026-07-10._
