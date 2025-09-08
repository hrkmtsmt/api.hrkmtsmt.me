import { Bindings } from "@types";

declare global {
  // biome-ignore lint/style/noNamespace: <explanation>
  namespace NodeJS {
    interface ProcessEnv {
      ENVIRONMENT: Bindings["ENVIRONMENT"];
      CLOUDFLARE_API_TOKEN: strintg;
      CLOUDFLARE_ACCOUNT_ID: string;
      CLOUDFLARE_DATABASE_ID: string;
      SECRET_GITHUB_OWNER: string;
      SECRET_GITHUB_REPO: string;
      SECRET_GITHUB_TOKEN: string;
    }
  }
}
