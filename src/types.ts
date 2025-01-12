/**
 * NOTE: Workersの環境変数の設定場所
 *
 * https://dash.cloudflare.com/<account>/workers/services/view/api/production/settings
 */
type Bindings = {
  DB: D1Database;
  ALLOW_ORIGIN: string;
  QIITA_API_URL: string;
  QIITA_BASE_URL: string;
  SIZU_API_URL: string;
  SIZU_BASE_URL: string;
  ZENN_API_URL: string;
  ZENN_BASE_URL: string;
  SECRET_BASIC_AUTH_USERNAME: string;
  SECRET_BASIC_AUTH_PASWORD: string;
  SECRET_QIITA_API_ACCESS_TOKEN: string;
  SECRET_SIZU_API_KEY: string;
};

export type Env = {
  Bindings: Bindings;
};
