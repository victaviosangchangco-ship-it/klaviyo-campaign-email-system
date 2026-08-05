# Cerberus — Email Client Compatibility

> What each client supports, what it breaks, which Cerberus technique fixes it, and what we must
> verify before an email ships.
>
> Companion to [Analysis](Cerberus-Analysis.md) · [Techniques](Cerberus-Techniques.md) ·
> [Components](Cerberus-Components.md) · [Best Practices](Cerberus-Best-Practices.md)

---

## 1. The three rendering engines

Almost every email defect traces back to which engine parses the HTML.

| Engine | Clients | Character |
|--------|---------|-----------|
| **Microsoft Word** | Outlook 2007–2021 Windows, Outlook 365 Windows desktop | No `max-width`, no `min-width`, no `display:inline-block`, no media queries, no `background-size`, no CSS animation, no `border-radius`. Honours `width`/`height` attributes, `bgcolor`, VML, and CSS in `<head>`. **Fixed-height `<td>` is the only reliable sizing primitive.** |
| **WebKit / Blink** | Apple Mail (macOS + iOS), Gmail apps, Outlook mobile, Samsung Mail, most modern webmail | Broadly modern CSS. The problems are **rewriting** (Gmail) and **decode ordering** (Apple Mail iOS), not lack of support. |
| **Gmail's sanitiser** | Gmail Web, Gmail Android, Gmail iOS | Rewrites `<body>`, drops CSS `background` on tables/cells, and **strips `<head>` styles entirely for non-Google accounts in the app**. Clips messages over ~102 KB. |

**Design consequence:** structure must be carried by **table markup + HTML attributes + inline
styles**. `<head>` CSS is progressive enhancement, never load-bearing. This is the whole argument for
the hybrid pattern.

---

## 2. Client-by-client

### 2.1 Outlook — Windows desktop (Word engine)

**The strictest target. If it works here, it usually works everywhere.**

| Breaks | Fix |
|--------|-----|
| `max-width` / `min-width` ignored → container spans full width | MSO ghost table at fixed 600px |
| `display:inline-block` ignored → hybrid columns stack | MSO ghost table with real `<td width="…">` cells |
| Media queries ignored | Never carry layout in a media query |
| `border-radius` ignored → square buttons | VML `roundrect` with `arcsize` |
| `background-size` / `background-position` ignored | VML `v:rect` + `v:fill` |
| Background images cannot scale | Supply the VML `src` at **@1x** |
| Extra spacing around tables | `mso-table-lspace: 0pt; mso-table-rspace: 0pt` |
| Line-height inflated | `mso-line-height-rule: exactly` |
| `min-height` ignored → cards drift | **Fixed-height `<td height="N">` + `height:Npx` inline** |
| Anchors are not block-level → button padding ignored | Duplicate fill/padding onto the `<td>` |
| Web-font reference → whole document falls back to **Times New Roman** | `<!--[if mso]><style>* { font-family: sans-serif !important; }</style><![endif]-->` |
| Background images at 72ppi render oversized | `<o:OfficeDocumentSettings><o:PixelsPerInch>96` |
| `prefers-color-scheme` unsupported → both light and dark logos render | Guard the dark image with `<!--[if !mso]><!-->` |
| Images downscale poorly | `-ms-interpolation-mode: bicubic` |

**Must verify:** ghost tables hold 600px · VML buttons render (square fallback acceptable, must not
vanish) · grid cards equal height · every full-width background carries a `bgcolor` attribute · fonts
did not fall back to Times New Roman.

---

### 2.2 Outlook.com / Outlook mobile / Outlook macOS

Modern engines, **not** the Word engine — most of §2.1 does not apply.

- **Outlook.com dark mode** inverts colours and does **not** honour `prefers-color-scheme` the same
  way. It exposes a `[data-ogsc]` (Outlook Get Style Class) hook instead.
  **Cerberus does not cover this; we do** — our `base-head.html` already ships `[data-ogsc]`
  duplicates of every dark-mode rule. Keep them.
- Outlook mobile is Blink-based and generally well-behaved.

---

### 2.3 Gmail — Web

