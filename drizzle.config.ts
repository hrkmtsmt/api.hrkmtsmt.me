import { defineConfig } from 'drizzle-kit';
import * as dotenvx from '@dotenvx/dotenvx';

dotenvx.config();

export default defineConfig({
  out: './migrations',
  schema: './src/schema/index.ts',
  dialect: 'sqlite',
  driver: 'd1-http',
  dbCredentials: {
    accountId: process.env.CLOUDFLARE_ACCOUNT_ID!,
    databaseId: process.env.CLOUDFLARE_DATABASE_ID!,
    token: process.env.CLOUDFLARE_D1_TOKEN!,
  },
});