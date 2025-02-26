import { Post } from "@schema/types";

interface P {
	id: Post["id"];
	slug: Post["slug"];
	media: Post["media"];
	title: Post["title"];
	url: Post["url"];
	createdAt: string;
	publishedAt: string;
}

export interface GetResponse {
	data: P[];
	pages: number;
	next: number | null;
}
