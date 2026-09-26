# QA Report — SS-2026-36

- **Brand:** SS
- **Draft assessed:** v7
- **Generated:** 2026-09-26T12:17:07.188Z
- **Result:** ✅ PASS (no blockers)
- **Findings:** 0 blocker · 0 warn · 31 pass

> Automated QA (Architecture V2 §2.6) encoding CLAUDE.md §6/§8. A browser preview is not
> sufficient proof (§8.1); client-level checks (Klaviyo/Gmail/Apple Mail/Outlook) remain a
> manual pre-send step and are listed at the end.

## Automated checks

| | Check | Ref | Detail |
|---|---|---|---|
| ✅ | unresolved-tokens | render/§5 | No unresolved tokens. |
| ✅ | anchor-balance | §6.23 | Anchors balanced (64). |
| ✅ | table-in-anchor | §6.6 | No <table> inside an <a>. |
| ✅ | nested-anchors | §8.2 | No nested anchors. |
| ✅ | empty-anchors | §8.2 | No empty anchors. |
| ✅ | image-anchor-display-block | §6.6 | No display:block on image-wrapping anchors. |
| ✅ | bad-hrefs | §6.7 | All hrefs are real destinations. |
| ✅ | merge-tag-in-attribute | §6.23 | Footer merge tags use the URL form; no tag leaks in attributes. |
| ✅ | image-src | §8 | All 23 image src(s) are absolute HTTPS. |
| ✅ | image-dims | §6.6 | All images carry width & height attributes. |
| ✅ | gmail-clip | §8.3 | HTML is 63.7KB (well under 102KB clip). |
| ✅ | structure | CS-08/CS-14 | Doctype, closing html, and preheader present. |
| ✅ | footer-link-contrast | CLAUDE.md/footer | Footer link colour differs from its background. |
| ✅ | stray-comment-artifact | render/§8.3 | No leaked component doc-comment prose in the body. |
| ✅ | theme-coherence | CLAUDE.md/theme-coherence | Hero, sections and products all support "Speed Humps, Safety Bollards, Dock Bumper, Convex Mirror". |
| ✅ | ss-visual-header | CLAUDE.md §6.1 | Header is not a solid accent-colour block. |
| ✅ | ss-visual-section-heading | CLAUDE.md §6.21 | No generic tinted-panel section summary detected. |
| ✅ | ss-visual-price-button | CLAUDE.md §6.17 | No boxed button-style price detected. |
| ✅ | ss-visual-planning-copy | CLAUDE.md §9/§5 | No planning/internal language detected in customer-facing copy. |
| ✅ | ss-visual-trust-cards | platform/qa/brand-visual.js | Trust cards render as a 2×2 table. |
| ✅ | ss-visual-trust-heading-size | platform/qa/brand-visual.js | Trust card heading font-size is within the approved range. |
| ✅ | ss-visual-contact-phone-anchor-style | platform/qa/brand-visual.js | phone anchor carries !important accent colour + bold weight. |
| ✅ | ss-visual-contact-phone-span-style | platform/qa/brand-visual.js | phone inner span carries !important accent colour + bold weight (Gmail-safe). |
| ✅ | ss-visual-contact-email-anchor-style | platform/qa/brand-visual.js | email anchor carries !important accent colour + bold weight. |
| ✅ | ss-visual-contact-email-span-style | platform/qa/brand-visual.js | email inner span carries !important accent colour + bold weight (Gmail-safe). |
| ✅ | ss-visual-product-descriptions | platform/qa/brand-visual.js | All 18 product card descriptions are populated, non-duplicate, and non-placeholder. |
| ✅ | ss-visual-contact-heading-typography | platform/qa/brand-visual.js | Contact block heading matches the approved W38 typography. |
| ✅ | product-inventory-current | §11 | All 18 product(s) are currently purchasable. |
| ✅ | curation-balance | curation-balance | Curated set is balanced across 4 categories: Speed Humps (primary) 5/9 score=22.5, Safety Bollards (supporting) 8/14 score=37, Dock Bumper (supporting) 3/4 score=10, Convex Mirror (supporting) 2/5 score=7. |
| ✅ | grid-pairing | grid-pairing | 9 row(s) paired; 8 strong pair(s) (same family/category). |
| ✅ | link-http-200 | §8/§8.1 | All 39 URL(s) returned HTTP 200. |

## Live link verification (HTTP 200)

Checked 39 distinct URL(s); 0 failed.

## Decision provenance

