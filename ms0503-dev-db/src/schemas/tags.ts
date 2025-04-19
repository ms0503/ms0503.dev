'use strict';

import { cuid2 } from 'drizzle-cuid2/sqlite';
import { sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const tags = sqliteTable('tags', {
    id: cuid2().defaultRandom().primaryKey(),
    name: text().notNull().unique()
});
