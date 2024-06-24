import { Handler } from 'hono';

export type Bindings = {
  ALLOW_ORIGIN: string;
  ALLOW_ORIGIN_LOCAL: string;
  BASIC_AUTH_USERNAME: string;
  BASIC_AUTH_PASWORD: string;
  ZENN_BASE_URL: string;
  ZENN_API_URL: string;
  QIITA_API_URL: string;
  QIITA_API_ACCESS_TOKEN: string;
  SIZU_BASE_URL: string;
  SIZU_API_URL: string;
  SIZU_API_KEY: string;
};

export type AppHandler = Handler<{ Bindings: Bindings }>;
