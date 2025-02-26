import { afterEach } from "bun:test";
import { Database } from "bun:sqlite";
import { drizzle } from "drizzle-orm/bun-sqlite";
import * as schema from "@schema/index";
import type SQLite from "bun:sqlite";
import type { BunSQLiteDatabase } from "drizzle-orm/bun-sqlite";

export interface BunSQLite extends BunSQLiteDatabase<typeof schema> {
	$client: SQLite;
}

export interface TestHonoEnv {
	DB: SQLite;
}

export class DatabaseManager {
	private db: SQLite;

	public readonly store: BunSQLite;

	public readonly env: TestHonoEnv;

	constructor() {
		const db = new Database("test/db.sqlite");
		this.db = db;
		this.store = drizzle({ client: db, schema });
		this.env = { DB: db };

		afterEach(() => {
			this.restore();
		});
	}

	private restore() {
		Object.values(schema).forEach((s) => this.store.delete(s).run());
	}
}
