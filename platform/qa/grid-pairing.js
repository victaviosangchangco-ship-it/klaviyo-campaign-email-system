'use strict';

const { finding } = require('./validators');

function checkGridPairing(pkg) {
  const audit = pkg && pkg._decision && pkg._decision.pairingAudit;
  const products = pkg && pkg.products;
  if (!Array.isArray(audit) || !audit.length || !Array.isArray(products)) {
    return [finding('pass', 'grid-pairing', 'No pairing audit present (generic path).', 'grid-pairing')];
  }

  const findings = [];

  // Data-integrity: product count unchanged
  const auditIds = [];
  for (const row of audit) {
    if (row.left) auditIds.push(row.left.id);
    if (row.right) auditIds.push(row.right.id);
  }
  const productIds = products.map((p) => p.id);
  if (auditIds.length !== productIds.length) {
    findings.push(finding(
      'blocker', 'grid-pairing-count',
      `Pairing changed product count: audit has ${auditIds.length}, products has ${productIds.length}.`,
      'grid-pairing'
    ));
  }

  // Data-integrity: no duplicates
  const seen = new Set();
  const dups = [];
  for (const id of productIds) {
    if (seen.has(id)) dups.push(id);
    seen.add(id);
  }
  if (dups.length) {
    findings.push(finding(
      'blocker', 'grid-pairing-duplicate',
      `Pairing introduced duplicate product ID(s): ${dups.join(', ')}.`,
      'grid-pairing'
    ));
  }

  // Data-integrity: same IDs before and after (sorted comparison)
  const sortedAudit = [...auditIds].sort();
  const sortedProducts = [...productIds].sort();
  if (sortedAudit.join(',') !== sortedProducts.join(',')) {
    findings.push(finding(
      'blocker', 'grid-pairing-mismatch',
      'Pairing altered the product ID set — products were lost or introduced.',
      'grid-pairing'
    ));
  }

  if (!findings.length) {
    const strongPairs = audit.filter((r) => r.score >= 50).length;
    findings.push(finding(
      'pass', 'grid-pairing',
      `${audit.length} row(s) paired; ${strongPairs} strong pair(s) (same family/category).`,
      'grid-pairing'
    ));
  }

  return findings;
}

module.exports = { checkGridPairing };
