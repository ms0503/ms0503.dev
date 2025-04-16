'use strict';

import type { Pick } from '@prisma/client/runtime/client';
import type { AppLoadContext } from 'react-router';
import type { Post, PostAndTag, Tag } from '~/generated/client';

async function getPosts(db: AppLoadContext['db'], postAndTags: Pick<PostAndTag, 'postId'>[]): Promise<Post[]> {
    const posts: Post[] = [];
    for(const { postId } of postAndTags) {
        const post = await db.post.findUniqueOrThrow({
            where: {
                id: postId
            }
        });
        posts.push(post);
    }
    return posts;
}

export async function getTagById(db: AppLoadContext['db'], id: Tag['id']): Promise<Tag> {
    return db.tag.findUniqueOrThrow({
        where: {
            id
        }
    });
}

export async function getTagByName(db: AppLoadContext['db'], name: Tag['name']): Promise<Tag> {
    return db.tag.findUniqueOrThrow({
        where: {
            name
        }
    });
}

export async function getTagIdByName(db: AppLoadContext['db'], name: Tag['name']): Promise<Tag['id']> {
    const { id } = await db.tag.findUniqueOrThrow({
        select: {
            id: true
        },
        where: {
            name
        }
    });
    return id;
}

export async function getTagNameById(db: AppLoadContext['db'], id: Tag['id']): Promise<Tag['name']> {
    const { name } = await db.tag.findUniqueOrThrow({
        select: {
            name: true
        },
        where: {
            id
        }
    });
    return name;
}

export async function getTagPostsById(db: AppLoadContext['db'], id: Tag['id']): Promise<Post[]> {
    const { posts } = await db.tag.findUniqueOrThrow({
        select: {
            posts: {
                select: {
                    postId: true
                }
            }
        },
        where: {
            id
        }
    });
    return getPosts(db, posts);
}

export async function getTagPostsByName(db: AppLoadContext['db'], name: Tag['name']): Promise<Post[]> {
    const { posts } = await db.tag.findUniqueOrThrow({
        select: {
            posts: {
                select: {
                    postId: true
                }
            }
        },
        where: {
            name
        }
    });
    return getPosts(db, posts);
}

export async function getTags(db: AppLoadContext['db'], count: number = 0, page: number = 1): Promise<Tag[]> {
    return db.tag.findMany({
        skip: count === -1 ? undefined : count * (page - 1),
        take: count === -1 ? undefined : count
    });
}
