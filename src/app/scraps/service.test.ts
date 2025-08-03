import { test, describe, expect } from "bun:test";
import { TestManager } from "@test/index";
import { ScrapService } from "./service";

describe("ScrapService", () => {
  describe("method service.list", () => {
    test("すべてのスクラップが取得できる", async () => {
      const manager = new TestManager();
      const service = new ScrapService(
        manager.octokit,
        process.env.SECRET_GITHUB_OWNER,
        process.env.SECRET_GITHUB_REPO,
      );

      const result = await service.list();

      expect(result).toStrictEqual([
        {
          filename: "1751979286783.md",
          createdAt: new Date(1751979286783),
        },
        {
          filename: "1753539888415.md",
          createdAt: new Date(1753539888415),
        },
      ]);
    });
  });

  describe("method service.retrive", () => {
    test("指定したファイル名のスクラップが取得できる", async () => {
      const manager = new TestManager();
      const service = new ScrapService(
        manager.octokit,
        process.env.SECRET_GITHUB_OWNER,
        process.env.SECRET_GITHUB_REPO,
      );

      const result = await service.retrieve("");

      expect(result).toStrictEqual({
        filename: "",
        createdAt: new Date(),
        content: "",
      });
    });

    test("存在しないファイル名の場合はundefinedが返される", async () => {
      const manager = new TestManager();
      const service = new ScrapService(
        manager.octokit,
        process.env.SECRET_GITHUB_OWNER,
        process.env.SECRET_GITHUB_REPO,
      );

      const result = await service.retrieve("dose-not-exist.md");

      expect(result).toBeNull();
    });
  });
});
