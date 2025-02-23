import queryString from "query-string";
import { Client } from "@modules";
import type { Env } from "@types";
import type * as Articles from "./articles.types";

const articles = (c: Client) => ({
	get: async (query: Articles.GetQuery) => {
		const q = queryString.stringify(query);
		return c.get<Articles.GetResponse>(`/articles?${q}`);
	},
});

export const zenn = (env: Env["Bindings"]) => {
	const c = new Client(env.ZENN_API_URL);

	return {
		articles: articles(c),
	};
};
