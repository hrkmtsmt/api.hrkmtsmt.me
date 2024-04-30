import { Hono } from 'hono';
import { logger } from 'hono/logger';
import { basicAuth } from 'hono/basic-auth';

const app = new Hono();

app.use(logger());

app.use('/*', basicAuth({ username: '', password: '' }));

app.get('/', (c) => c.json({ message: 'Hello World!' }));

export default app;
