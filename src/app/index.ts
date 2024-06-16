import { handler as root } from './root';
import { handler as middleware } from './middleware';
import { handler as posts } from './posts';

export const handlers = {
  middleware,
  root,
  posts,
};
