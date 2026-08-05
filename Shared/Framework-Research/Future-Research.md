# Future Research — gaps, verifications and open questions

| | |
|---|---|
| **Status** | RESEARCH — **NON-NORMATIVE** |
| **Version** | 1.0.0 |
| **Compiled** | 2026-07-29 |
| **Purpose** | What this research did **not** cover, what it produced that must be **verified before use**, and the open questions worth answering next |

> ⛔ **Nothing in this document governs a build.** Cerberus remains the only production rendering framework.
> Every item here is a **task or a question**, never a rule. See `README.md` §1.

---

## 1. What this round covered, and what that means

Five sources, eighteen research goals each, compiled from public documentation and README material fetched
2026-07-29.

**The honest boundary, restated from `README.md` §7:** these documents are the product of reading each project's
**documentation**, not its source tree, and **nothing in this folder has been render-tested by us**. That
boundary is why this file exists — several findings are consequential enough to act on and not yet evidenced
enough to act on *yet*.

**Three categories of output:**

| Category | Count | Status |
|---|---|---|
| Rules of ours **settled** by independent agreement | 14 (Email Guidelines) + confirmations elsewhere | Done. Stop re-litigating |
| Patterns with an **adopt** verdict | P-01, P-04, P-07, P-08, P-12, P-13, P-14 | Proposals — require ECPs |
| Findings requiring **verification first** | P-09, P-10 | **Blocked on reproduction** |

---

## 2. Sources not covered

Deliberately out of scope this round. Recorded with a reason, so a future round starts from a decision rather
than a blank page.

| Source | Kind | Why it may be worth a round | Priority |
|---|---|---|---|
| **caniemail.com** | Client-support database | **The highest-value uncovered source.** `CLAUDE.md` §8.8 already instructs checking unfamiliar CSS properties there, so it is a *cited dependency we have never researched*. A structured round would answer whether it can supply the reproduction evidence our ECP bar demands, and whether its data is citable | **High** |
| **Email Markup Consortium** | Accessibility & markup conformance | Publishes accessibility conformance data for real emails. Directly relevant to §9.5, which is stronger than every source researched — worth knowing whether an external bar exists that ours does not meet | **High** |
| **Litmus / Email on Acid research** | Commercial testing platforms + published research | The natural answer to our permanent §9.1 gap: **Gate G2's client matrix has never been run for any draft.** Research question is not "which is better" but *"what would it take to close G2, and is a documented manual protocol sufficient?"* | **High** |
| **Parcel / Stripo / Chamaileon** | Visual email builders | A different failure mode from frameworks — WYSIWYG output rather than compiled abstraction. Likely little to extract, but the *builder* category is entirely unexamined | Low |
| **Klaviyo's own template documentation** | Our actual sending platform | Arguably a gap in our knowledge base that outranks four of the five sources researched. Our §8.2 and §8.7 rules exist because of Klaviyo's import rewrite and its tag-expansion behaviour, and both were learned from **defects rather than from documentation** | **High** |
| **Salesforce / Braze / Iterable template systems** | Competing ESP templating | Cross-platform comparison of tag-in-attribute behaviour would tell us whether §8.7 is a Klaviyo-specific rule or a general one | Medium |
| **Nathan Dumont / Mark Robbins (Good Email Code)** | Accessible, minimal email patterns | Rules-and-reasons in kind, like the Email Guidelines source — which was the most valuable of the five. **The most likely place to find a second high-value ruleset** | **High** |
| **Cerberus upstream changes since vendoring** | Our own Tier-1 reference | We vendored it and never checked for upstream movement. A drift check is cheap and directly relevant | Medium |

**The pattern in that table is worth naming.** The four High-priority uncovered sources — caniemail, Email
Markup Consortium, Litmus/EoA, Klaviyo's own docs — are all **evidence sources**, not technique sources. This
round researched *frameworks* and found our techniques are largely ahead of them. The next round should research
**evidence**, because that is where we are actually weak: our ECP bar demands reproduction in a named client,
and Gate G2 has never been run.

