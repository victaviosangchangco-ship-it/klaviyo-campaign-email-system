// ---------------------------------------------------------------------------
// validators.js — the QA Layer (Architecture V2 §2.6, Phase 2).
//
// Encodes the highest-value CLAUDE.md §6/§8 email-safety rules as EXECUTABLE
// checks. Each returns findings with a severity:
//   blocker → a real defect that blocks promotion-to-send (recorded, not hidden;
//             the build still lands in Output/ for preview, CLAUDE.md §4.1).
//   warn    → worth a human's eye, does not block.
//   pass    → the check ran and found nothing.
//
// The severity split is deliberate: genuine send-breakers (empty href, table in
// an anchor, nested anchors, unresolved tokens, empty image src, merge-tag in an
// attribute, >102KB clip) block; template-inherent style choices only warn.
//
// A live HTTP-200 link checker (§8/§8.1) is provided separately (async, network)
// and is opt-in so the suite stays deterministic and offline by default.
// ---------------------------------------------------------------------------

'use strict';

function finding(severity, rule, message, ref, extra = {}) {
  return { severity, rule, message, ref, ...extra };
}

// Iterate anchors as {attrs, inner} (components carry no nested anchors, so a
// non-greedy match to the first </a> is correct here).
function eachAnchor(html, fn) {
  const re = /<a\b([^>]*)>([\s\S]*?)<\/a>/gi;
  let m;
  while ((m = re.exec(html)) !== null) fn(m[1], m[2], m[0]);
}

// --- individual checks ------------------------------------------------------

function checkUnresolvedTokens(html) {
  const hits = [...new Set([...html.matchAll(/\[\[([A-Z0-9_]+)\]\]/g)].map((m) => m[1]))];
  return hits.length
    ? finding('blocker', 'unresolved-tokens', `Unresolved [[TOKEN]](s): ${hits.join(', ')}`, 'render/§5', { hits })
    : finding('pass', 'unresolved-tokens', 'No unresolved tokens.', 'render/§5');
}

function checkAnchorBalance(html) {
  const open = (html.match(/<a\b/gi) || []).length;
  const close = (html.match(/<\/a>/gi) || []).length;
  return open === close
    ? finding('pass', 'anchor-balance', `Anchors balanced (${open}).`, '§6.23')
    : finding('blocker', 'anchor-balance', `Anchor imbalance: ${open} <a> vs ${close} </a>.`, '§6.23', { open, close });
}

function checkTableInAnchor(html) {
  let count = 0;
  eachAnchor(html, (attrs, inner) => {
    if (/<table\b/i.test(inner)) count++;
  });
  return count
    ? finding('blocker', 'table-in-anchor', `${count} anchor(s) wrap a <table> — Klaviyo detaches the href on import.`, '§6.6', { count })
    : finding('pass', 'table-in-anchor', 'No <table> inside an <a>.', '§6.6');
}

function checkNestedAnchors(html) {
  let count = 0;
  eachAnchor(html, (attrs, inner) => {
    if (/<a\b/i.test(inner)) count++;
  });
  return count
    ? finding('blocker', 'nested-anchors', `${count} nested anchor(s) — Gmail rendering artifact / lost link.`, '§8.2', { count })
    : finding('pass', 'nested-anchors', 'No nested anchors.', '§8.2');
}

function checkEmptyAnchors(html) {
  let count = 0;
  eachAnchor(html, (attrs, inner) => {
    const stripped = inner.replace(/&nbsp;|&zwnj;|\s/gi, '');
    if (stripped === '') count++;
  });
  return count
    ? finding('blocker', 'empty-anchors', `${count} empty anchor(s) (ghost element).`, '§8.2', { count })
    : finding('pass', 'empty-anchors', 'No empty anchors.', '§8.2');
}

