'use strict';

import { Omit, Pick } from '@prisma/client/runtime/client';
import { db } from '~/services/db.server';
import type { Category, Post, PostAndTag, Tag } from '~/generated/client';

async function getTags(postAndTags: Pick<PostAndTag, 'tagId'>[]): Promise<Tag[]> {
    const tags: Tag[] = [];
    for(const { tagId } of postAndTags) {
        const tag = await db.tag.findUniqueOrThrow({
            where: {
                id: tagId
            }
        });
        tags.push(tag);
    }
    return tags;
}

export type PostWithoutBody = Omit<Post, 'body'>;

export async function getPostBodyById(id: Post['id']): Promise<Post['body']> {
    try {
        await db.$connect();
        const { body } = await db.post.findUniqueOrThrow({
            select: {
                body: true
            },
            where: {
                id
            }
        });
        return body;
    } finally {
        await db.$disconnect();
    }
}

export async function getPostBodyByTitle(title: Post['title']): Promise<Post['body']> {
    try {
        await db.$connect();
        const { body } = await db.post.findUniqueOrThrow({
            select: {
                body: true
            },
            where: {
                title
            }
        });
        return body;
    } finally {
        await db.$disconnect();
    }
}

export async function getPostById(id: Post['id']): Promise<PostWithoutBody> {
    try {
        await db.$connect();
        return db.post.findUniqueOrThrow({
            omit: {
                body: true
            },
            where: {
                id
            }
        });
    } finally {
        await db.$disconnect();
    }
}

export async function getPostByTitle(title: Post['title']): Promise<PostWithoutBody> {
    try {
        await db.$connect();
        return db.post.findUniqueOrThrow({
            omit: {
                body: true
            },
            where: {
                title
            }
        });
    } finally {
        await db.$disconnect();
    }
}

export async function getPostCategoryById(id: Post['id']): Promise<Category> {
    try {
        await db.$connect();
        const { category } = await db.post.findUniqueOrThrow({
            select: {
                category: true
            },
            where: {
                id
            }
        });
        return category;
    } finally {
        await db.$disconnect();
    }
}

export async function getPostCategoryByTitle(title: Post['title']): Promise<Category> {
    try {
        await db.$connect();
        const { category } = await db.post.findUniqueOrThrow({
            select: {
                category: true
            },
            where: {
                title
            }
        });
        return category;
    } finally {
        await db.$disconnect();
    }
}

export async function getPostCategoryIdById(id: Post['id']): Promise<Post['categoryId']> {
    try {
        await db.$connect();
        const { categoryId } = await db.post.findUniqueOrThrow({
            where: {
                id
            }
        });
        return categoryId;
    } finally {
        await db.$disconnect();
    }
}

export async function getPostCategoryIdByTitle(title: Post['title']): Promise<Post['categoryId']> {
    try {
        await db.$connect();
        const { categoryId } = await db.post.findUniqueOrThrow({
            where: {
                title
            }
        });
        return categoryId;
    } finally {
        await db.$disconnect();
    }
}

export async function getPostCreatedAtById(id: Post['id']): Promise<Post['createdAt']> {
    try {
        await db.$connect();
        const { createdAt } = await db.post.findUniqueOrThrow({
            select: {
                createdAt: true
            },
            where: {
                id
            }
        });
        return createdAt;
    } finally {
        await db.$disconnect();
    }
}

export async function getPostCreatedAtByTitle(title: Post['title']): Promise<Post['createdAt']> {
    try {
        await db.$connect();
        const { createdAt } = await db.post.findUniqueOrThrow({
            select: {
                createdAt: true
            },
            where: {
                title
            }
        });
        return createdAt;
    } finally {
        await db.$disconnect();
    }
}

export async function getPostIdByTitle(title: Post['title']): Promise<Post['id']> {
    try {
        await db.$connect();
        const { id } = await db.post.findUniqueOrThrow({
            select: {
                id: true
            },
            where: {
                title
            }
        });
        return id;
    } finally {
        await db.$disconnect();
    }
}

export async function getPostTagsById(id: Post['id']): Promise<Tag[]> {
    try {
        await db.$connect();
        const { tags } = await db.post.findUniqueOrThrow({
            select: {
                tags: {
                    select: {
                        tagId: true
                    }
                }
            },
            where: {
                id
            }
        });
        return getTags(tags);
    } finally {
        await db.$disconnect();
    }
}

export async function getPostTagsByTitle(title: Post['title']): Promise<Tag[]> {
    try {
        await db.$connect();
        const { tags } = await db.post.findUniqueOrThrow({
            select: {
                tags: {
                    select: {
                        tagId: true
                    }
                }
            },
            where: {
                title
            }
        });
        return getTags(tags);
    } finally {
        await db.$disconnect();
    }
}

export async function getPostTitleById(id: Post['id']): Promise<Post['title']> {
    try {
        await db.$connect();
        const { title } = await db.post.findUniqueOrThrow({
            select: {
                title: true
            },
            where: {
                id
            }
        });
        return title;
    } finally {
        await db.$disconnect();
    }
}

export async function getPostUpdatedAtById(id: Post['id']): Promise<Post['updatedAt']> {
    try {
        await db.$connect();
        const { updatedAt } = await db.post.findUniqueOrThrow({
            select: {
                updatedAt: true
            },
            where: {
                id
            }
        });
        return updatedAt;
    } finally {
        await db.$disconnect();
    }
}

export async function getPostUpdatedAtByTitle(title: Post['title']): Promise<Post['updatedAt']> {
    try {
        await db.$connect();
        const { updatedAt } = await db.post.findUniqueOrThrow({
            select: {
                updatedAt: true
            },
            where: {
                title
            }
        });
        return updatedAt;
    } finally {
        await db.$disconnect();
    }
}

export async function getPosts(count: number = 0, page: number = 1): Promise<Post[]> {
    try {
        await db.$connect();
        return db.post.findMany({
            skip: count === -1 ? undefined : count * (page - 1),
            take: count === -1 ? undefined : count
        });
    } finally {
        await db.$disconnect();
    }
}
