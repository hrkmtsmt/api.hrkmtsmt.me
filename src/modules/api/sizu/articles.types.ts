export type GetResponse = {
  posts: {
    slug: string;
    title: string;
    visibility: "MYSELF" | "ANYONE" | "URL_ONLY";
    createdAt: string;
    updatedAt: string;
  }[];
};
