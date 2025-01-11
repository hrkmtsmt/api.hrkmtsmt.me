import { Hono } from 'hono';

const root = new Hono();

root.get('/', (c) => {
  return c.json({ message: 'Hello World!' });
});

export default root;
