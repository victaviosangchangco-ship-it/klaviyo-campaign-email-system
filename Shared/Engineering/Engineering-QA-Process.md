# Engineering QA Process

| | |
|---|---|
| **Status** | ACTIVE |
| **Version** | 1.0.0 |
| **Owner** | Project Owner |
| **Applies to** | **Klaviyo Campaign Email System** · **Klaviyo Flows Automation System** |
| **Mirroring** | Byte-identical copies in both projects. Both canonical. Any change applies to both in the same edit. |
| **Scope** | The permanent QA **process** and its four gates. Individual build rules stay in the standards and each `CLAUDE.md`; the Hero checklist stays in STD-HERO §11. |

> **QA is part of generation, not a step after it.** A build that has not passed its gates is not a build; it
> is a candidate.
>
> **This document owns the process.** It does **not** restate the Hero checklist (STD-HERO §11), the Cerberus
> pre-Output checklist (`Cerberus-Best-Practices.md` §7), or either project's own QA sections. It says **when**
> each runs, **who** runs it, and **what counts as evidence**.

---

## 1. The three rules that make the rest work

### 1.1 A preview is never proof

Desktop and browser renders miss entire defect classes — link containment after an ESP import, equal-height
regions in Outlook, Gmail-mobile gutters and background drops, Apple-Mail-iOS image collapse. **Apple Mail is
the most capable client and therefore the most misleading render to approve on.**

### 1.2 Engineering complete ≠ production validated

Two separate states, recorded separately, never one implying the other (**ADR-008**):

| State | Means | Established by |
|---|---|---|
| **Engineering complete** | The markup is right | Source analysis · computed values · verified URLs · automated scans · balanced markup |
| **Production validated** | It renders | The client matrix, incl. dark mode, images-off, and clickability **after a real ESP import** |

### 1.3 Never record an unverified check as passed

Anything not verifiable in the working environment is reported as a **required manual pre-activation step**,
never as a pass. Recording an unknown as an assurance is the most serious process failure available here,
because every downstream decision then rests on it.

**Three permitted verdicts per check:** **PASS** (with evidence) · **FAIL** (with the mechanism) ·
**UNVERIFIED IN THIS ENVIRONMENT** (with what would verify it). There is no fourth.

---

## 2. The four gates

```
   G0                G1                 G2                  G3
BEFORE            BEFORE             BEFORE              BEFORE
IMPLEMENTATION    DRAFT              OUTPUT              PRODUCTION
─────────────     ─────────────      ─────────────       ─────────────
inputs are        the build is       it renders          it is safe and
buildable         internally         everywhere it       lawful to send
                  correct            must
                                                          ↑
 no code yet      automated +        client matrix       Owner approval
                  source analysis    + ESP import        + no open blockers
```

| Gate | Runs when | Run by | Blocks |
|---|---|---|---|
| **G0** | Before any markup exists | Implementer | Starting the build |
| **G1** | Before writing `Draft/-vN` | Implementer | Presenting the draft |
| **G2** | Before promoting to `Output/` | **Reviewer ≠ Implementer** | Promotion |
| **G3** | Before a send or flow activation | Reviewer + **Owner** | Sending / activating |

---

## 3. G0 — Before implementation

**Purpose: prove the inputs are buildable.** Every failure caught here costs minutes; the same failure caught
at G2 costs a rebuild.

### 3.1 Inputs

- ☐ Read order followed for this project: `CLAUDE.md` → brand facts → visual system → send/flow spec
- ☐ Applicable **standards** identified and read — **STD-HERO before any Hero work**
- ☐ The relevant Cerberus document read for the mechanisms in play

### 3.2 Specification complete

- ☐ Brand · send or flow · position in sequence · customer state · **single** intended action
- ☐ Trigger and delay known (flow), or schedule and audience known (campaign) — so the available data is known
- ☐ Copy makes sense **at the actual send delay**
- ☐ Every value needed either exists in a project file or is a **flagged placeholder** — nothing inferred

### 3.3 Data and destinations

- ☐ Dynamic bindings mapped to the correct namespace for the trigger type; **property names verified against
  the payload or a provider reference, never inferred from a pattern**
- ☐ Every dynamic value has a **fallback**
- ☐ Every destination URL verified **HTTP 200**, no redirects
- ☐ Coupon: confirmed to exist and be **active**; static-vs-dynamic decided
- ☐ Product data taken from the approved source and verified on its **own product page**, not a listing

