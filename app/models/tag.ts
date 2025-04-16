'use strict';

import { db } from '~/services/db.server';
import type { Pick } from '@prisma/client/runtime/client';
import type { Post, PostAndTag, Tag } from '~/generated/client';

async function getPosts(postAndTags: Pick<PostAndTag, 'postId'>[]): Promise<Post[]> {
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

export async function getTagById(id: Tag['id']): Promise<Tag> {
    try {
        await db.$connect();
        return db.tag.findUniqueOrThrow({
            where: {
                id
            }
        });
    } finally {
        await db.$disconnect();
    }
}

export async function getTagByName(name: Tag['name']): Promise<Tag> {
    try {
        await db.$connect();
        return db.tag.findUniqueOrThrow({
            where: {
                name
            }
        });
    } finally {
        await db.$disconnect();
    }
}

export async function getTagIdByName(name: Tag['name']): Promise<Tag['id']> {
    try {
        await db.$connect();
        const { id } = await db.tag.findUniqueOrThrow({
            select: {
                id: true
            },
            where: {
                name
            }
        });
        return id;
    } finally {
        await db.$disconnect();
    }
}

export async function getTagNameById(id: Tag['id']): Promise<Tag['name']> {
    try {
        await db.$connect();
        const { name } = await db.tag.findUniqueOrThrow({
            select: {
                name: true
            },
            where: {
                id
            }
        });
        return name;
    } finally {
        await db.$disconnect();
    }
}

export async function getTagPostsById(id: Tag['id']): Promise<Post[]> {
    try {
        await db.$connect();
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
        return getPosts(posts);
    } finally {
        await db.$disconnect();
    }
}

export async function getTagPostsByName(name: Tag['name']): Promise<Post[]> {
    try {
        await db.$connect();
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
        return getPosts(posts);
    } finally {
        await db.$disconnect();
    }
}

export async function getTags(count: number = 0, page: number = 1): Promise<Tag[]> {
    try {
        await db.$connect();
        return db.tag.findMany({
            skip: count === -1 ? undefined : count * (page - 1),
            take: count === -1 ? undefined : count
        });
    } finally {
        await db.$disconnect();
    }
}
