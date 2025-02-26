import { describe, test, expect, mock } from "bun:test";
import { drizzle } from "drizzle-orm/bun-sqlite";
import { TestManager } from "@test/index";
import { posts } from "./route";
import { PostService } from "./service";
import type { Post } from "@schema/types";
import type { GetResponse } from "./types";

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

mock.module("drizzle-orm/d1", () => {
	return { drizzle };
});

describe("route /posts", () => {
	describe("GET /posts", () => {
		test("リクエストを送るとレスポンスが返ってくる", async () => {
			const manager = new TestManager();
			const service = new PostService(manager.store);
			service.upsert(data);

			const result = await posts.request("/posts", {}, manager.env);

			expect(await result.json<GetResponse>()).toStrictEqual({
				data: [
					{
						id: 1,
						slug: "a",
						media: "zenn",
						title: "Zenn article A",
						url: "https://example.com/articles/zenn/A",
						createdAt: "2021-01-01T00:00:00.000Z",
						publishedAt: "2021-01-01T00:00:00.000Z",
					},
					{
						id: 2,
						slug: "b",
						media: "qiita",
						title: "Qiita article B",
						url: "https://example.com/articles/qiita/A",
						createdAt: "2021-01-01T00:00:00.000Z",
						publishedAt: "2021-01-01T00:00:00.000Z",
					},
					{
						id: 4,
						slug: "d",
						media: "hatena",
						title: "hatena article D",
						url: "https://example.com/articles/hatena/D",
						createdAt: "2021-01-01T00:00:00.000Z",
						publishedAt: "2021-01-01T00:00:00.000Z",
					},
				],
				pages: 1,
				next: null,
			});
		});

		test("メディアがしずかなインターネットに指定されていてシークレットモードが無効のパラメータのリクエストを送るとエラーになる", async () => {
			const manager = new TestManager();
			const service = new PostService(manager.store);
			service.upsert([]);

			expect(
				posts.request("/posts?secret=false&media=sizu", {}, manager.env),
			).resolves.toThrow();
		});
	});
});
