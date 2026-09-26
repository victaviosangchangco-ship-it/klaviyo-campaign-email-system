# Email Hero Engineering Standard

> **The single source of truth for every Hero built in either project.**
> Applies to the **Klaviyo Campaign Email System** and **Klaviyo Flows Automation System**, every brand
> (RDD · SS · SC · Stack · future), every campaign type and every flow type.
>
> **Read this document before designing, briefing, exporting or building any Hero.** It supersedes the
> Hero rules previously held in each project's `CLAUDE.md`; those sections now point here.

---

## Document control

| | |
|---|---|
| **Status** | **ACTIVE — mandatory.** Architecture settled; client validation of a first build **outstanding** (§12.4) |
| **Version** | **1.1.0** — see §16 |
| **Established** | 2026-07-29, from the completed v1–v26 Hero **geometry** investigation (RDD Abandoned Checkout), extended the same day by the Hero **composition** investigation (§15) |
| **Evidence base** | 26 Template 1/2 drafts, 4 Part 3 drafts, pixel-sampled artwork measurement, computed WCAG contrast, geometric simulation at 320/375/414/600px, and a three-architecture composition exploration |
| **Two halves** | §2–§14 govern **geometry** — engineering correctness. **§15 governs composition** — communication correctness. **A Hero must pass both.** See §15.2 and ADR-009. |
| **Canonical location** | `Shared/Email-Hero-Engineering-Standard.md` |
| **Mirroring** | **Two byte-identical copies exist**, one per project. Both are canonical. **Any change must be applied to both in the same edit**, and the change must be recorded in §16. A one-sided edit silently forks the standard — verify by hashing both files. |
| **Cross-reference convention** | **C§n** = Campaign `CLAUDE.md` · **F§n** = Flow `CLAUDE.md` · **X§n** = Cerberus analysis docs |

**Sync check** — run before trusting either copy:

```
sha256sum "…/Klaviyo Campaign Email System/Shared/Email-Hero-Engineering-Standard.md" \
          "…/Klaviyo Flow and Claude Code/Shared/Email-Hero-Engineering-Standard.md"
```

---

## 1. Purpose

### 1.1 What this document exists to stop

Twenty-nine Hero drafts were produced across two templates and three architectures. **Every one of them
looked correct on desktop and lost its composition on mobile.** Each revision changed a different
parameter — crop mode, background position, band height, canvas width, a second artwork, a mobile-only
image, a media query, a hybrid stack — and each fixed one device while breaking another.

That pattern is the signature of a **misdiagnosis**, not of insufficient effort. The parameters being
tuned were never the cause. The cause is a geometric incompatibility between two coordinate systems
(§3), and no amount of HTML can reconcile them.

This document converts that finding into a permanent, checkable engineering standard so the class of
defect cannot recur.

### 1.2 What this document is

- A **geometry gate**: a formula that tells you, *before* any artwork is commissioned or any markup is
  written, whether a proposed Hero can hold its composition on a 320px phone (§3).
- An **Artwork Contract**: the six conditions an artwork asset must satisfy to be accepted (§4).
- A **layer allocation**: what belongs to artwork, what belongs to HTML, what belongs to shared
  components (§5, §6).
- A **prohibition list** with the engineering reason for each entry (§13).
- A **workflow** that puts the geometry gate before the design work rather than after it (§14).

### 1.3 What this document is not

It is not a visual design guide. Brand colours, type scale, spacing and voice remain in each brand's
`Design.md` / `03-Brands MD Files`. This document constrains **architecture**, and it is deliberately
silent on taste.

### 1.4 The two laws

Everything in this document derives from two findings. If you remember nothing else:

> **Law 1 — Divide a Hero along the height axis, never the width axis.**
> Width shrinks on reflow and is contested between artwork and type. Height is elastic and
> content-driven. Any composition whose meaning depends on a left/right relationship between artwork
> and HTML text will shear on a phone.

> **Law 2 — Artwork and HTML may be bonded only by a flat published colour, never by position.**
> Email cannot express a proportional position, and Gmail's mobile apps will not paint a CSS
> background on a cell. A hex is the only contract both layers can honour at every width, in every
> client.

---

## 2. Hero Architecture

### 2.1 The standard: **Aspect-Locked Band + Colour-Bonded Copy**

**One code path at every width. No overlay. The artwork is a full-width band whose bottom terminates in
a flat published colour; all copy sits below it on that same colour.**

```
┌──────────────────────────────────────────────┐
│  BRAND BAR            logo │ utility          │  ← stage colour (bond hex)
├──────────────────────────────────────────────┤
│░░░░░ ARTWORK BAND ░░░░░░░░░░░░░░░░░░░░░░░░░░░│
│░░░░░ full width · aspect-locked · no crop ░░░│
│░░░░░ diagonal / shaped edge lives HERE ░░╲░░░│  ← shape is INSIDE the raster
│▓▓▓▓▓ TERMINATION BAND — flat bond hex ▓▓▓▓▓▓▓│  ← THE BOND (§4.2)
├──────────────────────────────────────────────┤
│  eyebrow                                      │  ← same bond hex, full width
│  HEADLINE                                     │     all live HTML
│  ▬▬▬▬▬ flourish                               │
│  body copy, personalised                      │
│  ┌────────────┐  ┌──────────────────┐         │  ← Cerberus hybrid row
│  │ coupon chip│  │  CTA             │         │
│  └────────────┘  └──────────────────┘         │
│  reassurance line                             │
└──────────────────────────────────────────────┘

Identical structure at 320 / 375 / 414 / 600px. Only SCALE changes.
```

**Why this is the standard, stated as engineering rather than preference:**

| Property | Mechanism that guarantees it |
|---|---|
| Composition cannot break on reflow | Nothing is positioned relative to an artwork feature, so there is no drift term (§3.3) |
| The join is invisible at every x | Artwork's last row and the copy surface are the **same published hex** |
| The join is invisible at every width | Both sides are flat colour, so sub-pixel rounding in the height reservation is immaterial |
| Zero crop, permanently | Band height is aspect-locked; `background-size:contain` or a fluid `<img>` — never `cover` |
| Survives `<head>` CSS being stripped | Colour is on the `bgcolor` **attribute**; the band is a real sized cell |
| Type is free | Copy never competes with artwork for width, so font sizes need no viewport scaling |
| Outlook needs no special geometry | Variant B1 has no text over artwork, so **no VML background is required at all** |

### 2.2 Two implementation variants

**B1 — Foreground image (DEFAULT. Use this unless §2.3 is satisfied.)**

The artwork is a plain fluid `<img>` in an edge-to-edge cell. Because no text sits over it:

- No `background-image`, no `background-size`, **no VML `v:rect`/`v:fill`** — an entire class of Outlook
  risk disappears.
- The artwork gets **real `alt` text**, which a CSS background image can never have (§10.3).
- Crop is structurally impossible: a fluid `<img>` cannot crop.
- Images-off degrades to a styled alt box on the bond hex (§10.4).

**B2 — Background image + VML (EXCEPTION. Gated by §2.3.)**

Only when a small, short element must sit over **flat artwork colour** — never over a photographic
feature. Requires CSS `background-image` + `background-color` + VML for Outlook (§9.2), and requires
`W*` to be published and `≤ 320px` (§3.4).

### 2.3 Gate for using B2

All four must be true, in writing, before B2 may be built:

1. The overlaid copy sits entirely over **flat artwork colour**, verified by pixel sampling.
2. `k` (clear-zone fraction, §3.2) is published for the artwork.
3. `W*` computed per §3.3 is **≤ 320px**.
4. The overlaid copy is short enough that its longest line fits the clear zone at 320px **at or above
   the §10.2 type floor**.

If any of the four fails, **B2 is prohibited for that artwork** and B1 is used. In practice condition 3
fails for any artwork whose imagery occupies more than ~30% of the frame — see §3.5.

### 2.4 Relationship to the layout below the band

The copy, coupon and CTA below the band are **ordinary sections built from the shared component set**,
not Hero-specific markup. Multi-column rows there use **Cerberus hybrid stacking** (§9.6). This is
deliberate: it means the Hero introduces no bespoke layout code, and every improvement to the shared
CTA / chip / spacer components propagates into every Hero automatically.

---

## 3. Geometry Rules

This section is the analytical core. It is what makes the standard checkable in advance.

### 3.1 The two coordinate systems

| | Scales with viewport? | Why |
|---|---|---|
| **Raster artwork** and every feature inside it | **Yes**, linearly | A fluid image or an aspect-locked `contain` background scales with its box |
| **HTML type**, and therefore every copy block's width and height | **No** | Email has **no viewport-relative font units.** `vw`, `vmin`, `clamp()` are unsupported in Outlook (Word engine), Gmail (web, Android, iOS) and Yahoo. `text-size-adjust` prevents auto-inflation; it does not scale type. |

**Every Hero geometry failure in the v1–v26 history reduces to this single asymmetry.**

### 3.2 Definitions

```
W            container width in CSS px at the current viewport (≤600)
ratio        artwork master height ÷ master width
band_height  = W × ratio                     ← the aspect lock
k            clear-zone fraction = (x-coordinate of the first artwork feature) ÷ master width
clear(W)     = W × k                         ← scales
inset        copy block's left inset in px   ← constant
copy_w       copy block's width in px        ← constant
copy_right   = inset + copy_w                ← constant
```

