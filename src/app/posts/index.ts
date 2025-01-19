import { Hono } from 'hono';
import { HTTPException } from 'hono/http-exception';
import { count, desc, eq, not } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/d1';
import { Logger, Pagenation } from '@src/modules';
import * as s from '@src/schema';
import type { Env } from '@src/types';
import type { BlankSchema } from 'hono/types';

export const posts = new Hono<Env, BlankSchema, '/'>().get('/posts', async (c) => {
  try {
    const limit = Number(c.req.query('limit')) || 12;
    const offset = Number(c.req.query('offset')) || 1;
    const secret = c.req.query('secret')?.toLowerCase() === 'true';
    const media = (c.req.query('media') as typeof s.posts.$inferInsert.media) || undefined;

    const db = drizzle(c.env.DB);

    if (media) {
      const result = await db
        .select({ post: s.posts, total: count() })
        .from(s.posts)
        .where(eq(s.posts.media, media))
        .orderBy(desc(s.posts.publishedAt))
        .limit(limit)
        .offset((offset - 1) * limit);

      const data = result.map((r) => r.post);
      const total = result.at(0)?.total ?? 0;
      const { pages, next } = new Pagenation(total, limit, offset);

      return c.json({ data, pages, next }, 200);
    }

    if (secret) {
      const result = await db
        .select({ post: s.posts, total: count() })
        .from(s.posts)
        .orderBy(desc(s.posts.publishedAt))
        .limit(limit)
        .offset(offset * limit);

      const data = result.map((r) => r.post);
      const total = result.at(0)?.total ?? 0;
      const { pages, next } = new Pagenation(total, limit, offset);

      return c.json({ data, pages, next }, 200);
    }

    const result = await db
      .select({ post: s.posts, total: count() })
      .from(s.posts)
      .where(not(eq(s.posts.media, 'sizu')))
      .orderBy(desc(s.posts.publishedAt))
      .limit(limit)
      .offset(offset * limit);

    const data = result.map((r) => r.post);
    const total = result.at(0)?.total ?? 0;
    const { pages, next } = new Pagenation(total, limit, offset);

    return c.json({ data, pages, next }, 200);
  } catch (error: unknown) {
    Logger.error(error);
    throw new HTTPException(500, { message: 'Failed to fetch posts.' });
  }
});