| Breaks | Fix |
|--------|-----|
| Message clipped over **~102 KB** → footer behind "View entire message" | Strip descriptive comments, no `&zwnj;` runs, no CSS inliner, minimal table tree |
| Download-button overlay on large unlinked images | `.a6S { display:none; opacity:0.01 }` + `img.g-img + div { display:none }` |
| Text recoloured inside a conversation thread | `.im { color: inherit !important; }` |
| Auto-detected addresses/dates styled as links | `.aBn` + `unstyle-auto-detected-links` |
| `<style>` supported here — but not everywhere in Gmail | Never depend on it for structure |
| Content that duplicates an earlier message in the same thread is collapsed behind "…" | **Not a markup defect** — always retest on a fresh subject line before chasing it (C§8.2, C§8.3) |

---

### 2.4 Gmail — Android and iOS apps ⚠️ highest-risk

**The single most common source of "it looked fine in preview" defects for us.**

| Breaks | Fix |
|--------|-----|
| **`<head>` styles stripped entirely for non-Google accounts** (IMAP/Exchange added to the Gmail app) — an estimated third of app users | Layout must work from inline styles + attributes alone. **This is the hybrid argument.** |
| `<body>` rewritten; CSS `background` dropped on tables and cells → white side gutters and white seams between sections | `bgcolor` **attribute** on every coloured `<table>` **and** its content `<td>`, identical hex to the inline value (C§6.16) |
| Fixed `width="600"` container cannot shrink when media queries are stripped | Fluid container: `width="100%"` + `style="width:100%; max-width:600px"` |
| Right-hand gutter in the iOS app | `u ~ div .email-container { min-width: …px }` per device width ★ |
| Filled `inline-block` anchors coerced toward full width → price badges stretch across the card | Shrink-to-fit `<table>` with no `width` attribute (C§6.17) |
| Oversized images fail to load → broken icon + alt text | Keep image payload modest; well-compressed JPEG over multi-hundred-KB PNG |
| Heavy GIFs (>~2 MB) blank out | Target ≤1 MB; reduce frames and dimensions, not quality flags (C§6.19) |

**Must verify on both Android and iOS:** no white gutters · no seams between adjacent same-colour
sections · price badges compact and centred · 2-col grid stacks cleanly · images render · no
horizontal scroll · hero at full width.

---

### 2.5 Apple Mail — macOS and iOS

Best CSS support of any mail client. Two specific traps, both ours by hard experience:

| Breaks | Fix |
|--------|-----|
| **`display:block` on an anchor wrapping an image → anchor collapses to zero height, image never paints.** iOS WebKit resolves the block height before the image decodes; desktop decodes-then-reflows and recovers, so it fails **only on iPhone** | Keep the `<a>` inline; put `display:block` on the `<img>` (C§6.6) |
| **An image with no `width`/`height` attributes is dropped** — no intrinsic box to reserve | Always give real pixel `width` and `height` attributes, then scale with `width:100%; height:auto` |
| iOS auto-scales the whole message | `<meta name="x-apple-disable-message-reformatting">` ★ |
| iOS auto-links phone numbers, dates, addresses in blue | `<meta name="format-detection" content="telephone=no,address=no,email=no,date=no,url=no">` ★ and `a[x-apple-data-detectors]` ★ |

**Apple Mail on iPhone is the strictest common WebKit client. A desktop Safari render proves nothing
about it.**

---

### 2.6 Samsung Mail (Android)

| Breaks | Fix |
|--------|-----|
| Message rendered narrower than the viewport | `#MessageViewBody, #MessageWebViewDiv { width: 100% !important; }` ★ |

---

### 2.7 Android 4.4 native mail (legacy)

| Breaks | Fix |
|--------|-----|
| Injects `margin: 16px 0` on a wrapper div | `div[style*="margin: 16px 0"] { margin: 0 !important; }` ★ |
| Notification preview uses the `<title>` | Ship a real, non-empty `<title>` ★ |

---

### 2.8 Yahoo Mail / AOL

Media-query support is partial and historically unreliable. Same conclusion as Gmail mobile: the
layout must work without them. Yahoo also does not render SVG.

---

### 2.9 Windows 10 Mail

| Breaks | Fix |
|--------|-----|
| Underlines links despite inline CSS | `a { text-decoration: none; }` in `<head>` |
| Background colour needs the MSO conditional wrapper | `<!--[if mso | IE]>` wrapper table with the page background |