### 3.3 The drift term and the critical width

Overlay reads as one composition only while:

```
copy_right  ≤  clear(W)
```

One side is constant, the other scales. Subtracting gives the **drift term**:

```
drift(W) = copy_right − k·W          →  d(drift)/dW = −k
```

**Drift accumulates at `k` px for every px of lost viewport width.** Setting `drift = 0` gives the
**critical width**, below which overlay is geometrically impossible:

```
        copy_right       inset + copy_w
W*  =  ────────────  =  ────────────────
             k                  k
```

> **`W*` is the single number that decides whether a Hero can survive a phone.**
> Compute it before commissioning artwork. If `W* > 320`, the architecture is wrong — not the code.

### 3.4 Worked measurement — the artwork that caused the investigation

RDD Abandoned Checkout Part 3 artwork, measured by pixel sampling the `w_600` render:

```
master           1376 × 768        ratio = 768/1376 = 0.55814
band_height      600 × 0.55814     = 334.9 → 335px   (w_600 returns exactly 600×335 ✔ lock proven)
first feature    orange arc, leftmost point x = 327 of 600
                 per-row: 387 / 365 / 349 / 332 / 327 / 331 / 341 / 363 / 390
k                327 / 600         = 0.545
inset            32px      copy_w  246px      copy_right = 278px
W*               278 / 0.545       = 510px
```

**Measured drift:**

| W | `clear(W)` = 0.545·W | `copy_right` | drift | Result |
|---|---|---|---|---|
| 600 | 327 | 278 | **+49** | ✔ composition intact |
| 560 | 305 | 278 | +27 | ✔ |
| **510** | **278** | **278** | **0** | **← W\*** |
| 480 | 262 | 278 | −16 | ✘ copy touches the feature |
| 414 | 226 | 278 | −52 | ✘ headline over the feature |
| 375 | 204 | 278 | −74 | ✘ |
| 320 | 174 | 278 | −104 | ✘ |

**`W* = 510px`. No phone reaches it.** Every phone therefore fell back to a stacked layout — which is
exactly the reported symptom: *"the artwork becomes visually separated, the context appears underneath."*

### 3.5 Why percentage columns do not rescue overlay

Making the copy column a **percentage** eliminates the drift term (percentage table widths are well
supported). It does not help, because the type still does not scale. Same artwork, copy column at 41%
of `W` (= 246px at 600), headline `"still waiting"` (13 chars) at 30px bold:

| W | 41% column | Headline needs (13 × size × 0.55) | Largest type that fits | Headline : body ratio |
|---|---|---|---|---|
| 600 | 246 | 215 @30px | 30px ✔ | **2.0 : 1** |
| 500 | 205 | 215 | 28px | 1.9 : 1 |
| 414 | 170 | 215 | 23px | 1.5 : 1 |
| 375 | 154 | 215 | **21px** | 1.4 : 1 |
| 320 | 131 | 215 | **18px** | **1.2 : 1** |

*(0.55 em/char for Arial Bold — the same factor the brand button-sizing formula uses.)*

At 320px the "display headline" would be 18px against 15px body. **The hierarchy contrast the design
depends on collapses from 2.0:1 to 1.2:1.** Percentage columns convert *"copy escapes the clear zone"*
into *"copy is illegible inside the clear zone"*. Both are failures.

### 3.6 The minimum viable clear-zone fraction — and why it is unreachable

Solve for the `k` that would let a 13-character headline hold at a defensible 26px, with a 20px inset
and 16px clearance:

```
k·W − 36  ≥  13 × 26 × 0.55 = 186px
→  survive to 375px:  k ≥ 0.59
→  survive to 320px:  k ≥ 0.69
```

The measured artwork has **k = 0.545**. To reach `k ≥ 0.69` the imagery would be confined to ~30% of
the frame — a 180px sliver at 600px.

> **Conclusion, and the reason §13.1 exists: a left/right overlay Hero is geometrically unviable in
> email at 320–414px for any artwork whose imagery occupies a meaningful share of the frame. This was
> never an implementation defect, and no framework, template engine or markup technique changes it.**

### 3.7 The aspect lock (mandatory for every Hero, both variants)

```
band_height (at 600px)  =  600 × ratio
mobile reservation      =  padding-bottom: (ratio × 100)%   on a zero-height box, released on mobile
```

- **Verify the lock by render, never by arithmetic.** Request the artwork at `w_<container width>` and
  confirm the returned pixel height equals `band_height` **exactly**. If it does not, the lock is wrong
  and `contain` will letterbox.
- **`background-size:contain` set inline**, so it holds when `<head>` CSS is stripped. **`cover` is
  prohibited** (§13.5).
- Under the Band architecture the reservation **no longer needs to be pixel-exact**, because both sides
  of the join are the same flat colour. A ±1px rounding error is invisible. This is a direct
  simplification the Band architecture buys.

### 3.8 Height budget and the mobile fold — state it, do not hide it

A 16:9-class artwork consumes a large share of a phone's first screen:

```
reserved artwork height at 375px  =  375 × 0.558  =  209px   (≈32% of a 667px device)
```

With a brand bar, eyebrow, two-line headline, flourish and body above it, the CTA lands at roughly
**580–590px** — below the fold on Gmail iOS at 375×667 (usable ≈500px).

**This is arithmetic, not a defect, and it must be reported rather than "fixed":**

- The only levers are shortening copy or cropping the artwork. **Cropping is prohibited** (§13.5).
- Deleting personalisation or the flourish to buy 20px is not a legitimate fix.
- **Publish the computed CTA offset** at 320/375/414 in the build's header comment and in the review
  summary, so the trade-off is a recorded decision rather than a surprise.
- Mitigation is editorial: keep the Hero copy to eyebrow + 2-line headline + 1–2 body lines, and rely
  on the closing CTA to repeat the action.
- **A shallower artwork ratio is the real lever.** A 3:1 band reserves 125px at 375px instead of 209px.
  Ratio is an artwork brief decision (§4.1) — make it deliberately.

---

## 4. Artwork Contract

**No Hero artwork enters a build until all six conditions are verified and recorded.** This is the
artefact whose absence caused the v1–v26 history: every revision negotiated with an artwork that had
already made the architectural decision.

### 4.1 Declared aspect ratio

- Master dimensions and `ratio = height ÷ width` are published with the asset.
- Requesting the asset at `w_<container>` must return **exactly** `<container> × round(container × ratio)`.
- Prefer a **shallower ratio** (2.5:1 – 3:1) over 16:9 unless the composition needs the height. Ratio
  directly sets the mobile height cost (§3.8).

### 4.2 Flat termination band — **the bond**

- The bottom **≥8% of the master's height** is a **single flat colour, uniform across every x**.
- Uniformity tolerance: **≤2 levels per channel** across the full width of the band.
- Rationale for 8%: at 320px it renders as ~14 CSS px of flat colour, which survives JPEG chroma
  subsampling, encoder ringing at the frame edge, and sub-pixel rounding in the height reservation.
- The shaped edge (diagonal, curve, wedge) lives **above** the band, inside the raster.

**Counter-example — what a failing edge looks like.** Bottom row of the investigated artwork, sampled:

```
x=0…360    #11161C  #12151A  #14171C  #131418  #16151A  #17181C  #1E2126  #252429  #2B2B2D
x≈390…600  #A27558  #D1D0D6  #A6A6A8  #A6A0A0  #A29688  #A29283          ← wood floor, glass, wall
           └─ 60% joins navy invisibly ─┘        └─ 40% is a hard light-to-dark step ─┘
```

The join was seamless on 60% of the frame and hard-edged on 40%. **No HTML can fix that 40%**, because
Gmail's mobile apps drop CSS `background` on cells — the copy surface can only be a flat `bgcolor` or a
tiled strip, and a flat colour cannot match a two-tone edge. This single measurement is why §4.2 exists.

### 4.3 Published bond hex

The termination band's **modal** hex is published with the asset and becomes, from one value:

1. the stage / copy-surface colour,
2. the cell `bgcolor` **attribute** (Gmail mobile, §9.3),
3. the images-off fallback (§10.4),
4. the `.keep-hero` / `.keep-stage` dark-mode `background-color` value (§7.4).

**One hex, four jobs.** Sample from clean interior pixels, never from an antialiased edge.

### 4.4 Nothing baked in

**No text, no logo, no CTA, no coupon code, no price, no date, no stock claim** — ever. Reasons in
§13.2–§13.4.

### 4.5 No overlay clear zone is specified

Overlay is not part of the standard. If a variant genuinely needs B2, the asset must additionally
publish `k` and prove `W* ≤ 320` (§2.3, §3.3).

### 4.6 Export integrity

- Full-bleed and rectangular: no white borders, rounded-corner artifacts or embedded canvas margins.
  These are **export defects** — request a corrected export; never mask them with HTML or CSS.
- Inspect at **2× zoom** at every contact point between subject and ground for compositing artefacts
  (imprecise masking, halos, ghost patches). One brand hero already shipped with a baked masking
  artefact under a trolley base that cannot be repaired in HTML.
