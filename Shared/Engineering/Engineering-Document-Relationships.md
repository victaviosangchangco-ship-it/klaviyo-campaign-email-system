# Engineering Document Relationships

| | |
|---|---|
| **Status** | ACTIVE |
| **Version** | 1.0.0 |
| **Owner** | Project Owner |
| **Applies to** | **Klaviyo Campaign Email System** · **Klaviyo Flow and Claude Code** |
| **Mirroring** | Byte-identical copies in both projects. Both canonical. Any change applies to both in the same edit. |
| **Scope** | Where knowledge lives, what each layer owns, precedence on conflict, and where a new fact goes. **Contains no normative build rules.** |

> **The question this document answers:** *"I have a fact, a rule, a value or a decision — which file does it
> go in, and which file wins if two disagree?"*
>
> Getting this wrong is how a value ends up in two files and starts drifting.

---

## 1. The hierarchy

```
                    ┌───────────────────────────────────────────┐
        L0          │  GOVERNANCE      Shared/Engineering/       │
   how standards    │  README · Governance · ADRs · Versioning   │
   are decided      │  Change-Management · Relationships · QA    │
                    └───────────────────┬───────────────────────┘
                                        │  governs how L1 changes
                                        ▼
                    ┌───────────────────────────────────────────┐
        L1          │  STANDARDS       Shared/*.md              │
   cross-project    │  STD-HERO — Email-Hero-Engineering-        │
   normative rules  │             Standard.md                   │
                    │  Shared/Frameworks/Cerberus/ (reference)  │
                    └───────────────────┬───────────────────────┘
                                        │  binds every project
                                        ▼
                    ┌───────────────────────────────────────────┐
        L2          │  OPERATING RULES   <project>/CLAUDE.md    │
   per-project      │  workflow · build standards · QA gates ·  │
   how work is done │  prohibitions · naming · read order       │
                    └───────────────────┬───────────────────────┘
                                        │
                                        ▼
                    ┌───────────────────────────────────────────┐
        L3          │  BRAND FACTS                              │
   what is true     │  Flow:      Brands/<CODE>/BrandConfig.md  │
   about the brand  │  Campaign:  03-Brands MD Files/<CODE>.md  │
                    └───────────────────┬───────────────────────┘
                                        ▼
                    ┌───────────────────────────────────────────┐
        L4          │  VISUAL SYSTEM                            │
   how the brand    │  Flow:      Brands/<CODE>/Design.md       │
   looks            │  Campaign:  06-Assets Library/*-Standards │
                    │             + Shared/design-tokens.md     │
                    └───────────────────┬───────────────────────┘
                                        ▼
                    ┌───────────────────────────────────────────┐
        L5          │  SEND / FLOW SPEC                         │
   this one email   │  Flow:      Flows/<FLOW>/Flow.md          │
                    │  Campaign:  the send's Brief/             │
                    └───────────────────┬───────────────────────┘
                                        ▼
                    ┌───────────────────────────────────────────┐
        L6          │  COMPONENTS                               │
   the building     │  Campaign: Components/*.html + Templates/  │
   blocks          │  Flow:     the brand's component set       │
                    │  Both:    Cerberus/Components/ (reference)│
                    └───────────────────┬───────────────────────┘
                                        ▼
                    ┌───────────────────────────────────────────┐
        L7          │  REFERENCE      <send|flow>/Reference/    │
   approved         │  screenshots · approved proposals         │
   direction        │  READ-ONLY. Never shipped.                │
                    └───────────────────┬───────────────────────┘
                                        ▼
                    ┌───────────────────────────────────────────┐
        L8          │  DRAFT          <send|flow>/Draft/-vN     │
   working HTML     │  every revision a NEW version, forever    │
                    └───────────────────┬───────────────────────┘
                                        │  explicit Owner approval
                                        │  of a NAMED version
                                        ▼
                    ┌───────────────────────────────────────────┐
        L9          │  OUTPUT         <send|flow>/Output/       │
   approved HTML    │  one un-versioned file. NOT approval      │
                    │  to send — see §5.3                       │
                    └───────────────────────────────────────────┘
```

**Assets sit beside the hierarchy, not inside it** — they are inputs at whatever level owns them:
shared/cross-brand → `Shared/Assets/` or root `Assets/` · brand-evergreen → the brand's `Assets/` ·
send-or-flow-specific artwork → that send's or flow's `Assets/`.

