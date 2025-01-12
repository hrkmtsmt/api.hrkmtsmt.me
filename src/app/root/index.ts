import { Env } from '@src/types';
import { Hono } from 'hono';
import { BlankSchema } from 'hono/types';

export const root = new Hono<Env, BlankSchema, '/'>().get('/', (c) => {
  return c.json({ message: 'Hello World!' });
});
