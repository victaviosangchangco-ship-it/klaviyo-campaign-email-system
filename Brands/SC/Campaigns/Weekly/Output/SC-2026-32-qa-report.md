# QA Report — SC-2026-32

- **Brand:** SC
- **Draft assessed:** v3
- **Generated:** 2026-08-10T01:57:06.279Z
- **Result:** ✅ PASS (no blockers)
- **Findings:** 0 blocker · 0 warn · 12 pass

> Automated QA (Architecture V2 §2.6) encoding CLAUDE.md §6/§8. A browser preview is not
> sufficient proof (§8.1); client-level checks (Klaviyo/Gmail/Apple Mail/Outlook) remain a
> manual pre-send step and are listed at the end.

## Automated checks

| | Check | Ref | Detail |
|---|---|---|---|
| ✅ | unresolved-tokens | render/§5 | No unresolved tokens. |
| ✅ | anchor-balance | §6.23 | Anchors balanced (69). |
| ✅ | table-in-anchor | §6.6 | No <table> inside an <a>. |
| ✅ | nested-anchors | §8.2 | No nested anchors. |
| ✅ | empty-anchors | §8.2 | No empty anchors. |
| ✅ | image-anchor-display-block | §6.6 | No display:block on image-wrapping anchors. |
| ✅ | bad-hrefs | §6.7 | All hrefs are real destinations. |
| ✅ | merge-tag-in-attribute | §6.23 | Footer merge tags use the URL form; no tag leaks in attributes. |
| ✅ | image-src | §8 | All 34 image src(s) are absolute HTTPS. |
| ✅ | image-dims | §6.6 | All images carry width & height attributes. |
| ✅ | gmail-clip | §8.3 | HTML is 71.6KB (well under 102KB clip). |
| ✅ | structure | CS-08/CS-14 | Doctype, closing html, and preheader present. |

## Live link verification (HTTP 200)

⚠️ **Not run** in this build (offline / not requested). Re-run with `--verify-links`, and
verify clickability **after Klaviyo import** before send (§8.1). This is a required manual gate.

## Decision provenance

```json
{
  "candidateSource": "calendar:SC-2026-32",
  "category": "Bath Aids",
  "verifiedCount": 16,
  "subjectFrom": "calendar.subject_line",
  "generatedBy": "calendar-driven (LLM seam: platform/ai/copy.js buildCalendarPackage)"
}
```

## Manual pre-send gate (not automatable here — §8.1)

- [ ] Klaviyo Preview · Gmail Web · Gmail Mobile (Android & iOS) · Apple Mail · Outlook
- [ ] Clickability verified AFTER Klaviyo import (links survive the rewrite, §6.6/§8.1)
- [ ] Recorded approval by a reviewer who is NOT the author (CR-16/CR-17)

**Send status:** `NOT APPROVED TO SEND` — presence in Output/ is preview only (CLAUDE.md §4.1/§9).