- Raster only, served over HTTPS, HTTP 200, `image/*`, no redirects. **Never SVG** — Gmail (all),
  Outlook (all) and Yahoo do not render `image/svg+xml` in `<img>`.
- Deliver **@2x** for the CSS/foreground reference and **@1x** for the HTML `background` attribute and
  any VML `src` (Outlook cannot scale a background image).
- Keep the @2x derivative well compressed; oversized images render on desktop and fail in the Gmail
  mobile app.

### 4.7 Acceptance record

Record all six in the brand's `Design.md` (Flow) / `06-Assets Library` (Campaign) artwork register:

```
asset · master WxH · ratio · w_<container> verified return · bond hex · band % · 2× inspection pass/fail
```

---

## 5. HTML Responsibilities

**HTML owns every word and every changeable value. Without exception.**

| HTML must own | Why |
|---|---|
| Eyebrow, headline, body copy | Editable without a re-export; readable with images off; announced by screen readers; resizable |
| Personalisation and its fallback | `{{ first_name\|default:'there' }}` — never bare (renders "Hi ,") |
| Coupon code | Offers change; codes may be per-profile dynamic; must be selectable text |
| CTA label and destination | Destinations change; labels are A/B tested; the anchor must be a real anchor |
| Logo | Must be a link, must be swappable light/dark, must have `alt` |
| Every colour that must match the artwork | Tokenised so a re-export is a hex change, not a redesign |
| Utility items (phone, secure line) | Real `tel:`/`mailto:` links |

**Structural obligations:**

- Layout correct from **table markup + HTML attributes + inline styles alone**, before any `<head>` CSS.
- Every coloured section: `bgcolor` on the `<table>` **and** its content `<td>`, identical six-digit hex.
- Container fluid: `width="100%"` + `style="width:100%; max-width:600px"`; MSO ghost table locks 600px.
  **Never a bare `width="600"`.**
- Restate `font-family`, `font-size`, `font-weight`, `line-height`, `color` on **every** text `<td>` —
  never inherit.
- Spacers and dividers are **painted sized cells** with `aria-hidden="true"`, `height` attribute,
  `&nbsp;`, `font-size:0; line-height:0; mso-line-height-rule:exactly`. Never `<hr>`, never `border-top`
  as the mechanism.
- **Never `height` and `padding` on the same cell** — content-box vs border-box engines disagree by the
  padding amount, so the region silently changes size per client.
- Anchors contain **inline content only**. Never wrap a `<table>` or block element in an `<a>` (Klaviyo
  detaches the `href` on import). Never `display:block` on an image-wrapping anchor (Apple Mail iOS
  collapses it to zero height before the image decodes). `display:block` on a **text** CTA anchor is
  correct and stays.

---

## 6. Artwork Responsibilities

**Artwork owns everything that must scale, and nothing that must change.**

| Artwork must own | Artwork must never own |
|---|---|
| Photography, product imagery, lighting, texture | Any word, in any language |
| The shaped edge (diagonal / curve / wedge) geometry | The logo |
| Decorative graphics, arcs, gradients, brand marks | The CTA, or anything button-shaped |
| The flat termination band and its published hex | The coupon code |
| Its own declared aspect ratio | Prices, dates, stock counts, seasonal references |

**Why the shaped edge belongs to the artwork and only to the artwork:** it is the one element that must
stay in proportion at every width. Inside the raster it scales for free and can never drift. Expressed
in CSS it cannot exist at all — `clip-path`, `transform: skew`, `mask` and SVG are unsupported across
Outlook, Gmail and Yahoo. Expressed as a stepped table staircase it cannot survive reflow.

**Component reuse strategy.** Shared components own the frame; artwork and HTML plug into it:

| Layer | Owns |
|---|---|
| **Components** | Stage wrapper (doubled `bgcolor`, MSO ghost table) · aspect-lock box · brand bar · CTA · coupon chip · painted rule and spacer primitives · hybrid column pair |
| **Artwork** | One `src`, one ratio, one bond hex |
| **HTML** | Copy, links, personalisation, tokens |

A new Hero should therefore be **a new artwork plus new copy**, never new layout code. If a Hero requires
new layout code, that is a signal the architecture is being violated — stop and re-read §2.

---

## 7. Color System

### 7.1 The bond hex is load-bearing

The bond hex (§4.3) is not decoration. It is the mechanism that makes the artwork and the copy read as
one object. **Never substitute a nearby brand grey or navy "because it is in the palette"** — it must be
the artwork's own sampled colour, or the join becomes visible.

### 7.2 Sampling method

Sample the **modal** value across the termination band at the render width, from clean interior pixels.
Reject antialiased edges and JPEG-ringing rows. Record the sample count and per-channel means alongside
the hex so the value is reproducible.

*Worked example (investigated artwork):* 16 samples down the left field →
R mean 15.7, G 20.9, B 28.4 → **`#10151C`**.

### 7.3 Contrast on dark bonds — the two-tier rule inverts

A brand's "text-safe" accent is defined against **white**. On a dark bond it inverts. This is a
measured, general finding, not brand trivia:

| Foreground | On `#FFFFFF` | On `#10151C` |
|---|---|---|
| `#F58220` brand orange | **2.59:1 ✘** — fills only | **7.06:1 ✔** — safe for text |
| `#B4500F` orange deep (the light-background text orange) | **5.13:1 ✔** | **≈2.4:1 ✘** — never use |
| `#FFFFFF` | — | **18.32:1 ✔** |
| `#9AA4B2` | 2.4:1 ✘ | **7.27:1 ✔** — microcopy, reassurance lines |
| `#14181F` on `#F58220` fill | **6.86:1 ✔** | — |
| `#FFFFFF` on `#F58220` fill | **2.59:1 ✘** | — |

- **Never carry a light-background text colour onto a dark bond.** Recompute the pair; do not reuse
  habit.
- **A CTA label on brand orange is dark ink, not white.** White on brand orange fails AA in both
  directions at any size. A white label ships only under an explicitly recorded, per-template user
  request, and such an exception **does not travel to a new template**.
- Compute contrast from WCAG relative luminance; do not carry a figure forward without checking it. One
  brand doc carried `8.10:1` for a pair that measures `6.86:1` — the verdict was unchanged, but the
  number was wrong for months.

### 7.4 Dark mode

- Declare participation twice: `<meta name="color-scheme">` + `<meta name="supported-color-schemes">`
  **and** `:root { color-scheme: light dark; supported-color-schemes: light dark; }`.
- **Never use the `background` shorthand in a dark-mode rule.** `background:#FFFFFF!important` resets
  `background-image` to `none` and therefore **deletes the background image of every element it matches.**
  Use the **`background-color` longhand** in every `prefers-color-scheme` block and every `[data-ogsc]`
  block.
- Any element carrying a background image gets **its own dark-mode class** (`.keep-hero`) that only ever
  sets `background-color`. Never apply a generic `keep-light`-style class to it.
- **This defect presents as a layout fault** — copy stranded on a blank panel — so it is routinely
  misdiagnosed as positioning. It cost four drafts on one template. **Check the shorthand first.**
- Declare the dark-mode block **after** the mobile block so it wins by cascade at equal specificity, and
  keep the `[data-ogsc]` variant (higher specificity) for Outlook.com.
- Hold every Hero band explicitly (`.keep-hero`, `.keep-stage`, `.keep-rule`, `.keep-fill`) so no client
  can invert a deliberately dark Hero into mush.

### 7.5 Six-digit hex only

`#ffffff`, never `#fff`, never `rgb()`. Three-digit hex fails in some clients and in `bgcolor`
attributes.

---

## 8. Responsive Behaviour

### 8.1 The reflow contract

**Desktop and mobile must differ by scale and line-wrapping only.** Specifically:

| Must be identical at every width | May change |
|---|---|
| Element **order** | Column **width** |
| Element **surface** (which colour each sits on) | Vertical **padding** |
| **Presence** — nothing appears or disappears | Line **wrapping** |
| **Type sizes** (see §8.2) | Multi-column rows collapsing to one column |

**Nothing may be hidden on one breakpoint and shown on another.** A `display:none` on mobile is a
hierarchy collapse, not a responsive technique, and it is invisible to every reader whose client strips
`<head>` CSS. If an element is not legible at 320px it does not belong in the Hero at any width.

### 8.2 Type sizes should not change across the breakpoint

Under the Band architecture the copy column releases to full width on mobile, so it is **wider** than
the desktop column, not narrower. There is therefore no geometric need to shrink type — and holding the
sizes constant makes hierarchy collapse impossible by construction.

**Target: zero `font-size` overrides in the Hero's media query.** Where a brand's existing display scale
mandates a smaller mobile headline, that is permitted, but the ratio between headline and body must be
preserved and recorded.

### 8.3 The mobile reservation

```css
.hero-cell { height: auto !important }              /* release the desktop band height */
.hero-art  { padding-bottom: <ratio×100>% !important }   /* reserve the artwork's own height */
```

Releasing a reserved height is a **sanctioned** media-query use. The **no-crop guarantee above it is
inline and unconditional** and must never depend on the media query.

### 8.4 What a media query may and may not do

