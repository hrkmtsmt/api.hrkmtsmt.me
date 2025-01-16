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
    return c.json(await db.select().from(s.posts), 200);
  } catch (error: unknown) {
    Logger.error(error);
    throw new HTTPException(500, { message: 'Failed to fetch posts.' });
  }
});
