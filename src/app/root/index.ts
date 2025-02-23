import { Hono } from "hono";
import type { BlankSchema } from "hono/types";
import type { Env } from "@types";

export const root = new Hono<Env, BlankSchema, "/">().get("/", (c) => {
	return c.json({ message: "Hello World!" });
});
