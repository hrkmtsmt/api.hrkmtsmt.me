/**
 * NOTE: Workersの環境変数の設定場所
 *
 * https://dash.cloudflare.com/<account>/workers/services/view/api/production/settings
 */
type Bindings = {
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

export type Env = {
  Bindings: Bindings;
};