---

## 2. What each layer owns — and must never contain

| L | Layer | **Owns** | **Must never contain** |
|---|---|---|---|
| **L0** | Governance | Authority · roles · approval · ADRs · version semantics · change procedure · the QA process · this map · the standards register | **Any build rule.** Any brand value. Any Hero rule (STD-HERO owns those) |
| **L1** | Standards | Cross-project normative engineering rules. STD-HERO owns all Hero architecture, geometry, artwork acceptance and Hero locking. Cerberus owns rendering mechanisms and the client defect index | Brand values · product data · send or flow copy · per-project workflow |
| **L2** | Operating rules (`CLAUDE.md`) | How work is done **in this project**: read order · build standards · QA gates · prohibitions · naming · draft/output rules · pointers to L1 | Brand values · flow or campaign copy · per-project-instance notes · **restated L1 rules** |
| **L3** | Brand facts | Identity · legal entity · URLs (verified) · hosted asset URLs · footer content · phone/address · integration config · dynamic-variable names | The visual system · flow or campaign logic |
| **L4** | Visual system | Colour · type · spacing · component styling · layout measurements · mobile behaviour · dark mode · accessibility targets · brand-specific build measurements | Brand facts (it **references** them) · flow or campaign logic |
| **L5** | Send / flow spec | Objective · audience · trigger, timing, filters (flow) or schedule (campaign) · sequence · dynamic blocks · required assets · subject and preview · metrics | Brand values · the design system · global rules |
| **L6** | Components | Reusable markup, token-driven. Structure that renders from inline styles + attributes + tables alone | Brand values (injected as tokens) · send-specific copy |
| **L7** | Reference | Approved design direction: screenshots, approved proposals. **Read-only guidance** | Anything shipped. It **never** overrides verified data |
| **L8** | Draft | Every working revision, `-v1`, `-v2`, … monotonic, never overwritten or renumbered | — |
| **L9** | Output | The approved build, un-versioned, one file | Anything not explicitly approved by name |

---

## 3. Precedence — which wins on conflict

### 3.1 The order

```
L0 governance  ▶  L1 standards  ▶  L2 CLAUDE.md  ▶  L3 brand facts  ▶  L4 visual
system  ▶  L5 send/flow spec  ▶  L7 reference
```

**Higher wins.** With three absolute overrides:

1. **A project file always beats chat history, memory or inference** — including an assistant's own earlier
   statements in the same session. If a chat and a file disagree, **the file wins.**
2. **Verified data always beats reference material.** L7 `Reference/` is *visual direction only*. It never
   overrides a verified price, URL, stock status or brand rule.
3. **A stated prohibition beats a reference implementation.** Where a component file contradicts a standard,
   **the standard governs and the component is stale.** One currently is
   (`Components/hero-image.html`, reflecting the superseded baked-copy Hero pattern) and is flagged in place —
   because a stale component is dangerous precisely because it looks authoritative.

### 3.2 Same-layer conflicts

Two documents at the same layer disagreeing means an **ownership violation** (§2) — the fact has two homes.
Resolve by deciding which document owns it, moving the fact there, and leaving a **pointer** in the other.
Do not "sync" the two copies; that leaves the defect in place.

### 3.3 When L1 and L2 appear to conflict

Almost always the L2 text is a stale copy of a rule that moved to L1. **The standard governs; the `CLAUDE.md`
text is deleted and replaced by a pointer.** This is a T1 or T2 change if the rules genuinely match, and T3 if
the L2 text imposed something the standard does not.

### 3.4 Deliberate divergence from a vendored reference

Where our standards deliberately differ from Cerberus, the divergence is **recorded with its reason** in
`Cerberus-Best-Practices.md` §5. **A recorded divergence is not a defect and must not be "corrected" toward
Cerberus.** If you find yourself about to align a template to Cerberus, check §5 first.

---

## 4. Where does this fact go?

A decision tree. Follow it before creating or editing anything.

