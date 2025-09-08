import { Hono } from "hono";
import { logger } from "hono/logger";
import { cors } from "hono/cors";
import { basicAuth } from "hono/basic-auth";
import { drizzle } from "drizzle-orm/d1";
import { Octokit } from "@octokit/rest";
import { scheduled } from "./scheduled";
import * as handlers from "./app";
import type { BlankSchema } from "hono/types";
import type { Env } from "./types";

const app = new Hono<Env, BlankSchema, "/">()
  .use(logger())
  .use("/*", (c, next) => {
    return cors({
      origin: [c.env.ALLOW_ORIGIN],
    })(c, next);
  })
  .use("/*", (c, next) => {
    if (c.env.ENVIRONMENT === "local") {
      return next();
    }

    return basicAuth({
      username: c.env.SECRET_BASIC_AUTH_USERNAME,
      password: c.env.SECRET_BASIC_AUTH_PASSWORD,
    })(c, next);
  })
  .use(async (c, next) => {
    const octokit = new Octokit({
      auth: c.env.SECRET_GITHUB_TOKEN,
      retry: {
        doNotRetry: ["abuse"],
      },
    });
    c.set("octokit", octokit);
    c.set("db", drizzle(c.env.DB));

    await next();
  })
  .route("/", handlers.oauth)
  .route("/", handlers.root)
  .route("/", handlers.posts)
  .route("/", handlers.scraps);

export default {
  fetch: app.fetch,
  scheduled,
};

export type AppType = typeof app;
