"use strict";
import { categories } from "./categories.js";
import { posts } from "./posts.js";
import { postsAndTags } from "./posts-and-tags.js";
import { tags } from "./tags.js";
import { relations } from "drizzle-orm";
export const categoriesRelations = relations(categories, ({ many }) => ({
    posts: many(posts)
}));
export const postsAndTagsRelations = relations(postsAndTags, ({ one }) => ({
    post: one(posts, {
        fields: [
            postsAndTags.postId
        ],
        references: [
            posts.id
        ]
    }),
    tag: one(tags, {
        fields: [
            postsAndTags.tagId
        ],
        references: [
            tags.id
        ]
    })
}));
export const postsRelations = relations(posts, ({ many, one }) => ({
    category: one(categories, {
        fields: [posts.categoryId],
        references: [categories.id]
    }),
    tags: many(postsAndTags)
}));
export const tagsRelations = relations(tags, ({ many }) => ({
    posts: many(postsAndTags)
}));
