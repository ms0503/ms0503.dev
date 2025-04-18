'use strict';

import { posts } from '../../drizzle/schemas/posts';
import { postsAndTags } from '../../drizzle/schemas/posts-and-tags';
import { tags } from '../../drizzle/schemas/tags';
import { eq } from 'drizzle-orm';
import type { AppLoadContext } from 'react-router';
import type { Post, PostAndTag, PostWithoutBody, Tag } from '~/models/types';

async function getPosts(db: AppLoadContext['db'], postAndTags: Pick<PostAndTag, 'postId'>[]): Promise<PostWithoutBody[]> {
    const postArr: Post[] = [];
    for(const { postId } of postAndTags) {
        const post = await db.select().from(posts).where(eq(posts.id, postId)).then(v => v[0]);
        postArr.push(post);
    }
    return postArr;
}

export async function getTagById(db: AppLoadContext['db'], id: Tag['id']): Promise<Tag> {
    return db.select().from(tags).where(eq(tags.id, id)).then(v => v[0]);
}

export async function getTagByName(db: AppLoadContext['db'], name: Tag['name']): Promise<Tag> {
    return db.select().from(tags).where(eq(tags.name, name)).then(v => v[0]);
}

export async function getTagIdByName(db: AppLoadContext['db'], name: Tag['name']): Promise<Tag['id']> {
    return db.select({
        id: tags.id
    }).from(tags).where(eq(tags.name, name)).then(v => v[0].id);
}

export async function getTagNameById(db: AppLoadContext['db'], id: Tag['id']): Promise<Tag['name']> {
    return db.select({
        name: tags.name
    }).from(tags).where(eq(tags.id, id)).then(v => v[0].name);
}

export async function getTagPostsById(db: AppLoadContext['db'], id: Tag['id']): Promise<PostWithoutBody[]> {
    const posts = await db.select({
        postId: postsAndTags.postId
    }).from(postsAndTags).where(eq(postsAndTags.tagId, id));
    return getPosts(db, posts);
}

export async function getTagPostsByName(db: AppLoadContext['db'], name: Tag['name']): Promise<PostWithoutBody[]> {
    const posts = await db.select({
        postId: postsAndTags.postId
    }).from(postsAndTags).where(eq(postsAndTags.tagId, await getTagIdByName(db, name)));
    return getPosts(db, posts);
}

export async function getTags(db: AppLoadContext['db'], count: number = 0, page: number = 1): Promise<Tag[]> {
    const base = db.select().from(tags);
    if(count === -1) {
        return base;
    }
    return base.limit(count).offset(count * (page - 1));
}
