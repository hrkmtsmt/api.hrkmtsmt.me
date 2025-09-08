import { mock, afterEach } from "bun:test";
import { Database } from "bun:sqlite";
import { drizzle } from "drizzle-orm/bun-sqlite";
import { Octokit } from "@octokit/rest";
import * as dotenvx from "@dotenvx/dotenvx";
import * as schema from "@schema/index";
import type SQLite from "bun:sqlite";
import type { BunSQLiteDatabase } from "drizzle-orm/bun-sqlite";

export interface BunSQLite extends BunSQLiteDatabase<typeof schema> {
  $client: SQLite;
}

export interface TestHonoEnv {
  DB: SQLite;
  SECRET_GITHUB_TOKEN: string;
  SECRET_GITHUB_OWNER: string;
  SECRET_GITHUB_REPO: string;
}

export class TestManager {
  public readonly db: BunSQLite;

  public readonly env: TestHonoEnv;

  public readonly octokit: Octokit;

  constructor() {
    dotenvx.config({ path: ".dev.vars" });

    const store = new Database("db.sqlite");
    const octokit = new Octokit({
      auth: process.env.SECRET_GITHUB_TOKEN,
    });

    this.db = drizzle({ client: store, schema });
    this.octokit = octokit;
    this.env = {
      DB: store,
      SECRET_GITHUB_TOKEN: process.env.SECRET_GITHUB_TOKEN,
      SECRET_GITHUB_OWNER: process.env.SECRET_GITHUB_OWNER,
      SECRET_GITHUB_REPO: process.env.SECRET_GITHUB_REPO,
    };

    mock.module("drizzle-orm/d1", () => {
      return { drizzle };
    });

    afterEach(() => {
      this.restore();
    });
  }

  private restore() {
    Object.values(schema).forEach((s) => this.db.delete(s).run());
  }
}
