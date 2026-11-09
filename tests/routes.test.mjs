import test from 'node:test';
import assert from 'node:assert/strict';
import { parseRoute, tabPath, itemPath } from '../src/routing/routes.ts';
import { readingTime } from '../src/utils/readingTime.ts';

test('every section, including admin, survives direct navigation and trailing slash', () => {
  for (const tab of ['accueil', 'agriculture', 'elevage', 'humanitaire', 'projets', 'admin']) {
    assert.equal(parseRoute(tabPath(tab)).tab, tab);
    assert.equal(parseRoute(`${tabPath(tab)}/`).tab, tab);
  }
});
test('shared article and reportage URLs round-trip Unicode and reserved characters', () => {
  for (const kind of ['articles', 'reportages']) {
    const slug = 'récolte eau & santé/2026';
    assert.deepEqual(parseRoute(itemPath(kind, slug)), { tab: 'accueil', kind, slug });
  }
});
test('unknown or malformed URLs do not silently render the home page', () => {
  for (const path of ['/missing', '/admin/anything', '/articles', '/articles/%E0%A4%A']) {
    assert.equal(parseRoute(path).notFound, true);
  }
});
test('reading estimates are derived from words, including empty and long text', () => {
  assert.equal(readingTime(''), '1 min');
  assert.equal(readingTime('mot '.repeat(401)), '3 min');
});
