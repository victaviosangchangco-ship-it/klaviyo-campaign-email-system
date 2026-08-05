# Really Good Emails — research notes

| | |
|---|---|
| **Status** | RESEARCH — **NON-NORMATIVE** |
| **Version** | 1.0.0 |
| **Source** | `reallygoodemails.com` |
| **Maintainer** | Really Good Emails (RGE) |
| **Fetched** | 2026-07-29 |
| **Confidence** | **High** on what it is and its taxonomy. **N/A** on engineering mechanics — it publishes none. |
| **Kind** | A **curated gallery and resource library**. Not a framework, not a ruleset, no engineering deliverable. |

> ⛔ **Nothing in this document governs a build.** Cerberus remains the only production rendering framework.
>
> **This source carries a governance hazard the other four do not, and it must be read first:** RGE is a
> library of *other companies' finished emails*. `CLAUDE.md` §5.4 governs how such material may be used —
> **study layout, structure, hierarchy, sections, CTA placement and spacing, then create a fresh design
> inspired by them. Never reproduce another design exactly, and never copy another brand's identity.** A
> gallery makes violating that rule effortless. See goal 17, which is the most important section in this file.

---

## 0. Why a gallery is in an engineering research folder at all

Because of **ADR-009: Marketing Composition is an Engineering Concern**.

That ADR established that composition is not a matter of taste sitting outside engineering — it is a
constrained problem with failure modes, and §15 of `Email-Hero-Engineering-Standard.md` records its rules
(mandatory reading order, the composition-vs-geometry diagnostic, the Visual Bridge, proportion follows
communication value, the four hero roles).

**If composition is an engineering concern, then a corpus of composition is an engineering reference.** That
is this source's entire claim to a place here, and it is a legitimate one. But it means RGE is a reference for
**§15 only** — it has nothing to offer §§1–14 of that standard, and nothing to offer `CLAUDE.md` §8 or §9.

**Read this file for composition and lifecycle. Read the other four for engineering.**

---

## 1. Identity and problem solved

A curated, searchable gallery of real marketing emails, organised by category, with an associated resource
library and a design service (RGE Studio).

The problem it solves is **reference scarcity**: an email designer needs to know what good work in a given
lifecycle context looks like, and there is no other systematic corpus of that.

---

## 2. Provenance and maintenance status

An established, actively curated industry resource with a long track record. Curation — not code — is the
product, so "maintenance status" means "is it still being curated", and it is.

**No versioning, no releases, no licence relevant to us**, because we take nothing from it but observation.

---

## 3. Core architecture

**None.** No compiler, no templating language, no pipeline, no component library, no published rules.

Recorded as a genuine finding rather than a null answer: **the industry's most widely used email reference is
not an engineering artefact.** That is a useful thing to know about the state of the field, and it explains why
the Email Guidelines source is the only one of the five that is the same *kind* of thing as our standards.

---

## 4. Layout model

**None published.** What the gallery provides is a **corpus of layout outcomes**, from which patterns can be
observed but not extracted as specifications.

**Methodological warning, and it is a real one.** Observing a layout in a gallery tells you it *shipped*. It
does not tell you:

- whether it rendered correctly in Outlook, or in Gmail on a non-Google account
- whether it was clickable after its ESP's import rewrite
- whether it passed accessibility contrast or tap-target requirements
- whether it worked in dark mode
- whether it performed

Gallery entries are typically captured as **desktop renders**. Our `CLAUDE.md` §9.1 is unambiguous: **a
browser preview is never proof**, and desktop renders miss the entire defect class in §8.2, §8.3 and §8.4.

**So: a gallery is evidence of intent, never evidence of correctness.** Under our ECP evidence bar
(`Engineering-Change-Management.md` §2.2), a gallery entry is not evidence of anything and can never support a
proposal.

---

## 5. Responsive strategy

**None published.** See goal 4 — and note specifically that a desktop capture is silent about the mobile
experience, which is where every geometry failure in our Hero programme actually occurred.

---

## 6. Outlook / MSO strategy

**None published.** N/A.

---

## 7. Dark mode strategy

**None published.** N/A. Gallery captures are light-mode by default, which makes dark-mode failure the single
most systematically invisible defect in the entire corpus.

---

## 8. Accessibility strategy

**None published.** N/A — and worth stating that this is where a visual corpus is most actively misleading. A
design can look excellent in a gallery capture and fail WCAG AA contrast, fail the ≥14px body-copy minimum,
and fail the ≥44px tap-target requirement, with none of those visible in the capture.

