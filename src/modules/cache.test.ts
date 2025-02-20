import { describe, test, expect } from "bun:test";
import { Cache } from ".";

describe("class Cache", () => {
  test("初期化後に値を取得するとundefinedになる", () => {
    expect<number | undefined>(new Cache<number>().get()).toBe(undefined);
  });

  test("値を16にセットした後に値を取得すると16になる", () => {
    const cache = new Cache<number>();
    cache.set(16);
    expect<number | undefined>(cache.get()).toEqual(16);
  });

  test("値を32にセットして値をクリアした後に値を取得するとundefinedになる", () => {
    const cache = new Cache<number>();
    cache.set(32);
    cache.clear();
    expect<number | undefined>(cache.get()).toEqual(undefined);
  });
});
