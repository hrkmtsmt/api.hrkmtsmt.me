import { sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/d1";
import { HTTPException } from "hono/http-exception";
import { Logger, Api, splitArray } from "./modules";
import * as schemas from "./schema";
import type { ExportedHandlerScheduledHandler } from "@cloudflare/workers-types";
import type { Env } from "./types";

export const scheduled: ExportedHandlerScheduledHandler<Env["Bindings"]> = async (_, env, context) => {
  context.waitUntil(
    (async () => {
      try {
        const api = new Api(env);

        const token = api.hatena.oauth.generateAuthorization(
          "GET",
          `${env.HATENA_API_URL}/hrkmtsmt/hrkmtsmt.hatenablog.com/atom/entry`,
          env.SECRET_HATENA_OAUTH_CONSUMER_KEY,
          env.SECRET_HATENA_OAUTH_CONSUMER_SECRET,
          env.SECRET_HATENA_OAUTH_ACCESS_TOKEN,
          env.SECRET_HATENA_OAUTH_ACCESS_TOKEN_SECRET
        );

        await api.hatena.articles.list({ hatenaId: "hrkmtsmt", blogId: "hrkmtsmt.hatenablog.com" }, token);

        // TODO: ページネーションがあれば再帰的に取得する処理をかく
        const [zenn, qiita, sizu] = await Promise.all([
          api.zenn.articles.get({ username: "hrkmtsmt" }),
          api.qiita.articles.get(),
          api.sizu.articles.get(),
        ]);

        const createdAt = new Date();

        const z = zenn.articles.map<typeof schemas.posts.$inferInsert>((p) => {
          return {
            slug: p.slug,
            media: "zenn" as const,
            title: p.title,
            url: `${env.ZENN_BASE_URL}${p.path}`,
            createdAt,
            publishedAt: new Date(p.bodyUpdatedAt),
          };
        });

        const q = qiita.map<typeof schemas.posts.$inferInsert>((p) => {
          return {
            slug: p.id,
            media: "qiita" as const,
            title: p.title,
            url: p.url,
            createdAt,
            publishedAt: new Date(p.updatedAt),
          };
        });

        const s = sizu.posts
          .filter((p) => p.visibility === "ANYONE")
          .map<typeof schemas.posts.$inferInsert>((p) => {
            return {
              slug: p.slug,
              media: "sizu" as const,
              title: p.title,
              url: `${env.SIZU_BASE_URL}/hrkmtsmt/posts/${p.slug}`,
              createdAt,
              publishedAt: new Date(p.updatedAt),
            };
          });

        const db = drizzle(env.DB);
        await Promise.all(
          splitArray([...z, ...q, ...s], 10).map(async (r) => {
            return db
              .insert(schemas.posts)
              .values(r)
              .onConflictDoUpdate({
                target: [schemas.posts.slug],
                set: {
                  title: sql`excluded.title`,
                },
              });
          })
        );
      } catch (error: unknown) {
        Logger.error(error);
        throw new HTTPException(500, { message: "Failed to insert posts." });
      }
    })()
  );
};
