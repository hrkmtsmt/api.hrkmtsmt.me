import { Client } from '@src/modules';
import type { Env } from '@src/types';
import * as Articles from './articles.types';
import queryString from 'query-string';

const articles = (client: Client) => ({
  get: async (query: Articles.GetQuery) => {
    const q = queryString.stringify(query);
    return client.get<Articles.GetResponse>(`/articles?${q}`);
  },
});

export const zenn = (env: Env['Bindings']) => {
  const client = new Client(env.ZENN_API_URL);

  return {
    articles: articles(client),
  };
};
