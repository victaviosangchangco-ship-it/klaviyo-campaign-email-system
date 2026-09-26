# Review HTML — Runtime Instructions

Short runtime checklist for reviewing campaign HTML before promotion to Output.

---

## Review Steps

1. **Compare against the approved structural baseline** — load the brand's most recent approved
   Output campaign and confirm the structural architecture is preserved (container, header, hero,
   grid, footer, MSO conditionals, responsive classes).
2. **Validate campaign intent** — does the email match the Brief? Correct theme, correct products,
   correct messaging, correct hero, correct campaign type.
3. **Validate brand** — correct logo, colours, fonts, tone, contact details, sender identity, URLs.
4. **Validate HTML structure** — run `Standards/email-safety-contract.md` checks:
   - No `<table>` inside `<a>`
   - No `display:block` on image-wrapping anchors
   - No nested anchors
   - No empty/ghost elements
   - Tag balance (`<table>`, `<tr>`, `<td>`, `<a>` open == close)
   - No unresolved `[[TOKEN]]`s
   - MSO conditionals preserved
   - Well under Gmail ~102 KB clip
5. **Validate responsive product grid** — `Standards/product-grid-contract.md`:
   - Equal-height cards via fixed-height `<td>`
   - Price badges = shrink-to-fit centred tables (not bare inline-block)
   - Odd last card centred with colspan
   - Mobile stack works, brand marks not enlarged
6. **Validate links/data** — every `href` and `<img src>` is public absolute HTTPS returning HTTP 200.
   Every product is verified in stock, visible, correct price. No fabricated data.
7. **Record in `Review/`** — blockers, warnings, pass/fail per item, which clients checked,
   which Draft version assessed.
8. **Never promote a failing Draft.** Blockers gate the send, not the file's presence in Output
   (Output always holds the latest build for preview/QA).

## Blocker categories

- **Hard blocker (blocks send):** dead link/404, out-of-stock product linked, hidden product,
  fabricated data, HTML structural defect, empty preheader, merge-tag error
- **Warning (document, fix if possible):** image > 2 MB, near Gmail clip limit, minor alignment
  issue on one client, missing alt text
- **Pass:** all checks verified across the client matrix