```json
{
  "candidateSource": "calendar:SS-2026-36",
  "category": "Speed Humps, Safety Bollards, Dock Bumper, Convex Mirror",
  "verifiedCount": 18,
  "subjectFrom": "calendar.subject_line",
  "generatedBy": "calendar-driven (LLM seam: platform/ai/copy.js buildCalendarPackage)",
  "curationAudit": [
    {
      "id": 913,
      "name": "Safety Sector Metal Speed Hump 500mm",
      "category": "Speed Humps",
      "role": "primary",
      "tier": "complete",
      "stock": 38,
      "reason": "no accessory/component name pattern matched — treated as a standalone product",
      "rankWithinCategory": 1
    },
    {
      "id": 605,
      "name": "Steel Speed Hump- 1m Module",
      "category": "Speed Humps",
      "role": "primary",
      "tier": "complete",
      "stock": 2,
      "reason": "no accessory/component name pattern matched — treated as a standalone product",
      "rankWithinCategory": 2
    },
    {
      "id": 682,
      "name": "Traffic Calming Rubber Speed Hump- End Section Pair",
      "category": "Speed Humps",
      "role": "primary",
      "tier": "component",
      "stock": 29,
      "reason": "name matches component pattern \"end section\"",
      "rankWithinCategory": 3
    },
    {
      "id": 555,
      "name": "Rubber Speed Hump End Cap- Black",
      "category": "Speed Humps",
      "role": "primary",
      "tier": "accessory",
      "stock": 129,
      "reason": "name matches accessory pattern \"end cap\" (fallback: no structured product-type field in this catalog)",
      "rankWithinCategory": 4
    },
    {
      "id": 554,
      "name": "Rubber Speed Hump End Cap- Yellow",
      "category": "Speed Humps",
      "role": "primary",
      "tier": "accessory",
      "stock": 97,
      "reason": "name matches accessory pattern \"end cap\" (fallback: no structured product-type field in this catalog)",
      "rankWithinCategory": 5
    },
    {
      "id": 112,
      "name": "Surface Mounted Safety Bollard 900mm",
      "category": "Safety Bollards",
      "role": "supporting",
      "tier": "complete",
      "stock": 248,
      "reason": "no accessory/component name pattern matched — treated as a standalone product",
      "rankWithinCategory": 1
    },
    {
      "id": 117,
      "name": "Removable Security Bollard 950mm",
      "category": "Safety Bollards",
      "role": "supporting",
      "tier": "complete",
      "stock": 95,
      "reason": "no accessory/component name pattern matched — treated as a standalone product",
      "rankWithinCategory": 2
    },
    {
      "id": 552,
      "name": "Disabled Car Park Bollard 165 x 1300mm",
      "category": "Safety Bollards",
      "role": "supporting",
      "tier": "complete",
      "stock": 68,
      "reason": "no accessory/component name pattern matched — treated as a standalone product",
      "rankWithinCategory": 3
    },
    {
      "id": 551,
      "name": "Car Park Bollard 165 x 1300mm",
      "category": "Safety Bollards",
      "role": "supporting",
      "tier": "complete",
      "stock": 65,
      "reason": "no accessory/component name pattern matched — treated as a standalone product",
      "rankWithinCategory": 4
    },
    {
      "id": 116,
      "name": "Removable Safety Bollard 1000mm",
      "category": "Safety Bollards",
      "role": "supporting",
      "tier": "complete",
      "stock": 55,
      "reason": "no accessory/component name pattern matched — treated as a standalone product",
      "rankWithinCategory": 5
    },
    {
      "id": 122,
      "name": "316 Stainless Steel Fixed Bollard 1200mm",
      "category": "Safety Bollards",
      "role": "supporting",
      "tier": "complete",
      "stock": 44,
      "reason": "no accessory/component name pattern matched — treated as a standalone product",
      "rankWithinCategory": 6
    },
    {
      "id": 113,
      "name": "Surface Mounted Parking Bollard 140mm x 1200mm",
      "category": "Safety Bollards",
      "role": "supporting",
      "tier": "complete",
      "stock": 30,
      "reason": "no accessory/component name pattern matched — treated as a standalone product",
      "rankWithinCategory": 7
    },
    {
      "id": 114,
      "name": "Inground Safety Bollard 900mm",
      "category": "Safety Bollards",
      "role": "supporting",
      "tier": "complete",
      "stock": 29,
      "reason": "no accessory/component name pattern matched — treated as a standalone product",
      "rankWithinCategory": 8
    },
    {
      "id": 678,
      "name": "Rubber Dock Bumper D Type 1000mm",
      "category": "Dock Bumper",
      "role": "supporting",
      "tier": "complete",
      "stock": 23,
      "reason": "no accessory/component name pattern matched — treated as a standalone product",
      "rankWithinCategory": 1
    },
    {
      "id": 675,
      "name": "Wall Bumper Rubber 1000mm",
      "category": "Dock Bumper",
      "role": "supporting",
      "tier": "complete",
      "stock": 14,
      "reason": "no accessory/component name pattern matched — treated as a standalone product",
      "rankWithinCategory": 2
    },
    {
      "id": 677,
      "name": "Rubber Dock Bumper D Type 900mm",
      "category": "Dock Bumper",
      "role": "supporting",
      "tier": "complete",
      "stock": 5,
      "reason": "no accessory/component name pattern matched — treated as a standalone product",
      "rankWithinCategory": 3
    },
    {
      "id": 522,
      "name": "Indoor Safety Mirror- 600mm",
      "category": "Convex Mirror",
      "role": "supporting",
      "tier": "complete",
      "stock": 43,
      "reason": "no accessory/component name pattern matched — treated as a standalone product",
      "rankWithinCategory": 1
    },
    {
      "id": 521,
      "name": "Indoor Convex Mirror- 450mm",
      "category": "Convex Mirror",
      "role": "supporting",
      "tier": "complete",
      "stock": 29,
      "reason": "no accessory/component name pattern matched — treated as a standalone product",
      "rankWithinCategory": 2
    }
  ],
  "categoryStats": [
    {
      "category": "Speed Humps",
      "role": "primary",
      "candidateCount": 9,
      "selectedCount": 5,
      "depthScore": 22.5
    },
    {
      "category": "Safety Bollards",
      "role": "supporting",
      "candidateCount": 14,
      "selectedCount": 8,
      "depthScore": 37
    },
    {
      "category": "Dock Bumper",
      "role": "supporting",
      "candidateCount": 4,
      "selectedCount": 3,
      "depthScore": 10
    },
    {
      "category": "Convex Mirror",
      "role": "supporting",
      "candidateCount": 5,
      "selectedCount": 2,
      "depthScore": 7
    }
  ],
  "approvedCategories": [
    "Speed Humps",
    "Safety Bollards",
    "Dock Bumper",
    "Convex Mirror"
  ],
  "pairingAudit": [
    {
      "row": 1,
      "left": {
        "id": 913,
        "name": "Safety Sector Metal Speed Hump 500mm"
      },
      "right": {
        "id": 675,
        "name": "Wall Bumper Rubber 1000mm"
      },
      "score": 0,
      "reason": "CAMPAIGN_THEME_FALLBACK"
    },
    {
      "row": 2,
      "left": {
        "id": 605,
        "name": "Steel Speed Hump- 1m Module"
      },
      "right": {
        "id": 682,
        "name": "Traffic Calming Rubber Speed Hump- End Section Pair"
      },
      "score": 90,
      "reason": "SAME_FUNCTION"
    },
    {
      "row": 3,
      "left": {
        "id": 555,
        "name": "Rubber Speed Hump End Cap- Black"
      },
      "right": {
        "id": 554,
        "name": "Rubber Speed Hump End Cap- Yellow"
      },
      "score": 100,
      "reason": "SAME_BASE_FAMILY"
    },
    {
      "row": 4,
      "left": {
        "id": 112,
        "name": "Surface Mounted Safety Bollard 900mm"
      },
      "right": {
        "id": 117,
        "name": "Removable Security Bollard 950mm"
      },
      "score": 90,
      "reason": "SAME_FUNCTION"
    },
    {
      "row": 5,
      "left": {
        "id": 552,
        "name": "Disabled Car Park Bollard 165 x 1300mm"
      },
      "right": {
        "id": 551,
        "name": "Car Park Bollard 165 x 1300mm"
      },
      "score": 90,
      "reason": "SAME_FUNCTION"
    },
    {
      "row": 6,
      "left": {
        "id": 116,
        "name": "Removable Safety Bollard 1000mm"
      },
      "right": {
        "id": 114,
        "name": "Inground Safety Bollard 900mm"
      },
      "score": 90,
      "reason": "SAME_FUNCTION"
    },
    {
      "row": 7,
      "left": {
        "id": 122,
        "name": "316 Stainless Steel Fixed Bollard 1200mm"
      },
      "right": {
        "id": 113,
        "name": "Surface Mounted Parking Bollard 140mm x 1200mm"
      },
      "score": 50,
      "reason": "SAME_CATEGORY"
    },
    {
      "row": 8,
      "left": {
        "id": 678,
        "name": "Rubber Dock Bumper D Type 1000mm"
      },
      "right": {
        "id": 677,
        "name": "Rubber Dock Bumper D Type 900mm"
      },
      "score": 100,
      "reason": "SAME_BASE_FAMILY"
    },
    {
      "row": 9,
      "left": {
        "id": 522,
        "name": "Indoor Safety Mirror- 600mm"
      },
      "right": {
        "id": 521,
        "name": "Indoor Convex Mirror- 450mm"
      },
      "score": 72,
      "reason": "SHARED_NAMING_STEM"
    }
  ]
}
```

## Manual pre-send gate (not automatable here — §8.1)

- [ ] Klaviyo Preview · Gmail Web · Gmail Mobile (Android & iOS) · Apple Mail · Outlook
- [ ] Clickability verified AFTER Klaviyo import (links survive the rewrite, §6.6/§8.1)
- [ ] Recorded approval by a reviewer who is NOT the author (CR-16/CR-17)

**Send status:** `NOT APPROVED TO SEND` — presence in Output/ is preview only (CLAUDE.md §4.1/§9).