---

## 3. Feature support matrix

✅ works · ⚠️ partial / conditional · ❌ unsupported

| Feature | Outlook Win | Outlook.com | Gmail Web | Gmail app (Google acct) | Gmail app (non-Google) | Apple Mail | Apple Mail iOS | Yahoo | Samsung |
|---|:--:|:--:|:--:|:--:|:--:|:--:|:--:|:--:|:--:|
| `<table>` layout | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Inline CSS | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| `<head>` `<style>` | ✅ | ✅ | ✅ | ✅ | ❌ | ✅ | ✅ | ⚠️ | ✅ |
| Media queries | ❌ | ✅ | ⚠️ | ⚠️ | ❌ | ✅ | ✅ | ⚠️ | ✅ |
| `max-width` | ❌ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| `display:inline-block` | ❌ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| `border-radius` | ❌ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| CSS `background-image` | ❌ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| `background-size` | ❌ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ⚠️ | ✅ |
| VML | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| `bgcolor` attribute | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| CSS `background` on `<td>` | ⚠️ | ✅ | ✅ | ⚠️ | ⚠️ | ✅ | ✅ | ✅ | ✅ |
| `height` attribute on `<td>` | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| `min-height` | ❌ | ✅ | ✅ | ✅ | ⚠️ | ✅ | ✅ | ⚠️ | ✅ |
| `flex` / `grid` | ❌ | ⚠️ | ❌ | ❌ | ❌ | ✅ | ✅ | ❌ | ⚠️ |
| `float` | ❌ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| `prefers-color-scheme` | ❌ | ⚠️ `[data-ogsc]` | ❌ | ❌ | ❌ | ✅ | ✅ | ❌ | ⚠️ |
| Web fonts | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ | ❌ | ⚠️ |
| Animated GIF | ❌ 1st frame | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| SVG in `<img>` | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ | ❌ | ❌ |
| `:hover` | ❌ | ✅ | ❌ | ❌ | ❌ | ✅ | ⚠️ | ⚠️ | ⚠️ |

**Read the two Gmail-app columns together.** The difference between them — `<head>` CSS present or
absent — is the entire justification for building hybrid.

---

## 4. Which technique fixes which client

| Technique | Outlook Win | Gmail app | Apple Mail iOS | Samsung | Android 4.4 |
|---|:--:|:--:|:--:|:--:|:--:|
| MSO ghost tables | ✅ primary | — | — | — | — |
| VML roundrect / rect | ✅ primary | — | — | — | — |
| `mso-*` properties | ✅ primary | — | — | — | — |
| Hybrid `inline-block` + `min/max-width` | via ghost | ✅ primary | — | — | — |
| Fluid container `width:100%; max-width` | via ghost | ✅ primary | ✅ | ✅ | — |
| `bgcolor` on table **and** cell | ✅ | ✅ primary | ✅ | ✅ | ✅ |
| Fixed-height `<td>` | ✅ primary | ✅ | ✅ | ✅ | ✅ |
| `display:block` on `<img>`, inline `<a>` | — | ✅ | ✅ primary | ✅ | — |
| `width`/`height` attributes on images | ✅ | ✅ | ✅ primary | ✅ | ✅ |
| Shrink-to-fit badge table | ✅ | ✅ primary | ✅ | ✅ | ✅ |
| Three sibling anchors (Klaviyo) | ✅ | ✅ | ✅ | ✅ | ✅ |
| `u ~ div .email-container` | — | ✅ iOS only | — | — | — |
| `#MessageViewBody` | — | — | — | ✅ primary | — |
| `div[style*="margin: 16px 0"]` | — | — | — | — | ✅ primary |
| `.a6S` / `.g-img` | — | ✅ web | — | — | — |
| `.im { color: inherit }` | — | ✅ web | — | — | — |
| `x-apple-disable-message-reformatting` | — | — | ✅ primary | — | — |
| `format-detection` meta | — | — | ✅ primary | — | — |
| `[data-ogsc]` | Outlook.com | — | — | — | — |

---

## 5. Mandatory verification matrix

**A browser or localhost render is never proof.** Both systems already require this (C§8.1, F§9.1);
Cerberus's compatibility analysis reinforces exactly which checks matter where.

