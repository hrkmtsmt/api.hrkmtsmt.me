import { Client, HTTP_METHODS } from '@src/modules';
import { HatenaOAuth } from './oauth';
// import * as Articles from './articles.types';
import type { Env } from '@src/types';

// const articles = (client: Client) => ({
//   get: async () => client.get<Articles.GetResponse>('/authenticated_user/items'),
// });
//

// DOCS: https://developer.hatena.ne.jp/
export const hatena = (env: Env['Bindings']) => {
  const c = new Client(env.HATENA_API_URL, { Authorization: `Bearer ${env.SECRET_QIITA_API_ACCESS_TOKEN}` });
  const o = new Client(env.HATENA_OAUTH_URL, { 'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8' });
  return {
    // articles: articles(c),
    oauth: new HatenaOAuth(
      o,
      env.HATENA_OAUTH_URL,
      env.SECRET_HATENA_OAUTH_CONSUMER_KEY,
      env.SECRET_HATENA_OAUTH_CONSUMER_SECRET
    ),
  };
};
