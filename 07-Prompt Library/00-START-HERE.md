# 00 — START HERE (Universal Entry Point)

**This is the first file to open for _any_ campaign task in this workspace.** It routes you to the
right playbook, generate prompt, and QA gate. It does not restate rules — it points to them.

> **Context efficiency:** load only the files your current task needs. See CLAUDE.md §3 and §4.

---

## 1. Execution order (load only what is needed)

1. **CLAUDE.md** is already loaded (lean router — operating rules, safety, workflow).
2. **Resolve the campaign through the calendar service** (`getCampaignById`, `getCampaignByWeek`,
   or `getNextCampaign`). Do NOT load the full `config/campaign-calendar.generated.json`.
3. **Read the campaign's `cadence` field** to select the Playbook (table below).
   If cadence is null or unresolvable: **STOP and report** — never guess.
4. **Load the brand facts** — `03-Brands MD Files/<CODE>.md` + `config/brands/<CODE>.config.json`.
5. **Load the cadence Playbook** — `../Playbooks/<Cadence>-Playbook.md`.
6. **Read the current Brief** — `Brands/<CODE>/Campaigns/<Cadence>/Brief/`.
7. **Generate** — assemble from `Components/` + `Templates/` + verified brand/product data.
   Runtime: `07-Prompt Library/Generate-HTML.md`.
8. **QA** — `07-Prompt Library/QA-Checklist.md` (self-contained).
9. **Record in `Review/`** — what was checked, in which clients, pass/fail.

**Do NOT automatically load:** full BRD.md, full Hero Engineering Standard, full Cerberus docs,
other brands' files, old campaign Reviews/Drafts, CLAUDE-LEGACY.md, full design-tokens.md,
full font-stacks.md (load only when the task requires visual system decisions).

**STOP rule:** if information is missing, **stop and request clarification** — never invent
brand values, product data, SKUs, prices, URLs, images, or coupon codes.

---

## 2. Choose the cadence (structural workflow) FIRST

The campaign's `cadence` field determines the Playbook. Its `campaign_type` field determines
the content/theme approach (product-insights, promotional-sale, holiday-gifting, etc.).

| Cadence | Use when | Playbook | Generate prompt |
|---------|----------|----------|-----------------|
| **weekly** | Recurring product-led send | `Weekly-Playbook.md` | `Generate-Weekly-Campaign.md` |
| **monthly** | Monthly roundup / bigger narrative | `Monthly-Playbook.md` | `Generate-Monthly-Campaign.md` |
| **product-launch** | New product/range announcement | `Launch-Playbook.md` | `Generate-Product-Launch-Campaign.md` |
| **holiday** | Calendar event (EOFY, BFCM, Christmas) | `Holiday-Playbook.md` | `Generate-Holiday-Campaign.md` |
| **seasonal** | Season-change range refresh | `Seasonal-Playbook.md` | `Generate-Seasonal-Campaign.md` |
| **category** | Deep dive on one category/range | `Category-Playbook.md` | `Generate-Category-Campaign.md` |
| **clearance** | Stock clearance / markdowns | `Clearance-Playbook.md` | `Generate-Clearance-Campaign.md` |
| **brand-story** | Values / trust narrative | `Brand-Story-Playbook.md` | `Generate-Brand-Story-Campaign.md` |
| **educational** | How-to / compliance / guide | `Educational-Playbook.md` | `Generate-Educational-Campaign.md` |
| **automation** | Triggered content (flows = separate project) | `Automation-Playbook.md` | — |

Playbooks: `../Playbooks/`. Generate prompts: this folder. Never reuse the Weekly layout for another cadence.

---

## 3. Where the work goes

`Brands/<CODE>/Campaigns/<Type>/`:
`Brief/` → `References/` → `Assets/` → `Draft/` → `Review/` → `Output/`

Build in `Draft/` (versioned, keep all versions). `Output/` = latest build for preview/QA.
Approval tracked in `Brief/` + `Review/`, not by file presence. See CLAUDE.md §8.

---

## 4. Product & brand data

- **Products:** BigCommerce API. Verify each on its own product page (active, visible, in stock,
  real price, live URL HTTP 200). Hidden product = 404 = dead link. Never invent.
- **Brand values:** approved sources only, with confidence tags. Absent → `To be confirmed`.
- **Coupons:** only when the campaign has a promotion (see `Standards/coupon-contract.md`).

---

## 5. QA / send gate

Run `QA-Checklist.md` (self-contained). Verify across: Klaviyo Preview + Gmail Web + Gmail Mobile
+ Apple Mail + Outlook. Confirm clickability **after Klaviyo import**. Never approve on
localhost/desktop alone.
