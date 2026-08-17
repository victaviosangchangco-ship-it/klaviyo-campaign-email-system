# Review — SS-2026-LAUNCH-everyday-mobility-accessories

Assesses **Draft v2** (`…-draft-v2.html`), mirrored to `Output/SS-2026-LAUNCH-everyday-mobility-accessories.html`.
(v1 retained for history.)

## v2 update (this revision)

- **SS section expanded per user direction:** "More New Arrivals from Safety Sector" now shows **both** genuine SS
  products in a balanced 2-col row — **CUPSS60GRE** 64oz Flask ($86.67) and **SPEHPM50** Metal Speed Hump 500mm
  ($135.27), both linking to safetysector.com.au. CUPSS25BLA (RDD) remains excluded.
  - *Flagged:* the speed hump is thematically loose in an everyday-mobility/holder launch; included at the user's
    explicit request, kept in the clearly-separated SS section (own header, own storefront) so attribution is clean.
- **Hero: PENDING a corrected asset from the user.** The supplied banner
  `Designing_new_product_launch_banner_202608161941` visibly shows a **"RetailD" (RDD) bottle** alongside the SS
  flask and a SectorCare cup holder → cross-brand confusion; it is **NOT used**. The email keeps the previously
  approved, compliant cup/phone-holder hero (`Edit_banner_lower_text_202608161332.jpeg`, live) as interim until
  the user supplies a fixed hero (no other-brand products/logos), which will then be swapped in.
- **Klaviyo draft updated (reused, no duplicate):** `01M04KX3FNTK22S37B1FGXMYYZ`, template re-attached with v2 HTML;
  audience unchanged and already user-confirmed (Engaged 240D + Safety Sector Customer List); still Draft,
  NOT_APPROVED_TO_SEND. v2 QA: tag-balanced, 0 ghost/nested/dead-link, 0 RDD refs, 9 imgs all alt, 27 KB.

---
### v1 baseline (below)

**Approval status: NOT approved to send.** Klaviyo DRAFT created for review; manual multi-client render QA still
required (§8.1). Build + self-QA complete.

## Klaviyo draft (created — DRAFT ONLY, never sent/scheduled)

- **Draft ID:** `01M04KX3FNTK22S37B1FGXMYYZ` · status **Draft** · https://www.klaviyo.com/campaign/01M04KX3FNTK22S37B1FGXMYYZ/wizard
- **Account:** SS `T7SuPP`. **Sender:** hello@safetysector.com.au / "Safety Sector" (SS account default; not invented).
- **Audience (user-confirmed §13.1):** included = Segment `Engaged 240D` [Tdv6tq] + List `Safety Sector Customer List` [Y6Axmi]; excluded = none. Recipient estimate ~6,866.
- **Subject:** New Arrival: One Holder for Your Drink and Phone · **Preview:** non-empty, campaign-specific (§6.24), verified on the draft message.
- **Creative:** the approved Output HTML attached verbatim (template `U5PaZL`, HTML verified). QA gate: 0 blockers.
- **Created via** the sanctioned Klaviyo services (safety guard + draft-campaign-service + template-service + dedup),
  not a parallel path; the calendar-bound orchestrator entrypoint does not apply (this launch has no calendar row).
- **Hero deployed:** committed + pushed to main (`5916bd3`); live at
  `https://assets-ss-wheat.vercel.app/Edit_banner_lower_text_202608161332.jpeg` (HTTP 200 `image/jpeg`).
- **sendStatus: NOT_APPROVED_TO_SEND.** No send, no schedule, no publish.

## Product / brand-attribution verification (§5.4 / §6.28)

All data from the BigCommerce Catalog API (store `498h0egvgn`) + live storefront checks this session.

| SKU | In email as | Brand (BC field) | Link routes to | Live URL | Image |
|---|---|---|---|---|---|
| CHDRBLA | Featured grid #1 | SectorCare | sectorcare.com.au (§6.28) | 200 | 200 |
| CHDBLA | Featured grid #2 | SectorCare | sectorcare.com.au | 200 | 200 |
| CHDGRE | Featured grid #3 | SectorCare | sectorcare.com.au | 200 | 200 |
| CHDBLAGRE | Featured grid #4 | SectorCare | sectorcare.com.au | 200 | 200 |
| CUPSS60GRE | More New Arrivals from Safety Sector | Safety Sector | safetysector.com.au | 200 | 200 |
| CUPSS25BLA | **EXCLUDED** | Retail Display Direct | — | — | — |
| SPEHPM50 | **HELD BACK** | Safety Sector | — | — | — |

