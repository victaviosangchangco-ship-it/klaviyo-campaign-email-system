// ---------------------------------------------------------------------------
// report.js — turns QA findings into (a) a summary object the workflow gates on
// and (b) a Markdown report written to the send's Review/ folder (CLAUDE.md §8).
// ---------------------------------------------------------------------------

'use strict';

function summarize(findings) {
  const blockers = findings.filter((f) => f.severity === 'blocker');
  const warns = findings.filter((f) => f.severity === 'warn');
  const passes = findings.filter((f) => f.severity === 'pass');
  return {
    pass: blockers.length === 0,
    counts: { blocker: blockers.length, warn: warns.length, pass: passes.length },
    blockers,
    warns,
    passes,
  };
}

function icon(sev) {
  return sev === 'blocker' ? '❌' : sev === 'warn' ? '⚠️' : '✅';
}

function toMarkdown({ campaignId, brandCode, draftVersion, findings, summary, pkg, linkResults, meta, generatedAt }) {
  const lines = [];
  lines.push(`# QA Report — ${campaignId}`);
  lines.push('');
  lines.push(`- **Brand:** ${brandCode}`);
  lines.push(`- **Draft assessed:** ${draftVersion}`);
  lines.push(`- **Generated:** ${generatedAt}`);
  lines.push(`- **Result:** ${summary.pass ? '✅ PASS (no blockers)' : `❌ ${summary.counts.blocker} BLOCKER(S)`}`);
  lines.push(`- **Findings:** ${summary.counts.blocker} blocker · ${summary.counts.warn} warn · ${summary.counts.pass} pass`);
  lines.push('');
  lines.push('> Automated QA (Architecture V2 §2.6) encoding CLAUDE.md §6/§8. A browser preview is not');
  lines.push('> sufficient proof (§8.1); client-level checks (Klaviyo/Gmail/Apple Mail/Outlook) remain a');
  lines.push('> manual pre-send step and are listed at the end.');
  lines.push('');

  lines.push('## Automated checks');
  lines.push('');
  lines.push('| | Check | Ref | Detail |');
  lines.push('|---|---|---|---|');
  for (const f of findings) {
    lines.push(`| ${icon(f.severity)} | ${f.rule} | ${f.ref || ''} | ${String(f.message).replace(/\|/g, '\\|')} |`);
  }
  lines.push('');

  if (linkResults && linkResults.length) {
    const failed = linkResults.filter((r) => !r.ok);
    lines.push('## Live link verification (HTTP 200)');
    lines.push('');
    lines.push(`Checked ${linkResults.length} distinct URL(s); ${failed.length} failed.`);
    if (failed.length) {
      lines.push('');
      lines.push('| URL | Status |');
      lines.push('|---|---|');
      for (const r of failed.slice(0, 25)) lines.push(`| ${r.url} | ${r.status || r.error} |`);
    }
    lines.push('');
  } else {
    lines.push('## Live link verification (HTTP 200)');
    lines.push('');
    lines.push('⚠️ **Not run** in this build (offline / not requested). Re-run with `--verify-links`, and');
    lines.push('verify clickability **after Klaviyo import** before send (§8.1). This is a required manual gate.');
    lines.push('');
  }

  if (pkg && pkg._decision) {
    lines.push('## Decision provenance');
    lines.push('');
    lines.push('```json');
    lines.push(JSON.stringify(pkg._decision, null, 2));
    lines.push('```');
    lines.push('');
  }

  lines.push('## Manual pre-send gate (not automatable here — §8.1)');
  lines.push('');
  lines.push('- [ ] Klaviyo Preview · Gmail Web · Gmail Mobile (Android & iOS) · Apple Mail · Outlook');
  lines.push('- [ ] Clickability verified AFTER Klaviyo import (links survive the rewrite, §6.6/§8.1)');
  lines.push('- [ ] Recorded approval by a reviewer who is NOT the author (CR-16/CR-17)');
  lines.push('');
  lines.push('**Send status:** `NOT APPROVED TO SEND` — presence in Output/ is preview only (CLAUDE.md §4.1/§9).');
  lines.push('');
  return lines.join('\n');
}

module.exports = { summarize, toMarkdown };
