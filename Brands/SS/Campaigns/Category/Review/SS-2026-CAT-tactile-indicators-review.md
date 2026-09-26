# SS-2026-CAT-tactile-indicators — Review / QA (assesses SS-2026-CAT-tactile-indicators-draft-v2.html)

**Draft assessed:** `Draft/SS-2026-CAT-tactile-indicators-draft-v2.html` (mirrored to `Output/SS-2026-CAT-tactile-indicators.html`).
**Supersedes:** the v1 assessment below. **v1 is retained** in `Draft/` as the rollback trail (§4.1).
**Approval status:** NOT approved to send (draft for human review, §9). Send gate not cleared.

## Update round 2 (revised hero + stock hardening + Klaviyo sync)
- **Hero replaced with the user-provided `Revised SS Hero Banner`** (`hosting/ss/hero-banners/Revised SS Hero Banner.jpeg`, 1376×768, ~1.792:1, 699KB JPEG — a clean redesign whose "ANTI SLIP SURFACE" icon is a correct dark line-art shoe, intact, not distorted). Deployed through the existing Vercel workflow as an **immutable versioned** asset `ss-2026-tactile-way-forward-hero-v3.jpg` (publish-assets → push to `main` → Vercel). **Verified HTTP 200, `image/jpeg`, content-length 699673 = the source bytes.** HTML hero `src` now points to v3 (aspect-correct `width="600" height="335"`); the v1 and v2 heroes are no longer referenced (both retained on the host).
- **Authoritative stock audit (BigCommerce read-only Catalog API):** **SS 18/18 IN STOCK** (shared store `498h0egvgn`; each `availability=available`, `is_visible=true`, inventory ok). Not from cached values.
- **Klaviyo:** existing Draft `01M1Y34DGF8RGPGKNEMH5NC142` updated via `sync-campaign-draft.js` (UPDATE-only). Template `Automation: SS-2026-CAT-tactile-indicators` (id `VWHvWT`) upserted with the new HTML. Verify-after-write: status **Draft**, 18 cards, v3 hero present + old/v2 heroes absent, audience `["UuyeSE"]` **unchanged**, no `send_strategy`, exactly 1 draft (no duplicate). NOT sent/scheduled.
- Re-rendered (desktop + mobile) after the hero swap; revised hero renders at correct aspect, no distortion.

## Root cause 1 — why v1 looked visually broken vs `Weekly/Draft/SS-2026-W36-draft-v1.html`
v1 was built from the same **generic flat-grid template** as the RDD v1 (not the approved SS system
that W36 uses). It used **black square price badges (`border-radius:0`), zero-radius square cards, a
solid-black footer band, bordered/circle trust cards, no dark mode, and no thematic sectioning** — a
harsh look that mismatched the premium SS reference. W36's approved pattern is **red accent rules +
thematic sections + Cerberus hybrid rounded cards + red price *text* + a light footer + a contact
block + dark mode**.

## Root cause 2 — the "Anti Slip Surface" hero icon (the visually-broken banner element)
The malformed "ANTI SLIP SURFACE" shoe icon is a **defect baked into the source artwork itself**
(`hosting/ss/hero-banners/SS Hero Banner.png` — an AI-generation artifact). Proof: the deployed hero
(`ss-2026-tactile-way-forward-hero.png`) is **pixel-identical** to that source, and the HTML displays
it **un-distorted at correct 2:1 aspect** (600×300 from 1774×887). It was **NOT** caused by the image
`src`, hosted version, CSS resize/crop, `object-fit`, container clipping, width/height attributes, or
HTML structure. A baked-in icon cannot be repaired in HTML/CSS (§6.15/§6.13-H) — it requires a
corrected artwork export.

## Fix applied in v2
**HTML** — rebuilt to the W36 pattern, theme/hero/products preserved:
- Left-aligned SS logo header + border-bottom (§6.1).
- 3 thematic **sections** (red accent rule + h2 + sub): Individual Tactile Indicators (9) · Peel & Stick Tactiles (6) · Tactile Plates & Installation (3). Odd sections centre the trailing card (§6.9).
- Cerberus hybrid `col-2` rounded cards (radius 12, MSO ghost tables), image + name + one-line sub + **red price text**; fixed-height reserved cells (§6.8/§6.20).
- Light closing-CTA panel + one red CTA (§6.22); 2×2 bordered trust cards; contact block ("Got a question? We're here to help." + `02 9790 2182` + `sales@safetysector.com.au`, preserved exactly, §6.26); light footer with URL-form subscription tags (§6.23); dark-mode classes throughout.

**Hero (corrected artwork export, not a silent replacement)** — replaced **only** the malformed shoe
glyph (measured bbox x693–753, y770–817) with a **clean red line-art shoe** matching the other two red
line icons; the rest of the artwork is pixel-identical (colour-matched, feathered patch; circle shadow
and "ANTI SLIP SURFACE" label untouched). Composited via headless rendering, saved as a new **immutable**
version `ss-2026-tactile-way-forward-hero-v2.png`, published to the SS Vercel host, deployed (push to
`main`), and **verified HTTP 200** serving the correct bytes (len 2100835). The HTML hero `src` now points
to v2. Original v1 hero retained (never overwritten, §7.1).

## Automated QA — PASS
- Structure: anchor balance 62/62; **0** `<table>`-in-`<a>`; **0** nested/empty anchors; **0** empty `<td>`/`<tr>`; **0** literal `...`/`…` (§6.6/§8.2).
- Grid: exactly **18** cards; hybrid 2-col with centred odd last card (§6.9); fixed-height cells (§6.8).
- Links: all 18 product pages + 18 images + hero (v2) + collection CTA + logo return **HTTP 200**. No `#`/empty/placeholder/localhost/`file://`; no `{{ }}` or anchor-emitting tag in any `href` (§6.7/§6.23/§8).
- Size 67.0KB, under the ~102KB Gmail clip (§8.3); no descriptive comments (only functional MSO).
- Rendered verification (headless Edge): desktop 720px and mobile 390px — header/hero/sections/cards/trust/contact/footer all render; corrected shoe icon renders cleanly in the hero; cards stack 1-col on mobile; red price text intact.

## Product audit — 18/18 valid, on-theme, all SS
Every product is an SS (`safetysector.com.au`, shared store `498h0egvgn`) tactile-indicator item and
belongs to the Tactile Ground Surface Indicators theme (studs in stainless/rubber/carborundum/plastic,
peel & stick pads/indicators, one-piece plates, install template; warning + directional). **No RDD, no
SC, no unrelated/filler products.**

## Manual review still required before SEND (cannot be exercised here)
- Real-client render pass: Klaviyo Preview, Gmail Web + Mobile (Android & iOS), Apple Mail (incl. iPhone), Outlook, Samsung (§8.1).
- Post-Klaviyo-import clickability of every card/CTA (§8.1.2).
- Audience to be confirmed by the user before the draft is created (§13.1).
- Optional: a fully re-generated (not composited) corrected hero export could be commissioned later; the v2 composite is a faithful, verified correction of the single defective icon.

---
## (v1 assessment — superseded, retained for history)
- v1 passed automated structure QA but used the generic template (Root Cause 1) and the defective baked hero (Root Cause 2).