| May | May not |
|---|---|
| Release a reserved height | Make a layout stack, contain or fit |
| Adjust gutters and vertical padding | Be the mechanism for width or containment |
| Tune a tap target | Hide or reveal content |
| Recolour a canvas | Carry the no-crop guarantee |

**Rationale:** the Gmail app strips `<head>` CSS entirely for non-Google accounts. Anything structural
in a media query is invisible to that population.

### 8.5 Breakpoint

Single breakpoint at `max-width:620px`. Mobile CSS must never alter the desktop layout.

### 8.6 Degradation policy

**Degradation is acceptable; disappearance is not.** A square button in Outlook is fine. A missing
button is a hard fail. A hybrid column that stays at its `max-width` instead of expanding is acceptable
degradation (§9.6); a column that vanishes is not.

### 8.7 Copy must fit the band — the band `height` is a floor, not a clamp (overlay / single-surface variants)

**This is the Approved Flow Hero Banner Construction rule.** It governs any Hero that places live copy
**on** a fixed-height aspect-locked band — Variant **B2**, and brand single-surface overlay Heroes such as
the RDD aspect-locked single-surface Hero. (It does **not** apply to Variant **B1**, where the copy sits
*below* the band on auto height and can never create this fault.)

The copy block — eyebrow/headline + flourish + body + CTA **plus its own padding** — **must fit within the
band height**. An HTML `height="N"` and inline `height:Npx` on the band cell is a **floor, not a clamp**:
if the copy is taller, the cell grows, and because `background-size:contain` fills only the artwork's own
aspect-locked height at the top, the extra cell height renders as a flat **bond-colour strip below the
artwork** on the side that has no copy — an unexplained blank band under the Hero.

Three guards, all required:

- **Each headline line must fit the clear-zone text-block width at the headline font size**, or it wraps to
  an extra line and overflows the band. Estimate `chars_per_line ≈ block_width ÷ (font_size × 0.55)` and
  keep each line within it; join words that must not break with `&nbsp;`. *(A first line that silently
  wrapped to three lines at 34px in a 280px block was the RDD Customer Winback v1 defect.)*
- **Keep the body to one or two short lines.** A `{{ personalization }}` tag renders **longer in preview**
  than the resolved value, and longer again for long profile values — size the copy for the longest
  realistic render, not the preview default.
- **Re-measure the copy stack against the band whenever the copy or the artwork changes.** Total copy
  height ≤ band height, leaving a few px of slack for `valign:middle`.

**The fix is always to fit the copy to the band** — shorten the line, shorten the body, or (as an approved
design revision) re-cut the band's aspect to a taller artwork. **Never** paper over the strip with a spacer
row, a negative margin, or a band taller than the artwork (which only letterboxes it).

**Diagnostic (with §15.2):** a bond-colour strip that appears **below the artwork and looks the same at
every width** is a copy-overflow — this rule. A strip or crop that **changes with width** is an aspect/lock
fault — §3.7 and §13.5.

*Derived from the RDD Customer Winback Hero (Draft v2), the reference implementation of this rule. The
construction it fits — image band, headline with optional promotion, supporting line and CTA all within the
band, on the artwork's bonded clear-zone colour — is the shared technical standard; brand identity (colour,
type, logo, CTA style, imagery, copy) stays per-brand in each `Design.md` / `Flow.md`.*

---

## 9. Client Compatibility

### 9.1 The limitation set that shapes this standard

Ranked by contribution to the Hero geometry failure:

| # | Limitation | Clients | Consequence for a Hero |
|---|---|---|---|
| **1** | No viewport-relative font units (`vw`, `vmin`, `clamp()`) | Outlook all · Gmail all · Yahoo | **Primary cause.** Type cannot scale with artwork → §3 |
| **2** | `position:absolute` unusable | **stripped by Gmail** · ignored by Outlook Word | No independent text layer; overlay must be table-anchored in px |
| **3** | No `clip-path` / `transform` / `mask` / SVG | Outlook · Gmail · Yahoo | A diagonal can only be raster, therefore aspect-fixed |
| **4** | CSS `background` dropped on tables and cells | **Gmail mobile apps** | The copy surface can only be a flat `bgcolor` or a tiled strip → §4.2 |
| **5** | `<head>` CSS stripped entirely | **Gmail app, non-Google accounts** | Any media-query correction is invisible to that population |
| **6** | `background-size` unsupported | Outlook Word engine | Requires VML; VML `v:fill type="frame"` renders at the `v:rect`'s **fixed px** size only |
| **7** | `calc()` / `min()` / `max()` unreliable | Outlook | Cannot compute a proportional inset |
| **8** | Percentage `padding-top` reserves height only | universal | Can aspect-lock a box; cannot position content proportionally in two axes |
| **9** | `object-fit` unsupported | Outlook | No foreground-image fitting control |