```
Is it a DECISION and its reasoning ("why do we do it this way")?
   └─▶ Architecture-Decision-Records.md          (L0)   — and the rule itself goes below

Is it about WHO may change a standard, or HOW a change is approved/versioned?
   └─▶ Engineering-Governance.md / -Change-Management.md / -Versioning.md   (L0)

Is it a CHECK that must run before something ships?
   ├─ Hero-specific?          ─▶ STD-HERO §11 / §12                        (L1)
   └─ anything else?          ─▶ Engineering-QA-Process.md                 (L0)

Is it a build rule that is true for EVERY brand and BOTH projects?
   ├─ about a Hero?           ─▶ STD-HERO                                  (L1)
   ├─ a rendering mechanism?  ─▶ cite Cerberus; do not restate it          (L1)
   └─ otherwise?              ─▶ the project's CLAUDE.md — and consider
                                 whether it should become a standard        (L2)

Is it a rule about HOW WORK IS DONE in one project (workflow, naming, gates)?
   └─▶ that project's CLAUDE.md                                            (L2)

Is it a FACT about a brand (a URL, an entity, an asset URL, a phone number)?
   └─▶ that brand's brand-facts document                                   (L3)

Is it about how a brand LOOKS (colour, type, spacing, a measurement)?
   └─▶ that brand's visual-system document                                 (L4)

Is it specific to ONE campaign or ONE flow?
   └─▶ that send's brief / that flow's spec                                (L5)

Is it reusable MARKUP?
   └─▶ the component set — and propagate the fix everywhere it applies     (L6)

Is it a screenshot or an approved design proposal?
   └─▶ that send's or flow's Reference/ — read-only, never shipped         (L7)

Is it HTML for one email?
   └─▶ Draft/-vN  (new version, always)                                    (L8)
```

### 4.1 The two questions to ask first

1. **"Could a reader get this by following one link?"** → then write the link, not the content.
2. **"Is this true for every brand and every send?"** → **Yes** = L0/L1/L2. **No** = L3/L4/L5.

### 4.2 Promotion — when a fact should move up

A value discovered while building **must be promoted in the same change**, never left only in a template:

| Discovered | Promote to |
|---|---|
| A reusable asset URL, colour, size or treatment | the brand's facts or visual-system document |
| A rendering rule that will apply to the next build too | that project's `CLAUDE.md` |
| A rule true in **both** projects | a standard (L1) — via `Engineering-Change-Management.md` |
| A decision with reasoning worth preserving | an ADR |

**Leaving it in the HTML guarantees it drifts**, because the next template will be built without it.

---

## 5. Flow through the layers

### 5.1 Building an email

```
L2 read the project's CLAUDE.md
      ▼
L3 brand facts  ─▶  L4 visual system  ─▶  L5 the send/flow spec
      ▼
L1 the standards that apply (STD-HERO BEFORE any Hero work — it is a gate, not a reference)
      ▼
L7 Reference/  +  Assets/           (direction and inputs)
      ▼
L6 assemble from Components         (new artwork + new copy, not new layout code)
      ▼
L0 run Engineering-QA-Process.md gates  +  STD-HERO §11 if there is a Hero
      ▼
L8 Draft/-vN
      ▼
     review ──▶ feedback ──▶ Draft/-v(N+1)     (loop; never edit a version in place)
      ▼
   explicit Owner approval of a NAMED version
      ▼
L9 Output/
```

### 5.2 Feedback never edits a version in place

Every revision is a **new** draft version. The prior versions are the comparison and rollback trail; a reader
must be able to diff v3 against v2. Version numbers only ever increase.

### 5.3 `Output/` is not permission to send

Presence in `Output/` means *approved as a build*. **It does not mean send-ready.** Unresolved blockers — dead
links, missing assets, unconfirmed data bindings, a client matrix not yet run — are reported explicitly and
block activation. See `Engineering-QA-Process.md` §2 (Gate G3) and ADR-008.

---

## 6. Cross-project mapping

The two projects use different filenames for the same layers. The **layers are identical**; only the paths
differ.