### 3.4 Assets

- ☐ Every image: HTTPS, HTTP 200, `image/*` content-type, no redirects, **not SVG** (check the *content-type*,
  not the extension)
- ☐ Sized ~2× display size and compressed
- ☐ **Asset quality gate:** no watermark · no baked transparency checkerboard · correct aspect · not corrupt ·
  licensed. *(Three of four supplied icons failed this once; there was no gate.)*
- ☐ **Hero artwork: the Artwork Contract is satisfied — STD-HERO §4 — and acceptance is recorded**

### 3.5 Geometry (Hero present)

- ☐ **STD-HERO's geometry gate computed** — ratio, band height, mobile reserved height, CTA fold offset, and
  `W*` if an overlay is proposed. **`W* > 320px` refuses the architecture here, before artwork is
  commissioned.** This gate exists because ~29 drafts were spent discovering after the fact what it decides in
  advance.

### 3.6 G0 blockers

**Stop and report — never fabricate to fill a slot:** missing products, prices, live URLs, coupon codes or
hosted assets. A defective supplied asset is **substituted with a documented stand-in, never dropped along with
the design element that used it**, and the swap must later be URL-only.

---

## 4. G1 — Before Draft

**Purpose: prove the build is internally correct.** Automated scans first — they are cheap, exhaustive and
cannot be forgotten.

### 4.1 Automated scans (run on the built file; all must be zero unless noted)

| Scan | Expected | Catches |
|---|---|---|
| `table` / `tr` / `td` / `a` / `div` open vs close counts | **equal** | Unbalanced markup |
| Anchor nested inside an anchor | 0 | Malformed anchors |
| `<` inside an attribute list | 0 | A template tag emitting HTML inside an attribute |
| Odd `"` count within any tag | 0 | Unclosed attribute |
| `href=""` or `href="#"` | 0 | Dead links |
| `background-size:\s*cover` | **0** | The prohibited Hero crop class |
| Hero background/artwork references | **exactly 1** | Duplicate or mobile-only artwork |
| `background:\s*#[0-9A-Fa-f]{6}\s*!important` inside a dark-mode block | **0** | The shorthand that **deletes background images** in dark mode |
| `display:\s*(flex|grid)` · `position:\s*absolute` · `table-layout:\s*fixed` | 0 | Unsupported layout mechanisms |
| 3-digit hex · `rgb(` | 0 | Fails in some clients and in `bgcolor` |
| `<td[^>]*>\s*</td>` · `<tr[^>]*>\s*</tr>` | 0 | Ghost cells |
| Whitespace-only anchors | 0 | Gmail phantom nodes |
| Bare un-defaulted personalisation tokens | 0 | "Hi ," in production |
| Literal template-tag strings **inside HTML comments** | 0 | Engines expand tags inside comments; one that emits an anchor can break the document |
| Built file size | **well under ~102 KB** | Gmail clipping the footer |

**Prefer adding a scan over adding a paragraph.** Nearly every expensive defect in this project's history was
grep-detectable: an anchor imbalance, a `cover` count, a dark-mode shorthand, a tag inside an attribute.

### 4.2 Source analysis

- ☐ Layout correct from **tables + HTML attributes + inline styles alone** — re-check with `<head>` CSS
  mentally removed
- ☐ Container fluid, MSO ghost table present, no bare fixed width
- ☐ Every coloured section: `bgcolor` on the `<table>` **and** its content `<td>`, identical hex
- ☐ Multi-column rows: hybrid arithmetic reconciles; `font-size:0` on the parent; font size restated per column
- ☐ No fixed-height cell also carrying padding
- ☐ Every image: explicit `width`/`height` attributes, `border="0"`, `display:block`, meaningful `alt`
  (`alt=""` only if decorative)
- ☐ No block element inside an `<a>`; no `display:block` on an image-wrapping anchor
- ☐ Spacers and dividers are painted sized cells with `aria-hidden`
- ☐ **Hero present → STD-HERO §11 in full**

### 4.3 Computed values

- ☐ Every contrast pair **computed** (not carried forward) against WCAG AA
- ☐ Aspect ratios, band heights, column widths and button widths computed and shown
- ☐ Button label width checked against its container **before** building

