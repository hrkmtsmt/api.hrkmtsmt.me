import { Hono } from 'hono';
import { logger } from 'hono/logger';
import { cors } from 'hono/cors';
import { handlers } from './app';
import type { Bindings } from './types';

const app = new Hono<{ Bindings: Bindings }>();

app.use(logger());

app.use('/*', (c, next) => cors({
    origin: [c.env.ALLOW_ORIGIN, c.env.ALLOW_ORIGIN_LOCAL]
  })(c, next)
)

app.use('/*', handlers.middleware);

app.get('/', handlers.root);

app.get('/posts', handlers.posts);

export default app;
