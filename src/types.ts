import type { D1Database } from "@cloudflare/workers-types";
import type { DrizzleD1Database } from "drizzle-orm/d1";
import type { BunSQLite } from "@test/index";
import type { Octokit } from "@octokit/rest";

const ENVIRONMENT = {
  TEST: "test",
  LOCAL: "local",
  PRODUCTION: "production",
} as const;

export interface Bindings {
  DB: D1Database;
  ENVIRONMENT: (typeof ENVIRONMENT)[keyof typeof ENVIRONMENT];
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
  GITHUB_BASE_URL: string;
  SECRET_BASIC_AUTH_USERNAME: string;
  SECRET_BASIC_AUTH_PASSWORD: string;
  SECRET_GITHUB_OWNER: string;
  SECRET_GITHUB_REPO: string;
  SECRET_GITHUB_TOKEN: string;
  SECRET_HATENA_API_KEY: string;
  SECRET_QIITA_API_ACCESS_TOKEN: string;
  SECRET_SIZU_API_KEY: string;
}

export interface Env {
  Bindings: Bindings;
  Variables: {
    db: Database;
    octokit: Octokit;
  };
}

export interface CloudflareD1 extends DrizzleD1Database {
  $client: D1Database;
}

export type Database = CloudflareD1 | BunSQLite;