| Client | Must verify |
|--------|-------------|
| **Klaviyo Preview** | Template imported cleanly; no unrendered `{{` / `{%`; footer links are link text only, not raw markup |
| **Klaviyo test import** | **Clickability after the rewrite** — hero, card image / title / price, CTAs, nav, coupon all navigate to the correct live URL |
| **Gmail Web** | No "…" bubble on a *fresh thread*; footer visible without "View entire message"; no download-button overlay |
| **Gmail Android** | No white gutters or seams; badges compact; grid stacks; images render; no horizontal scroll |
| **Gmail iOS** | As Android, **plus** no right-hand gutter |
| **Apple Mail desktop** | Layout, dark mode, web font (if any) |
| **Apple Mail iPhone** | **Every image paints** (zero-height anchor collapse); hero full width; tap targets ≥44px |
| **Outlook desktop** | 600px held by ghost table; buttons visible; cards equal height; backgrounds painted; not Times New Roman |
| **Outlook.com** | Dark mode via `[data-ogsc]` |
| **Outlook mobile** | General layout |
| **Samsung Mail** *(where available)* | Full-viewport width |
| **Yahoo** *(where available)* | Layout holds without media queries |

**Report honestly.** Any client that cannot be exercised in this environment is recorded in `Review/`
as a **required manual pre-send step** — never as a pass.

---

## 6. Known-defect quick reference

| Symptom | Likely cause | Section |
|---------|--------------|---------|
| Card renders but is dead after Klaviyo upload | `<table>` inside an `<a>` | C§6.6 · [BP §5.3](Cerberus-Best-Practices.md) |
| Image missing on iPhone only | `display:block` on the image-wrapping anchor | C§6.6 · [BP §5.5](Cerberus-Best-Practices.md) |
| Image missing on iPhone, present elsewhere | No `width`/`height` attributes | C§6.6 |
| White strips left/right on Gmail mobile | Background CSS-only; no `bgcolor` on the cell | C§6.16 · [BP §5.1](Cerberus-Best-Practices.md) |
| White seams between same-colour sections | `bgcolor` missing on adjacent sections' cells | C§6.16 |
| Right-hand gutter, Gmail iOS only | Missing `u ~ div .email-container` min-width | [Tech §1](Cerberus-Techniques.md) |
| Price badge full-width on Gmail mobile | Bare `display:inline-block` filled anchor | C§6.17 · [BP §5.4](Cerberus-Best-Practices.md) |
| Cards uneven height in Outlook only | `min-height` instead of fixed-height `<td>` | C§6.8 |
| Region height differs per client | `height` **and** `padding` on the same cell (content-box vs border-box) | F§8.3 |
| Last odd card left-aligned | Missing `colspan` on the row cell | C§6.9 |
| Thin white strip under the hero | No `font-size:0; line-height:0` on the hero `<td>`, or image not `display:block` | C§6.14 |
| Footer behind "View entire message" | File over ~102 KB | C§8.3 |
| Floating "…" bubble | Ghost nodes — *or* Gmail's quoted-content collapse on a repeated thread | C§8.2 |
| Everything Times New Roman in Outlook | Unguarded web-font reference | [Tech §12](Cerberus-Techniques.md) |
| Both logos visible in Outlook | Dark image not guarded by `[if !mso]` | [Tech §9.3](Cerberus-Techniques.md) |
| Blue underlined address in the footer | Missing `unstyle-auto-detected-links` | [Tech §1](Cerberus-Techniques.md) |
| Download icon over a large image in Gmail | Missing `.g-img` / `.a6S` | [Tech §1](Cerberus-Techniques.md) |
| Gap between hybrid columns | Missing `font-size:0` on the parent cell | [Tech §3](Cerberus-Techniques.md) |
| Hybrid column wraps one step early | Missing `margin: 0 -1px` | [Tech §3](Cerberus-Techniques.md) |
| Right-thumbnail row stacks text-first on mobile | Missing `direction:ltr` in the stack rule | [Tech §5](Cerberus-Techniques.md) |

---

_Compatibility reference for Cerberus `fa6de2e` · 2026-07-28. Verify unfamiliar properties at
[caniemail.com](https://www.caniemail.com/) before use._
