/* eslint-disable import-x/no-deprecated */
'use strict';

import { cuid2 } from 'drizzle-cuid2/sqlite';
import { primaryKey, sqliteTable } from 'drizzle-orm/sqlite-core';

export const postsAndTags = sqliteTable('posts_and_tags', {
    postId: cuid2('post_id').notNull(),
    tagId: cuid2('tag_id').notNull()
}, table => [
    primaryKey({
        columns: [
            table.postId,
            table.tagId
        ],
        name: 'id'
    })
]);