---

## 3. Verification tasks — blocked findings

These are **not** ECPs. They are reproductions that must happen before an ECP can be raised, per
`Engineering-Change-Management.md` §2.2's requirement for *"reproduction in a NAMED client, not suspected or
inferred."*

### 3.1 P-10 — Yahoo/AOL `height` attribute → `min-height` · **HIGHEST PRIORITY**

**The claim.** Yahoo and AOL convert an HTML `height` attribute into `min-height`.

**Why it is the highest-priority item produced by this entire research exercise.** It is the only finding that
suggests **a rule we already ship may be weaker than we have documented it**. §8.3's equal-height product card
rests on reserved fixed-height cells acting as ceilings, with the load-bearing requirement that *content must
never determine card height*. If the attribute is a floor in those clients, content can push a region past its
reservation and **two cards in a row can stop matching** — the exact defect the rule exists to prevent.

**Test.**

```
1  Build a two-card row where card A's title fits its reserved two-line region
   and card B's title overflows it. Use realistic long product names per §9.3.
2  Render in Yahoo Mail (web + Android) and AOL.
3  Baseline against Gmail web, Apple Mail desktop, Outlook desktop.
4  Measure: do the two cards' total heights match in each client?
5  Isolate: does the inline height still constrain when the attribute does not?
```

**Outcomes and actions** are enumerated in `Reusable-Engineering-Patterns.md` P-10 §5. **Do not pre-emptively
change the card architecture** — an unverified fix to a settled component is the worst category of change.

**Blocker:** requires real Yahoo and AOL accounts, i.e. Gate G2 capability we do not currently have (§4.2).

### 3.2 P-09 — Outlook 120dpi document-level DPI declaration

**The claim.** Outlook on Windows at 120dpi scales some dimension units and not others; the remedy is a
document-level DPI declaration in the head paired with the Office XML namespace.

**Why it matters.** `CLAUDE.md` has no coverage of 120dpi at all, and our reserved-height card regions are
exactly the structure a scaling discrepancy would misalign — the same failure mode §8.3 already records from a
different cause.

**Test.**

```
1  Confirm current state: does our head scaffold already carry a DPI declaration?
   (The Office namespace is present — it is required for VML — the DPI declaration is unverified.)
2  Render an existing draft in Outlook on Windows at 96dpi and at 120dpi.
3  Measure the 600px container, the 2-column card widths, and the reserved region heights.
4  If they differ: add the declaration, re-render, confirm the difference closes.
```

**Do not add it to the head scaffold of every template in both projects before step 4.** That is a broad change
on a medium-confidence claim.

### 3.3 Other unreproduced client claims from the Email Guidelines source

Recorded so they are not silently promoted from "documented elsewhere" to "known":

| Claim | Why we care | Priority |
|---|---|---|
| **Orange webmail forces top vertical alignment on every cell** | §8.3 relies on `valign="middle"` for the price/CTA region and for a one-line value in a two-line reserved area. A client that overrides `valign` breaks the vertical rhythm the rule exists to create | Medium |
| **Outlook 2007–2019 does not paint a background under an element's own margin** | Strengthens our sized-spacer-row rule rather than threatening it, and our §8.8 rule to carry the section `bgcolor` onto spacers already immunises us. Worth confirming the immunity | Low |
| **Yahoo/AOL may remove `role="presentation"`** | §9.5 and §8.8 both depend on it. If it is stripped, layout tables are announced as data tables to screen readers in those clients — an accessibility exposure with no visual symptom | Medium |
| **Yahoo Android strips `<style>` from the first `<head>`** | Extends the no-`<style>` population beyond Gmail GANGA. Our hybrid stacking already survives it, so this would *confirm* our architecture rather than challenge it | Low |
| **Gmail GANGA strips `<style>` permanently for non-Google accounts** | The single most load-bearing client fact in our entire architecture — §8.4 and §8.8 both rest on it. **We have never reproduced it ourselves.** Worth doing once, properly, and recording | **High** |

