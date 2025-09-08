export interface GetListResponse {
  data: {
    filename: string;
    createdAt: Date;
  }[];
  pages: number;
  next: number | null;
}

export interface GetResponse {
  data: {
    filename: string;
    content: string;
    createdAt: Date;
  };
}
