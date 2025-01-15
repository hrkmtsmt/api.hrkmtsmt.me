import { Hono } from 'hono';
import { drizzle } from 'drizzle-orm/d1';
import { Api, Logger } from '@src/modules';
import * as s from '@src/schema';
import { Env } from '@src/types';
import { BlankSchema } from 'hono/types';
import { Zenn, Qiita, Sizu } from './types';
import { HTTPException } from 'hono/http-exception';

export const posts = new Hono<Env, BlankSchema, '/'>()
  .get('/posts', async (c) => {
    try {
      const db = drizzle(c.env.DB);
      return c.json(await db.select().from(s.posts), 200);
    } catch (error: unknown) {
      Logger.error(error);
      throw new HTTPException(500, { message: 'Failed to fetch posts.' });
    }
  })
  .put('/posts:bulk', async (c) => {
    try {
      const api = new Api(c.env);

      const [zenn, qiita, sizu] = await Promise.all([
        api.zenn.get<Zenn>('/articles?username=hrkmtsmt'),
        api.qiita.get<Qiita>('/authenticated_user/items'),
        api.sizu.get<Sizu>('/posts'),
      ]);

      const now = new Date();

      const p1 = zenn.articles.map((p) => {
        return {
          id: p.id,
          media: 'Zenn' as const,
          title: p.title,
          url: `${c.env.ZENN_BASE_URL}${p.path}`,
          createdAt: now,
          publishedAt: new Date(p.bodyUpdatedAt),
        };
      });

      const p2 = qiita.map((p) => {
        return {
          id: p.id,
          media: 'Qiita' as const,
          title: p.title,
          url: p.url,
          createdAt: now,
          publishedAt: new Date(p.updatedAt),
        };
      });

      const p3 = sizu.posts
        .filter((p) => p.visibility === 'ANYONE')
        .map((p) => {
          return {
            id: p.slug,
            media: 'Sizu' as const,
            title: p.title,
            url: `${c.env.SIZU_BASE_URL}/${p.slug}`,
            createdAt: now,
            publishedAt: new Date(p.updatedAt),
          };
        });

      const db = drizzle(c.env.DB);
      db.insert(s.posts).values([...p1, ...p2, ...p3]);

      return c.json(null);
    } catch (error: unknown) {
      Logger.error(error);
      throw new HTTPException(500, { message: 'Failed to insert posts.' });
    }
  });
