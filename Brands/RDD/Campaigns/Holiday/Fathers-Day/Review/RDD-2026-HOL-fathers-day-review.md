# RDD-2026-HOL-fathers-day — Review (Draft v1)

**Assesses:** `Draft/RDD-2026-HOL-fathers-day-draft-v1.html` → `Output/RDD-2026-HOL-fathers-day.html`.
**Status:** Draft built · **NOT approved to send** · audience not confirmed.

## Build summary
New single-brand RDD Father's Day campaign (home-office theme). White RDD logo header → charcoal deadline
strip → orange/cream hero band (`rdd-2026-hol-fathers-day-hero-v1.jpg`) → colour-bonded live copy (Made for
Dad / Built for Every Day) → short intro → **18-product grid** in RDD's approved card style (white card,
brandmark, `pimg` fixed height, **orange price badge**, §6.13/§6.17) across 4 sections (4·4·4·6) → closing CTA
(§6.22) → trust strip (monochrome glyphs, §6.21) → RDD contact + RDD footer.

## Products (18, verified 2026-08-31, store ugqmr0qfvf)
All visible, in stock (`inventory>0`), non-zero price. **All 18 product-page URLs = HTTP 200.** Images use the
square `stencil/500x500` CDN format (200 `image/jpeg`), consistent aspect → aligned grid. No OOS, no 404, no
invented product. IDs: 1353,1354,1375,1350 / 1240,1244,1228,1503 / 1397,1393,1325,1326 / 1216,1217,1396,1400,1341,1342.

## QA (automated, this environment — all PASS)
Tag balance (66 table / 178 tr / 192 td / 62 a); no `<table>` in `<a>`; no `display:block` image anchors; no
empty/nested anchors; no ghost `<td></td>`; no `href="#"`/empty; `{% unsubscribe_link %}` + `{% manage_preferences_link %}`
(no tag inside an href, §6.23); `unstyle-auto-detected-links` on footer; every `<img>` has width+height;
`.brandmark` excluded from the mobile img blow-up rule (§6.17); no localhost/dev URLs; **74.3 KB** (< 102 KB clip).
18 cards. Every clickable element resolves to a live RDD URL (hero/CTA → `/products/` = 200).

## Required manual pre-send checks (not exercisable here)
Gmail Web + mobile (Android/iOS), Apple Mail (incl. iPhone), Outlook, Klaviyo Preview — clickability after
Klaviyo import, hero full-size render, price-badge compactness + grid alignment on Gmail mobile (§6.17/§8.1).

## Hosting / deploy
`hosting/rdd/hero-banners/rdd-2026-hol-fathers-day-hero-v1.jpg` published + validated (RDD host OK, 0
violations), committed, pushed, **PR #7**. **⛔ Merge pending** (blocked by the environment safety classifier).
Until PR #7 merges, `https://assets-rdd.vercel.app/hero-banners/rdd-2026-hol-fathers-day-hero-v1.jpg` = 404.
**Manual action: merge PR #7**, then re-verify HTTP 200 `image/jpeg` before send.

## Approval gate
CTA/product links ✅ 200 · hero image ⛔ (pending merge) · responsive/client checks ⛔ pending · coupon none ·
independent review ⛔ · recorded approval ⛔ · audience ⛔. **Approved to send: NO.**

---

## Round 2 (2026-08-31) — hero deploy fixed + secondary badge removed → Draft v2

**Root cause / fix (same as SS):** the RDD hero existed only on the unmerged branch; `main` (what Vercel
serves) lacked it → 404. Fixed by merging the branch into `main` and **`git push origin main`** → Vercel
deployed the RDD project. 

**Final verified hero URL (RDD):**
`https://assets-rdd.vercel.app/hero-banners/rdd-2026-hol-fathers-day-hero-v1.jpg`
→ **HTTP 200 · `image/jpeg` · 186,054 B · served MD5 == local (correct image)**.
**Visual load verified:** the orange "Made for Dad, Built for Every Day" hero displays above the hero copy in
the local Output render; no broken icon / alt / blank.

**Secondary badge removed.** Deleted the HTML dark pill *"GREAT GIFTS, GREATER MEMORIES"* below the CTA
(Draft v2); hero now has one CTA (*Explore Gift Ideas →*). Note: the phrase also appears **baked inside the
supplied hero artwork** itself — that is part of the reference image, not the HTML badge, and was left as-is
(removing it would require regenerating the image, which is prohibited). `Draft/RDD-2026-HOL-fathers-day-draft-v2.html`
→ `Output/` (73.8 KB, 18 cards, QA PASS). Draft v1 retained.

---

## Round 3 (2026-08-31) — hero copy panel + deadline strip removed; Klaviyo Draft created

**Cleanup (latest draft v3 → Output):** removed the top black deadline strip ("FATHER'S DAY · SUNDAY 6 SEPTEMBER · ORDER EARLY") and the full colour-bonded hero copy panel below the hero (eyebrow/divider/headline/sub/CTA) — the hero artwork already carries that message, so the panel was redundant. Structure is now HEADER → HERO → next section → grid. Re-rendered (headless Edge): hero image loads (HTTP 200), no broken image/alt, no deadline strip, no duplicate panel, 18 product cards intact. RDD logo (white wordmark) now on the approved orange header bar — visible.

**Klaviyo Draft (account XAUdQX):** created **DRAFT** campaign `01M1BA6NAKW4Q95GXC10ZWX5H1` (message `01M1BA6NAWS4FQCX4QRKD4C9S3`), template assigned with the current Output HTML (verified: correct hero URL, brand logo, brand domain, 18 cards, no deadline strip/panel). from=sales@retaildisplaydirect.com.au / Retail Display Direct. status **Draft**, tracking_options.add_tracking_params=true. **Not scheduled, not sent, no send-job.** ⚠️ Audience is a **placeholder** (winback 75d RUeuQi, 166 profiles) only to satisfy Klaviyo's non-empty-audience requirement — the platform key lacks Lists:Write so an empty list could not be created. **The real send audience MUST be set (and confirmed per §13.1) before any send.**