### 4.4 Content and compliance

- ☐ Subject line **and** preview text supplied; preview extends the subject rather than repeating it
- ☐ Evergreen: no dated, seasonal or expiring claims unless the send is date-triggered
- ☐ One primary CTA; incentive paired with it
- ☐ Compliance block present, using **URL-returning** tags inside `href` only
- ☐ Sender identity and postal address present
- ☐ Preheader present and minimal

---

## 5. G2 — Before Output

**Purpose: prove it renders where it must.** **The Reviewer must not be the Implementer.**

### 5.1 Client matrix

```
☐ Gmail Web            ☐ Apple Mail desktop      ☐ Outlook desktop
☐ Gmail Android        ☐ Apple Mail iOS          ☐ Outlook mobile
☐ Gmail iOS            ☐ Apple Mail iPad         ☐ Samsung Mail
☐ Yahoo (where available)
☐ Gmail app on a NON-GOOGLE account          ← the <head>-CSS-stripped path
☐ Dark mode: Apple Mail · iOS Mail · Outlook.com
☐ Images-disabled state
☐ 320 / 375 / 414 / 600px widths
```

**The non-Google Gmail row is not optional.** `<head>` CSS stripping makes it a materially different renderer,
and it is the population that receives the *unenhanced* build.

### 5.2 ESP checks (Klaviyo)

Run **after a real import**, because the ESP rewrites the HTML.

- ☐ **Clickability re-verified after import.** Klaviyo rewrites `href`s; a link that works in source can be
  detached on import — specifically where an anchor wrapped a block element
- ☐ Every clickable element navigates to the **correct live** destination: hero, cards (image, title, price),
  CTAs, category tiles, logo, offer bars, footer nav
- ☐ **No unrendered template syntax** visible anywhere in a real preview
- ☐ **Compliance links render as link text only** — no raw attribute fragments on screen — and every one
  navigates
- ☐ **Only URL-returning compliance tags inside `href`.** The anchor-emitting forms are valid **only**
  standalone in body content
- ☐ **Every tag name verified against the provider reference.** An undefined variable fails **silently** as an
  empty string, so a plausible-but-invalid name produces a dead link that looks correct in preview *and* in
  source
- ☐ Dynamic-data states previewed: **no first name** · **empty feed** (static fallback renders) · **empty or
  single-item loop** · **missing optional properties** · **long values** · **coupon absent**
- ☐ Subject and preview text checked **with and without** personalisation
- ☐ Plain-text alternative reviewed rather than left to generate unchecked

### 5.3 Accessibility

- ☐ WCAG AA contrast throughout, including inside buttons and on coloured bands
- ☐ Body ≥14px (16px preferred); microcopy ≥12px
- ☐ Tap targets ≥44px, achieved with **padding**
- ☐ Real HTML text preferred over text-in-image; logical source order
- ☐ `lang` set · `role="presentation"` on every layout table · `role="article" aria-roledescription="email"`
  on the wrapper · `aria-hidden` on every spacer and divider
- ☐ Meaningful `alt` everywhere; `alt=""` only when decorative (**no** `alt` attribute is read as the filename)
- ☐ Destination-descriptive link text — never "Click Here" / "Learn More"
- ☐ Auto-linked address/phone blocks neutralised so they match surrounding text

### 5.4 Dark mode

- ☐ `color-scheme` / `supported-color-schemes` declared in **meta and CSS**
- ☐ **`background-color` longhand only** in every `prefers-color-scheme` and `[data-ogsc]` block —
  the shorthand **deletes background images**, and this presents as a *layout* fault, so check it **first**
  when copy appears stranded on a blank panel
- ☐ Any background-image element has **its own** dark-mode class
- ☐ Dark-mode block declared **after** the mobile block; `[data-ogsc]` variants present
- ☐ Buttons, borders and coloured bands legible under a forced invert

### 5.5 Compatibility specifics

- ☐ **Outlook:** ghost tables present · VML `roundrect` `arcsize` recomputed if a button height changed, and the
  VML box resized to match the CSS box · VML `src` at **@1x** · web-font reference guarded · no nested VML
  inside a `v:textbox`
- ☐ **Gmail:** `bgcolor` on cells, not just tables · iOS gutter blocks present · download-button overlay
  suppressed and large images tagged · content-width badges built as shrink-to-fit tables
