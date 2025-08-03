import { describe, test, expect } from "bun:test";
import { TestManager } from "@test/index";
import { posts } from "./route";
import { PostService } from "./service";
import type { Post } from "@schema/types";
import type { ListResponse } from "./types";

const data: Post[] = [
  {
    id: 1,
    slug: "a",
    media: "zenn",
    title: "Zenn article A",
    url: "https://example.com/articles/zenn/A",
    createdAt: new Date("2021-01-01T00:00:00.000Z"),
    publishedAt: new Date("2021-01-01T00:00:00.000Z"),
  },
  {
    id: 2,
    slug: "b",
    media: "qiita",
    title: "Qiita article B",
    url: "https://example.com/articles/qiita/A",
    createdAt: new Date("2021-01-01T00:00:00.000Z"),
    publishedAt: new Date("2021-01-01T00:00:00.000Z"),
  },
  {
    id: 3,
    slug: "c",
    media: "sizu",
    title: "Sizu article C",
    url: "https://example.com/articles/sizu/C",
    createdAt: new Date("2021-01-01T00:00:00.000Z"),
    publishedAt: new Date("2021-01-01T00:00:00.000Z"),
  },
  {
    id: 4,
    slug: "d",
    media: "hatena",
    title: "hatena article D",
    url: "https://example.com/articles/hatena/D",
    createdAt: new Date("2021-01-01T00:00:00.000Z"),
    publishedAt: new Date("2021-01-01T00:00:00.000Z"),
  },
];

describe("route /posts", () => {
  describe("GET /posts", () => {
    test("リクエストを送るとレスポンスが返ってくる", async () => {
      const manager = new TestManager();
      const service = new PostService(manager.db);
      service.upsert(data);

      const result = await posts.request("/posts", {}, manager.env);

      expect(await result.json<ListResponse>()).toStrictEqual({
        data: [
          {
            id: 1,
            slug: "a",
            media: "zenn",
            title: "Zenn article A",
            url: "https://example.com/articles/zenn/A",
            createdAt: new Date("2021-01-01T00:00:00.000Z"),
            publishedAt: new Date("2021-01-01T00:00:00.000Z"),
          },
          {
            id: 2,
            slug: "b",
            media: "qiita",
            title: "Qiita article B",
            url: "https://example.com/articles/qiita/A",
            createdAt: new Date("2021-01-01T00:00:00.000Z"),
            publishedAt: new Date("2021-01-01T00:00:00.000Z"),
          },
          {
            id: 4,
            slug: "d",
            media: "hatena",
            title: "hatena article D",
            url: "https://example.com/articles/hatena/D",
            createdAt: new Date("2021-01-01T00:00:00.000Z"),
            publishedAt: new Date("2021-01-01T00:00:00.000Z"),
          },
        ],
        pages: 1,
        next: null,
      });
    });

    test("メディアがしずかなインターネットに指定されていてシークレットモードが無効のパラメータのリクエストを送るとエラーになる", async () => {
      const manager = new TestManager();
      const service = new PostService(manager.db);
      service.upsert([]);

      expect(
        posts.request("/posts?secret=false&media=sizu", {}, manager.env),
      ).resolves.toThrow();
    });
  });
});
