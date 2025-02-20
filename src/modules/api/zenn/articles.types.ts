export type GetQuery = {
  username: string;
  order?: "latest";
  page?: number;
};

export type GetResponse = {
  articles: {
    id: number;
    slug: string;
    title: string;
    path: string;
    likedCount: number;
    publishedAt: string;
    bodyUpdatedAt: string;
  }[];
  publication: null;
  nextPage: number | null;
};
