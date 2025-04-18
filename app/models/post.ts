'use strict';

import { categories } from '../../drizzle/schemas/categories';
import { posts, postsWithoutBody } from '../../drizzle/schemas/posts';
import { postsAndTags } from '../../drizzle/schemas/posts-and-tags';
import { tags } from '../../drizzle/schemas/tags';
import { eq } from 'drizzle-orm';
import type { AppLoadContext } from 'react-router';
import type { Category, Post, PostAndTag, PostWithoutBody, Tag } from '~/models/types';

async function getTags(db: AppLoadContext['db'], postAndTags: Pick<PostAndTag, 'tagId'>[]): Promise<Tag[]> {
    const tagArr: Tag[] = [];
    for(const { tagId } of postAndTags) {
        const tag = await db.select().from(tags).where(eq(tags.id, tagId)).then(v => v[0]);
        tagArr.push(tag);
    }
    return tagArr;
}

export async function getPostBodyById(db: AppLoadContext['db'], id: Post['id']): Promise<Post['body']> {
    return db.select({
        body: posts.body
    }).from(posts).where(eq(posts.id, id)).then(v => v[0].body);
}

export async function getPostBodyByTitle(db: AppLoadContext['db'], title: Post['title']): Promise<Post['body']> {
    return db.select({
        body: posts.body
    }).from(posts).where(eq(posts.title, title)).then(v => v[0].body);
}

export async function getPostById(db: AppLoadContext['db'], id: Post['id']): Promise<PostWithoutBody> {
    return db.select().from(postsWithoutBody).where(eq(postsWithoutBody.id, id)).then(v => v[0]);
}

export async function getPostByTitle(db: AppLoadContext['db'], title: Post['title']): Promise<PostWithoutBody> {
    return db.select().from(postsWithoutBody).where(eq(postsWithoutBody.title, title)).then(v => v[0]);
}

export async function getPostCategoryById(db: AppLoadContext['db'], id: Post['id']): Promise<Category> {
    return db.select().from(categories).where(eq(categories.id, await getPostCategoryIdById(db, id))).then(v => v[0]);
}

export async function getPostCategoryByTitle(db: AppLoadContext['db'], title: Post['title']): Promise<Category> {
    return db.select().from(categories).where(eq(categories.id, await getPostCategoryIdByTitle(db, title))).then(v => v[0]);
}

export async function getPostCategoryIdById(db: AppLoadContext['db'], id: Post['id']): Promise<Post['categoryId']> {
    return db.select({
        categoryId: postsWithoutBody.categoryId
    }).from(postsWithoutBody).where(eq(postsWithoutBody.id, id)).then(v => v[0].categoryId);
}

export async function getPostCategoryIdByTitle(db: AppLoadContext['db'], title: Post['title']): Promise<Post['categoryId']> {
    return db.select({
        categoryId: postsWithoutBody.categoryId
    }).from(postsWithoutBody).where(eq(postsWithoutBody.title, title)).then(v => v[0].categoryId);
}

export async function getPostCreatedAtById(db: AppLoadContext['db'], id: Post['id']): Promise<Post['createdAt']> {
    return db.select({
        createdAt: postsWithoutBody.createdAt
    }).from(postsWithoutBody).where(eq(postsWithoutBody.id, id)).then(v => v[0].createdAt);
}

export async function getPostCreatedAtByTitle(db: AppLoadContext['db'], title: Post['title']): Promise<Post['createdAt']> {
    return db.select({
        createdAt: postsWithoutBody.createdAt
    }).from(postsWithoutBody).where(eq(postsWithoutBody.title, title)).then(v => v[0].createdAt);
}

export async function getPostIdByTitle(db: AppLoadContext['db'], title: Post['title']): Promise<Post['id']> {
    return db.select({
        id: postsWithoutBody.id
    }).from(postsWithoutBody).where(eq(postsWithoutBody.title, title)).then(v => v[0].id);
}

export async function getPostTagsById(db: AppLoadContext['db'], id: Post['id']): Promise<Tag[]> {
    const tags = await db.select({
        tagId: postsAndTags.tagId
    }).from(postsAndTags).where(eq(postsAndTags.postId, id));
    return getTags(db, tags);
}

export async function getPostTagsByTitle(db: AppLoadContext['db'], title: Post['title']): Promise<Tag[]> {
    const tags = await db.select({
        tagId: postsAndTags.tagId
    }).from(postsAndTags).where(eq(postsAndTags.postId, await getPostIdByTitle(db, title)));
    return getTags(db, tags);
}

export async function getPostTitleById(db: AppLoadContext['db'], id: Post['id']): Promise<Post['title']> {
    return db.select({
        title: postsWithoutBody.title
    }).from(postsWithoutBody).where(eq(postsWithoutBody.id, id)).then(v => v[0].title);
}

export async function getPostUpdatedAtById(db: AppLoadContext['db'], id: Post['id']): Promise<Post['updatedAt']> {
    return db.select({
        updatedAt: postsWithoutBody.updatedAt
    }).from(postsWithoutBody).where(eq(postsWithoutBody.id, id)).then(v => v[0].updatedAt);
}

export async function getPostUpdatedAtByTitle(db: AppLoadContext['db'], title: Post['title']): Promise<Post['updatedAt']> {
    return db.select({
        updatedAt: postsWithoutBody.updatedAt
    }).from(postsWithoutBody).where(eq(postsWithoutBody.title, title)).then(v => v[0].updatedAt);
}

export async function getPosts(db: AppLoadContext['db'], count: number = 0, page: number = 1): Promise<PostWithoutBody[]> {
    const base = db.select().from(postsWithoutBody);
    if(count === -1) {
        return base;
    }
    return base.limit(count).offset(count * (page - 1));
}

export async function getPostsWithBody(db: AppLoadContext['db'], count: number = 0, page: number = 1): Promise<Post[]> {
    const base = db.select().from(posts);
    if(count === -1) {
        return base;
    }
    return base.limit(count).offset(count * (page - 1));
}
