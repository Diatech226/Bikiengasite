import test from 'node:test';
import assert from 'node:assert/strict';
import { supportAmount, supportCategory } from '../src/utils/support.ts';

test('support uses the numeric CMS value regardless of editorial labels', () => {
  const amounts = [{ value: 15000, label: 'Pack de 3 arbres' }, { value: 50000, label: 'Soutien libre' }];
  assert.equal(supportAmount(amounts, 'arbres', 15000), 15000);
  assert.equal(supportAmount(amounts, 'forage', 50000), 50000);
});

test('in-kind support and an unselected amount never send a monetary pledge', () => {
  const amounts = [{ value: 15000 }];
  assert.equal(supportAmount(amounts, 'materiel', 15000), undefined);
  assert.equal(supportAmount(amounts, 'forage'), undefined);
});

test('changed CMS amounts invalidate stale selections', () => {
  assert.equal(supportAmount([{ value: 20000 }], 'forage', 15000), undefined);
  for (const value of [NaN, Infinity, -1, 0, 1000000000, 1.234]) {
    assert.equal(supportAmount([{ value }], 'forage', value), undefined);
  }
  assert.equal(supportAmount([{ value: 0.29 }], 'forage', 0.29), 0.29);
});

test('each chantier retains its category and missing options have a safe fallback', () => {
  const categories = ['forage', 'cereales', 'orphelins', 'arbres', 'materiel'].map(value => ({ value }));
  for (const { value } of categories) assert.equal(supportCategory(categories, value), value);
  assert.equal(supportCategory(categories, 'unknown'), 'forage');
  assert.equal(supportCategory([]), '');
});
