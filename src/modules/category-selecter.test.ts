import { test, describe, expect } from "bun:test";
import { CategorySelecter } from "./category-selecter";

describe("class CategorySelecter", () => {
	describe("method selecter.value", () => {
		test("メディアでしずかなインターネットを指定していてシークレットモードが無効な場合はエラーを返す", () => {
			expect(() => new CategorySelecter("sizu", false)).toThrow();
		});

		test("メディアでしずかなインターネットを指定していてシークレットモードが有効な場合はしずかなインターネットのみを返す", () => {
			const selecter = new CategorySelecter("sizu", true);
			expect(selecter.value).toStrictEqual(["sizu"]);
		});

		test("メディアの指定ありでシークレットモードが有効な場合は指定されたメディアのみを返す", () => {
			const selecter = new CategorySelecter("zenn", true);
			expect(selecter.value).toStrictEqual(["zenn"]);
		});

		test("メディアの指定ありでシークレットモードが無効な場合は指定されたメディアのみを返す", () => {
			const selecter = new CategorySelecter("qiita", false);
			expect(selecter.value).toStrictEqual(["qiita"]);
		});

		test("メディアの指定なしでシークレットモードが有効な場合は何も返さない", () => {
			const selecter = new CategorySelecter(undefined, true);
			// biome-ignore lint/suspicious/noExplicitAny: <explanation>
			expect(selecter.value).toBe(undefined as any);
		});

		test("メディアの指定なしでシークレットモードが無効な場合は指定されたはしずかなインターネットを含まない全メディアを返す", () => {
			const selecter = new CategorySelecter(undefined, false);
			expect(selecter.value).toStrictEqual(["hatena", "note", "qiita", "zenn"]);
		});
	});
});