**Check any unfamiliar CSS property at [caniemail.com](https://www.caniemail.com/) before using it.**

### 9.2 Outlook (Windows, Word engine) — VML requirements

**Variant B1 needs no VML for the artwork.** That is a deliberate benefit of the Band architecture.

**Where VML is still required:**

- **Rounded filled CTA** — `v:roundrect` with
  `arcsize ≈ radius ÷ (height ÷ 2) × 50`. **Recompute `arcsize` whenever the button height changes**, and
  resize the VML `width`/`height` to match the CSS box — Outlook renders `v:roundrect` at its own fixed
  dimensions, so a button changed only in CSS keeps the old size there.
- **Variant B2 background** — `v:rect` (full container box; **VML ignores padding**, so all padding lives
  on the inner table) + `v:fill type="frame"` with the `src` at **@1x** and a mandatory `color` fallback
  + `v:textbox inset="0,0,0,0"`.
- Declare `xmlns:v="urn:schemas-microsoft-com:vml"` on `<html>`; repeat it on the `<v:rect>` defensively.
- Inside a `v:textbox`, **do not nest further VML**. Square corners in Outlook are the accepted fallback.

**Other Outlook obligations:** MSO ghost table for the 600px lock and for every hybrid row ·
`<o:OfficeDocumentSettings><o:PixelsPerInch>96` · guard any web-font reference with
`<!--[if mso]><style>*{font-family:sans-serif!important}</style><![endif]-->` or Outlook drops the whole
document to Times New Roman · guard a dark-mode image swap with `[if !mso]` or Outlook renders both
variants · **do not adopt `table-layout: fixed !important`** globally — it disables intrinsic sizing and
breaks shrink-to-fit badges and centred odd last cards.

**Hiding a row from Outlook** (e.g. a mobile-only decorative rule) uses the asymmetric form:
`<!--[if !mso]><!--> … <!--<![endif]-->`. Getting the delimiters wrong hides the content from *everyone*.

### 9.3 Gmail (web, Android, iOS)

- **`bgcolor` attribute on the cell** is the only background declaration Gmail mobile reliably honours.
  Table-level alone is not enough.
- **`<head>` CSS stripped for non-Google accounts** — the layout must be correct without it.
- **`position` stripped** — no overlay positioning.
- Right-hand gutter on the iOS app: the three `u ~ div .email-container { min-width }` blocks
  (320 / 375 / 414).
- Download-button overlay on large unlinked images: `.a6S{display:none!important;opacity:0.01!important}`
  plus `img.g-img + div{display:none!important}`, and tag images wider than ~300px `class="g-img"`.
- Thread recolour: `.im{color:inherit!important}`.
- Keep the built file **well under the ~102 KB clip threshold** so the footer is never behind "View
  entire message".
- A filled `inline-block`/`block` anchor is **coerced toward full width by the Gmail mobile app**. Any
  badge or button that must stay content-width is a **shrink-to-fit centred `<table>` with no `width`
  attribute**. Intentionally full-width CTAs are exempt but must be *deliberately* wide.

### 9.4 Apple Mail (desktop, iOS, iPad)

- **Most capable client, and therefore the most misleading during review.** Never approve a Hero on an
  Apple Mail render.
- **Every image needs explicit `width` and `height` attributes.** Apple Mail iOS has no box to reserve
  without them and drops the image. Never size an image with `max-height` + `width:auto` and no
  dimensions.
- **Never `display:block` on an anchor that wraps an image** — Apple Mail iOS resolves the block height
  before the image decodes, collapses the anchor to zero height and never paints the image, while desktop
  and Gmail Android look correct.
- `<meta name="x-apple-disable-message-reformatting">` and the
  `a[x-apple-data-detectors]` / `.unstyle-auto-detected-links a` / `.aBn` block for auto-linked
  addresses, dates and phone numbers.

### 9.5 Samsung Mail

Modern WebKit: honours media queries and `background-size`. **Not a limiter for the Hero.** Requires
`#MessageViewBody, #MessageWebViewDiv { width:100% !important }`, otherwise the message renders narrower
than the viewport.

### 9.6 Cerberus hybrid implementation (the rows below the band)

Cerberus is the external rendering authority and is **neutral on the Hero geometry problem** — it
supplies reflow mechanisms for *content columns* and has no primitive for positioning text relative to a
feature inside an image. Nothing in Cerberus caused or can cure §3; that is worth stating so it is not
blamed.

What Cerberus **does** supply, and what the Band architecture uses:

```
inner width      I = C − 2P
column max-width M = I / N            (round down; margin:0 -1px absorbs the remainder)
column min-width m = chosen so the row wraps at the intended viewport
ghost table      G = I, each ghost <td> = M
```

At a 600px container: 10px parent padding → `I=580`, 2-col `290`/`175`, 3-col `193`/`140`. With wider
Hero gutters, recompute — e.g. 26px padding → `I=548`, two columns `max-width:274` / `min-width:258`,
ghost table `width="548"`.

**Mandatory supports, each load-bearing:** `font-size:0` on the parent cell (kills the inline-block
whitespace gap — **restate the font size inside every column**) · `margin:0 -1px` (sub-pixel rounding) ·
`vertical-align:top` · `width:100%` (a wrapped column fills the row) · `min-width` (without it columns
squeeze instead of wrapping) · the ghost table (without it Outlook renders each `<div>` at 100% and
stacks everything).

**Choosing `min-width` deliberately.** The wrap threshold is `N × m`. A pair of wide columns (a coupon
chip and a CTA) legitimately takes `m` close to `M` so the row wraps early rather than squeezing content
that cannot squeeze. This is a valid parameterisation, not a violation of the `m ≈ 0.6M` heuristic.

**Size sibling columns to the same height** so `vertical-align:top` reads as level rather than as a
mistake.

**Known, accepted degradation:** without `<head>` CSS a wrapped hybrid column stays at its `max-width`
instead of expanding to the full viewport. Content is legible but not edge-to-edge. Documented, not a
defect (§8.6).

### 9.7 Container width

**600px, always.** Cerberus's hybrid template runs at 680px; adopt the *mechanism*, never the width.
Every approved brand measurement and every artwork export is built to 600px, so changing it would
require re-exporting every asset.

---

## 10. Accessibility Requirements

### 10.1 Real text, always

**All Hero copy is live HTML.** This is the primary accessibility requirement and the reason §13.2–§13.4
prohibit baked copy. Baked text cannot be announced beyond a single `alt` string, cannot be resized,
cannot be reflowed by a magnifier, cannot respond to a high-contrast mode, and cannot be translated.

### 10.2 Type and contrast floors

- **Body copy ≥14px** (16px preferred). **Microcopy ≥12px.** Never below 12px anywhere.
- **WCAG AA contrast** for all text including inside buttons and on coloured bands. Compute it (§7.3);
  do not inherit a figure.
- **Never convey meaning by colour alone.**
- **Tap targets ≥44px, achieved with padding**, never by widening an element.

### 10.3 Semantics

- `role="article" aria-roledescription="email" lang="en"` on the outer wrapper; `lang` on `<html>`.
- `role="presentation"` on **every** layout table.
- `aria-hidden="true"` on every spacer, divider and decorative mark.
- **Meaningful `alt` on the artwork.** Variant B1 can carry one; a CSS background image cannot — a
  concrete accessibility argument for B1 over B2.
- `alt=""` on genuinely decorative images. An image with **no** `alt` attribute is read aloud as its
  filename.
- Destination-descriptive link text. Never "Click Here" / "Learn More".
- Logical reading order in source. Where `dir="rtl"` order-swapping is used for a desktop layout, the
  mobile stack rule **must** carry `direction: ltr !important` or rows stack backwards.
- Review the plain-text alternative rather than letting it generate unchecked.

### 10.4 Images-off behaviour

Images-off is a **first-class state**, not a fallback to be tolerated.

| Variant | Images-off result | Requirement |
|---|---|---|
| **B1** foreground `<img>` | Styled alt box on the bond hex, then the copy | Style the alt-text box on the `<img>` — `background` set to the bond hex plus `font-family`/`size`/`line-height`/`color` — so it degrades deliberately rather than as naked default serif |
| **B2** background image | Flat bond colour panel with the copy on it | `background-color` is **mandatory**, not optional — it is what keeps overlaid text legible |

**Test it explicitly.** With images disabled the Hero must still deliver the eyebrow, headline, offer and
CTA, on the correct surface, with AA contrast. If it does not, copy has been lost to the artwork.

---

## 11. Validation Checklist

Run in full on every Hero build. Nothing here is optional, and nothing may be marked as passing on a
browser preview.

**Geometry**

- ☐ `ratio` published; `w_<container>` returns **exactly** `<container> × band_height`
- ☐ Band height `= 600 × ratio`; `background-size:contain` (or a fluid `<img>`) — **`cover` count = 0**
- ☐ `.hero-art` mobile reservation `= ratio × 100%`
- ☐ **Exactly one** Hero artwork reference; zero duplicate or mobile-only artwork nodes
- ☐ If B2: `k` published and `W*` computed **and ≤ 320px**
- ☐ CTA vertical offset computed and reported at 320 / 375 / 414 (§3.8)

**Artwork Contract (§4)**

- ☐ Termination band ≥8% of frame height, flat to ≤2 levels per channel across every x
- ☐ Bond hex published and used for surface + `bgcolor` + images-off + dark-mode class
- ☐ Zero baked text / logo / CTA / coupon / price / date
- ☐ Full-bleed rectangular export; 2× zoom inspection passed
- ☐ Raster, HTTPS, HTTP 200, `image/*`, no redirects, no SVG

**Structure**

- ☐ Layout correct from tables + attributes + inline styles alone, with `<head>` CSS removed
- ☐ Container fluid `width:100%; max-width:600px`; MSO ghost table locks 600px; no bare `width="600"`
- ☐ `role="presentation"` on every layout table
- ☐ Every coloured section: `bgcolor` on the `<table>` **and** its content `<td>`, identical hex
- ☐ Hybrid rows: `min`/`max-width`, ghost `<td>` widths and ghost table width all reconcile
- ☐ `font-size:0` on every hybrid parent cell; font size restated inside each column
- ☐ Six-digit hex only; no `rgb()`
- ☐ No `height` and `padding` on the same cell
- ☐ No `display:flex`, `grid`, `align-items`, `justify-content`, `position:absolute`, `table-layout:fixed`

**Responsive**

- ☐ Element order, surface and presence identical at 320 / 375 / 414 / 600
- ☐ **Zero `display:none` on Hero content** in any media query
- ☐ `font-size` overrides in the Hero media query: **0** (or ratio preserved and recorded)
- ☐ No media query carries width, containment or the no-crop guarantee
- ☐ Body never scrolls horizontally

**Colour, dark mode, images-off**

- ☐ Every text/background pair computed against WCAG AA
- ☐ **Zero `background` shorthand in any dark-mode rule** — longhand only
- ☐ Background-image elements have their own dark-mode class
- ☐ Dark-mode block declared after the mobile block; `[data-ogsc]` variants present
- ☐ Images-off render checked; alt box styled to the bond hex

**Links and markup**

- ☐ Zero `<table>` or block element inside an `<a>`
- ☐ Zero `display:block` on an image-wrapping anchor
- ☐ Zero `#`, empty, placeholder or 404 `href`
- ☐ Anchor open/close counts match; no nested anchors; no `<` inside an attribute list; no odd quote
  count in any tag
- ☐ No template tag that emits HTML placed inside an attribute
- ☐ Clickability verified **after** a real ESP import (Klaviyo rewrites `href`s)

**Ghost elements**

- ☐ Zero empty `<td>`/`<tr>`; zero whitespace-only anchors; zero zero-size clickable nodes
- ☐ Zero whitespace text nodes between the Hero `<td>`, `<a>` and `<img>`
- ☐ Tag open/close counts balanced for `table` / `tr` / `td` / `a` / `div`
- ☐ Descriptive comments stripped at promotion; functional `[if mso]` / `[if !mso]` conditionals kept
- ☐ **No literal template-tag strings inside comments.** Template engines expand tags inside HTML
  comments; a tag that emits an anchor can break the document. Write tag names without braces in prose.

**Accessibility**

- ☐ Body ≥14px, microcopy ≥12px, tap targets ≥44px via padding
- ☐ Meaningful `alt` on the artwork (B1); `aria-hidden` on every spacer and rule
- ☐ `lang` set; `role="article" aria-roledescription="email"` on the wrapper
- ☐ Plain-text alternative reviewed

**Weight**

- ☐ Built file well under ~102 KB
- ☐ Artwork derivatives sized and compressed; @1x supplied for the `background` attribute and VML

---

## 12. Approval Gates

### 12.1 Gate 1 — Geometry gate (**before** artwork is commissioned)

Compute and record: `ratio` · `band_height` · mobile reserved height at 375px · CTA offset at 375px ·
and, if B2 is proposed, `k` and `W*`.

**If `W* > 320`, B2 is refused at this gate.** This is the gate whose absence caused the v1–v26
history — every revision negotiated with an artwork that had already decided the architecture.

### 12.2 Gate 2 — Artwork Contract gate (**before** any HTML)

All six §4 conditions verified and recorded in the artwork register. **A failing artwork is returned for
re-export; it is never compensated for in HTML or CSS.**

### 12.3 Gate 3 — Build gate (**before** review)

The full §11 checklist, plus the automated scans (tag balance, anchor validity, `cover` count, duplicate
artwork count, `background` shorthand in dark-mode rules, hex format).

### 12.4 Gate 4 — Client validation gate (**before** any promotion to `Output/`)

```
☐ Gmail Web          ☐ Apple Mail desktop     ☐ Outlook desktop
☐ Gmail Android      ☐ Apple Mail iOS         ☐ Outlook mobile
☐ Gmail iOS          ☐ Apple Mail iPad        ☐ Samsung Mail
☐ Yahoo (where available)
☐ Dark mode: Apple Mail · iOS Mail · Outlook.com
☐ Images-disabled state
☐ Clickability re-verified AFTER a real ESP import
☐ Gmail app on a NON-GOOGLE account (the <head>-CSS-stripped path)
```

**A browser or desktop preview is never proof.** Anything not verifiable in the working environment is
reported as a **required manual pre-activation step**, never as a pass.

> ⚠️ **As of this document's establishment, no template in either project has been built to this
> standard and validated against the matrix above.** The architecture is settled by analysis; the render
> matrix is outstanding. Do not describe a Band-architecture Hero as production-validated until Gate 4 is
> complete and recorded.

### 12.5 Hero locking policy

A Hero whose engineering is settled is marked **`ARCHITECTURE LOCKED`** in the owning design document,
with its baseline file named.

**A locked Hero may be changed for exactly five reasons:**

1. A **verified** rendering bug — reproduced in a named client, not suspected or inferred
2. A client compatibility issue
3. An accessibility issue
4. A new brand requirement
5. An approved design revision

**Never make cosmetic or experimental changes to a locked Hero.** No re-tuning of spacing, ratios,
colours, crops or artwork "to see if it looks better", and no exploratory redesigns — not even if asked
casually. If a change is wanted, first establish which of the five reasons applies; if none does, say so
and recommend the effort go to unlocked components. **Iterating a finished Hero is not improvement, it is
churn, and churn is how a solved problem gets re-broken.**

**When a locked Hero genuinely must change:**

- Ship it as a **new draft version**; never edit a previous version in place.
- State the qualifying reason in the file header.
- Re-run the **regression evidence set** against the previous baseline: hash the inline styles, VML
  blocks, MSO conditionals, `height` attributes, `bgcolor` attributes, `href`s, `img src`s and `class`
  values, and report which sets are identical. A lock is only meaningful if changes to it are provably
  bounded.

**`ARCHITECTURE LOCKED` is not a production sign-off.** It means the engineering is settled and says
nothing about Gate 4. Record the two states separately and never let the first imply the second.

### 12.6 Draft versioning

All Hero work is authored in `Draft/` first. Every revision creates a **new** version; previous versions
are never overwritten, deleted or renumbered — they are the comparison and rollback trail. `Output/`
receives a build only after explicit approval of a **named** draft version, and never in the same turn
that produces a new draft.

---

## 13. Prohibited Hero Architectures

**Each entry below is prohibited on the basis of a measured engineering finding, not preference.** Each
records the mechanism, the client evidence, and the cost already paid.

### 13.1 ✘ Landing-page Hero relying on proportional left/right content

**What it is.** Copy in a left column, imagery in a right column, divided by a shape; the copy is
expected to stay inside the artwork's negative space as the email narrows.

**Why prohibited.** The artwork scales with viewport width; HTML type does not (§3.1). Drift accumulates
at `k` px per px of lost width, and below `W* = (inset + copy_w) / k` the overlay is geometrically
impossible (§3.3). For the measured artwork `W* = 510px` — **no phone reaches it**. Making the column a
percentage removes the drift but collapses the headline-to-body ratio from 2.0:1 to **1.2:1** at 320px
(§3.5). Making the clear zone wide enough would require `k ≥ 0.69`, confining imagery to ~30% of the
frame (§3.6).

**Client evidence.** No `vw`/`clamp()` in Outlook, Gmail or Yahoo, so type cannot be scaled to
compensate; `position` stripped by Gmail, so the copy cannot be placed proportionally.

**Cost already paid.** The primary cause of the v1–v26 cycle. Approximately 29 drafts across two
templates.

**Instead.** Divide along the height axis (Law 1, §2.1).

### 13.2 ✘ Text baked into Hero artwork

**Why prohibited.**

- **Images-off destroys the message entirely.** Only a single `alt` string survives. Blocked images are
  common in corporate and B2B mail.
- **Accessibility failure**: baked text cannot be announced beyond `alt`, resized, reflowed by a
  magnifier, adapted to high contrast, or translated (§10.1).
- **Personalisation impossible** — a flow Hero must be able to carry a defaulted first name.
- **Every copy change becomes an artwork re-export**, which makes A/B testing and correction expensive
  and slow.
- **Deliverability**: pushes the text-to-image ratio toward image-only.

**Honest acknowledgement.** Baking copy in *is* geometrically robust — everything scales together, so
there is no drift and no `W*`. That robustness was the legitimate reason it was adopted. **The Band
architecture delivers the same geometric robustness without the accessibility cost** (§2.1), which is why
the trade no longer needs to be made.

> ### ⚠️ This supersedes Campaign `CLAUDE.md` §6.15
>
> Campaign §6.15 (established RDD-2026-W30) required *"a single embedded Hero Banner artwork (including
> headline, eyebrow text, introduction, and CTA inside the image)"*. **That requirement is superseded by
> this standard for all new work.**
>
> - **Existing approved Campaign templates are grandfathered.** They are not defective and must not be
>   retrofitted without a specific instruction.
> - **§6.14 (edge-to-edge) stands unchanged** and applies to the artwork band.
> - **The single-anchor rule stands** for a linked artwork band.
> - **Operational consequence:** the Campaign artwork brief changes. Designers and generative tools must
>   be asked for a **band asset** (photographic content + shaped edge + flat termination band), not a
>   *finished hero* with copy in it. See §14.1.

