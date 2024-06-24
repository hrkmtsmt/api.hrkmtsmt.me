import { fetcher, toTimestamp } from '@src/modules';
import { AppHandler } from '@src/types';
import { ListResponse, Zenn, Qiita, Sizu } from './types';

export const handler: AppHandler = async (c) => {
  try {
    const secret = JSON.parse(c.req.queries('secret')?.at(0) ?? 'false') as boolean;

    const [z, q, s] = await Promise.all([
      fetcher<Zenn>(`${c.env.ZENN_API_URL}/articles?username=hrkmtsmt`),
      fetcher<Qiita>(`${c.env.QIITA_API_URL}/authenticated_user/items`, {
        Authorization: `Bearer ${c.env.QIITA_API_ACCESS_TOKEN}`,
      }),
      secret
        ? fetcher<Sizu>(`${c.env.SIZU_API_URL}/posts`, { Authorization: `Bearer ${c.env.SIZU_API_KEY}` })
        : undefined,
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

    const data: ListResponse = [...zenn, ...qiita, ...sizu].toSorted((a, b) => b.id - a.id);

    return c.json(data, 200);
  } catch (error: unknown) {
    return c.json({ message: 'Failed to fetch data from external service API.' }, 500);
  }
};
