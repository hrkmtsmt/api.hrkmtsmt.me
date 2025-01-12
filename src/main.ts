import { Hono } from 'hono';
import { logger } from 'hono/logger';
import { cors } from 'hono/cors';
import { basicAuth } from 'hono/basic-auth';
import * as handlers from './app';
import type { Env } from './types';

const app = new Hono<Env>();

app.use(logger());

app.use('/*', (c, next) => {
  return cors({
    origin: [c.env.ALLOW_ORIGIN, c.env.ALLOW_ORIGIN_LOCAL],
  })(c, next);
});

app.use('/*', (c, next) => {
  return basicAuth({
    username: c.env.BASIC_AUTH_USERNAME,
    password: c.env.BASIC_AUTH_PASWORD,
  })(c, next);
});

app.route('/', handlers.root);

app.route('/', handlers.posts);

export default app;
