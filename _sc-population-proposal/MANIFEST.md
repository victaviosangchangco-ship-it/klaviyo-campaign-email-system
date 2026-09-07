# SC Brand-Doc Population — MANIFEST (rollback map)

## Git state

| Item | Value |
|---|---|
| Branch | `sc-brand-doc-population-2026-09-07` |
| Base SHA (main HEAD) | `d4dcc30ff75412fbc138da5e23993acd84524fac` |
| Working tree at Phase 0 | DIRTY (52 changes) → stashed with `git stash push -u -m "pre-SC-task working tree state 2026-09-07"` → tree clean (porcelain=0) before branching |
| Stash | `stash@{0}` "pre-SC-task working tree state 2026-09-07" — **NOT popped by Claude; Vic pops manually** |
| Phase 1 writes | ONLY inside `_sc-population-proposal/` (quarantined). No canonical file touched. |

## Files READ (read-only) to build this proposal

- `03-Brands MD Files/SC.md` (stub), `SS.md` (structure), `Shared.md` (contract)
- `BRD.md` (status table, lines 67–73)
- `config/brands/SC.config.json` (identity, logo, designTokens, klaviyo blocks — no secrets present)
- `Desktop/Social Media Content Automation System/Product Featured Graphics Project/Design.md` (Maria)
- Two `.docx` positioning/brand-purpose briefs in that same project folder (text extracted, read-only)
- Project memory `sc-brand-facts`; live `GET /accounts` (SC account, read-only, this session)

## Files Phase 2 WOULD create / modify / delete (ON APPROVAL ONLY)

| Action | Path | Before | After |
|---|---|---|---|
| **Create** (move) | `03-Brands MD Files/SC.md` | stub (H1 only) | populated from `SC.md.proposed` |
| **Create** (move) | `SC-BRAND-DOC-GAPS.md` (repo root) | does not exist | from `SC-BRAND-DOC-GAPS.md.proposed` |
| **Modify** (patch) | `BRD.md` | SC status "⬜ Not yet drafted" (line 71) | "✅ Drafted (…)" via `BRD-status-update.diff` |
| **Delete** | `_sc-population-proposal/` (whole folder) | Phase-1 quarantine commit | removed |
| **NOT applied** | `config/brands/SC.config.json` | unchanged | unchanged — `SC.config.json.proposed` stays for manual apply |

**Explicitly NOT touched in Phase 1 or Phase 2:** any `.env` file · `Brands/SC/Campaigns/**` · Klaviyo
(no API writes) · Vercel/hosting · the stash · `main`. No merge, no rebase, no push.

## Rollback commands

**Discard the entire Phase-1 proposal, return to clean main:**
```bash
cd "c:/Users/Win11/Desktop/Klaviyo Campaign Email System"
git checkout main                                   # or: git switch main
git branch -D sc-brand-doc-population-2026-09-07     # delete the proposal branch
git stash pop                                        # Vic restores the pre-task working tree (manual)
```

**Undo just the Phase-1 commit but keep the branch:**
```bash
git reset --hard d4dcc30ff75412fbc138da5e23993acd84524fac
```

**If Phase 2 was applied and must be undone (before any further commits):**
```bash
git reset --hard <phase-1-commit-sha>   # back to the quarantined-proposal state
# then restore the deleted quarantine folder from that commit if needed:
git checkout <phase-1-commit-sha> -- _sc-population-proposal/
```

**Verify at any point nothing on main/canonical changed:**
```bash
git rev-parse main            # must still be d4dcc30…
git status --porcelain        # on the branch: only _sc-population-proposal/ (Phase 1)
```

## Confidence-tag ledger (SC.md.proposed)

- **[Confirmed]:** brand name/code/website/category, purpose, tagline, theme, 6 personality traits, the 5
  palette hexes, Poppins + weight hierarchy, "uppercase major headings", imagery direction, CTA label
  "SHOP NOW", CTA rectangular style, official logo URL (W2Ua5v), LEFT header alignment, contact
  email/phone/address/hours/ABN/socials, privacy URL, product source/store/domain/categories, hosting,
  Klaviyo account + key env var, icon standard (§6.21).
- **[Inferred]:** audience profile, email Poppins-fallback approximation, CTA fill colour navy `#465669`,
  header height 32px, from label, footer legal-line treatment, navy icon tone, uppercase CTA.
- **[To be confirmed]:** email header logo source (W2Ua5v vs XAUdQX), exact email fallback stack, exact CTA
  fill/radius (pending master Guideline), Klaviyo `from_email` + `reply_to_email`, `featuredCategoryIds`
  validation, hosted SC icon set, default Weekly audience, footer postal line.
