import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import { drizzle } from "drizzle-orm/d1";
import { Logger } from "@modules";
import { Pagination, MediaSelecter } from "@core";
import { PostService } from "./service";
import type { BlankSchema } from "hono/types";
import type { Env } from "@types";
import type { Post } from "@schema/types";

export const posts = new Hono<Env, BlankSchema, "/">().get(
  "/posts",
  async (c) => {
    try {
      const limit = Number(c.req.query("limit")) || 12;
      const page = Number(c.req.query("page")) || 1;
      const offset = page - 1;
      const secret = c.req.query("secret")?.toLowerCase() === "true";
      const media = c.req.query("media") as Post["media"] | undefined;
      const selecter = new MediaSelecter(media, secret);
      const medium = selecter.value === "all" ? undefined : selecter.value;

      const service = new PostService(drizzle(c.env.DB));
      const [data, total] = await Promise.all([
        service.retrive({ medium, limit, offset: offset * limit }),
        service.count({ medium }),
      ]);
      const { pages, next } = new Pagination(total, limit, page);

      return c.json({ data, pages, next }, 200);
    } catch (error: unknown) {
      Logger.error(error);
      if (error instanceof Error) {
        throw new HTTPException(422, { message: error.message });
      }

      throw new HTTPException(500, { message: "Failed to fetch posts." });
    }
  },
);
