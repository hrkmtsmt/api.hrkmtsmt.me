import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const posts = sqliteTable('posts', {
  id: text('id').primaryKey().notNull(),
  title: text('title').notNull(),
  url: text('url').notNull(),
  media: text('media', { enum: ['Zenn', 'Qiita', 'Sizu'] }).notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
  publishedAt: integer('published_at', { mode: 'timestamp' }).notNull(),
});
