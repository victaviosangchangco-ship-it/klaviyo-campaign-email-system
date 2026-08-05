# 00 — START HERE (Universal Entry Point)

**This is the first file to open for _any_ campaign task in this workspace.** It routes you to the
right rules, the right playbook, the right generate prompt, and the right QA gate, in the right order.
It does not restate rules — it points to them. On any conflict, the **BRD wins** (see CLAUDE.md §2).

> New here? Read [`../CLAUDE.md`](../CLAUDE.md) once end-to-end first — it is the operating guide.
> This file is the per-task launcher you return to every time.

---

## 1. Universal execution order (follow every time)

1. **Read `CLAUDE.md`** — operating rules, standards, QA gates. (Reusable system rules live here.)
2. **Read `BRD.md`** — business goals, strategy, psychology, human workflow.
3. **Read the brand's approved sources** — `03-Brands MD Files/<CODE>.md`, plus `BrandConfig.md` /
   `Design.md` where available. Carry confidence tags (`[Confirmed]` / `[Inferred]` / `To be confirmed`).
4. **Read the Campaign Playbook** for the campaign _type_ — `../Playbooks/<Type>-Playbook.md`.
5. **Read the current prompt** — the type's generate prompt below + the specific send `Brief/`.
6. **Generate** — build from `Templates/` + `Components/` + `Shared/` + verified brand/product values.
7. **QA** — run the type's QA checklist; render and verify across clients (§8.1).
8. **Update Review Notes** — record what was checked, in which clients, and the approval trail.
9. **Update `CLAUDE.md` if the lesson is reusable** — convert any new, reusable finding into a
   permanent rule (root-cause-first, CLAUDE.md §8.1.7). Never edit the BRD from production work.

**STOP rule (permanent):** if information is missing, **stop and request clarification** — never invent
brand values, product data, SKUs, prices, URLs, images, or coupon codes (CLAUDE.md §5, §5.1, §6.5).

---

## 2. Step 0 — Choose the campaign type FIRST (Campaign Selection Engine)

Before building anything, decide **which campaign type** this is. Each type has its own psychology,
hero, copy, CTA, product strategy, and QA. **Never reuse the Weekly layout for another type.**
(Full decision logic: CLAUDE.md "Campaign Selection Engine".)

| Type | Use when | Playbook | Generate prompt |
|------|----------|----------|-----------------|
| **Weekly** | Recurring product-led send, broad coverage | `Weekly-Playbook.md` | `Generate-Weekly-Campaign.md` |
| **Monthly** | Monthly roundup / bigger narrative | `Monthly-Playbook.md` | `Generate-Monthly-Campaign.md` |
| **Product Launch** | Introduce a new product/range; announcement, benefits, premium | `Launch-Playbook.md` | `Generate-Product-Launch-Campaign.md` |
| **Holiday** | Dated calendar event (EOFY, BFCM, Christmas) | `Holiday-Playbook.md` | `Generate-Holiday-Campaign.md` |
| **Seasonal** | Season-change range refresh, emotional theme | `Seasonal-Playbook.md` | `Generate-Seasonal-Campaign.md` |
| **Category** | Deep dive on one category/range | `Category-Playbook.md` | `Generate-Category-Campaign.md` |
| **Clearance** | Stock clearance / markdowns, urgency + value | `Clearance-Playbook.md` | `Generate-Clearance-Campaign.md` |
| **Brand Story** | Values / about / trust narrative, low product density | `Brand-Story-Playbook.md` | `Generate-Brand-Story-Campaign.md` |
| **Educational** | How-to / compliance / buying guide | `Educational-Playbook.md` | `Generate-Educational-Campaign.md` |
| **Automation** | Triggered content (⚠ automated **flows** live in the separate Klaviyo Flow project) | `Automation-Playbook.md` | — |

Playbooks live in [`../Playbooks/`](../Playbooks/). Generate prompts live in this folder.

---

## 3. Where the work goes (file-driven workflow)

Each send moves left→right through six stages inside
`Brands/<CODE>/Campaigns/<Type>/`:

`Brief/` → `References/` → `Assets/` → `Draft/` → `Review/` → `Output/`

- Build in `Draft/` (versioned `-draft-vN.html`, **full history kept — never delete drafts**); `Output/`
  always holds the **latest build** as one un-versioned file for browser/Klaviyo preview, QA and review.
  **Approval-to-send is tracked in `Brief/` + `Review/`, not by withholding HTML from `Output/`**
  (CLAUDE.md §4.1/§9).
- Naming conventions: CLAUDE.md §10.
- `Product Launch/Assets/` has sub-folders: `Hero/`, `Products/`, `Lifestyle/`, `Icons/`.

---

## 4. Product & brand data — the non-negotiables

- **Products:** retrieve from the brand's approved source (BigCommerce). Verify each product on its own
  **product page / via the API**: active, `visible=true`, in stock, real price, live URL (HTTP 200),
  public image. A **hidden/unpublished** product returns **404** on its live URL and must **not** be
  linked in an email (it will be a dead link). Never invent product data; report blockers and wait for
  approval (CLAUDE.md §5.1).
- **Brand values:** only from approved sources, with confidence tags. Absent value → `To be confirmed`.
- **Coupons:** confirmed created + active in the commerce platform before send; unique per-campaign
  titles; never invent a code — use a clearly-marked placeholder (CLAUDE.md §6.3–§6.5).

---

## 5. QA / send gate

Run the type's QA checklist (`QA-Checklist.md`, or `QA-Launch-Checklist.md` for launches) and the
email-client compatibility gates in **CLAUDE.md §8.1**: verify in Klaviyo Preview + Gmail Web + Gmail
Mobile + Apple Mail + Outlook; confirm clickability **after Klaviyo import**; confirm responsive
rendering; confirm images/product/CTA/coupon links resolve. Never approve on localhost/desktop alone.

_Created as part of File-Driven System V2. Keep this file short — it routes, it does not duplicate._
