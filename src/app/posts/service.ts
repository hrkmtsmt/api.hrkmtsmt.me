import { or, count, desc, eq, sql } from "drizzle-orm";
import { posts } from "@src/schema";
import { splitArray } from "@src/modules";
import type { Database, CloudflareD1 } from "@src/types";
import type { Post } from "@src/schema/types";

interface RetriveSelecter {
	medium: Post["media"][] | undefined;
	limit?: number;
	offset?: number;
}

interface TotalSelecter {
	medium: Post["media"][] | undefined;
}

export class PostService<DB extends Database> {
	private readonly db: CloudflareD1;

	constructor(db: DB) {
		this.db = db as unknown as CloudflareD1;
	}

	private mediumSelecter(medium: Post["media"][] | undefined) {
		return medium ? or(...medium.map((m) => eq(posts.media, m))) : undefined;
	}

	public async upsert(data: Post[]) {
		return Promise.all(
			splitArray(data, 10).map(async (row) => {
				return this.db
					.insert(posts)
					.values(row)
					.onConflictDoUpdate({
						target: [posts.slug],
						set: {
							title: sql`excluded.title`,
						},
					});
			}),
		);
	}

	public async retrive(selecter: RetriveSelecter) {
		return this.db
			.select()
			.from(posts)
			.where(this.mediumSelecter(selecter.medium))
			.orderBy(desc(posts.publishedAt))
			.limit(selecter.limit ?? -1)
			.offset(selecter.offset ?? 0);
	}

	public async count(selecter: TotalSelecter) {
		const [{ total }] = await this.db
			.select({ total: count() })
			.from(posts)
			.where(this.mediumSelecter(selecter.medium));
		return total;
	}
}
