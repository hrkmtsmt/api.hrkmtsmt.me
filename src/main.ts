import { Hono } from 'hono';
import { logger } from 'hono/logger';
import { handlers } from './app';
import type { Bindings } from './types';

const app = new Hono<{ Bindings: Bindings }>();

app.use(logger());

app.use('/*', handlers.middleware);

app.get('/', handlers.root);

app.get('/articles', handlers.articles);

export default app;
