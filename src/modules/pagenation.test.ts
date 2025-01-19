import { test, describe, expect } from 'bun:test';
import { Pagenation } from '.';

describe('class Pagenation', () => {
  describe('pagination.pages', () => {
    test('総データ数がlimitより少ない場合ページ数は1になる', () => {
      expect(new Pagenation(11, 12, 1).pages).toBe(1);
    });

    test('総データ数が20でlimitが9のとページ数は3になる', () => {
      expect(new Pagenation(20, 9, 1).pages).toBe(3);
    });
  });

  describe('pagination.next', () => {
    test('総ページ数が現在のページ数以下の場合は次のページは存在しない', () => {
      expect(new Pagenation(11, 12, 1).next).toBe(null);
    });

    test('総ページ数が現在のページ数より上の場合は次のページを出力する', () => {
      expect(new Pagenation(20, 9, 1).next).toBe(2);
    });
  });
});
