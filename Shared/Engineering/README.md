# Shared/Engineering — the engineering foundation

| | |
|---|---|
| **Status** | ACTIVE |
| **Version** | 1.0.0 |
| **Owner** | Project Owner |
| **Applies to** | **Klaviyo Campaign Email System** · **Klaviyo Flow and Claude Code** |
| **Mirroring** | Byte-identical copies in both projects. Both canonical. See §6. |
| **Established** | 2026-07-29 |

---

## 1. What this folder is

`Shared/Engineering/` is the **governance layer** over the engineering standards. It answers the four
questions that a documentation repository cannot answer on its own:

1. **Why** was an engineering decision made? → `Architecture-Decision-Records.md`
2. **Where** do engineering rules live, and what owns what? → `Engineering-Document-Relationships.md`
3. **How** does a standard change, and who may change it? → `Engineering-Governance.md`,
   `Engineering-Change-Management.md`, `Engineering-Versioning.md`
4. **How** is conformance proven before anything ships? → `Engineering-QA-Process.md`

**This folder holds no build rules.** It does not tell you how to write a table, size a button or export
an image. Those are in the **standards** (§3) and in each project's `CLAUDE.md`. This folder tells you how
the standards are governed.

### 1.1 Why it exists — the failure it is designed to prevent

Both projects accumulated real engineering knowledge the expensive way, and that knowledge kept getting
re-lost:

| What happened | What it cost | What was actually missing |
|---|---|---|
| 16 drafts spent tuning a hero crop that should never have existed | ~16 revisions | A **geometry gate before artwork was commissioned** |
| A one-word CSS bug (`background` shorthand deleting a background image in dark mode) misdiagnosed as a layout fault | 4 drafts | A **symptom → cause map** and a named regression check |
| `{{ manage_preferences_url }}` — plausible, undocumented, invalid, silently rendering an empty link | 7 template revisions and 40 markdown files | A rule that **tag names are verified against the provider reference, never inferred** |
| 3 of 4 supplied trust icons unusable (watermarks, baked transparency checkerboard) | rework + a permanent `[TEMP]` flag | An **asset acceptance gate** |
| A stated accessibility figure (`8.10:1`) wrong for months; actual `6.86:1` | credibility | A rule that **published figures are computed, not carried forward** |
| A "permanent" rule (baked-in hero copy) superseded once the geometry was understood | a supersession and a brief change | A **decision record** capturing the *reason*, so the reversal was traceable rather than surprising |

Every one of those is a **governance** gap, not a knowledge gap. The knowledge existed; nothing forced it
to be applied at the moment it mattered. That is what this folder fixes.

### 1.2 The one-line test of whether this folder is working

> **A new contributor — human or AI — should be able to build a conforming template, and should be
> physically unable to repeat a documented past mistake, without reading a chat history.**

---

## 2. Read order

Read by **what you are about to do**, not front to back.

### 2.1 I am new to the project (human or AI, first session)

```
1  this README                                   ← orientation, the register, the philosophy
2  Engineering-Document-Relationships.md         ← where everything lives and what owns what
3  <project>/CLAUDE.md                           ← the operating rules for this project
4  Architecture-Decision-Records.md              ← why things are the way they are
5  Engineering-QA-Process.md                     ← what you will be held to
```

### 2.2 I am about to build or edit a template

```
0  Shared/Creative-Workflow-Standard.md          ← FIRST for any NEW design. Fixes the order:
                                                   Creative → Marketing → Engineering → Implementation
                                                   → Validation → Output. Engineering is never the
                                                   first design activity. Skip to 1 for a small edit.
0b Shared/Email-Design-System/                   ← the visual language library, used inside that
                                                   creative phase. Start at its README, then
                                                   Design-Decision-Matrix.md. Supplies the WHAT
                                                   (language · Hero pattern · sections · CTA);
                                                   item 0 supplies the WHEN. No HTML, CSS or values.
1  <project>/CLAUDE.md                           ← always first among the operating rules
2  the brand layer, then the send/flow spec      ← per that project's read order
3  the STANDARDS that apply (§3 register)        ← e.g. the Hero standard, BEFORE any Hero work
4  Shared/Frameworks/Cerberus/FRAMEWORK-README.md + the matching Cerberus doc
5  Engineering-QA-Process.md                     ← the gates you must pass
```

