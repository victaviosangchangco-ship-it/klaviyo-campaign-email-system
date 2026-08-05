# Generate — Product Launch Campaign

Operational prompt for generating one **Product Launch** send. A launch is an *event* (something new as
news), not a Weekly grid and not a sale. Start at [`00-START-HERE.md`](00-START-HERE.md); read the
[`../Playbooks/Launch-Playbook.md`](../Playbooks/Launch-Playbook.md) for strategy. This file is the
build recipe. It does **not** restate CLAUDE.md rules — it cites them.

## Source of truth (highest wins — CLAUDE.md §2)
1. `BRD.md` 2. approved brand sources (`BrandConfig.md` / `Design.md`) 3. `03-Brands MD Files/<CODE>.md`
4. the send `Brief/`. If information is missing, **stop and ask** — never invent (§5, §5.1, §6.5).

## Read order (CLAUDE.md §3)
`CLAUDE.md` → `BRD.md` → brand doc → approved brand sources → `Brief/` → `References/` → existing `Draft/`.

## Step 0 — Confirm the type
Confirm this is a Launch (Campaign Selection Engine, CLAUDE.md). If it's really a Category deep-dive,
Clearance, or Weekly, switch prompts. Do not proceed on the wrong type.

## Step 1 — Products (verify BEFORE building)
- Use **only the approved launch SKU list** from the brief. **Do not auto-select newly-created BigCommerce
  products** (§5.1).
- Verify **every SKU via the BigCommerce API** (`/catalog/products?sku=…`, and `/catalog/variants?sku=…`
  for variant SKUs). Storefront search hides unpublished items and is not sufficient.
- For each SKU record: RDD SKU, product name, price, `is_visible`, inventory, **live URL + HTTP status**,
  primary image URL, confidence (Exact/High/Medium).
- **Gate:** a product may enter the grid only if `visible=true`, in stock, non-zero price, **live URL
  returns HTTP 200**, and the image is a public HTTPS `image/*` at 200. A `visible=false` product returns
  **404** and is a dead link — do not link it.
- Present the **verification/mapping table for approval** before building (Bruce). Report blockers
  (hidden, $0 price, OOS, wrong-brand name in title); never substitute silently.

## Step 2 — Brand layer
- Pull real brand assets from approved sources (hosted logo, colours, type). Tag derived values
  `[Inferred]` until confirmed. Never guess (§5).
- Apply the brand's header logo default (CLAUDE.md §6.1 for SS/SC) and its button/colour system.

## Step 3 — Build (layout is launch-specific, NOT the Weekly grid)
Section order:
1. **Header** — brand logo (per §6.1 default).
2. **Hero banner** — sells the idea of the launch; visual-only, no baked-in price (§7). Email-safe
   responsive container so it never shrinks on Gmail mobile (§6.6, §8.1).
3. **Launch badge** — subtle "New / Just launched" device.
4. **Headline** — bold, benefit-led.
5. **Introduction** — ONE short paragraph, no em dashes (§6.2). No second intro later (§5.2).
6. **Why these products** — 2–4 benefit bullets (what's new, why it matters).
7. **Product grid** — approved SKUs only; balanced cards (equal image area/height/alignment §5.1/§6.2);
   every card fully clickable via inline anchors (image anchor + separate text anchor; **never** an
   anchor around a `<table>` — §6.6). Group variant families coherently.
8. **CTA** — one primary intent ("Shop the range"); bulletproof VML+anchor (CS-08); no redundant CTAs (§6.2).
9. **Trust section** — brand [Confirmed] trust claims (shipping, ownership, warranty, returns).
10. **Footer** — compliance (`{% unsubscribe %}`, preferences), sender identity (CS-15).
Preheader hidden text required (CS-14). Dark-mode aware (§6, CS-12).

Build from `Templates/` + `Components/` + `Shared/`; only brand/product values differ (CS-03, CR-19).

## Step 4 — Offer (only if approved)
Launches are not discount-led. If a launch/welcome offer is approved, write a **fresh** promo title for
this launch (§6.5); never recycle a previous coupon heading; never invent a code (placeholder if not
confirmed); confirm the code is active in BigCommerce before send (§6.3). Place the offer **after** the
grid (hook first).

## Step 5 — QA / send gate
Run [`QA-Launch-Checklist.md`](QA-Launch-Checklist.md) and CLAUDE.md §8.1:
`✓ SKU/URL/image/stock/price verified via API · ✓ zero anchors wrap a <table> · ✓ zero image anchors are
display:block · ✓ hero doesn't shrink on Gmail mobile · ✓ clickability verified AFTER Klaviyo import ·
✓ Apple Mail iPhone · Gmail (Web/iOS/Android) · Outlook · Yahoo · Klaviyo Preview · ✓ responsive.`
The latest build always lives in `Output/` for preview/QA (§4.1). A hidden/404 product does not stop the
build from being previewed, but it **blocks the send** — keep the `Review/` status *not approved to send*
and record the blocker + clients checked in `Review/`.

## Naming (CLAUDE.md §10)
Draft: `<CODE>-YYYY-LAUNCH-<slug>-draft-vN.html` · Final: `<CODE>-YYYY-LAUNCH-<slug>.html`
(e.g. `RDD-2026-LAUNCH-expandable-barriers-draft-v1.html`). Brief:
`<CODE>-YYYY-LAUNCH-<slug>-brief.md`.

## Output rules (CLAUDE.md §4.1/§9)
Every draft is created in `Draft/` first (keep all `-draft-vN` versions); `Output/` is then updated to the
latest build as one un-versioned file for preview/QA/review. `Output/` presence is **not** sending
approval — that status lives in `Brief/` + `Review/`. The **send** requires recorded approval + the §8.1
gate (clickability post-Klaviyo, responsive, images/product/CTA/coupon links confirmed, no unresolved
blockers). Revisions create a new `Draft/-vN`, then refresh `Output/` to match.
