import { defineConfig } from "drizzle-kit";
import * as dotenvx from "@dotenvx/dotenvx";
import path from "path";

dotenvx.config({
  path: path.join(__dirname, ".dev.vars"),
});

export default defineConfig({
  out: "./migrations",
  schema: "./src/schema/index.ts",
  dialect: "sqlite",
  driver: "d1-http",
  dbCredentials: {
    token: process.env.CLOUDFLARE_API_TOKEN,
    accountId: process.env.CLOUDFLARE_ACCOUNT_ID,
    databaseId: process.env.CLOUDFLARE_DATABASE_ID,
  },
});
