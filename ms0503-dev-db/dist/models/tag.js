"use strict";
import { posts } from "../schemas/posts.js";
import { postsAndTags } from "../schemas/posts-and-tags.js";
import { tags } from "../schemas/tags.js";
import { eq } from "drizzle-orm";
async function getPosts(db, postAndTags) {
    const postArr = [];
    for (const { postId } of postAndTags) {
        const post = await db.select().from(posts).where(eq(posts.id, postId)).then(v => v[0]);
        postArr.push(post);
    }
    return postArr;
}
export async function getTagById(db, id) {
    return db.select().from(tags).where(eq(tags.id, id)).then(v => v[0]);
}
export async function getTagByName(db, name) {
    return db.select().from(tags).where(eq(tags.name, name)).then(v => v[0]);
}
export async function getTagIdByName(db, name) {
    return db.select({
        id: tags.id
    }).from(tags).where(eq(tags.name, name)).then(v => v[0].id);
}
export async function getTagNameById(db, id) {
    return db.select({
        name: tags.name
    }).from(tags).where(eq(tags.id, id)).then(v => v[0].name);
}
export async function getTagPostsById(db, id) {
    const posts = await db.select({
        postId: postsAndTags.postId
    }).from(postsAndTags).where(eq(postsAndTags.tagId, id));
    return getPosts(db, posts);
}
export async function getTagPostsByName(db, name) {
    const posts = await db.select({
        postId: postsAndTags.postId
    }).from(postsAndTags).where(eq(postsAndTags.tagId, await getTagIdByName(db, name)));
    return getPosts(db, posts);
}
export async function getTags(db, count = 0, page = 1) {
    const base = db.select().from(tags);
    if (count === -1) {
        return base;
    }
    return base.limit(count).offset(count * (page - 1));
}
