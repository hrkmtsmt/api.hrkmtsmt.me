import { Hono } from 'hono';
import { logger } from 'hono/logger';
import { cors } from 'hono/cors';
import { basicAuth } from 'hono/basic-auth';
import { scheduled } from './scheduled';
import * as handlers from './app';
import type { BlankSchema } from 'hono/types';
import type { Env } from './types';

const app = new Hono<Env, BlankSchema, '/'>()
  .use(logger())
  .use('/*', (c, next) => {
    return cors({
      origin: [c.env.ALLOW_ORIGIN],
    })(c, next);
  })
  .use('/*', (c, next) => {
    return basicAuth({
      username: c.env.SECRET_BASIC_AUTH_USERNAME,
      password: c.env.SECRET_BASIC_AUTH_PASWORD,
    })(c, next);
  })
  .route('/', handlers.root)
  .route('/', handlers.posts);

export default {
  fetch: app.fetch,
  scheduled,
};
export type AppType = typeof app;
