export type Zenn = {
  articles: Array<{
    id: string;
    title: string;
    path: string;
    likedCount: number;
    publishedAt: string;
    bodyUpdatedAt: string;
  }>;
};

export type Qiita = Array<{
  id: string;
  title: string;
  likesCount: string;
  url: string;
  createdAt: string;
  updatedAt: string;
}>;

export type Sizu = {
  posts: Array<{
    slug: string;
    title: string;
    visibility: 'MYSELF' | 'ANYONE' | 'URL_ONLY';
    createdAt: string;
    updatedAt: string;
  }>;
};

export type ListResponse = Array<{
  id: string;
  title: string;
  url: string;
  createdAt: string;
  updatedAt: string;
}>;
