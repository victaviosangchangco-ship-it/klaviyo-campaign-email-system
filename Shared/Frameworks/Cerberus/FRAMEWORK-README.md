# Cerberus Email Framework — Vendored Reference

**Cerberus is our official HTML email reference framework.** It is a *reference*, not a runtime
dependency: we do not build campaigns or flows by editing Cerberus files. We build from **our own**
component library, and Cerberus is the authority we check that library against.

---

## Provenance (do not edit upstream files)

| | |
|---|---|
| Upstream | <https://github.com/emailmonday/Cerberus> (canonical: <https://www.cerberusemail.com/>) |
| Author | Ted Goas |
| Licence | MIT (see `LICENSE`) — permissive; attribution retained |
| Commit vendored | `fa6de2ebb2e0bcd0614c53bd11f930d5bc8173fd` |
| Commit date | 2024-07-07 |
| Vendored on | 2026-07-28 |

**Upstream files are byte-for-byte unmodified.** Verified checksums at vendor time:

```
c06594401b15fb0bb25bc4d062aa0189  cerberus-fluid.html
0ef2d5fdea1eb3620d9674e7c5d7002b  cerberus-hybrid.html
a62bf84fed70595495834c51cba4a65f  cerberus-responsive.html
```

The nested `.git` directory was removed so the parent repository tracks these files normally instead
of recording an unusable gitlink. Nothing else was changed. To refresh, re-clone at a new commit,
delete `.git`, update the table above, and re-run the analysis docs against the diff.

---

## What is upstream vs. what is ours

| Path | Origin | Editable? |
|------|--------|-----------|
| `cerberus-fluid.html`, `cerberus-hybrid.html`, `cerberus-responsive.html` | **Upstream** | ❌ Never |
| `docs/`, `archived-versions/`, `LICENSE`, `README.md`, `bower.json`, `package.json`, `.github/` | **Upstream** | ❌ Never |
| `Cerberus-*.md` (5 analysis docs) | **Ours** | ✅ Yes |
| `Components/*.html` (13 reference components) | **Ours** (extracted + hardened) | ✅ Yes |
| `FRAMEWORK-README.md` (this file) | **Ours** | ✅ Yes |

---

## The five analysis documents

Read in this order:

1. **[`Cerberus-Analysis.md`](Cerberus-Analysis.md)** — what Cerberus is, the three template
   architectures (Fluid / Responsive / Hybrid), and the complete concept inventory. **Start here.**
2. **[`Cerberus-Techniques.md`](Cerberus-Techniques.md)** — the mechanics: ghost tables, VML, hybrid
   stacking, `dir` order-swapping, bulletproof buttons, responsive images, spacers, dark mode.
3. **[`Cerberus-Components.md`](Cerberus-Components.md)** — component-by-component breakdown and how
   each maps to our existing library.
4. **[`Cerberus-Best-Practices.md`](Cerberus-Best-Practices.md)** — the ruleset, with an explicit
   adopt / already-have / deliberately-diverge verdict on every rule.
5. **[`Cerberus-Compatibility.md`](Cerberus-Compatibility.md)** — client-by-client support matrix and
   the QA gates each client demands.

## The reference component library

`Components/` holds **13 annotated reference components** extracted from Cerberus and hardened with
the defects our own production history has already taught us (Klaviyo import rewrite, Gmail-mobile
gutters, Apple Mail iOS image collapse, Outlook fixed-height cells).

**These are reference components only.** They are brand-neutral, use `[[TOKEN]]` slots, and are not
wired into any build. Production markup remains:

- Campaign System → `Components/*.html` + `Shared/Snippets/base-head.html`
- Flow System → the brand's `Design.md` component set

When a production component and a Cerberus reference disagree, see
[`Cerberus-Best-Practices.md`](Cerberus-Best-Practices.md) §5 — several disagreements are
**deliberate**, because we support Klaviyo and Gmail-mobile conditions Cerberus does not target.

---

## The one-line summary of why this matters

Cerberus is the industry's most battle-tested statement of *how email HTML must be built*. Our
CLAUDE.md rules were learned the expensive way — one production defect at a time. Vendoring Cerberus
gives us an **independent, external check** on that ruleset, and a canonical reference for every
technique we have not yet needed.
