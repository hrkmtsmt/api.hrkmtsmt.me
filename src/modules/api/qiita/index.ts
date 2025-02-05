import { Client } from '@src/modules';
import type { Env } from '@src/types';
import * as Articles from './articles.types';

const articles = (client: Client) => ({
  get: async () => client.get<Articles.GetResponse>('/authenticated_user/items'),
});

// DOCS: https://qiita.com/api/v2/docs
export const qiita = (env: Env['Bindings']) => {
  const client = new Client(env.QIITA_API_URL, { Authorization: `Bearer ${env.SECRET_QIITA_API_ACCESS_TOKEN}` });

  return {
    articles: articles(client),
  };
};
