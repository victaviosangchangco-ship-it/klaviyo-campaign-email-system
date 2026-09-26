// ---------------------------------------------------------------------------
// curation-balance.js — QA over the curation audit trail (SYSTEM PATCH:
// Curation Ranking + Category Balancing).
//
// Reads pkg._decision.curationAudit / categoryStats (platform/ai/copy.js's
// selectBalanced) and WARNS — never blocks — on a poorly-balanced grid:
//   - the primary category is materially accessory-heavy (>50% of its
//     selected slots are accessory-tier),
//   - an approved supporting category had valid, in-stock candidates but
//     ended up with zero representation in the final selection.
// Low stock alone is never a warning (CLAUDE.md: a valid in-stock product is
// never rejected for being thin — that's a ranking penalty, not a blocker).
// Absence of an audit (the generic, non-calendar-driven path, or an override
// campaign) is a pass, not a violation — there is no campaign category intent
// to check it against.
// ---------------------------------------------------------------------------

'use strict';

const { finding } = require('./validators');

function checkCurationBalance(pkg) {
  const decision = pkg && pkg._decision;
  const audit = decision && decision.curationAudit;
  const categoryStats = decision && decision.categoryStats;

  if (!Array.isArray(audit) || !audit.length || !Array.isArray(categoryStats)) {
    return finding('pass', 'curation-balance', 'No curation audit to assess (generic/override path — no category intent to balance against).', 'curation-balance');
  }

  const problems = [];

  const primaryEntries = audit.filter((a) => a.role === 'primary');
  if (primaryEntries.length) {
    const accessoryCount = primaryEntries.filter((a) => a.tier === 'accessory').length;
    if (accessoryCount / primaryEntries.length > 0.5) {
      problems.push(
        `primary category "${primaryEntries[0].category}" is accessory-heavy: ${accessoryCount}/${primaryEntries.length} ` +
          `selected product(s) are accessory-tier (end-cap/replacement/wall-mount items), not standalone units.`
      );
    }
  }

  const omittedSupporting = categoryStats.filter((c) => c.role === 'supporting' && c.candidateCount > 0 && c.selectedCount === 0);
  if (omittedSupporting.length) {
    problems.push(
      `approved supporting categor${omittedSupporting.length > 1 ? 'ies' : 'y'} completely omitted despite having valid, ` +
        `in-stock candidates: ${omittedSupporting.map((c) => `"${c.category}" (${c.candidateCount} candidate(s))`).join(', ')}.`
    );
  }

  // Thin-stock supporting warning: a supporting product with inv<=2 was
  // selected while another approved supporting category still has unselected
  // complete-tier products with healthier stock. Never blocks — just flags.
  const supportingAudit = audit.filter((a) => a.role === 'supporting');
  const thinSupportingSelected = supportingAudit.filter((a) => a.stock != null && a.stock <= 2);
  if (thinSupportingSelected.length) {
    const otherSupportingCats = categoryStats.filter((c) => c.role === 'supporting' && c.selectedCount < c.candidateCount);
    const hasUnusedStrong = otherSupportingCats.some((c) => {
      const catAuditSelected = audit.filter((a) => a.category === c.category);
      const selectedIds = new Set(catAuditSelected.map((a) => a.id));
      return catAuditSelected.length < c.candidateCount;
    });
    if (hasUnusedStrong) {
      problems.push(
        `${thinSupportingSelected.length} thin-stock (inv≤2) supporting product(s) selected ` +
          `(${thinSupportingSelected.map((a) => `${a.name} inv=${a.stock}`).join('; ')}) ` +
          `while other approved supporting categories still have unselected candidates.`
      );
    }
  }

  if (problems.length) {
    return finding('warn', 'curation-balance', problems.join(' '), 'curation-balance', { categoryStats });
  }
  return finding(
    'pass',
    'curation-balance',
    `Curated set is balanced across ${categoryStats.length} categor${categoryStats.length > 1 ? 'ies' : 'y'}: ` +
      categoryStats.map((c) => `${c.category} (${c.role}) ${c.selectedCount}/${c.candidateCount}` +
        (c.depthScore != null ? ` score=${c.depthScore}` : '')).join(', ') + '.',
    'curation-balance'
  );
}

module.exports = { checkCurationBalance };
