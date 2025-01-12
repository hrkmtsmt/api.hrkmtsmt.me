import { Hono } from 'hono';
import { logger } from 'hono/logger';
import { cors } from 'hono/cors';
import { handlers } from './app';
import type { Env } from './types';

const app = new Hono<Env>();

app.use(logger());

app.use('/*', (c, next) => {
  const handler = cors({
    origin: [c.env.ALLOW_ORIGIN, c.env.ALLOW_ORIGIN_LOCAL],
  });

  return handler(c, next);
});

app.use('/*', handlers.middleware);

app.get('/', handlers.root);

app.get('/posts', handlers.posts);

export default app;
