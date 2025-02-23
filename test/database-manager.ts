import { Database } from "bun:sqlite";
import { drizzle } from "drizzle-orm/bun-sqlite";
import * as schema from "@src/schema";
import type SQLite from "bun:sqlite";
import type { BunSQLiteDatabase } from "drizzle-orm/bun-sqlite";

export interface BunSQLite extends BunSQLiteDatabase<typeof schema> {
	$client: SQLite;
}

export class DatabaseManager {
	public store: BunSQLite;

	constructor() {
		this.store = drizzle({
			client: new Database("test/db.sqlite"),
			schema,
		});
	}

	public restore() {
		Object.values(schema).forEach((s) => this.store.delete(s).run());
	}
}
