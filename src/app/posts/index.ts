import { Hono } from 'hono';
import { HTTPException } from 'hono/http-exception';
import { or, desc, eq, not } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/d1';
import { Logger } from '@src/modules';
import * as s from '@src/schema';
import { Env } from '@src/types';
import type { BlankSchema } from 'hono/types';

export const posts = new Hono<Env, BlankSchema, '/'>().get('/posts', async (c) => {
  try {
    const limit = Number(c.req.query('limit')) || 12;
    const offset = Number(c.req.query('offset')) || 0;
    const secret = c.req.query('secret')?.toLowerCase() === 'true';
    const media = (c.req.query('media') as typeof s.posts.$inferInsert.media) || undefined;

    const result = await drizzle(c.env.DB)
      .select()
      .from(s.posts)
      .where(or((!secret ? not(eq(s.posts.media, 'sizu')) : undefined, media ? eq(s.posts.media, media) : undefined)))
      .orderBy(desc(s.posts.publishedAt))
      .limit(limit)
      .offset(offset * limit);

    return c.json(result, 200);
  } catch (error: unknown) {
    Logger.error(error);
    throw new HTTPException(500, { message: 'Failed to fetch posts.' });
  }
});
