import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import { drizzle } from "drizzle-orm/d1";
import { Logger, Pagination, MediaSelecter } from "@src/modules";
import { Post } from "@src/schema/types";
import { PostService } from "./service";
import type { Env } from "@src/types";
import type { BlankSchema } from "hono/types";

export const posts = new Hono<Env, BlankSchema, "/">().get(
	"/posts",
	async (c) => {
		try {
			const limit = Number(c.req.query("limit")) || 12;
			const page = Number(c.req.query("page")) || 1;
			const offset = page - 1;
			const secret = c.req.query("secret")?.toLowerCase() === "true";
			const media = (c.req.query("media") as Post["media"]) || undefined;

			const { value: medium } = new MediaSelecter(media, secret);
			const service = new PostService(drizzle(c.env.DB));

			const [data, total] = await Promise.all([
				service.retrive({ medium, limit, offset: offset * limit }),
				service.count({ medium }),
			]);
			const { pages, next } = new Pagination(total, limit, page);

			return c.json({ data, pages, next }, 200);
		} catch (error: unknown) {
			Logger.error(error);
			throw new HTTPException(500, { message: "Failed to fetch posts." });
		}
	},
);
