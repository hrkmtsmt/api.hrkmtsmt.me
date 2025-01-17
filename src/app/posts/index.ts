import { Hono } from 'hono';
import { drizzle } from 'drizzle-orm/d1';
import { Logger } from '@src/modules';
import * as s from '@src/schema';
import { Env } from '@src/types';
import { BlankSchema } from 'hono/types';
import { HTTPException } from 'hono/http-exception';

export const posts = new Hono<Env, BlankSchema, '/'>().get('/posts', async (c) => {
  try {
    const db = drizzle(c.env.DB);
    const result = await db.select().from(s.posts);
    const secret = (p: (typeof result)[number]) => {
      if (Boolean(c.req.query('secret'))) {
        return true;
      }

      return p.media !== 'sizu';
    };
    const response = [...result]
      .filter(secret)
      .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());

    return c.json(response, 200);
  } catch (error: unknown) {
    Logger.error(error);
    throw new HTTPException(500, { message: 'Failed to fetch posts.' });
  }
});