### 13.3 ✘ CTA baked into artwork

**Why prohibited.** All of §13.2, plus:

- **The whole artwork becomes one click target**, so a reader who taps anywhere navigates — including
  taps intended to scroll or to zoom the image.
- **No tap-target guarantee.** A baked button cannot be sized to ≥44px independently of the image scale;
  at 320px a button drawn for 600px renders at 53% and falls below the floor.
- **No hover, focus or pressed state**, and no real anchor for assistive technology to announce as a
  control.
- **Destination changes require a re-export** even though the label did not change.
- **Klaviyo rewrites `href`s on import**; a single wrapping anchor gives no per-element verification.

### 13.4 ✘ Coupon code baked into artwork

**Why prohibited.** All of §13.2, plus:

- **The code cannot be selected or copied.** This is a direct, measurable conversion loss on mobile,
  where retyping a code from an image is the single largest friction point in redemption.
- **Per-profile dynamic codes become impossible**, so trackable unique coupons are ruled out and codes
  become shareable.
- **A code change requires an artwork re-export**, so an expired or deactivated code cannot be corrected
  quickly.
- **Not evergreen.** A flow sends unattended for months; a baked code cannot be rotated.

### 13.5 ✘ `background-size: cover` on a Hero, and any non-aspect-locked band

**Why prohibited.** `cover` **crops by definition** — it fills the box and discards the overflow;
`background-position` only selects *which* part is discarded. The visible region is therefore a function
of the **box aspect ratio**, and on mobile the box height is content-driven, so the aspect ratio — and
the crop — **changes per device.** A `cover` Hero can never reproduce its desktop composition on a phone,
and every attempt to tune it fixes one device while breaking another.

**Corollary, and the harder rule: never tune a crop to fix a composition problem.** If the brief is
"show all of it", the crop is the bug.

**Cost already paid.** Sixteen drafts of one template were spent tuning a crop that should never have
existed.

**Instead.** `contain`, set inline, on a band aspect-locked to the artwork's own ratio (§3.7). At an
aspect-exact box `contain` and `cover` render identical pixels, so adopting `contain` changes nothing at
600px and changes everything at every other width.

### 13.6 ✘ Geometry-dependent overlays — text positioned relative to an artwork feature

**Why prohibited.** Overlay itself is supported; **responsive overlay does not exist in email.** The
overlay is anchored by table padding in absolute px while the artwork's features sit at percentages of
`W`, so the two drift apart linearly (§3.3). There is no mechanism — in any client, framework or
template engine — to express "place this text at 5%–46% of the image's width."

**Permitted narrow exception:** copy over **flat artwork colour** under the §2.3 gate, where the copy's
position relative to a *feature* is irrelevant because there is no feature.

### 13.7 ✘ Responsive layouts that require proportional positioning

**Why prohibited.** Percentage `padding-top` reserves **height only**; it cannot position content
proportionally in two axes. `calc()`, `min()` and `max()` are unreliable in Outlook. `position` is
stripped by Gmail. Therefore any design whose correctness depends on an element sitting at a proportional
offset in both axes is unbuildable, and an approximation of it will drift.

### 13.8 ✘ Any Hero that cannot maintain identical visual hierarchy across desktop and mobile

**Why prohibited.** This is the outcome test that catches everything §13.1–§13.7 might miss. If element
order, surface or presence changes between 320px and 600px, the Hero is two designs wearing one name, and
the mobile one has never been designed — it is a by-product.

**Specific banned tactics:**

