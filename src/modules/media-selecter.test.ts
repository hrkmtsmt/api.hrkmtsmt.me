import { test, describe, expect } from "bun:test";
import { MediaSelecter } from "./media-selecter";

describe("class MediaSelecter", () => {
	describe("method selecter.value", () => {
		test("メディアでしずかなインターネットを指定していてシークレットモードが無効な場合はエラーを返す", () => {
			expect(() => new MediaSelecter("sizu", false)).toThrow();
		});

		test("メディアでしずかなインターネットを指定していてシークレットモードが有効な場合はしずかなインターネットのみを返す", () => {
			const selecter = new MediaSelecter("sizu", true);

			expect(selecter.value).toStrictEqual(["sizu"]);
		});

		test("メディアの指定ありでシークレットモードが有効な場合は指定されたメディアのみを返す", () => {
			const selecter = new MediaSelecter("zenn", true);

			expect(selecter.value).toStrictEqual(["zenn"]);
		});

		test("メディアの指定ありでシークレットモードが無効な場合は指定されたメディアのみを返す", () => {
			const selecter = new MediaSelecter("qiita", false);

			expect(selecter.value).toStrictEqual(["qiita"]);
		});

		test("メディアの指定なしでシークレットモードが有効な場合は全メディアを返す", () => {
			const selecter = new MediaSelecter(undefined, true);

			expect(selecter.value).toBe("all");
		});

		test("メディアの指定なしでシークレットモードが無効な場合は指定されたはしずかなインターネットを含まない全メディアを返す", () => {
			const selecter = new MediaSelecter(undefined, false);

			expect(selecter.value).toStrictEqual(["hatena", "note", "qiita", "zenn"]);
		});
	});
});
