"use strict";
import { categories } from "../schemas/categories.js";
import { posts, postsWithoutBody } from "../schemas/posts.js";
import { postsAndTags } from "../schemas/posts-and-tags.js";
import { tags } from "../schemas/tags.js";
import { eq } from "drizzle-orm";
async function getTags(db, postAndTags) {
    const tagArr = [];
    for (const { tagId } of postAndTags) {
        const tag = await db.select().from(tags).where(eq(tags.id, tagId)).then(v => v[0]);
        tagArr.push(tag);
    }
    return tagArr;
}
export async function getPostBodyById(db, id) {
    return db.select({
        body: posts.body
    }).from(posts).where(eq(posts.id, id)).then(v => v[0].body);
}
export async function getPostBodyByTitle(db, title) {
    return db.select({
        body: posts.body
    }).from(posts).where(eq(posts.title, title)).then(v => v[0].body);
}
export async function getPostById(db, id) {
    return db.select().from(postsWithoutBody).where(eq(postsWithoutBody.id, id)).then(v => v[0]);
}
export async function getPostByTitle(db, title) {
    return db.select().from(postsWithoutBody).where(eq(postsWithoutBody.title, title)).then(v => v[0]);
}
export async function getPostCategoryById(db, id) {
    return db.select().from(categories).where(eq(categories.id, await getPostCategoryIdById(db, id))).then(v => v[0]);
}
export async function getPostCategoryByTitle(db, title) {
    return db.select().from(categories).where(eq(categories.id, await getPostCategoryIdByTitle(db, title))).then(v => v[0]);
}
export async function getPostCategoryIdById(db, id) {
    return db.select({
        categoryId: postsWithoutBody.categoryId
    }).from(postsWithoutBody).where(eq(postsWithoutBody.id, id)).then(v => v[0].categoryId);
}
export async function getPostCategoryIdByTitle(db, title) {
    return db.select({
        categoryId: postsWithoutBody.categoryId
    }).from(postsWithoutBody).where(eq(postsWithoutBody.title, title)).then(v => v[0].categoryId);
}
export async function getPostCreatedAtById(db, id) {
    return db.select({
        createdAt: postsWithoutBody.createdAt
    }).from(postsWithoutBody).where(eq(postsWithoutBody.id, id)).then(v => v[0].createdAt);
}
export async function getPostCreatedAtByTitle(db, title) {
    return db.select({
        createdAt: postsWithoutBody.createdAt
    }).from(postsWithoutBody).where(eq(postsWithoutBody.title, title)).then(v => v[0].createdAt);
}
export async function getPostIdByTitle(db, title) {
    return db.select({
        id: postsWithoutBody.id
    }).from(postsWithoutBody).where(eq(postsWithoutBody.title, title)).then(v => v[0].id);
}
export async function getPostTagsById(db, id) {
    const tags = await db.select({
        tagId: postsAndTags.tagId
    }).from(postsAndTags).where(eq(postsAndTags.postId, id));
    return getTags(db, tags);
}
export async function getPostTagsByTitle(db, title) {
    const tags = await db.select({
        tagId: postsAndTags.tagId
    }).from(postsAndTags).where(eq(postsAndTags.postId, await getPostIdByTitle(db, title)));
    return getTags(db, tags);
}
export async function getPostTitleById(db, id) {
    return db.select({
        title: postsWithoutBody.title
    }).from(postsWithoutBody).where(eq(postsWithoutBody.id, id)).then(v => v[0].title);
}
export async function getPostUpdatedAtById(db, id) {
    return db.select({
        updatedAt: postsWithoutBody.updatedAt
    }).from(postsWithoutBody).where(eq(postsWithoutBody.id, id)).then(v => v[0].updatedAt);
}
export async function getPostUpdatedAtByTitle(db, title) {
    return db.select({
        updatedAt: postsWithoutBody.updatedAt
    }).from(postsWithoutBody).where(eq(postsWithoutBody.title, title)).then(v => v[0].updatedAt);
}
export async function getPosts(db, count = 0, page = 1) {
    const base = db.select().from(postsWithoutBody);
    if (count === -1) {
        return base;
    }
    return base.limit(count).offset(count * (page - 1));
}
export async function getPostsWithBody(db, count = 0, page = 1) {
    const base = db.select().from(posts);
    if (count === -1) {
        return base;
    }
    return base.limit(count).offset(count * (page - 1));
}