| Tactic | Why it fails |
|---|---|
| `display:none` on Hero content at one breakpoint | Invisible to every reader whose client strips `<head>` CSS; and if it is not legible at 320px it does not belong in the Hero at all |
| A second Hero image for mobile | Double download; ghost node; invisible to `<head>`-stripped clients |
| A per-breakpoint artwork canvas or crop | Two code paths; reintroduces §13.5 |
| A `max-height:0` / `overflow:hidden` reveal wrapper | Ghost-node pattern; strips to the wrong state |
| Shrinking type to force an overlay to fit | Collapses hierarchy (§3.5); breaches the §10.2 floor |
| Shortening copy to fix alignment | Copy length is not an alignment mechanism; structure is |

### 13.9 ✘ Migrating template frameworks to solve a Hero geometry problem

**Why prohibited.** MJML, Foundation for Emails (Inky) and Maizzle all compile to the same table +
inline-CSS subset and inherit an identical client constraint set. A framework changes authoring
ergonomics, never client capability.

| Framework | Assessment |
|---|---|
| **MJML** | `<mj-hero>` exists and emits the same VML + background-image pattern. Its fixed-height mode behaves cover-like, so adopting it would **reintroduce the crop prohibited by §13.5** — a regression, not a fix. |
| **Foundation for Emails (Inky)** | No Hero component; `container` / `row` / `columns` compile to tables. Offers no mechanism; you would hand-build what already exists. |
| **Maizzle** | Tailwind → inlined CSS. Lets you *author* `clamp()` and responsive prefixes, but `clamp()` is not honoured by Gmail or Outlook and responsive prefixes compile to media queries the Gmail app strips. |

**Instead.** Fix the artwork architecture (§4). That is where the constraint actually lives.

---

## 14. Future Hero Workflow

### 14.1 Order of operations — geometry before design

```
1  DEFINE          brand · campaign or flow · position in sequence · single action
                   ↓
2  GEOMETRY GATE   choose ratio → compute band_height, mobile reserved height,
                   CTA offset at 320/375/414.  If B2 is wanted: compute W*, and
                   refuse it if W* > 320.                                    ← Gate 1 (§12.1)
                   ↓
3  BRIEF ARTWORK   commission against the Artwork Contract (§4), stating:
                   • exact master dimensions and ratio
                   • "photographic content terminates along a shaped edge above a
                      SOLID <hex> band occupying the bottom ≥8% of the frame"
                   • "NO text, logo, CTA, coupon, price or date in the artwork"
                   • full-bleed rectangular, raster, @2x and @1x derivatives
                   ↓
4  ACCEPT ARTWORK  verify all six contract conditions; sample and publish the bond
                   hex; register it.  Failing artwork is RE-EXPORTED, never
                   compensated for in HTML.                                  ← Gate 2 (§12.2)
                   ↓
5  BUILD           assemble from SHARED COMPONENTS. New artwork + new copy only.
                   If new layout code is needed, STOP — the architecture is being
                   violated (§6).
                   ↓
6  BUILD GATE      full §11 checklist + automated scans                      ← Gate 3 (§12.3)
                   ↓
7  REVIEW          new Draft/-vN.  Report the CTA fold offset explicitly.
                   ↓
8  CLIENT MATRIX   §12.4 in full, including Gmail on a non-Google account    ← Gate 4 (§12.4)
                   ↓
9  APPROVAL        explicit approval of a NAMED draft version → Output/
                   ↓
10 LOCK            mark ARCHITECTURE LOCKED in the owning design doc, naming the
                   baseline file.  Record that Gate 4 is separate from the lock.
```

### 14.2 Briefing generative artwork tools

Generative tools are not the problem; the **brief** is. Asked for "a hero", an image model produces a
*landing-page* hero: a complete composition with implied text zones and features at specific positions.
That presupposes overlay geometry — the one thing email cannot provide.

**Brief the band, not the hero.** State the master dimensions, the shaped edge, the solid termination
band and its hex, and the explicit prohibition on text, logo, CTA and coupon. The same tool then produces
an asset that cannot break.

### 14.3 When someone proposes a Hero that this standard forbids

1. Compute `W*` and quote it. The number ends the discussion faster than an argument does.
2. Name which §13 entry applies and why.
3. Offer the Band equivalent of the same visual idea — a shaped edge in the artwork almost always
   preserves the intent.
4. If the request is reaffirmed, record it as an explicit, named exception with the reason and the
   accepted cost. **An exception applies to that one template and never travels to the next.**

### 14.4 Continuous improvement

**Root cause first.** Never ship a symptomatic Hero fix. Identify the true cause, fix it structurally,
propagate the fix into the shared component, and — if the lesson is reusable — **promote it into this
document in the same change** (both copies, §15).

**Keep this document architectural.** Brand values belong in the brand's design docs; flow and campaign
specifics belong in their own specs. This file holds only what is true for every brand and every send.

---

## 15. Hero Marketing Psychology

### 15.0 Why this section is in an engineering standard

§1–§14 were written from the **geometry** investigation. They work: the architecture they define cannot
crop, cannot drift, and cannot shear on reflow. A build that satisfies them is geometrically correct.

**A second investigation then found that a geometrically correct Hero can still fail.** The first build to
fully satisfy §1–§14 was reported as *"technically correct but visually fragmented — the artwork and the
message feel disconnected, it reads as two sections instead of one."* Every §11 check passed. The colour
bond was measured at **0 levels of difference**, so the join was literally invisible. Nothing in §1–§14 had
been violated.

That failure was **compositional, not geometric** — and compositional failures are detectable and
preventable by rule. **A rule that prevents a repeat investigation belongs in this document**, whatever
discipline it comes from. That is the whole purpose stated in §1.1.

This section is therefore normative, not advisory. It carries the second half of what "a correct Hero"
means.

### 15.1 Visual hierarchy — the mandatory reading order

Every Hero presents its elements in this order, top to bottom, and in this **source order**:

```
        VISUAL HOOK          artwork · masthead · product imagery
             ↓               attention, no information
        OFFER                the incentive, shortest read, highest information density
             ↓
        HEADLINE             the framing that elaborates the offer
             ↓
        CTA                  the single action
             ↓
        REASSURANCE          the last objection removed, at the point of action
```

**Why the offer precedes the headline.** The hook buys attention but delivers no information. The offer is
the shortest, highest-information element in the Hero — a reader absorbs *"10% off, code, 48 hours"* in
under a second. Placing it immediately after the hook **converts attention into a reason to keep reading
before** asking the reader to process a display headline. The headline then *elaborates* an incentive the
reader already holds, rather than competing with it for the same instant of attention.

Reversing them — headline, then offer — makes the display type the first thing to parse, and the reader
must decide whether to continue on the strength of a phrase rather than a value.

**Why placing artwork independently of the messaging is worse than either order.** A Hero is read as a
**chain**. Each element hands the eye to the next. When artwork sits outside that chain — a self-contained
photograph above an unrelated block of copy — the reader **completes the image, stops, and must re-enter
the content from a cold start.** Every re-entry is a drop-off point. A single continuous chain has one
entry and one exit; a fragmented Hero has two of each, and the second entry is optional.

**Engineering constraints on this order, so it stays email-safe:**

- It is achieved by **source order alone** — never by positioning. That keeps it identical in every client
  and makes the visual order and the screen-reader order the same thing (§10.3).
- It survives `<head>` CSS being stripped, because stacking order is structural.
- It is unaffected by reflow: the chain is vertical, and reflow only changes width (§8.1).

### 15.2 Composition versus geometry — two failure classes, one diagnostic

**A Hero can fail in two independent ways, and they need different fixes.**

| | **Geometry failure** | **Composition failure** |
|---|---|---|
| Nature | An **engineering** problem | A **communication** problem |
| Cause | Two coordinate systems that cannot be reconciled (§3.1) | Elements that do not read as one message |
| Fixed by | Architecture, arithmetic, a gate | Hierarchy, proportion, semantics, a bridge |
| Governed by | §2–§14 | §15 |
| Example | Copy overruns the artwork's feature by 74px at 375px | 47% of the Hero is a photograph that says nothing about the offer |

> **THE DIAGNOSTIC — apply this first, before proposing any fix:**
>
> **A geometry failure looks different between clients or between widths.**
> **A composition failure looks the same everywhere.**
>
> If the complaint reproduces identically at 320px, 375px, 600px, in Gmail, in Outlook and in Apple Mail,
> it is **not** a geometry problem and no amount of markup will fix it. Stop, and read §15.3–§15.6.

This diagnostic exists because the second investigation began by looking for a geometry cause that was not
there. Symptom vocabulary maps cleanly onto the two classes:

| Reported as | Class |
|---|---|
| "cropped" · "cut off" · "shifted down" · "different on iPhone" · "fixes keep moving the problem" | **Geometry** |
| "fragmented" · "reads as two sections" · "disconnected" · "why is this image here" · "the artwork dominates" · "feels like a landing page" | **Composition** |

**A geometry pass does not imply a composition pass.** They are separate reviews with separate outcomes,
and both are required before a Hero is approved (§12, and ECP-002 in
`Shared/Engineering/Engineering-Change-Management.md`).

### 15.3 Semantic continuity — the artwork must support the message

