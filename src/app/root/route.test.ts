import { describe, test, expect } from "bun:test";
import { root } from "./route";
import type { GetResponse } from "./types";

describe("route /", () => {
	describe("GET /", () => {
		test("リクエストを送るとレスポンスが返ってくる", async () => {
			const result = await root.request("/");
			expect(await result.json<GetResponse>()).toStrictEqual({
				message: "Hello World!",
			});
		});
	});
});
