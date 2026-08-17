// Unit tests for the QA Layer — each crafted input must trip the right blocker,
// and a clean input must pass. These encode CLAUDE.md §6/§8 as regression tests.

'use strict';

const { test } = require('node:test');
const assert = require('node:assert');
const { runAll } = require('../qa/validators');
const { summarize } = require('../qa/report');

function ruleOf(findings, rule) {
  return findings.find((f) => f.rule === rule);
}

test('flags a <table> wrapped in an <a> (§6.6)', () => {
  const html = '<a href="https://x.com"><table><tr><td>x</td></tr></table></a>';
  assert.strictEqual(ruleOf(runAll(html), 'table-in-anchor').severity, 'blocker');
});

test('flags nested anchors (§8.2)', () => {
  const html = '<a href="https://x.com">hi <a href="https://y.com">there</a></a>';
  assert.strictEqual(ruleOf(runAll(html), 'nested-anchors').severity, 'blocker');
});

test('flags empty / placeholder hrefs (§6.7)', () => {
  assert.strictEqual(ruleOf(runAll('<a href="#">x</a>'), 'bad-hrefs').severity, 'blocker');
  assert.strictEqual(ruleOf(runAll('<a href="">x</a>'), 'bad-hrefs').severity, 'blocker');
  assert.strictEqual(ruleOf(runAll('<a href="[[CTA_URL]]">x</a>'), 'bad-hrefs').severity, 'blocker');
});

test('flags an anchor-emitting merge tag inside an href (§6.23)', () => {
  const html = '<a href="{% unsubscribe %}">Unsubscribe</a>';
  assert.strictEqual(ruleOf(runAll(html), 'merge-tag-in-attribute').severity, 'blocker');
});

test('accepts the URL-form unsubscribe tag (§6.23)', () => {
  const html = '<a href="{% unsubscribe_link %}">Unsubscribe</a>';
  assert.strictEqual(ruleOf(runAll(html), 'merge-tag-in-attribute').severity, 'pass');
});

test('flags empty / non-HTTPS image src (§8)', () => {
  assert.strictEqual(ruleOf(runAll('<img src="" />'), 'image-src').severity, 'blocker');
  assert.strictEqual(ruleOf(runAll('<img src="http://x.com/a.jpg" />'), 'image-src').severity, 'blocker');
});

test('flags unresolved tokens', () => {
  assert.strictEqual(ruleOf(runAll('<p>[[HERO_HEADING]]</p>'), 'unresolved-tokens').severity, 'blocker');
});

test('flags anchor imbalance (§6.23)', () => {
  assert.strictEqual(ruleOf(runAll('<a href="https://x.com">x'), 'anchor-balance').severity, 'blocker');
});

test('a clean minimal document passes the blocker-level checks', () => {
  const html =
    '<!DOCTYPE html><html><head><title>t</title></head><body>' +
    '<div style="display:none;max-height:0;mso-hide:all">preheader</div>' +
    '<a href="https://www.example.com/p/"><img src="https://cdn.example.com/a.jpg" width="188" height="188" /></a>' +
    '<a href="{% unsubscribe_link %}">Unsubscribe</a>' +
    '</body></html>';
  const summary = summarize(runAll(html));
  assert.strictEqual(summary.pass, true, `expected no blockers, got: ${JSON.stringify(summary.blockers)}`);
});
