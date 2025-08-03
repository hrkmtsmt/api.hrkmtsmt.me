import { describe, test, expect } from "bun:test";
import { TestManager } from "@test/index";
import { scraps } from "./route";
import * as schema from "@schema/index";
import type { GetListResponse, GetResponse } from "./types";

describe("route /scraps", () => {
  describe("GET /scraps", () => {
    test("リクエストを送るとスクラップ一覧が返ってくる", async () => {
      const manager = new TestManager();
      const result = await scraps.request("/scraps", {}, manager.env);

      expect(await result.json<GetListResponse>()).toStrictEqual({
        data: [
          {
            filename: "1751979286783.md",
            createdAt: new Date("1751979286783.md".split(".")[0]),
          },
          {
            filename: "1753539888415.md",
            createdAt: new Date("1751979286783.md".split(".")[0]),
          },
        ],
        pages: 1,
        next: null,
      });
    });
  });

  describe("GET /scraps/:filename", () => {
    test("存在するファイル名でリクエストするとスクラップの詳細が返ってくる", async () => {
      const manager = new TestManager();

      const result = await scraps.request(
        "/scraps/1751979286783.md",
        {},
        manager.env,
      );

      expect(result.status).toEqual(200);
    });

    test("存在しないファイル名でリクエストすると404エラーが返ってくる", async () => {
      const manager = new TestManager();

      const result = await scraps.request(
        "/scraps/non-existent.md",
        {},
        manager.env,
      );

      expect(result.status).toBe(422);
    });
  });
});