function checkImageAnchorDisplayBlock(html) {
  let count = 0;
  eachAnchor(html, (attrs, inner) => {
    if (/<img\b/i.test(inner) && /display\s*:\s*block/i.test(attrs)) count++;
  });
  return count
    ? finding('blocker', 'image-anchor-display-block', `${count} image-wrapping anchor(s) with display:block — Apple Mail iOS zero-height collapse.`, '§6.6', { count })
    : finding('pass', 'image-anchor-display-block', 'No display:block on image-wrapping anchors.', '§6.6');
}

function checkHrefs(html) {
  const bad = [];
  const re = /href\s*=\s*"([^"]*)"/gi;
  let m;
  while ((m = re.exec(html)) !== null) {
    const v = m[1].trim();
    // Klaviyo Liquid destinations are valid (e.g. {% unsubscribe_link %}).
    if (/^\{[{%]/.test(v)) continue;
    if (v === '' || v === '#' || v.startsWith('[[')) bad.push(v || '(empty)');
    else if (/</.test(v)) bad.push(v); // HTML/tag leaked into the attribute (§6.23)
  }
  return bad.length
    ? finding('blocker', 'bad-hrefs', `${bad.length} empty/placeholder/malformed href(s): ${[...new Set(bad)].slice(0, 5).join(' | ')}`, '§6.7/§6.23', { samples: [...new Set(bad)].slice(0, 5) })
    : finding('pass', 'bad-hrefs', 'All hrefs are real destinations.', '§6.7');
}

function checkMergeTagInAttribute(html) {
  const leaks = [];
  // anchor-emitting subscription tags must never sit inside an href (§6.23)
  if (/href\s*=\s*"[^"]*\{%\s*(unsubscribe|manage_preferences)\s*%\}/i.test(html)) {
    leaks.push('{% unsubscribe %}/{% manage_preferences %} inside href — use the *_link URL form');
  }
  // invalid {{ *_url }} variables produce dead hrefs
  const invalidVar = html.match(/href\s*=\s*"[^"]*\{\{\s*(manage_preferences_url|unsubscribe_url)\s*\}\}/i);
  if (invalidVar) leaks.push('{{ manage_preferences_url }}/{{ unsubscribe_url }} is not a valid Klaviyo tag');
  return leaks.length
    ? finding('blocker', 'merge-tag-in-attribute', leaks.join('; '), '§6.23', { leaks })
    : finding('pass', 'merge-tag-in-attribute', 'Footer merge tags use the URL form; no tag leaks in attributes.', '§6.23');
}

function checkImages(html) {
  const bad = [];
  const re = /<img\b[^>]*\bsrc\s*=\s*"([^"]*)"/gi;
  let m;
  let total = 0;
  while ((m = re.exec(html)) !== null) {
    total++;
    const v = m[1].trim();
    if (v === '' || v.startsWith('[[')) bad.push(v || '(empty)');
    else if (!/^https:\/\//i.test(v) && !/^\{[{%]/.test(v)) bad.push(v); // must be absolute HTTPS (§8)
  }
  return bad.length
    ? finding('blocker', 'image-src', `${bad.length}/${total} image src(s) empty/placeholder/non-HTTPS.`, '§8/§6.6', { samples: [...new Set(bad)].slice(0, 5), total })
    : finding('pass', 'image-src', `All ${total} image src(s) are absolute HTTPS.`, '§8');
}

function checkMissingImageDims(html) {
  // Apple Mail iOS drops fixed images without BOTH width and height attributes (§6.6).
  let missing = 0;
  const re = /<img\b([^>]*)>/gi;
  let m;
  while ((m = re.exec(html)) !== null) {
    const attrs = m[1];
    const hasW = /\bwidth\s*=/.test(attrs);
    const hasH = /\bheight\s*=/.test(attrs);
    if (!hasW || !hasH) missing++;
  }
  return missing
    ? finding('warn', 'image-dims', `${missing} image(s) missing explicit width/height attribute(s) (Apple Mail iOS reserve box, §6.6).`, '§6.6', { missing })
    : finding('pass', 'image-dims', 'All images carry width & height attributes.', '§6.6');
}

