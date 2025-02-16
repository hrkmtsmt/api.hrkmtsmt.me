import { describe, test, expect } from 'bun:test';
import { splitArray } from '.';

describe('function spritArray', () => {
  test('length100の配列を10で分割すると、返り値の配列がlengthが10になる', () => {
    expect(splitArray([...Array(100)], 10).length).toEqual(10);
  });

  test('length91の配列を10で分割すると、返り値の配列がlengthが10になる', () => {
    expect(splitArray([...Array(91)], 10).length).toEqual(10);
  });

  test('パラメータでわたってきた配列がから配列の場合返り値もから配列になる', () => {
    expect(splitArray([], 10)).toStrictEqual([]);
  });
});