**Items 1–5 are unchanged.** STD-CREATIVE adds a creative phase in front of them and changes nothing
about what they require — see its §10.1 and §10.2. STD-DESIGN supplies the vocabulary used *inside* that
phase and likewise changes no build rule.

**Do not read the governance documents to build a template.** They will not help you and they are not a
substitute for the standards.

### 2.3 I want to change an engineering standard

```
1  Engineering-Governance.md                     ← may you? on what authority?
2  Engineering-Change-Management.md              ← the proposal → release path, and the evidence required
3  Engineering-Versioning.md                     ← what version bump this is, and how to deprecate
4  Architecture-Decision-Records.md              ← is there already an ADR that decided this?
5  the standard itself
```

### 2.4 Something rendered wrong and I want to know why

```
1  the relevant standard's symptom → cause map (the Hero standard has one)
2  Shared/Frameworks/Cerberus/Cerberus-Compatibility.md   ← client defect index
3  Architecture-Decision-Records.md              ← has this class of failure already been diagnosed?
4  Engineering-QA-Process.md § regression checks
```

**Check 1–3 before proposing a fix.** Most "new" rendering faults in this repository's history were
already-diagnosed classes being re-encountered.

---

## 3. The Standards Register

**The authoritative index of every engineering standard.** A standard not listed here does not exist as a
standard.

| ID | Standard | Path | Version | Status | Governs |
|---|---|---|---|---|---|
| **STD-CREATIVE** | Creative Workflow Standard | `Shared/Creative-Workflow-Standard.md` | 1.1.0 | **ACTIVE** | The **order of execution** for all new email design in both projects — Creative → Marketing → Engineering → Implementation → Validation → Output — plus the Creative Exploration obligation, the reference-analysis method **and its three fidelity modes (§4.0)**, the Marketing Review gate and the Creative Lock. **Holds no build rules.** First in sequence, not first in authority. |
| **STD-DESIGN** | Email Design System | `Shared/Email-Design-System/` | 1.0.0 | **ACTIVE** | The **visual language library** used by every template in both projects: 14 design languages, 12 Hero patterns mapped to STD-HERO's four roles, 16 section patterns, per-flow recommendations, the visual-hierarchy principles and the Design Decision Matrix. **Holds no HTML, no CSS, no brand values and no measurements** — relationships and decisions only. Supplies the *what*; STD-CREATIVE supplies the *when*. Last in authority. |
| **STD-HERO** | Email Hero Engineering Standard | `Shared/Email-Hero-Engineering-Standard.md` | 1.1.0 | **ACTIVE** | All Hero architecture, geometry, artwork acceptance, and the Hero locking policy, in both projects |
| **REF-CERB** | Cerberus Email Framework (vendored `fa6de2e`) + 5 analysis docs + 13 reference components | `Shared/Frameworks/Cerberus/` | upstream `fa6de2e` (vendored 2026-07-28) | **ACTIVE — reference** | The external rendering authority we check our markup against. Not a runtime dependency. **Never edit an upstream file.** |
| **OPS-CAMPAIGN** | Campaign operating rules | `<Campaign>/CLAUDE.md` | — | **ACTIVE** | Campaign build standards, QA gates, workflow |
| **OPS-FLOW** | Flow operating rules | `<Flow>/CLAUDE.md` | — | **ACTIVE** | Flow build standards, QA gates, workflow |

**Register maintenance:** adding, versioning, superseding or retiring a row is an
`Engineering-Change-Management.md` change and requires Owner approval. The register is updated **in the
same edit** as the standard it describes.

### 3.1 Why the Hero standard is not inside this folder

`Shared/Email-Hero-Engineering-Standard.md` was established and approved at its current path, and four
documents in each project already reference it there. **Moving it would invalidate those references and the
mirror hashes for no engineering gain.**

