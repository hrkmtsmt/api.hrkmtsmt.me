import { sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const posts = sqliteTable('posts', {
  id: text('id').primaryKey().notNull(),
  title: text('title').notNull(),
  url: text('url').notNull(),
  media: text('media').notNull(),
});