function checkGmailClip(html, kb) {
  const bytes = Buffer.byteLength(html, 'utf8');
  const limit = (kb || 102) * 1024;
  if (bytes > limit) {
    return finding('blocker', 'gmail-clip', `HTML is ${(bytes / 1024).toFixed(1)}KB (> ${kb}KB Gmail clip).`, '§8.3', { bytes });
  }
  if (bytes > limit * 0.9) {
    return finding('warn', 'gmail-clip', `HTML is ${(bytes / 1024).toFixed(1)}KB (approaching ${kb}KB Gmail clip).`, '§8.3', { bytes });
  }
  return finding('pass', 'gmail-clip', `HTML is ${(bytes / 1024).toFixed(1)}KB (well under ${kb}KB clip).`, '§8.3', { bytes });
}

function checkStructure(html) {
  const warns = [];
  if (!/<!DOCTYPE/i.test(html)) warns.push('missing <!DOCTYPE>');
  if (!/<\/html>/i.test(html)) warns.push('missing </html>');
  if (!/mso-hide:all|display:none;[^"]*max-height:0/i.test(html)) warns.push('no hidden preheader detected (CS-14)');
  return warns.length
    ? finding('warn', 'structure', `Structure notes: ${warns.join('; ')}.`, 'CS-08/CS-14', { warns })
    : finding('pass', 'structure', 'Doctype, closing html, and preheader present.', 'CS-08/CS-14');
}

// --- runner -----------------------------------------------------------------

function runAll(html, { platformConfig } = {}) {
  const kb = (platformConfig && platformConfig.qa && platformConfig.qa.gmailClipKb) || 102;
  return [
    checkUnresolvedTokens(html),
    checkAnchorBalance(html),
    checkTableInAnchor(html),
    checkNestedAnchors(html),
    checkEmptyAnchors(html),
    checkImageAnchorDisplayBlock(html),
    checkHrefs(html),
    checkMergeTagInAttribute(html),
    checkImages(html),
    checkMissingImageDims(html),
    checkGmailClip(html, kb),
    checkStructure(html),
  ];
}

// --- optional live link check (HTTP 200, §8/§8.1) ---------------------------
// Verifies distinct product/CTA/image URLs actually resolve. Network + opt-in.
async function checkLinksLive(urls, { timeoutMs = 8000, concurrency = 6, logger } = {}) {
  const distinct = [...new Set(urls.filter((u) => /^https:\/\//i.test(u)))];
  const results = [];
  let idx = 0;

  async function worker() {
    while (idx < distinct.length) {
      const url = distinct[idx++];
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), timeoutMs);
      try {
        // HEAD first; some CDNs disallow HEAD, so fall back to a ranged GET.
        let res = await fetch(url, { method: 'HEAD', redirect: 'manual', signal: controller.signal });
        if (res.status === 405 || res.status === 501) {
          res = await fetch(url, { method: 'GET', redirect: 'manual', signal: controller.signal, headers: { Range: 'bytes=0-0' } });
        }
        results.push({ url, status: res.status, ok: res.status >= 200 && res.status < 300 });
      } catch (err) {
        results.push({ url, status: 0, ok: false, error: err.name === 'AbortError' ? 'timeout' : err.message });
      } finally {
        clearTimeout(timer);
      }
    }
  }

  if (logger) logger.info(`Verifying ${distinct.length} distinct URL(s) resolve (HTTP 200)…`);
  await Promise.all(Array.from({ length: Math.min(concurrency, distinct.length || 1) }, worker));

  const failures = results.filter((r) => !r.ok);
  const f = failures.length
    ? finding('blocker', 'link-http-200', `${failures.length}/${results.length} URL(s) did not return HTTP 200.`, '§8/§8.1', { failures: failures.slice(0, 10) })
    : finding('pass', 'link-http-200', `All ${results.length} URL(s) returned HTTP 200.`, '§8/§8.1');
  return { finding: f, results };
}

module.exports = { runAll, checkLinksLive, finding };
