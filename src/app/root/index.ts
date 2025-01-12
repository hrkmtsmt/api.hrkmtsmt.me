import { Hono } from 'hono';

export const root = new Hono();

root.get('/', (c) => {
  return c.json({ message: 'Hello World!' });
});
