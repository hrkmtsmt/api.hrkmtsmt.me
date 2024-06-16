import { v4 as uuidV4 } from 'uuid';
import { fetcher } from "@src/modules";
import { AppHandler } from "@src/types";
import { ListResponse, Zenn, Qiita, Sizu } from "./types";

export const handler: AppHandler = async (c) => {
  try {
    // TODO: クエリパラメータを受け付けるようにする

    const [z, q, s] = await Promise.all([
      fetcher<Zenn>(`${c.env.ZENN_API_URL}/articles?username=hrkmtsmt`),
      fetcher<Qiita>(`${c.env.QIITA_API_URL}/authenticated_user/items`, { Authorization: `Bearer ${c.env.QIITA_API_ACCESS_TOKEN}` }),
      fetcher<Sizu>(`${c.env.SIZU_API_URL}/posts`, { Authorization: `Bearer ${c.env.SIZU_API_KEY}` }),
    ]);
    
    const zenn = z.articles.map<ListResponse[number]>((p) => {
      return {
        id: uuidV4(),
        media: 'zenn',
        title: p.title,
        url: `${c.env.ZENN_BASE_URL}${p.path}`,
        createdAt: p.publishedAt,
        updatedAt: p.bodyUpdatedAt,
      }
    });
    
    const qiita = q.map<ListResponse[number]>((p) => {
      return {
        id: uuidV4(),
        media: 'qiita',
        title: p.title,
        url: p.url,
        createdAt: p.createdAt,
        updatedAt: p.updatedAt,
      }
    });
    
    const sizu = s.posts.filter((p) => p.visibility === 'ANYONE').map<ListResponse[number]>((p) => {
      return {
        id: uuidV4(),
        media: 'sizu',
        title: p.title,
        url: `${c.env.SIZU_BASE_URL}/${p.slug}`,
        createdAt: p.createdAt,
        updatedAt: p.updatedAt,
      }
    });

    const data: ListResponse = [...zenn, ...qiita, ...sizu].toSorted((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    
    return c.json(data, 200);
  } catch (error: unknown) {
    return c.json({ message: 'Faled fetch.' }, 500);
  }
};
