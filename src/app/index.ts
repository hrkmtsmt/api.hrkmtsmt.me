import { handler as root } from './root';
import { handler as middleware } from './middleware';
import { handler as articles } from './articles';

export const handlers = {
  middleware,
  root,
  articles,
};
