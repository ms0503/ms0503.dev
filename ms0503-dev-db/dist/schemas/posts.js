'use strict';
import { cuid2 } from 'drizzle-cuid2/sqlite';
import { getTableColumns, sql } from 'drizzle-orm';
import { sqliteTable, sqliteView, text } from 'drizzle-orm/sqlite-core';
const now = sql `(strftime('%Y-%m-%dT00:00:00.000Z', 'now'))`;
const posts = sqliteTable('posts', {
    body: text().notNull(),
    categoryId: cuid2('category_id').notNull(),
    createdAt: text('created_at').notNull().default(now),
    id: cuid2().defaultRandom().primaryKey(),
    title: text().notNull().unique(),
    updatedAt: text('updated_at').notNull().default(now).$onUpdate(() => now)
});
const { body: _, ...columnsWithoutBody } = getTableColumns(posts);
export const postsWithoutBody = sqliteView('posts_without_body').as(db => db.select(columnsWithoutBody).from(posts));
export { posts };
