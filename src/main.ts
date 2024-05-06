import { Hono } from 'hono';
import { logger } from 'hono/logger';
import { basicAuth } from 'hono/basic-auth';
import { handler as articles } from './app/articles';
import type { Bindings } from './types';

const app = new Hono<{ Bindings: Bindings }>();

app.use(logger());

app.use('/*', (c, next) => {
	const handler = basicAuth({
		username: c.env.BASIC_AUTH_USERNAME,
		password: c.env.BASIC_AUTH_PASWORD
	});
	
	return handler(c, next);
});

app.get('/', (c) => c.json({ message: 'Hello World🔥' }));

app.get('/articles', articles);

export default app;
