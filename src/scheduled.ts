import { drizzle } from 'drizzle-orm/d1';
import { HTTPException } from 'hono/http-exception';
import { Api, Logger, splitArray } from './modules';
import * as schemas from './schema';
import type { Env } from './types';
import type { Qiita, Sizu, Zenn } from './app/posts/types';

export const scheduled: ExportedHandlerScheduledHandler<Env['Bindings']> = async (_, env, context) => {
  context.waitUntil(
    (async () => {
      try {
        const api = new Api(env);

        const [zenn, qiita, sizu] = await Promise.all([
          api.zenn.get<Zenn>('/articles?username=hrkmtsmt'),
          api.qiita.get<Qiita>('/authenticated_user/items'),
          api.sizu.get<Sizu>('/posts'),
        ]);

        const now = new Date();

        const p1 = zenn.articles.map<typeof schemas.posts.$inferInsert>((p) => {
          return {
            slug: p.slug,
            media: 'zenn' as const,
            title: p.title,
            url: `${env.ZENN_BASE_URL}${p.path}`,
            createdAt: now,
            publishedAt: new Date(p.bodyUpdatedAt),
          };
        });

        const p2 = qiita.map<typeof schemas.posts.$inferInsert>((p) => {
          return {
            slug: p.id,
            media: 'qiita' as const,
            title: p.title,
            url: p.url,
            createdAt: now,
            publishedAt: new Date(p.updatedAt),
          };
        });

        const p3 = sizu.posts
          .filter((p) => p.visibility === 'ANYONE')
          .map<typeof schemas.posts.$inferInsert>((p) => {
            return {
              slug: p.slug,
              media: 'sizu' as const,
              title: p.title,
              url: `${env.SIZU_BASE_URL}/hrkmtsmt/posts/${p.slug}`,
              createdAt: now,
              publishedAt: new Date(p.updatedAt),
            };
          });

        const db = drizzle(env.DB);
        await Promise.all(
          splitArray([...p1, ...p2, ...p3], 10).map(async (r) => {
            return db.insert(schemas.posts).values(r);
          })
        );
      } catch (error: unknown) {
        Logger.error(error);
        throw new HTTPException(500, { message: 'Failed to insert posts.' });
      }
    })()
  );
};
