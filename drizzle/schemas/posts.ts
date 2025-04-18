'use strict';

import { cuid2 } from 'drizzle-cuid2/sqlite';
import { getTableColumns, sql } from 'drizzle-orm';
import { integer, sqliteTable, sqliteView, text } from 'drizzle-orm/sqlite-core';

const now = sql`(cast((julianday('now') - 2440587.5) * 86400000 as integer))`;

const posts = sqliteTable('posts', {
    body: text().notNull(),
    categoryId: cuid2('category_id').notNull(),
    createdAt: integer('created_at', {
        mode: 'timestamp'
    }).notNull().default(now),
    id: cuid2().defaultRandom().primaryKey(),
    title: text().notNull().unique(),
    updatedAt: integer('updated_at', {
        mode: 'timestamp'
    }).notNull().generatedAlwaysAs(now, {
        mode: 'stored'
    })
});

const { body: _, ...columnsWithoutBody } = getTableColumns(posts);

export const postsWithoutBody = sqliteView('posts_without_body').as(db => db.select(columnsWithoutBody).from(posts));

export { posts };