**Our §9.5 requirements cannot be validated against a gallery, and a gallery cannot be cited to relax them.**

---

## 9. Component and reuse model

**None.** Templates are offered as a category, but as finished artefacts to view, not as a component system
with tokens, propagation discipline or locks.

---

## 10. Theming and token model

**None.** N/A.

---

## 11. Tooling and dependency profile

**Zero** — it is a website. Nothing to install, nothing to depend on. The only cost of consulting it is the
governance hazard in goal 17.

---

## 12. Client-support claims and substantiation

**None made, and none possible.** RGE makes no compatibility claims whatsoever, which is at least honest —
compare the three tooling sources, which assert compatibility by construction without a defect index.

---

## 13. Where it AGREES with our standards

The agreement here is **taxonomic and strategic**, not technical — and it is more valuable than it first
appears.

### 13.1 The category taxonomy independently confirms our flow taxonomy

RGE's top-level categories are **Behavioral · Enhancement · Inaugural · Industry · Miscellaneous · Promotional
· Punctual · Seasonal · Templates**, with **Behavioral** subcategories including **Abandoned Cart · Post
Purchase · Product Recommendations · Retention · Review & Testimonial**.

Map that against `CLAUDE.md` §1's supported flows — Welcome Series, Abandoned Checkout, Browse Abandonment,
Customer Winback, Back In Stock, Price Drop, Post Purchase, Review Request, Cross Sell, Replenishment, Sunset,
VIP, Birthday:

| RGE category | Our equivalent |
|---|---|
| Behavioral → Abandoned Cart | Abandoned Checkout, Browse Abandonment |
| Behavioral → Post Purchase | Post Purchase, Replenishment |
| Behavioral → Product Recommendations | Cross Sell |
| Behavioral → Retention | Customer Winback, VIP, Sunset |
| Behavioral → Review & Testimonial | Review Request |
| Inaugural | Welcome Series |
| Punctual | Back In Stock, Price Drop, Birthday |
| Promotional / Seasonal | **The separate Campaign Email System** |

**Two findings from that mapping.**

First, **"Behavioral" is precisely our definition of a flow** — an email whose job is set by a customer state
and a trigger, which is `CLAUDE.md` §4.1's lifecycle-stage table stated as a taxonomy. Independent arrival at
the same division.

Second — and this is the more interesting one — **RGE's split between Behavioral and Promotional/Seasonal is
the same split as our two-project architecture.** Our Flow project handles automated lifecycle sends; the
Campaign project handles one-off promotional sends. That separation was a structural decision made for our own
reasons, and finding the industry's largest corpus organised along the same axis is meaningful independent
confirmation that it is the right axis. **Per `README.md` §6.4, that settles it.**

### 13.2 Agreement with §15 on composition

Consistent with `Email-Hero-Engineering-Standard.md` §15: real high-performing emails lead with a hook, carry
one primary action, and use artwork proportionally to its communication value. The corpus is consistent with
our rules; it does not, and cannot, prove them.

---

## 14. Where it DISAGREES with our standards

**No technical disagreements are possible** — it publishes no technical positions.

**One tension is real and worth naming.** Gallery-celebrated design skews toward visual ambition: large
imagery, unconventional composition, heavy art direction. Our standards are deliberately conservative on
exactly those axes for stated reasons —

- §8.5 / the Hero standard: aspect-locked bands, `contain` not `cover`, and **artwork may not carry the
  message** because it must survive image-blocking and dark mode
- §9.7: balanced text-to-image ratio, **never an image-only email**
- §4.3: nothing dated, seasonal or expiring, because a flow sends unattended for months

**A gallery is dominated by campaign work, and campaign work is allowed to be things a flow is not.** A
seasonal hero with baked-in artwork copy can be excellent as a one-off send and is *prohibited* in a flow.
Consulting the corpus without that filter imports campaign licence into flow constraints.

---

## 15. What it can do that we cannot

1. **Provide a broad corpus of lifecycle composition** — a scale of reference we cannot generate internally.
2. **Show what a given flow type looks like across many brands**, which is genuinely useful for §15.1 reading
   order and §15.3 semantic-continuity review.
3. **Surface composition conventions per lifecycle stage** — how an abandoned-cart hero is typically framed,
   what a post-purchase email leads with.
4. **Offer a category vocabulary** that is more granular than ours in the promotional direction.

---

## 16. What we can do that it cannot

