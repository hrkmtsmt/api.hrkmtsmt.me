import { Hono } from 'hono';
import { drizzle } from 'drizzle-orm/d1';
import { Api, toTimestamp } from '@src/modules';
import * as s from '@src/schema';
import { Env } from '@src/types';
import { ListResponse, Zenn, Qiita, Sizu } from './types';

export const posts = new Hono<Env>();

posts.get('/posts', async (c) => {
  try {
    const api = new Api(c.env);
    const secret = JSON.parse(c.req.queries('secret')?.at(0) ?? 'false') as boolean;

    const [z, q, s] = await Promise.all([
      api.zenn.get<Zenn>('/articles?username=hrkmtsmt'),
      api.qiita.get<Qiita>('/authenticated_user/items'),
      secret ? api.sizu.get<Sizu>('/posts') : undefined,
    ]);

    const zenn = z.articles.map<ListResponse[number]>((p) => {
      return {
        id: toTimestamp(p.publishedAt),
        media: 'zenn',
        title: p.title,
        url: `${c.env.ZENN_BASE_URL}${p.path}`,
        createdAt: p.publishedAt,
        updatedAt: p.bodyUpdatedAt,
      };
    });

    const qiita = q.map<ListResponse[number]>((p) => {
      return {
        id: toTimestamp(p.createdAt),
        media: 'qiita',
        title: p.title,
        url: p.url,
        createdAt: p.createdAt,
        updatedAt: p.updatedAt,
      };
    });

    const sizu =
      s?.posts
        .filter((p) => p.visibility === 'ANYONE')
        .map<ListResponse[number]>((p) => {
          return {
            id: toTimestamp(p.createdAt),
            media: 'sizu',
            title: p.title,
            url: `${c.env.SIZU_BASE_URL}/${p.slug}`,
            createdAt: p.createdAt,
            updatedAt: p.updatedAt,
          };
        }) ?? [];

    const data: ListResponse = [...zenn, ...qiita, ...sizu].sort((a, b) => b.id - a.id);

    return c.json(data, 200);
  } catch (error: unknown) {
    return c.json({ message: 'Failed to fetch data from external service API.' }, 500);
  }
});
