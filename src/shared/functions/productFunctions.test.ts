import { expect, test } from 'vitest';

import { getCategory, getRatingColor } from './productFunctions';

test('min rating 3.5', () => {
  expect(getRatingColor(2.5)).toBe('red');
});

test('max rating 5', () => {
  expect(getRatingColor(5)).toBe('black');
});

test('category', () => {
  expect(getCategory('beauty')).toBe('красота');
});

test('non category', () => {
  expect(getCategory('beauty-decorations')).toBe('beauty-decorations');
});