Everything engineering. Stated briefly because the asymmetry is total: rendering standards, hero geometry, the
artwork contract, dynamic-data engineering, accessibility requirements, dark mode, client-matrix QA,
components, tokens, locks, governance, and the §15 composition *rules* themselves — RGE has the corpus, we
have the rules derived from constraints.

**One specific capability worth naming:** we can state *why* a composition fails. §15.2's diagnostic — **a
geometry failure looks different between clients or widths; a composition failure looks the same
everywhere** — is a tool for reading a design. A gallery shows designs; it does not diagnose them.

---

## 17. Adoption risk — **the most important section in this file**

**The risk is not adoption. It is contamination.** And it is not hypothetical: this project has already paid
for it.

### 17.1 The recorded cost

A single reference image (`designsuggestion1.png`) drove **four successive draft rejections** of one template.
The mechanism was not that the reference was bad; it was that a reference image is **a composition without its
constraints**. It showed a mock coupon code, an unverified tagline, a product grid whose data source did not
exist, and a shaped panel division whose email-safe implementation was an open engineering problem. Every one
of those had to be resolved *after* the composition had already been mandated.

**A gallery is that experience, available in unlimited quantity.**

### 17.2 The specific hazards

| Hazard | Why a gallery makes it likely |
|---|---|
| **Copying identity** | §5.4 and §11 forbid copying another brand's design or identity. A gallery is a grid of other brands' identities. |
| **Importing campaign licence into a flow** | Goal 14. Dated, seasonal and baked-in-artwork designs are celebrated there and prohibited here (§4.3). |
| **Treating a desktop capture as proof** | §9.1: a browser preview is never proof. A gallery is entirely browser previews. |
| **Mandating a composition before its constraints are known** | The recorded cost above. |
| **Inferring data that does not exist** | §3.2 and §11: never invent products, prices, coupon codes or URLs. A reference design shows all of them, filled in, plausibly, and fictionally. |
| **Reference outranking verified data** | §2.2 is explicit: `Reference/` is visual guidance only and **never overrides verified data**. |

### 17.3 The required discipline

`CLAUDE.md` §5.4 already states the rule. What this research adds is a **usage protocol** for consulting a
corpus of finished emails, catalogued as **P-07**:

```
1  Extract the STRUCTURE  — reading order, section sequence, density, hierarchy, CTA placement
2  Discard the SURFACE    — typography, colour, spacing values, artwork, proportions, brand marks
3  Test against §15       — does the composition satisfy the mandatory reading order and the
                            proportion-follows-communication-value rule?
4  Test against §4.3      — is every element evergreen, or does it depend on a season, a date,
                            a stock level or baked-in artwork copy?
5  Test against §8 / §9   — is the structure achievable from tables, attributes and inline styles
                            alone, with no <style>, at ~280–320px, with images blocked, in dark mode?
6  Verify every DATUM     — no product, price, coupon, tagline or claim survives from a reference.
                            An absent value is "To be confirmed", never an assumption.
7  Then design FRESH      — the output must be a new design informed by the structure,
                            not a re-skin of the reference (§5.4).
```

**Step 5 is the step that was missing** when the reference-driven drafts were rejected. A composition that
cannot be built under §8 is not a design direction; it is an unresolved engineering problem wearing one.

---

## 18. Verdict

> **STUDY — VALUABLE FOR COMPOSITION AND LIFECYCLE STRATEGY ONLY. Zero engineering value. Highest
> contamination risk of the five sources, and the only one that needs a usage protocol rather than a
> verdict.**

**Extracted into the pattern catalogue:**

| Pattern | What is extracted | Verdict there |
|---|---|---|
| **P-07** | The 7-step reference-consumption protocol (goal 17.3) | **ADOPT — operationalises §5.4, which currently states the rule without a method** |

**Confirmed by independent agreement:**

- The Behavioral-vs-Promotional split validates our **two-project architecture** (goal 13.1). Settled.
- The Behavioral subcategories validate our **flow taxonomy** (goal 13.1). Settled.

**Rejected:** nothing, because nothing is offered. But **no gallery entry may ever be cited as evidence** in an
ECP, a QA report or a design justification — it fails the evidence bar on every axis (goal 4).

**The honest summary:** this source's value is real but narrow, and its risk is real and broad. Use it to
answer *"what does a good abandoned-cart email do first?"* Never use it to answer *"is this technique safe?"*

---

*Research notes, non-normative. Compiled 2026-07-29. No engineering claim in this file is citable, because
this source publishes none.*