The boundary is therefore:

- **`Shared/`** holds **standards** — normative rules. Most are build rules (STD-HERO); one is a rule of
  **sequence** (STD-CREATIVE, `Shared/Creative-Workflow-Standard.md`), which holds no build rules at all
  but is normative about the order in which the others are applied.
- **`Shared/Engineering/`** holds **governance** — how standards are decided, versioned, changed and proven.

The register in §3 is what makes standards discoverable regardless of path. *(If standards are ever
relocated under `Shared/Engineering/Standards/`, that is a T3 change under
`Engineering-Change-Management.md` and must update every referencing document in the same release.)*

---

## 4. Document relationships

Full hierarchy, per-layer responsibilities, precedence order and a "where does this fact go?" decision tree
are in **`Engineering-Document-Relationships.md`**. Summary:

```
        GOVERNANCE          Shared/Engineering/         ← how standards are decided and changed
             │                                             (this folder — no build rules)
             ▼
        STANDARDS           Shared/*.md, Shared/Frameworks/   ← normative, cross-project build rules
             │                                                  incl. STD-HERO and Cerberus
             ▼
        OPERATING RULES     <project>/CLAUDE.md         ← per-project workflow, QA gates, prohibitions
             │
             ▼
        BRAND LAYER         brand facts, then visual system
             │
             ▼
        SEND / FLOW SPEC    the individual campaign or flow
             │
             ▼
        COMPONENTS ──▶ REFERENCE ──▶ DRAFT ──▶ OUTPUT
```

**Two standards sit outside that authority stack because they govern *sequence* and *vocabulary* rather
than correctness.** They come first in the order of work and last in authority:

```
   BUSINESS GOAL ─▶ STD-CREATIVE ─▶ STD-DESIGN ─▶ STD-HERO ─▶ Framework Research
                     (when)          (what)        (how, Hero)   (reference)
                         │
                         ▼
                    CLAUDE.md ─▶ Cerberus ─▶ HTML ─▶ QA ─▶ Output
                    (engineering)  (rendering)
```

**Precedence on conflict: higher wins.** A standard beats a brand doc; `CLAUDE.md` beats a send brief; a
project file always beats chat history or inference.

---

## 5. Engineering philosophy

Eight principles. Each is here because violating it has already cost this project real rework.

### 5.1 Root cause before symptom, always

Never ship a symptomatic fix. If a fix changes a parameter without naming the mechanism, it is a guess.
**The tell:** a fix that works on one client and breaks another means you are tuning the wrong variable.
*(Origin: 16 drafts tuning a crop; the crop was the bug, not its value.)*

### 5.2 A rule earns its place by having cost something

Standards are written from **reproduced defects**, not from best-practice articles. Every normative rule
should be traceable to a client, a template and a cost. Rules without provenance get "cleaned up" by the
next contributor.

### 5.3 Structure carries the layout; CSS refines it

Every layout must be correct from table markup, HTML attributes and inline styles **alone**, before a single
`<head>` rule applies. The Gmail app strips `<head>` CSS entirely for non-Google accounts. A media query may
adjust type, release a reserved height or tune a tap target; it may never be what makes a layout stack,
contain or fit.

### 5.4 Degradation is acceptable; disappearance is not

A square button in Outlook is fine. A missing button is a hard fail. Design for the floor, enhance upward,
and **state the degradation** rather than hiding it.

### 5.5 Compute, do not carry forward

Contrast ratios, aspect ratios, critical widths, column arithmetic: **compute them and show the working.**
A figure copied from another document is unverified. *(Origin: `8.10:1` vs the actual `6.86:1`.)*

### 5.6 Every value has exactly one home

If a value appears in two files, one of them is already wrong — you just do not know which yet. Cross-
reference; never duplicate. This applies to the governance layer too: **this folder must not restate a
standard.**

### 5.7 A preview is never proof

