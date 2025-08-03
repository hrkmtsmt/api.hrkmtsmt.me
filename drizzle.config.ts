import path from "path";
import * as dotenvx from "@dotenvx/dotenvx";
import { defineConfig } from "drizzle-kit";

dotenvx.config({
  path: path.join(__dirname, ".dev.vars"),
});

const production = defineConfig({
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

const local = defineConfig({
  out: "./migrations",
  schema: "./src/schema/index.ts",
  dialect: "sqlite",
  dbCredentials: {
    url: "db.sqlite",
  },
});

export default process.env.ENVIRONMENT === "production" ? production : local;
