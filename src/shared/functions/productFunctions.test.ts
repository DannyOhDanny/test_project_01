import { describe, expect, it } from 'vitest';

import { categoryMap } from '../lib/categoryConfig';

import { formatPrice, getCategory, getRatingColor } from './productFunctions';

describe('getCategory', () => {
  it('возвращает mapped значение, если категория есть в map', () => {
    categoryMap['books'] = 'Книги';
    expect(getCategory('books')).toBe('Книги');
  });

  it('возвращает исходное значение, если категории нет в map', () => {
    expect(getCategory('unknown')).toBe('unknown');
  });

  it('работает с пустой строкой', () => {
    expect(getCategory('')).toBe('');
  });
});

describe('getRatingColor', () => {
  it('возвращает grey для NaN', () => {
    expect(getRatingColor(NaN)).toBe('grey');
    expect(getRatingColor(Number('abc'))).toBe('grey');
  });

  it('возвращает red для рейтинга меньше 3.5', () => {
    expect(getRatingColor(0)).toBe('red');
    expect(getRatingColor(3.4)).toBe('red');
  });

  it('возвращает black для рейтинга >= 3.5', () => {
    expect(getRatingColor(3.5)).toBe('black');
    expect(getRatingColor(5)).toBe('black');
  });
});
describe('formatPrice', () => {
  it('возвращает пустую строку для null, undefined или ""', () => {
    expect(formatPrice(null)).toBe(' - ');
    expect(formatPrice(undefined)).toBe(' - ');
    expect(formatPrice('')).toBe(' - ');
  });

  expect(formatPrice(1234).replace(/\s/g, '')).toBe('1234,00');
  expect(formatPrice('1 234,56').replace(/\s/g, '')).toBe('1234,56');
  expect(formatPrice(-1234.5).replace(/\s/g, '')).toBe('-1234,50');
});
