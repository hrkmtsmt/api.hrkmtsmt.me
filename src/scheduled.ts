import { drizzle } from "drizzle-orm/d1";
import { HTTPException } from "hono/http-exception";
import { Logger, Api } from "./modules";
import { PostService } from "./app/posts/service";
import type { ExportedHandlerScheduledHandler } from "@cloudflare/workers-types";
import type { Env } from "./types";
import type { Post } from "./schema/types";

export const scheduled: ExportedHandlerScheduledHandler<
	Env["Bindings"]
> = async (_, env, context) => {
	context.waitUntil(
		(async () => {
			try {
				const api = new Api(env);

				// const token = api.hatena.oauth.generateAuthorization(
				//   "GET",
				//   `${env.HATENA_API_URL}/hrkmtsmt/hrkmtsmt.hatenablog.com/atom/entry`,
				//   env.SECRET_HATENA_OAUTH_CONSUMER_KEY,
				//   env.SECRET_HATENA_OAUTH_CONSUMER_SECRET,
				//   env.SECRET_HATENA_OAUTH_ACCESS_TOKEN,
				//   env.SECRET_HATENA_OAUTH_ACCESS_TOKEN_SECRET
				// );

				// await api.hatena.articles.list({ hatenaId: "hrkmtsmt", blogId: "hrkmtsmt.hatenablog.com" }, token);

				// TODO: ページネーションがあれば再帰的に取得する処理をかく
				const [zenn, qiita, sizu] = await Promise.all([
					api.zenn.articles.get({ username: "hrkmtsmt" }),
					api.qiita.articles.get(),
					api.sizu.articles.get(),
				]);

				const createdAt = new Date();

				const z = zenn.articles.map<Post>((p) => {
					return {
						slug: p.slug,
						media: "zenn" as const,
						title: p.title,
						url: `${env.ZENN_BASE_URL}${p.path}`,
						createdAt,
						publishedAt: new Date(p.bodyUpdatedAt),
					};
				});

				const q = qiita.map<Post>((p) => {
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
					.map<Post>((p) => {
						return {
							slug: p.slug,
							media: "sizu" as const,
							title: p.title,
							url: `${env.SIZU_BASE_URL}/hrkmtsmt/posts/${p.slug}`,
							createdAt,
							publishedAt: new Date(p.updatedAt),
						};
					});

				const service = new PostService(drizzle(env.DB));
				await service.upsert([...z, ...q, ...s]);
			} catch (error: unknown) {
				Logger.error(error);
				throw new HTTPException(500, { message: "Failed to insert posts." });
			}
		})(),
	);
};
