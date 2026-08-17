// ---------------------------------------------------------------------------
// tokens.js — the [[TOKEN]] substitution primitive (Architecture V2 §2.5).
//
// Implements the Components/README contract:
//   [[TOKEN]]              → framework slot, replaced at generation time.
//   {{ ... }} / {% ... %}  → Klaviyo Liquid, LEFT INTACT (never touched here).
//
// It also carries the conditional-aware HTML comment stripper required by
// CLAUDE.md §8.3 (strip descriptive comments before Output, but PRESERVE the
// MSO conditionals — header.html warns the stripper must not break the
// `[if !mso]` opener that ends in a bare comment token).
// ---------------------------------------------------------------------------

'use strict';

const { RenderError } = require('../common/errors');

// Replace every [[TOKEN]] using `values`. A token present in `values` with a
// null/undefined value is treated as "intentionally empty" and replaced with "".
// A token NOT present in `values` at all is a bug or missing brand fact → STOP
// (never invent — CLAUDE.md §5), unless `allowUnknownEmpty` is set.
function substitute(html, values, { allowUnknownEmpty = false, componentName = 'template' } = {}) {
  const missing = new Set();
  const out = html.replace(/\[\[([A-Z0-9_]+)\]\]/g, (match, key) => {
    if (Object.prototype.hasOwnProperty.call(values, key)) {
      const v = values[key];
      return v == null ? '' : String(v);
    }
    if (allowUnknownEmpty) return '';
    missing.add(key);
    return match;
  });

  if (missing.size) {
    throw new RenderError(
      `Unresolved token(s) in ${componentName}: ${[...missing].join(', ')}. ` +
        `A required value is missing — generation STOPS rather than invent it (CLAUDE.md §5).`,
      { component: componentName, missing: [...missing] }
    );
  }
  return out;
}

// Assert no [[TOKEN]] survived anywhere in the final document.
function assertNoTokens(html) {
  const leftover = [...html.matchAll(/\[\[([A-Z0-9_]+)\]\]/g)].map((m) => m[1]);
  if (leftover.length) {
    throw new RenderError(
      `Final HTML still contains unresolved token(s): ${[...new Set(leftover)].join(', ')}.`,
      { leftover: [...new Set(leftover)] }
    );
  }
}

// Conditional-aware comment stripper. Removes descriptive <!-- ... --> blocks
// but KEEPS any comment that is part of an MSO conditional (contains "[if",
// "endif", or "mso"). This preserves:
//   <!--[if mso]> ... <![endif]-->
//   <!--[if !mso]><!-->  ...  <!--<![endif]-->
// which are functional (CLAUDE.md §8.3), while dropping the large documentation
// header/footer comments in every component file.
function stripDescriptiveComments(html) {
  const cleaned = html.replace(/<!--[\s\S]*?-->/g, (comment) => {
    const inner = comment.slice(4, -3).trimStart();
    // Keep ONLY genuine Outlook conditionals — those whose content STARTS the
    // conditional (`[if mso]>`, `[if !mso]><!`) or is the downlevel-revealed
    // close (`<![endif]`). Prose that merely mentions "MSO"/"if" is descriptive
    // and is stripped (that prose can itself contain example [[TOKEN]]s).
    if (inner.startsWith('[if') || inner.startsWith('<![endif]')) return comment;
    return '';
  });
  // Collapse the blank lines the removals leave behind (keeps the file small, §8.3).
  return cleaned.replace(/[ \t]+\n/g, '\n').replace(/\n{3,}/g, '\n\n');
}

module.exports = { substitute, assertNoTokens, stripDescriptiveComments };
