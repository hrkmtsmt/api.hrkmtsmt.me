import type { D1Database } from "@cloudflare/workers-types";
import type { DrizzleD1Database } from "drizzle-orm/d1";
import type { BunSQLite } from "@test/database-manager";

/**
 * NOTE: Workersの環境変数の設定場所
 *
 * https://dash.cloudflare.com/<account>/workers/services/view/api/production/settings
 */
interface Bindings {
	DB: D1Database;
	ALLOW_ORIGIN: string;
	APP_URL: string;
	HATENA_API_URL: string;
	HATENA_BASE_URL: string;
	HATENA_OAUTH_URL: string;
	QIITA_API_URL: string;
	QIITA_BASE_URL: string;
	SIZU_API_URL: string;
	SIZU_BASE_URL: string;
	ZENN_API_URL: string;
	ZENN_BASE_URL: string;
	SECRET_BASIC_AUTH_USERNAME: string;
	SECRET_BASIC_AUTH_PASWORD: string;
	SECRET_HATENA_OAUTH_CONSUMER_KEY: string;
	SECRET_HATENA_OAUTH_CONSUMER_SECRET: string;
	SECRET_HATENA_OAUTH_ACCESS_TOKEN: string;
	SECRET_HATENA_OAUTH_ACCESS_TOKEN_SECRET: string;
	SECRET_QIITA_API_ACCESS_TOKEN: string;
	SECRET_SIZU_API_KEY: string;
}

export interface Env {
	Bindings: Bindings;
}

export interface CloudflareD1 extends DrizzleD1Database {
	$client: D1Database;
}

export type Database = CloudflareD1 | BunSQLite;
