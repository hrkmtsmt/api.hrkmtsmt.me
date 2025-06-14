import { Client, OAuthBuilder, toBasicAuth } from "@modules";
import { HatenaOAuth } from "./oauth";
import type { Env } from "@types";
import type * as Articles from "./articles.types";

const articles = (client: Client) => ({
	list: async (params: Articles.GetParams) =>
		client.get<any>(`/${params.hatenaId}/${params.blogId}/atom/entry`),
});

// DOCS: https://developer.hatena.ne.jp/
export const hatena = (env: Env["Bindings"]) => {
	const c = new Client(env.HATENA_API_URL, { Authorization: toBasicAuth(env.SECRET_BASIC_AUTH_USERNAME, env.SECRET_HATENA_API_KEY) });
	const o = new Client(env.HATENA_OAUTH_URL, {
		"Content-Type": "application/x-www-form-urlencoded; charset=utf-8",
	});
	const b = new OAuthBuilder();

	return {
		articles: articles(c),
		oauth: new HatenaOAuth(
			o,
			b,
			env.HATENA_OAUTH_URL,
			env.SECRET_HATENA_OAUTH_CONSUMER_KEY,
			env.SECRET_HATENA_OAUTH_CONSUMER_SECRET,
		),
	};
};
