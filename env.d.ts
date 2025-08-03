import { Bindings } from "@types";

declare global {
  // biome-ignore lint/style/noNamespace: <explanation>
  namespace NodeJS {
    interface ProcessEnv {
      CLOUDFLARE_API_TOKEN: strintg;
      CLOUDFLARE_ACCOUNT_ID: string;
      CLOUDFLARE_DATABASE_ID: string;
    }
  }
}