- ☐ **Apple Mail:** every image has `width`/`height` attributes · no `display:block` on an image-wrapping anchor
- ☐ **Samsung:** viewport width reset present
- ☐ Any unfamiliar CSS property checked at **caniemail.com**

### 5.6 G2 verdict

**A single FAIL keeps the build in `Draft/`.** Promotion to `Output/` requires **explicit Owner approval of a
named draft version**, and never in the same turn that produced a new draft.

---

## 6. Regression checks

Run when changing anything already approved, and **mandatory** for any change to a locked component
(**ADR-005**).

### 6.1 The regression evidence set

Hash each set from the **prior baseline** and the **new build**, and report which are identical:

```
inline style="" blocks · VML tags · MSO conditionals · height="" attributes
bgcolor="" attributes · href="" values · img src="" values · class="" values
```

Plus, where a change is scoped to part of a file: **hash the carried region** and state whether it is
byte-identical.

### 6.2 Why hashing rather than description

*"I only changed the padding"* is a claim. A hash comparison is evidence. **This is the mechanism that makes a
lock meaningful** rather than declarative — without it, a lock is a comment.

### 6.3 Reporting

State which sets are identical, which changed, and **why each change was necessary**. An unexplained change in
a set that should have been untouched is a defect, even if the render looks correct.

---

## 7. G3 — Before production

**Purpose: prove it is safe and lawful to send.** Reviewer prepares; **Owner approves.**

- ☐ G0, G1 and G2 all recorded as passed, with evidence, by a Reviewer ≠ Implementer
- ☐ **The client matrix is actually complete** — not "engineering complete" (§1.2, ADR-008)
- ☐ **No open blockers.** Presence in `Output/` is **not** permission to send
- ☐ Every placeholder resolved, or explicitly accepted by the Owner as a named exception
- ☐ Compliance: working unsubscribe and preference mechanism, sender identity, postal address
- ☐ Flow only: filters, suppression and cross-flow exclusions respected so a profile cannot be double-sent for
  the same trigger; exit conditions do not contradict any promise in the copy
- ☐ Campaign only: audience and schedule confirmed; no product excluded by brand policy is featured
- ☐ Coupon confirmed **created and active** in the commerce platform
- ☐ Deliverability: honest subject, balanced text-to-image ratio, never image-only
- ☐ **Everything unverifiable is listed as a required manual pre-activation step**, not as a pass

---

## 8. Reporting format

Every QA report states, for each gate:

1. **What was checked** — named, not "QA passed"
2. **What passed** — with the evidence (a count, a hash, a computed value, a client name)
3. **What failed** — with the **mechanism**, not the symptom
4. **What could not be verified in this environment** — and what would verify it
5. **Open blockers and placeholders** — explicitly, every time

**Never imply a client was verified when it was not.** A report that overstates is worse than one that reports
a gap, because it removes the reader's ability to judge risk.

---

## 9. When a gate fails repeatedly

**A gate failing for the same reason across different builds is a signal the standard is wrong, not the
builds.** Open a T3 proposal (`Engineering-Change-Management.md` §2) rather than continuing to fix instances.

**What is never available:** weakening a gate so a specific build passes. The build changes, or the Owner
grants a named exception with the cost recorded (`Engineering-Governance.md` §3.3, §8). The gate does not move.

---

## 10. Governance of this document

Changing §2 (the gates), §1.3 (the verdict rule) or §5.1 (the client matrix) is a **T3** change. Adding a scan
to §4.1 is **T2** and is encouraged. Everything else follows `Engineering-Governance.md` §3.1.

---

## 11. Change log

| Version | Date | Tier | Change | Mirrored |
|---|---|---|---|---|
| 1.0.0 | 2026-07-29 | — | Established. Defines the four gates G0–G3, the three-verdict rule, the automated scan set, the regression evidence set as a hash comparison, ESP/Klaviyo checks, accessibility and dark-mode checks, the reporting format, and the "repeated failure means the standard is wrong" escalation. | ✔ |

---

*Hero-specific checklist and gates: STD-HERO §11, §12 — not duplicated here. Cerberus pre-Output checklist:
`Cerberus-Best-Practices.md` §7. Per-project QA sections: each `CLAUDE.md`. This document owns the process and
the gate definitions.*