**Hero artwork must carry information that supports the campaign objective. Atmosphere alone is not
sufficient justification for a dominant image.**

**Why perceived unity depends on shared meaning.** A reader attributes relatedness to elements that share
*meaning* first and appearance second. Given a photograph of an office above the words *"your cart is
still waiting, here is 10% off"*, there is no shared referent — the image depicts neither the cart, the
products, nor the incentive. The reader's implicit question, *"why is this picture here?"*, is the
fragmentation. It is not a rendering artefact and it does not go away when the join is made invisible.

Conversely, when the artwork depicts what the message is about, unity is **free**: no bridge, no
proportion tuning and no colour matching is required, because meaning has already done the work.

**The rule:**

- Artwork that carries **message-relevant** content may be proportionally dominant.
- Artwork that carries **only atmosphere** must be proportionally subordinate (§15.5) **and** bridged
  (§15.4).
- Artwork that is **contradicted** by the message is a defect, not a style choice.

**Atmosphere remains a legitimate role** (§15.6, role 1) — it is simply a *constrained* one. The failure is
never "we used an atmospheric image"; it is "we used an atmospheric image at the proportion of a product
image."

### 15.4 The Visual Bridge

> **Every Hero that contains artwork must contain at least one design element that visually connects the
> artwork to the HTML.** This is a build requirement, not a refinement.

**Definition.** A Visual Bridge is a **single element perceived as belonging to both regions** — it either
spans the boundary, encloses both sides, or abuts the artwork so the artwork is seen to rest on it.

**Approved bridge forms**, all email-safe from painted cells and table structure alone:

| Bridge | How it connects | Notes |
|---|---|---|
| **Offer Bar** | A full-width coloured band abutting the artwork with **zero gap**, so the artwork visibly rests on it | Strongest option: it is simultaneously a bridge and a conversion element |
| **Colour Band** | A full-width painted band of ≥3px at the junction | Cheapest; a designed junction rather than an ambiguous one |
| **Continuous Card** | A bordered, filled container whose edge runs past the boundary on both sides | Strongest Gestalt cue after proximity. Also removes the §4.2 band requirement — a framed image is *supposed* to have edges |
| **Shared Container** | Artwork and copy inset within one visible container | As above |
| **Shared Background** | Both regions on one continuous surface | **Conditional — see below** |

#### ⚠️ Colour alone is not a bridge

**This is the finding that this section exists to record.** A colour-identical join removes a *divider*.
It does not supply a *connector*. Those are not the same thing:

- **Absence of separation** — nothing visually cuts the two regions apart.
- **Presence of connection** — an object the eye reads as belonging to both.

Gestalt similarity (shared colour) is a **weak** grouping cue. Enclosure and continuity are **strong**
ones. A full-bleed photograph is a *closed rectangular composition with its own internal logic*; it reads
as an object placed on a surface, not as part of the surface. Matching the colour behind and below it
changes nothing about that reading.

**Measured proof that colour is insufficient:** a build achieved a colour bond of **0 levels of difference
across the full width** — a mathematically perfect join, verified pixel by pixel — and was still reported
as reading in two sections. Perfect colour identity is therefore demonstrably not a bridge.

**When "Shared Background" *does* count as a bridge.** Only in combination with subordinate artwork
proportion (§15.5). Once the artwork is small enough to read as a *masthead or texture on* the surface
rather than as *an object placed on* it, the shared background becomes a genuine shared surface. The bond
mechanism in §2.1 is necessary and correct; §15.4 records that at dominant proportions **it is not
sufficient on its own.**

### 15.5 Artwork proportion — emphasis follows communication value

> **Allocate visual emphasis according to communication value, not image size. Photography exists to
> support conversion, not to replace messaging.**

**The rule of thumb:** an element's share of the first screen should not exceed its share of the message.

**The hard constraints:**

1. **Artwork carrying no message-relevant content must not exceed roughly one third of the Hero's
   height.** Beyond that its role stops being legible and it starts demanding an explanation the email
   cannot give.
2. **Artwork must never be the only thing between the top of the email and the offer.** If a reader must
   scroll past the image to discover why the email was sent, the image is costing conversions.
3. **Artwork must never dominate the first screen without contributing marketing information.** Dominance
   is earned by information, not by aspect ratio.

**Measured illustration.** The build that prompted this section allocated **47%** of Hero height (377px of
806px) to a photograph carrying **zero** marketing information, placed **above** the offer. The proposed
correction reduces it to **31%** and puts the offer immediately beneath it. Nothing else about the
architecture changed — the fragmentation was a proportion and ordering problem.

**A shallower ratio is the lever, and it is an artwork brief decision** (§4.1, §3.8) — not something to be
solved in markup after the asset exists. This is the same conclusion §4 reached about geometry, applied to
composition: **the artwork decides, so the brief must decide first.**

### 15.6 The four Hero marketing roles

**Every Hero has exactly one role. Declare it before designing.** The role determines the permitted
proportion, whether a bridge is required, and what the artwork brief must ask for.

| Role | The Hero's job | Artwork carries | Max share of Hero | Bridge required? | Typical use |
|---|---|---|---|---|---|
| **1 Atmospheric** | Set mood, brand context, credibility of setting | Mood only — no message information | **≤ ⅓** | **Yes, mandatory** | Brand context bands, secondary flows |
| **2 Product** | Show what the reader was buying or is being offered | The actual products, cart items, or restocked item — **highest** information | May dominate | Optional — meaning already bridges | Abandoned Checkout item recall, Back In Stock, Cross Sell |
| **3 Offer** | Make the incentive the focal point | Little or nothing; **the offer itself is the dominant element, in HTML** | Artwork minimal or absent | n/a | Promotional recovery, Winback, Price Drop |
| **4 Brand** | Recognition and trust | Logo, brand marks, credibility signals | Modest | Usually inherent | Welcome Series, Brand Story |

**Roles 2 and 3 never bake content into artwork.** Product and offer information stays live HTML in every
case (§13.2–§13.4). A "Product Hero" means the artwork *depicts* products; it does not mean prices or
names are rendered into the image.

#### Template 3 (RDD Abandoned Checkout, third touch) is an **Offer Hero**

**Why.** Its objective is recovery through an incentive. The reader has already had two reminders, so
neither brand introduction nor mood-setting is the job — **the incentive is the job.** The highest-value
elements are the discount, the code, and one action.

**The mismatch that caused the fragmentation, stated precisely:** it was *built* as an Atmospheric Hero —
a dominant office photograph, with the offer attached beneath it — while its objective made it an Offer
Hero. Every symptom follows from that single mismatch:

- the artwork could not support the message, because an atmospheric image never can (§15.3);
- it was allocated 47% of the Hero, the proportion of a Product Hero (§15.5);
- it competed with the headline for the focal point, so there were two (§15.1);
- and it needed a bridge, which colour alone could not provide (§15.4).

**The correction is to build the declared role:** demote the artwork to a subordinate atmospheric masthead
(≤⅓), promote the offer to the focal point directly beneath it, and let that offer element double as the
Visual Bridge.

**A role mismatch is the single most useful thing to check when a Hero "feels wrong" but passes every
geometry check.** Ask what the email's objective is, ask what role the Hero was built as, and compare.

---

## 16. Change log

| Date | Version | Change | Applied to both copies |
|---|---|---|---|
| 2026-07-29 | 1.0.0 | Document established from the completed v1–v26 Hero geometry investigation. Defines the Aspect-Locked Band + Colour-Bonded Copy architecture, the `W*` geometry gate, the Artwork Contract, and §13's prohibition list. **Supersedes Campaign §6.15** (baked-in Hero copy) for all new work; existing approved Campaign templates grandfathered. | ✔ |
| 2026-07-29 | **1.1.0** | **Added §15 Hero Marketing Psychology** from the composition investigation — mandatory reading order (§15.1), the composition-versus-geometry diagnostic (§15.2), semantic continuity (§15.3), the **Visual Bridge requirement** and the finding that **colour alone is not a bridge** (§15.4), proportion-follows-communication-value (§15.5), and the four Hero marketing roles with Template 3 declared an **Offer Hero** (§15.6). Change log renumbered §15 → §16. Companion records: **ADR-009** and **ECP-002**. | ✔ |

**Version note.** Classified **MINOR (1.1.0)** rather than MAJOR because no template that is both
conforming and promoted to `Output/` becomes non-conforming — `Output/` is empty for Template 3 and the
approved Templates 1–2 Heroes were already superseded at 1.0.0. **Part 3 Draft v4 conforms to 1.0.0 but
would not satisfy 1.1.0 §15.4 and §15.5**; as an unapproved draft it is grandfathered at its recorded
version (`Engineering-Versioning.md` §5, §7.1) pending the Offer-Hero rebuild. If the Owner considers a
draft in scope for conformance, this becomes **2.0.0** — an Owner call, flagged rather than assumed.

---

*Establishing evidence: RDD Abandoned Checkout Templates 1–2 (Draft v1–v26) and Template 3 (Part 3
Draft v1–v3); pixel sampling of the `w_600` artwork render; computed WCAG relative luminance; geometric
simulation at 320 / 375 / 414 / 600px. Cerberus `fa6de2e` is the external rendering authority for the
mechanisms cited in §9.*
