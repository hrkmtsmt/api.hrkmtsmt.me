import { Context, Hono } from "hono";
import { logger } from "hono/logger";
import { cors } from "hono/cors";
import { basicAuth } from "hono/basic-auth";
import { scheduled } from "./scheduled";
import * as handlers from "./app";
import type { BlankSchema } from "hono/types";
import type { Env } from "./types";

const skip = (c: Context) => c.req.path.split("/").includes("oauth");

const app = new Hono<Env, BlankSchema, "/">()
  .use(logger())
  .use("/*", (c, next) => {
    if (skip(c)) {
      return next();
    }

    return cors({
      origin: [c.env.ALLOW_ORIGIN],
    })(c, next);
  })
  .use("/*", (c, next) => {
    if (skip(c)) {
      return next();
    }

    return basicAuth({
      username: c.env.SECRET_BASIC_AUTH_USERNAME,
      password: c.env.SECRET_BASIC_AUTH_PASSWORD,
    })(c, next);
  })
  .route("/", handlers.oauth)
  .route("/", handlers.root)
  .route("/", handlers.posts);

export default {
  port: 8787,
  fetch: app.fetch,
  scheduled,
};
export type AppType = typeof app;
