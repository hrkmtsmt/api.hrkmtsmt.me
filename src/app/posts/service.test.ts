import { test, describe, expect, afterEach } from "bun:test";
import { DatabaseManager } from "@test/database-manager";
import { PostService } from "./service";
import type { Post } from "@src/schema/types";

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

const db = new DatabaseManager();

afterEach(() => {
	db.restore();
});

describe("PostService", () => {
	describe("method service.upsert", () => {
		test("入力されてデータがデータベースに保存できる", () => {
			const service = new PostService(db.store);
			expect(() => service.upsert(data)).not.toThrow();
		});
	});

	describe("method service.retrive", () => {
		test("指定したメディアの記事が取得できる", async () => {
			const service = new PostService(db.store);
			await service.upsert(data);
			const result = await service.retrive({ medium: ["zenn", "sizu"] });
			expect(result).toStrictEqual([
				{
					id: 1,
					slug: "a",
					title: "Zenn article A",
					media: "zenn",
					url: "https://example.com/articles/zenn/A",
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
			]);
		});

		test("指定されたメディアがない場合はすべての記事が取得できる", async () => {
			const service = new PostService(db.store);
			await service.upsert(data);
			const result = await service.retrive({ medium: undefined });
			expect(result).toStrictEqual([
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
			]);
		});
	});

	describe("method service.count", () => {
		test("指定したメディアの記事の総数が取得できる", async () => {
			const service = new PostService(db.store);
			await service.upsert(data);
			const result = await service.count({ medium: ["hatena", "zenn"] });
			expect(result).toBe(2);
		});

		test("メディアが指定されていない場合は全記事の総数が取得できる", async () => {
			const service = new PostService(db.store);
			await service.upsert(data);
			const result = await service.count({ medium: undefined });
			expect(result).toBe(4);
		});
	});
});
