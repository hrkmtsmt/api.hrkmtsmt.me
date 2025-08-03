import { Post } from "@schema/types";

export interface ListResponse {
  data: Post[];
  pages: number;
  next: number | null;
}