**The last row deserves emphasis.** Our most important architectural rule rests on a client behaviour we accept
on authority. It is almost certainly correct — Cerberus and the Email Guidelines source agree independently —
but "almost certainly correct on authority" is a weaker footing than our own evidence bar demands of a *new*
rule, and the asymmetry is worth closing.

---

## 4. Open decisions for the Owner

Questions this research surfaced that only the Owner can answer.

### 4.1 Is our degradation floor 280px or 320px?

From P-14. The Email Guidelines source states ~280px with no `<style>`; our geometry work assumes 320px.

**This is not a documentation tidy-up.** The Hero standard's feasibility gate is *if `W* > 320px` the
architecture is wrong rather than the code*, and its background-image variant is gated on `W* ≤ 320`. **Changing
the floor changes what passes that gate**, which is a substantive engineering decision with a direct consequence
for hero variant selection.

**Options:**

| Option | Consequence |
|---|---|
| **Keep 320px**, record 280px as an external reference point | No change to hero gating. Accepts that the narrowest clients may degrade below our documented floor |
| **Adopt 280px as the project floor** | Stricter and better-evidenced, but the hero gate must be re-derived at the new floor, and existing variant selections re-checked |
| **Two floors, stated separately** — a legibility floor at 280px and a geometry gate at 320px | Honest and precise; risks confusion unless documented very clearly |

**Recommendation: the third**, with both numbers named and their different jobs stated. They *are* different
constraints — one is "text remains readable", the other is "copy fits beside artwork at legible type" — and
conflating them into one number is what would create the confusion.

### 4.2 Can Gate G2 ever be closed, and if not, what replaces it?

**Gate G2's client matrix has never been run for any draft.** That is the largest standing gap in the QA system
and it is not a research gap — it is a capability gap. Every §9.1 client validation is currently reported as a
required manual pre-activation step, which is honest and is also a permanent open state.

**The question is not "which testing tool".** It is: **what is the minimum evidence set that would let a draft
be promoted with G2 genuinely closed rather than deferred?** Three sub-questions:

- Is a documented manual protocol on real devices/accounts sufficient, or is a testing platform required?
- Which clients are genuinely mandatory versus best-effort? §9.1 lists eight plus two optional
- **What is the promotion rule when G2 cannot be run at all?** Currently the answer is implicit; making it
  explicit would remove a recurring ambiguity at every approval

**This decision blocks §3.1 and §3.2 above**, both of which need real client access.

### 4.3 Should the assertion-set ECP be raised now, or after the current template programme concludes?

P-08/P-12 is the strongest ECP candidate from this research and it touches a governance document. Raising it
mid-programme means the current drafts are validated under a changing process; raising it after means the
current drafts do not benefit from it.

**Recommendation: after.** The current template work has an open composition question and several outstanding
data blockers; changing the QA process underneath it adds a variable to a programme that already has several.
The assertion set is most valuable applied uniformly from a clean baseline.

---

## 5. Questions this research could not answer

Recorded honestly rather than resolved speculatively.

| Question | Why it stayed open |
|---|---|
| **Does any framework solve the two-coordinate-system problem?** | None of the five addresses it. Raster artwork scales with the viewport; HTML type does not, because email has no viewport-relative units. **This appears to be genuinely unsolved industry-wide, not merely unsolved by us** — but five sources is not proof of absence |
| **Is the Klaviyo import rewrite documented anywhere?** | Our §8.2 rules were derived from defects, not documentation. Whether the rewrite's behaviour is specified publicly is unknown and worth finding out — it would convert several inferred rules into evidenced ones |
| **Is §8.7's tag-in-attribute prohibition Klaviyo-specific or general?** | Requires the cross-platform ESP comparison in §2. If general, the rule is stronger than currently stated and belongs framed as a template-engine rule rather than a Klaviyo one |
| **Do any of the frameworks have a component-lock equivalent?** | **None found.** Our `ARCHITECTURE LOCKED` state appears to be genuinely unusual. Whether that is because it is a good idea others have not had, or because it is unnecessary at their scale, is unanswered |
| **Would widow prevention (P-15) actually help in a reserved-height region?** | Marked **Low confidence / inference** in the catalogue. Needs an observed defect before it is worth anything |
| **How do others handle dark mode on background images?** | Four of five sources have no dark-mode position at all, and the fifth has an image swap. **Our §9.6 `background`-shorthand rule has no external counterpart** — so there is no one to check it against, which is unusual and slightly uncomfortable given how consequential the rule is |

