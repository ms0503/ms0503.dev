'use strict';

import { categories } from '../../drizzle/schemas/categories';
import { posts, postsWithoutBody } from '../../drizzle/schemas/posts';
import { postsAndTags } from '../../drizzle/schemas/posts-and-tags';
import { tags } from '../../drizzle/schemas/tags';

export type Category = typeof categories.$inferSelect;

export type Post = typeof posts.$inferSelect;

export type PostAndTag = typeof postsAndTags.$inferSelect;

export type PostWithoutBody = typeof postsWithoutBody.$inferSelect;

export type Tag = typeof tags.$inferSelect;
