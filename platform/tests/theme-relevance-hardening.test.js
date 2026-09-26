// Unit tests for the hardened product theme-relevance gate (NARROW HARDENING
// PATCH: Product Theme Relevance). Priority: category/family (strongest) >
// product name (strong) > description/search-term overlap (supporting only).

'use strict';

const { test } = require('node:test');
const assert = require('node:assert');
const { productMatchesTheme, filterThemeRelevant, assignSection } = require('../ai/theme-relevance');

const themePkg = {
  campaignId: 'RDD-2026-38',
  topicCategory: 'Expandable Barriers',
  campaignName: 'Smarter Access Control with Expandable Barriers',
  searchTerms: ['expandable barriers', 'crowd management', 'barrier'],
};

const prod = (over = {}) => ({
  id: 1, name: 'Item', desc: '', url: 'https://x/1', imageUrl: 'https://x/1.jpg', priceLabel: 'AUD $10.00', ...over,
});

test('category match with weak description still accepted', () => {
  // Category IS the strongest signal — a generic name and no keyword-bearing
  // description must not prevent acceptance when the category itself matches.
  const p = prod({ name: 'Item 4021', category: 'Expandable Barriers', desc: 'Expandable Barriers', description: '' });
  assert.strictEqual(productMatchesTheme(p, themePkg), true);
});

test('description keyword alone cannot override wrong category', () => {
  // Category is present and confirmed WRONG (Signage), even though the free-text
  // description happens to contain a theme search term ("barrier"). A single
  // generic keyword must not rescue a wrong-category product.
  const p = prod({
    name: 'Aluminium Sign Stand',
    category: 'Signage',
    desc: 'Signage',
    description: 'A versatile sign and barrier-adjacent display stand for retail.',
  });
  assert.strictEqual(productMatchesTheme(p, themePkg), false);
});

test('product name + correct category accepted', () => {
  const p = prod({ name: 'Expandable Barrier 4m', category: 'Expandable Barriers', desc: 'Expandable Barriers' });
  assert.strictEqual(productMatchesTheme(p, themePkg), true);
});

test('unrelated category rejected', () => {
  const p = prod({ name: 'Office Desk Lamp', category: 'Lighting', desc: 'Lighting', description: 'A compact desk lamp.' });
  assert.strictEqual(productMatchesTheme(p, themePkg), false);
});

test('broad multi-category theme can accept multiple approved category families', () => {
  const broadTheme = {
    campaignId: 'RDD-2026-XX',
    campaignName: 'Access & Crowd Control',
    categoryFamilies: ['Expandable Barriers', 'Crowd Control Stanchions'],
    searchTerms: ['access control', 'crowd control'],
  };
  const barrier = prod({ id: 1, name: 'Expandable Barrier 4m', category: 'Expandable Barriers', desc: 'Expandable Barriers' });
  const stanchion = prod({ id: 2, name: 'Retractable Belt Stanchion', category: 'Crowd Control Stanchions', desc: 'Crowd Control Stanchions' });
  const unrelated = prod({ id: 3, name: 'Office Desk Lamp', category: 'Lighting', desc: 'Lighting' });

  assert.strictEqual(productMatchesTheme(barrier, broadTheme), true);
  assert.strictEqual(productMatchesTheme(stanchion, broadTheme), true);
  assert.strictEqual(productMatchesTheme(unrelated, broadTheme), false);

  const kept = filterThemeRelevant([barrier, stanchion, unrelated], broadTheme);
  assert.deepStrictEqual(kept.map((p) => p.id), [1, 2]);
});

test('selected product must map to a valid campaign section', () => {
  const sectioned = {
    campaignId: 'RDD-2026-XX',
    campaignName: 'Access & Crowd Control',
    sections: [
      { title: 'Expandable Barriers', categoryFamilies: ['Expandable Barriers'] },
      { title: 'Stanchions', categoryFamilies: ['Crowd Control Stanchions'] },
    ],
    searchTerms: [],
  };
  const barrier = prod({ id: 1, name: 'Expandable Barrier 4m', category: 'Expandable Barriers', desc: 'Expandable Barriers' });
  const unrelated = prod({ id: 2, name: 'Office Desk Lamp', category: 'Lighting', desc: 'Lighting' });

  const section = assignSection(barrier, sectioned);
  assert.ok(section);
  assert.strictEqual(section.title, 'Expandable Barriers');

  assert.strictEqual(assignSection(unrelated, sectioned), null);
  assert.deepStrictEqual(filterThemeRelevant([barrier, unrelated], sectioned).map((p) => p.id), [1]);
});