Desktop and browser renders miss entire defect classes. **"Engineering complete" and "production validated"
are separate states and are recorded separately** (ADR-008). Never let the first imply the second, and never
report a client as verified when it was not.

### 5.8 Iterating a finished component is churn, not improvement

Once engineering is settled, a component is **locked** and may change for a bounded set of reasons only.
Churn is how a solved problem gets re-broken. *(Origin: the Hero locking policy, STD-HERO §12.5.)*

---

## 6. Single source of truth, and the mirroring rule

### 6.1 The rule

**Engineering knowledge exists once.** Every document in this folder must reference other documents rather
than restate them. Specifically:

- **Never restate a Hero rule.** STD-HERO owns all of them. Cite the section.
- **Never restate a Cerberus mechanism.** Cite `Cerberus-Techniques.md` §n.
- **Never restate a brand value.** Cite the brand document.
- If two documents must both mention something, one **owns** it and the other **links** to it.

### 6.2 How to detect a duplication

Before adding a paragraph to any engineering document, ask: *"Could a reader get this from an existing
document by following one link?"* If yes, write the link instead.

**Duplication smells:** a hex value in two files · a pixel measurement in two files · the same rationale
paragraph in two files · a checklist item that also appears in a standard's checklist.

### 6.3 Mirroring — the two-copy contract

Both projects hold **byte-identical** copies of every file in this folder and of STD-HERO. Both copies are
canonical; neither is a shadow.

- **Any change must be applied to both copies in the same edit.** A one-sided edit silently forks the
  standard, which is worse than having no standard.
- **Verify by hash after every change:**

```
sha256sum "…/Klaviyo Campaign Email System/Shared/Engineering/<file>" \
          "…/Klaviyo Flow and Claude Code/Shared/Engineering/<file>"
```

- The mirror check is a **release step**, not an afterthought — see `Engineering-Change-Management.md` §7.
- Rationale for mirroring rather than a shared dependency: **ADR-007.**

### 6.4 What belongs in this folder, and what does not

| Belongs here | Does **not** belong here |
|---|---|
| Governance, roles, approval authority | Build rules of any kind |
| Architecture decision records | Brand values, colours, measurements |
| Versioning and deprecation policy | Campaign or flow copy |
| Change-management process | Template HTML or components |
| The QA **process** and its gates | The Hero checklist (STD-HERO §11 owns it) |
| The standards register | The standards themselves |

---

## 7. Folder contents

| File | Answers |
|---|---|
| `README.md` | What this folder is · read order · the standards register · philosophy · SSOT rules |
| `Engineering-Governance.md` | Who may change what, on what authority, and with what review |
| `Architecture-Decision-Records.md` | Why each major engineering decision was made (ADR-001 … ADR-008) |
| `Engineering-Versioning.md` | Version numbering · revisions · deprecation · rollback |
| `Engineering-Change-Management.md` | Proposal → review → approval → implementation → validation → release → rollback |
| `Engineering-Document-Relationships.md` | The document hierarchy, per-layer responsibility, precedence, and where a new fact goes |
| `Engineering-QA-Process.md` | The permanent QA workflow and its four gates |

---

## 8. Relationship to the Campaign project's business Decision Log

The Campaign project holds `09-Architecture Decisions/Decision-Log.md` (entries `D-01…`). **It is not
superseded and must not be merged into the ADR index.** The boundary:

| | Records | Example |
|---|---|---|
| **Decision Log (`D-##`)** — Campaign only | **Business and operating** decisions: policy, ownership, commercial rules, workflow choices | *"SC coupons are fixed-dollar by default"* · *"reviewer ≠ author"* |
| **ADR index (`ADR-###`)** — both projects | **Engineering** decisions: architecture, mechanism, client behaviour, standard selection | *"HTML owns the text"* · *"Cerberus hybrid at 600px, not 680px"* |

Where a business decision has an engineering consequence, the two cross-reference. Neither restates the
other.

---

*Established 2026-07-29 from the completed v1–v26 Hero engineering process. This folder is governance only;
the normative build rules live in the standards listed in §3.*
