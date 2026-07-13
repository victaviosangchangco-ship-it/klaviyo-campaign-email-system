# Shared Font Stacks

Email-safe font handling for the framework. **Brand typefaces are not defined here** — each brand's
faces live in its `Design.md` and are injected at generation via the `[[FONT_STACK]]` /
`[[HEADING_FONT_STACK]]` tokens. This file documents the shared fallback policy those tokens must
satisfy.

## Policy

- Every text element uses a `[[FONT_STACK]]` or `[[HEADING_FONT_STACK]]` token — never a hardcoded
  family in a component or template.
- The resolved value **must end in an email-safe generic fallback** so text renders even when a brand
  face is unavailable or blocked.

## Recommended fallbacks (guidance for generation, not a brand value)

| Token | Typical resolved value |
|-------|------------------------|
| `[[FONT_STACK]]` (body) | `Arial, Helvetica, sans-serif` |
| `[[HEADING_FONT_STACK]]` | brand display face, then `Arial, Helvetica, sans-serif` |

## Notes

- Web fonts / custom faces are unreliable across email clients; treat any brand display face as
  enhancement over the email-safe fallback (or render it as an image in the logo/hero only).
- Do not introduce a font-family in a component to "make it look right" — if a brand face is unknown,
  the token resolves to the email-safe fallback and the value is recorded as *To be confirmed* in the
  brand's Design source.