- **No RDD product ships.** CUPSS25BLA excluded (BC brand = Retail Display Direct despite its "SS" SKU prefix).
- **SectorCare accurately attributed, not misrepresented as SS.** The featured section carries a visible SectorCare
  wordmark and every cup/phone-holder link routes to sectorcare.com.au. Product names are product-focused; the
  brand is shown, not hidden and not relabelled as Safety Sector.
- **SS products attributed to SS.** The flask sits under "More New Arrivals from Safety Sector" and links to
  safetysector.com.au. Genuine SS (BC brand = Safety Sector).
- **SPEHPM50 held back** — genuinely SS but a car-park/traffic speed hump has no place in an everyday-mobility
  accessories launch (§5.1.2; user: "do not force unrelated SS products"). Available to add on request.

## Automated QA (passed)

- **Tag balance:** table 25/25, tr 41/41, td 48/48, a 23/23 — all balanced.
- **Ghost inspection (§8.2):** 0 empty anchors, 0 nested anchors, 0 `<table>` inside `<a>`, 0 empty `<td>`/`<tr>`,
  0 image-wrapping anchors with `display:block`, 0 `href="#"`/empty, 0 literal `...`/`…`.
- **Email-client safety (§6.6):** product cards use 3 sibling inline-content anchors (image / name / price); the
  `<img>` is the block element and anchors stay inline; hero is one inline anchor around a block `<img>`.
- **Merge tags (§6.23):** footer uses URL-form `{% unsubscribe_link %}` / `{% manage_preferences_link %}`; no
  anchor-emitting tag inside an `href`; no invalid `{{ }}` variables; no tag-in-attribute leak.
- **Links:** every href verified HTTP 200 this session; 0 localhost/file/RDD references; routing correct per the
  table above.
- **Images:** 8 `<img>`, all with meaningful `alt`; all product images + logo HTTP 200.
- **Gmail clip (§8.3):** built file 26 KB, well under ~102 KB; single minimal preheader line; no decorative dots.
- **Grid balance (§6.8/§6.9):** featured grid is 2×2 (even, no orphan); the lone SS flask card is centered via
  `colspan="2"` + fixed 282px wrapper with `.center-half` mobile reset (not a % width).
- **Icons (§6.21):** monochrome slate text-presentation glyphs only (`&#xNNNN;&#xFE0E;`); no colour emoji.
- **Dark mode:** `.dm-bg/.dm-text/.dm-sub` + `[data-ogsc]` retained from the approved SS launch.

## Content — what changed vs the previous SS Product Launch

- **New angle, no partnership re-announcement.** The prior launch opened with "Through our partnership with
  SectorCare, we're bringing you…". This one opens problem-first ("A drink in one hand, a phone in the other, and
  nowhere to put them.") and lets the SectorCare wordmark carry attribution — the partnership is shown, not
  explained (per user direction).
- **Focused range, not a 22-product catalogue.** 4 featured accessories + 1 SS new arrival, vs the prior 22-product
  two-category grid. Cleaner, launch-appropriate.
- **Trust claims made SS-safe.** Replaced the prior launch's "Registered NDIS Provider" (a mobility-provider claim
  not evidenced for the SS sender) with SS-confirmed claims: Australian Owned · Fast Australia-wide Shipping ·
  30-Day Returns · Trusted Support (SS.md). No fabricated claims.
- **Reused unchanged:** SS header/logo, hero mechanics, card component, "We've got you covered" trust-card
  structure, SS contact block (§6.26), SS legal footer (§6.23). Structure retained; content is new.

## Manual QA still required (cannot be exercised here)

Per §8.1, a browser/localhost preview is not sufficient proof. Before send, verify in **Klaviyo Preview · Gmail
Web + Gmail mobile (Android & iOS) · Apple Mail (incl. iPhone) · Outlook**: hero renders full-width and does not
shrink; product cards click through post-Klaviyo import; 2×2 grid stacks cleanly; centered flask card holds; no
white gutters/seams on Gmail mobile.

## Gates status

1. **Hero deployment — DONE.** Committed + pushed (`5916bd3`); live HTTP 200 on the SS Vercel host.
2. **Audience confirmation (§13.1) — DONE.** User confirmed Safety Sector Customer List + Engaged 240D.
3. **Manual multi-client render QA — STILL REQUIRED before send** (§8.1): Klaviyo Preview · Gmail web + mobile
   (Android/iOS) · Apple Mail (incl. iPhone) · Outlook. Confirm hero full-width, product cards clickable
   post-import, 2×2 grid stacks, centered flask card holds, no Gmail-mobile gutters.
4. **Send approval — PENDING.** Draft only; not approved to send.

## Decision to flag for the user

- Include the metal speed hump (SPEHPM50) or keep it out? Held back as off-theme; the launch reads cleaner without
  it. It is a genuine SS product and can be added to "More New Arrivals from Safety Sector" if desired.
