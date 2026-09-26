# QA Report — SS-2026-35

- **Brand:** SS
- **Draft assessed:** v2
- **Generated:** 2026-09-20T14:42:28.567Z
- **Result:** ✅ PASS (no blockers)
- **Findings:** 0 blocker · 0 warn · 20 pass

> Automated QA (Architecture V2 §2.6) encoding CLAUDE.md §6/§8. A browser preview is not
> sufficient proof (§8.1); client-level checks (Klaviyo/Gmail/Apple Mail/Outlook) remain a
> manual pre-send step and are listed at the end.

## Automated checks

| | Check | Ref | Detail |
|---|---|---|---|
| ✅ | unresolved-tokens | render/§5 | No unresolved tokens. |
| ✅ | anchor-balance | §6.23 | Anchors balanced (65). |
| ✅ | table-in-anchor | §6.6 | No <table> inside an <a>. |
| ✅ | nested-anchors | §8.2 | No nested anchors. |
| ✅ | empty-anchors | §8.2 | No empty anchors. |
| ✅ | image-anchor-display-block | §6.6 | No display:block on image-wrapping anchors. |
| ✅ | bad-hrefs | §6.7 | All hrefs are real destinations. |
| ✅ | merge-tag-in-attribute | §6.23 | Footer merge tags use the URL form; no tag leaks in attributes. |
| ✅ | image-src | §8 | All 24 image src(s) are absolute HTTPS. |
| ✅ | image-dims | §6.6 | All images carry width & height attributes. |
| ✅ | gmail-clip | §8.3 | HTML is 63.8KB (well under 102KB clip). |
| ✅ | structure | CS-08/CS-14 | Doctype, closing html, and preheader present. |
| ✅ | footer-link-contrast | CLAUDE.md/footer | Footer link colour differs from its background. |
| ✅ | stray-comment-artifact | render/§8.3 | No leaked component doc-comment prose in the body. |
| ✅ | theme-coherence | CLAUDE.md/theme-coherence | Hero, sections and products all support "Platform Trolley". |
| ✅ | ss-visual-header | CLAUDE.md §6.1 | Header is not a solid accent-colour block. |
| ✅ | ss-visual-section-heading | CLAUDE.md §6.21 | No generic tinted-panel section summary detected. |
| ✅ | ss-visual-price-button | CLAUDE.md §6.17 | No boxed button-style price detected. |
| ✅ | ss-visual-planning-copy | CLAUDE.md §9/§5 | No planning/internal language detected in customer-facing copy. |
| ✅ | link-http-200 | §8/§8.1 | All 38 URL(s) returned HTTP 200. |

## Live link verification (HTTP 200)

Checked 38 distinct URL(s); 0 failed.

## Decision provenance

```json
{
  "candidateSource": "override:SS-2026-35",
  "groups": [
    {
      "title": "Platform Trolleys & Loading Ramps",
      "count": 18
    }
  ],
  "verifiedCount": 18,
  "subjectFrom": "content-override (authored)",
  "generatedBy": "content-override (platform/ai/copy.js buildOverridePackage)"
}
```

## Manual pre-send gate (not automatable here — §8.1)

- [ ] Klaviyo Preview · Gmail Web · Gmail Mobile (Android & iOS) · Apple Mail · Outlook
- [ ] Clickability verified AFTER Klaviyo import (links survive the rewrite, §6.6/§8.1)
- [ ] Recorded approval by a reviewer who is NOT the author (CR-16/CR-17)

**Send status:** `NOT APPROVED TO SEND` — presence in Output/ is preview only (CLAUDE.md §4.1/§9).
