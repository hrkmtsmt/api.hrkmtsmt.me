import { drizzle } from "drizzle-orm/d1";
import { HTTPException } from "hono/http-exception";
import { XMLParser } from "fast-xml-parser";
import { Logger, Api } from "@modules";
import { PostService } from "@app/posts";
import type { ExportedHandlerScheduledHandler } from "@cloudflare/workers-types";
import type { Env } from "@types";
import type { Post } from "@schema/types";

type Scheduled = ExportedHandlerScheduledHandler<Env["Bindings"]>;

export const scheduled: Scheduled = async (_, env, context) => {
	context.waitUntil(
		(async () => {
			try {
				const api = new Api(env);

				const response = await api.hatena.articles.list({ hatenaId: "hrkmtsmt", blogId: "hrkmtsmt.hatenablog.com" });
				
				// AtomPub XML文字列をJSONに変換
				const parser = new XMLParser({
					ignoreAttributes: false,
					attributeNamePrefix: "@_"
				});
				const xmlData = parser.parse(response);
				
				const entries = Array.isArray(xmlData.feed?.entry) ? xmlData.feed.entry : [xmlData.feed?.entry].filter(Boolean);
				const h = entries.map((entry: any): Post => {
					const url = entry.link?.find?.((link: any) => link["@_rel"] === "alternate")?.["@_href"] || entry.link?.["@_href"];
					const slug = url?.split("/").pop() || entry.id?.split("/").pop() || "";
					
					return {
						slug,
						media: "hatena" as const,
						title: entry.title,
						url,
						createdAt: new Date(entry.published),
						publishedAt: new Date(entry.updated),
					};
				});
				h.forEach(console.table)

				// TODO: ページネーションがあれば再帰的に取得する処理をかく
				const [zenn, qiita, sizu] = await Promise.all([
					api.zenn.articles.get({ username: "hrkmtsmt" }),
					api.qiita.articles.get(),
					api.sizu.articles.get(),
				]);

				const z = zenn.articles.map<Post>((p) => {
					return {
						slug: p.slug,
						media: "zenn" as const,
						title: p.title,
						url: `${env.ZENN_BASE_URL}${p.path}`,
						createdAt: new Date(p.publishedAt),
						publishedAt: new Date(p.bodyUpdatedAt),
					};
				});

				const q = qiita.map<Post>((p) => {
					return {
						slug: p.id,
						media: "qiita" as const,
						title: p.title,
						url: p.url,
						createdAt: new Date(p.createdAt),
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
							createdAt: new Date(p.createdAt),
							publishedAt: new Date(p.updatedAt),
						};
					});

				const service = new PostService(drizzle(env.DB));
				await service.upsert([...h, ...z, ...q, ...s]);
			} catch (error: unknown) {
				Logger.error(error);
				throw new HTTPException(500, { message: "Failed to insert posts." });
			}
		})(),
	);
};