---

## 6. Follow-ups from producing this folder

Housekeeping items created by this task and deliberately **not** performed, because the task was scoped to
research and documentation only and explicitly excluded modifying engineering standards or `CLAUDE.md`.

### 6.1 Discoverability pointers — recommended, not done

This folder is currently **undiscoverable from any existing document**. A future editor of the standards will
not know it exists. Four one-line additions would fix that:

| File | Suggested addition |
|---|---|
| Flow `CLAUDE.md` §2.5 (engineering layer) | One line pointing at `Shared/Framework-Research/` as **non-normative** research |
| Campaign `CLAUDE.md` §3.1 | The same line |
| `Shared/Engineering/README.md` §3 (Standards Register) | A row marked **NON-NORMATIVE**, kept visibly distinct from the standards it lists |
| Both `Shared/README.md` | A one-line folder description |

**All four must carry the non-normative marking.** A pointer that reads like a standards reference is worse than
no pointer — it invites exactly the contamination `README.md` §1 exists to prevent.

**Type:** T1 documentation change, both projects, mirrored per ADR-007. Requires Owner approval only because it
touches `CLAUDE.md`.

### 6.2 Should this folder be a versioned standard at all?

An open governance question. It carries a version number and an owner but is explicitly non-normative, which is
a status the governance layer does not currently define — `Engineering-Versioning.md` describes versioning for
standards, and `Engineering-Document-Relationships.md`'s L0–L9 hierarchy has no research tier.

**Recommendation: define a non-normative document class** rather than either promoting this folder or leaving its
status undefined. The three-tier model in `README.md` §2 is the substance of that definition; it just needs to
exist in the governance layer rather than only here. **Low priority, but it will recur** the next time a
non-normative document is created.

### 6.3 Re-verification cadence

Two sources will drift:

- **Email Coding Guidelines** is a living document with no version. **Re-verify before citing** — the fetch date
  in that file's header is the only currency marker it has.
- **Foundation for Emails** is mid-transition to Inky v2. Its maintenance status is the load-bearing finding in
  its file and it will change.

**Recommendation: no scheduled cadence.** Re-verify on use — when a source is about to be cited in an ECP — which
is cheaper than periodic sweeps and catches drift exactly when it matters.

---

## 7. Standing open items from the wider programme

Not produced by this research, recorded here because a future reader of this folder will want the surrounding
state. **These are unchanged by this task** — no HTML, template, component or standard was modified.

| Ref | Item | Status |
|---|---|---|
| `[P3]` | Checkout URL event property unconfirmed against the live payload | Open — blocks CTA destination verification |
| `[C1]` | Coupon code not confirmed created and active in the commerce platform | Open — §6.4 blocks activation |
| `[B1]` | Product grid blocked on the product source | Open — §6.5 stop-and-report |
| `[E1]` | Hero standard §15.5 proportion exception needs Owner sign-off or its own ECP | Open |
| — | ECP-001, ECP-002 pending | Open |
| — | **Gate G2 client matrix never run for any draft** | Open — see §4.2 |
| — | Current template composition direction | Open — under active review |

---

*Research notes, non-normative. Compiled 2026-07-29. Every item here is a task or a question. Cerberus remains
the only production rendering framework.*