| L | **Klaviyo Flow and Claude Code** | **Klaviyo Campaign Email System** |
|---|---|---|
| L0 | `Shared/Engineering/` | `Shared/Engineering/` *(mirrored, identical)* |
| L1 | `Shared/Email-Hero-Engineering-Standard.md` · `Shared/Frameworks/Cerberus/` | *(identical, mirrored)* |
| L2 | `CLAUDE.md` | `CLAUDE.md` |
| L3 | `Brands/<CODE>/BrandConfig.md` | `03-Brands MD Files/<CODE>.md` |
| L4 | `Brands/<CODE>/Design.md` | `Shared/design-tokens.md` · `Shared/Fonts/font-stacks.md` — the Campaign L4 of record. ⚠️ The six `06-Assets Library/*-Standards.md` files are **UNPOPULATED placeholders** and are **not** a visual-system source. |
| L5 | `Brands/<CODE>/Flows/<FLOW>/Flow.md` | the send's `Brief/` · `01-Weekly` / `02-Monthly` overviews |
| L6 | the brand's component set | `Components/*.html` · `Templates/` · `Shared/Snippets/` |
| L7 | `Flows/<FLOW>/Reference/` | the send's `References/` |
| L8 | `Flows/<FLOW>/Draft/` | the send's `Draft/` |
| L9 | `Flows/<FLOW>/Output/` | the send's `Output/` |
| — | *(no equivalent)* | `09-Architecture Decisions/Decision-Log.md` — **business** decisions, distinct from ADRs (`README.md` §8) |

**L0 and L1 are shared and mirrored. L2 downward is project-specific.** That boundary is the whole design: the
engineering layer is common, the operating layer is not.

**`BrandConfig.md` and `Design.md` are Flow-project documents only.** They must not be created in the Campaign
project: duplicating L3/L4 across repositories breaches §7's first anti-pattern and creates the drift ADR-007
exists to prevent. Each project reads its own row above.

**L5 carries the design target.** In both projects the L5 spec holds a **Design Intent** block (Hero role,
Hero pattern, design language, dominance, emotional objective, CTA strength, plus a `Design status` of
`NONE`/`PROPOSED`/`LOCKED`/`SUPERSEDED`) and a **Reference Register** assigning each L7 file a fidelity mode.
The mechanism is owned by STD-CREATIVE §4.0; only the path differs — Flow `Flow.md`, Campaign the send's
`Brief/`. This is why an L7 reference tagged `TARGET` does not alter the §3.1 precedence order: the *approved
direction* is recorded at L5, and L7 remains visual input to it.

---

## 7. Anti-patterns

| Anti-pattern | Consequence |
|---|---|
| A hex, measurement or URL in two documents | They drift, and nothing indicates which is current |
| A brand value written into a standard | The standard stops being cross-brand and starts blocking new brands |
| A global rule written into one send's brief | It is lost the moment that send is archived |
| A Hero rule restated in `CLAUDE.md` | Two Hero specifications; the stale one gets followed |
| Trusting a component file over a standard | A stale component looks authoritative — it is the more dangerous of the two |
| Treating `Reference/` as normative | Reference is visual direction; it never overrides verified data |
| Editing a draft version in place | Destroys the diff and the rollback path |
| Renumbering sections other documents cite | Silently breaks every cross-reference. Append or suffix instead |
| Reading governance docs to build a template | They contain no build rules and will not help |

---

## 8. Governance of this document

Changing §1 (the hierarchy), §2 (ownership) or §3.1 (precedence) is a **T4** change — it redefines where every
other fact lives. Everything else follows `Engineering-Governance.md` §3.1.

---

## 9. Change log

| Version | Date | Tier | Change | Mirrored |
|---|---|---|---|---|
| 1.0.0 | 2026-07-29 | — | Established. Defines the L0–L9 hierarchy, per-layer ownership and exclusions, precedence with three absolute overrides, the "where does this fact go?" decision tree, promotion rules, and the cross-project layer mapping. | ✔ |
| 1.0.1 | 2026-07-30 | T1 | **§6 corrected**: the Campaign L4 row now names `Shared/design-tokens.md` + `Shared/Fonts/font-stacks.md` as the visual system of record and flags the six `06-Assets Library/*-Standards.md` files as UNPOPULATED placeholders — the previous row implied they were a source. Added two notes below §6: `BrandConfig.md`/`Design.md` are Flow-only and must not be duplicated into Campaign, and L5 carries the Design Intent block and Reference Register. **§1, §2 and §3.1 are unchanged** — no precedence or ownership change, so this is not a T4. | ✔ |

---

*Ownership matrix also summarised in `Engineering-Governance.md` §6.2 — that section is the authority for
document ownership; this document is the authority for the layer model and precedence.*
