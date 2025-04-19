'use strict';

import { posts } from '../schemas/posts';
import { postsAndTags } from '../schemas/posts-and-tags';
import { tags } from '../schemas/tags';
import { eq } from 'drizzle-orm';
import type { DB, Post, PostAndTag, PostWithoutBody, Tag } from './types';

async function getPosts(db: DB, postAndTags: Pick<PostAndTag, 'postId'>[]): Promise<PostWithoutBody[]> {
    const postArr: Post[] = [];
    for(const { postId } of postAndTags) {
        const post = await db.select().from(posts).where(eq(posts.id, postId)).then(v => v[0]);
        postArr.push(post);
    }
    return postArr;
}

export async function getTagById(db: DB, id: Tag['id']): Promise<Tag> {
    return db.select().from(tags).where(eq(tags.id, id)).then(v => v[0]);
}

export async function getTagByName(db: DB, name: Tag['name']): Promise<Tag> {
    return db.select().from(tags).where(eq(tags.name, name)).then(v => v[0]);
}

export async function getTagIdByName(db: DB, name: Tag['name']): Promise<Tag['id']> {
    return db.select({
        id: tags.id
    }).from(tags).where(eq(tags.name, name)).then(v => v[0].id);
}

export async function getTagNameById(db: DB, id: Tag['id']): Promise<Tag['name']> {
    return db.select({
        name: tags.name
    }).from(tags).where(eq(tags.id, id)).then(v => v[0].name);
}

export async function getTagPostsById(db: DB, id: Tag['id']): Promise<PostWithoutBody[]> {
    const posts = await db.select({
        postId: postsAndTags.postId
    }).from(postsAndTags).where(eq(postsAndTags.tagId, id));
    return getPosts(db, posts);
}

export async function getTagPostsByName(db: DB, name: Tag['name']): Promise<PostWithoutBody[]> {
    const posts = await db.select({
        postId: postsAndTags.postId
    }).from(postsAndTags).where(eq(postsAndTags.tagId, await getTagIdByName(db, name)));
    return getPosts(db, posts);
}

export async function getTags(db: DB, count: number = 0, page: number = 1): Promise<Tag[]> {
    const base = db.select().from(tags);
    if(count === -1) {
        return base;
    }
    return base.limit(count).offset(count * (page - 1));
}
