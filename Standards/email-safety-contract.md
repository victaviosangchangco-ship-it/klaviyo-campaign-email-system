# Email Safety Contract (Runtime)

All email-client safety rules in one place. Load during every HTML build.
Full engineering history: `Archive/CLAUDE-LEGACY.md`. Cerberus reference: `Shared/Frameworks/Cerberus/`.

---

## Link & Containment Safety

- **Never wrap a `<table>` inside an `<a>`.** Klaviyo rewrites links on import and detaches the href.
  Product cards: image / title / price as **separate sibling anchors** to the same URL.
- **Never put `display:block` on an image-wrapping `<a>`.** Anchor stays inline; `<img>` is the block
  element. Apple Mail iOS collapses block anchors before image decode.
- **Every `href` must return HTTP 200.** No `#`, empty, placeholder, `localhost`, `127.0.0.1`, local
  filesystem paths, or VS Code Live Server URLs in production HTML.
- **Every `<img src>` must be public absolute HTTPS**, returning HTTP 200 with `image/*`, no redirects.
- **Every fixed-size image needs explicit `width` and `height` HTML attributes.**
- Fluid images: `width:100%; max-width:Npx; height:auto` + real pixel `width`/`height` attrs.
- `display:block` on `<img>` (kills baseline gap). `border:0; outline:none; text-decoration:none`.

## Gmail Mobile Protection (§6.16 equivalent)

Page background on a **full-width wrapper `<table>`** via BOTH `bgcolor` AND inline `background`.
Gmail drops `<body>`/`<center>` backgrounds.

**Required shell:**
```
<body style="margin:0; padding:0; background:#f0f0f0;">
  <table role="presentation" width="100%" ... bgcolor="#f0f0f0" style="...background:#f0f0f0;">
    <tr><td align="center" style="padding:0;">
      <!--[if mso]><table width="600" ...><tr><td><![endif]-->
      <table class="email-container" width="100%" ... bgcolor="#ffffff"
             style="width:100%; max-width:600px; margin:0 auto; background:#ffffff;">
        ... content ...
      </table>
      <!--[if mso]></td></tr></table><![endif]-->
    </td></tr>
  </table>
</body>
```

- **Every coloured section carries `bgcolor` on BOTH the `<table>` AND its content `<td>`.**
  Gmail mobile paints cell backgrounds, not table backgrounds. Omitting cell `bgcolor` causes
  white strips/seams.
- Content container must be **fluid**: `width="100%"` + `max-width:600px`. Never a fixed-only
  `width="600"`.
- MSO ghost table locks 600px for Outlook. `[if mso]` conditionals are **functional** — keep them.

## Footer Merge-Tag Validity (§6.23 equivalent)

- **Inside an `href`, use URL-only tags:** `{% unsubscribe_link %}` and `{% manage_preferences_link %}`.
- **Never** put `{% unsubscribe %}` / `{% manage_preferences %}` inside an `href` — they emit a complete
  `<a>` element, causing nested anchors and visible HTML attribute text.
- **Never invent a merge variable.** `{{ manage_preferences_url }}` etc. are NOT valid Klaviyo tags.
- Footer links: **Unsubscribe · Privacy Policy** (Manage Preferences only when explicitly requested).

## Ghost Element Inspection

Run on every build. Remove before Output:
- Empty anchors (`<a></a>` or whitespace-only content)
- Nested anchors (`<a>` inside `<a>`)
- Empty `<td>`, `<tr>`, ghost tables with no content
- Zero-width/zero-height links, `display:none` links
- `href="#"` or empty `href`
- Tag balance: count of `<a ` must equal count of `</a>`; same for `<table>`, `<tr>`, `<td>`
- Stray whitespace between hero `<td>`, `<a>`, and `<img>` — collapse to zero whitespace

## Gmail Clip Prevention

- Keep built HTML **well under ~102 KB**.
- Strip all non-functional comments. Keep only MSO conditionals.
- Minimal preheader (single line, no long `&zwnj;&nbsp;` runs).
- Never add hidden preview blocks, decorative dots, or invisible spacer content proactively.

## Responsive Rules

- Product cards stack with `.pc{display:block!important;width:100%!important;box-sizing:border-box!important}`.
- Fixed-height cells reset on mobile: `.pimg,.pnc,.pdc,.ppc,.tct,.tcs{height:auto!important}`.
- Mobile images: `.pc img{width:100%!important;height:auto!important}` BUT exclude brand marks
  (`.pc img.brandmark{width:15px!important;max-width:15px!important}`).
- Tap targets ≥ 44px via padding, not by widening.
- Body must never scroll horizontally.

## Typography & Colour

- **Six-digit hex only** (`#ffffff`, never `#fff` or `rgb()`).
- Restate `font-family`, `font-size`, `font-weight`, `line-height`, `color` on every text `<td>` —
  Outlook resets inherited properties across nested tables.
- Inline-block hybrid columns: parent cell `font-size:0` (kills whitespace gap); restate size inside.
- `<p style="margin:0;">` — zero out defaults inline.

## Accessibility

- `role="article" aria-roledescription="email" lang="en"` on the outer wrapper.
- `aria-hidden="true"` on every spacer, divider, and decorative element.
- `alt=""` on decorative images. Meaningful `alt` on content images.
- Destination-descriptive link text (avoid "Click Here" / "Learn More").

## Dark Mode

- `color-scheme: light dark` meta tag + `:root` declaration.
- `prefers-color-scheme` + `[data-ogsc]` overrides.
- Brand-specific dark-mode classes in `base-head.html`.
