PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_posts` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`slug` text NOT NULL,
	`title` text NOT NULL,
	`url` text NOT NULL,
	`media` text NOT NULL,
	`created_at` integer NOT NULL,
	`published_at` integer NOT NULL
);
--> statement-breakpoint
INSERT INTO `__new_posts`("id", "slug", "title", "url", "media", "created_at", "published_at") SELECT "id", "slug", "title", "url", "media", "created_at", "published_at" FROM `posts`;--> statement-breakpoint
DROP TABLE `posts`;--> statement-breakpoint
ALTER TABLE `__new_posts` RENAME TO `posts`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE UNIQUE INDEX `posts_slug_unique` ON `posts` (`slug`);