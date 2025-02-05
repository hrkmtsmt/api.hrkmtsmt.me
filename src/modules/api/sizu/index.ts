import { Client } from '@src/modules';
import type { Env } from '@src/types';
import * as Articles from './articles.types';

const articles = (client: Client) => ({
  get: async () => client.get<Articles.GetResponse>('/posts'),
});

// DOCS: https://catnose99.github.io/quiet-internet-api-docs/
export const sizu = (env: Env['Bindings']) => {
  const client = new Client(env.SIZU_API_URL, { Authorization: `Bearer ${env.SECRET_SIZU_API_KEY}` });

  return {
    articles: articles(client),
  };
};
