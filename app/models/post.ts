'use strict';

import type { AppLoadContext } from 'react-router';
import type { Category, Post, PostAndTag, Tag } from '~/generated/client';

async function getTags(db: AppLoadContext['db'], postAndTags: Pick<PostAndTag, 'tagId'>[]): Promise<Tag[]> {
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

export async function getPostBodyById(db: AppLoadContext['db'], id: Post['id']): Promise<Post['body']> {
    const { body } = await db.post.findUniqueOrThrow({
        select: {
            body: true
        },
        where: {
            id
        }
    });
    return body;
}

export async function getPostBodyByTitle(db: AppLoadContext['db'], title: Post['title']): Promise<Post['body']> {
    const { body } = await db.post.findUniqueOrThrow({
        select: {
            body: true
        },
        where: {
            title
        }
    });
    return body;
}

export async function getPostById(db: AppLoadContext['db'], id: Post['id']): Promise<PostWithoutBody> {
    return db.post.findUniqueOrThrow({
        omit: {
            body: true
        },
        where: {
            id
        }
    });
}

export async function getPostByTitle(db: AppLoadContext['db'], title: Post['title']): Promise<PostWithoutBody> {
    return db.post.findUniqueOrThrow({
        omit: {
            body: true
        },
        where: {
            title
        }
    });
}

export async function getPostCategoryById(db: AppLoadContext['db'], id: Post['id']): Promise<Category> {
    const { category } = await db.post.findUniqueOrThrow({
        select: {
            category: true
        },
        where: {
            id
        }
    });
    return category;
}

export async function getPostCategoryByTitle(db: AppLoadContext['db'], title: Post['title']): Promise<Category> {
    const { category } = await db.post.findUniqueOrThrow({
        select: {
            category: true
        },
        where: {
            title
        }
    });
    return category;
}

export async function getPostCategoryIdById(db: AppLoadContext['db'], id: Post['id']): Promise<Post['categoryId']> {
    const { categoryId } = await db.post.findUniqueOrThrow({
        where: {
            id
        }
    });
    return categoryId;
}

export async function getPostCategoryIdByTitle(db: AppLoadContext['db'], title: Post['title']): Promise<Post['categoryId']> {
    const { categoryId } = await db.post.findUniqueOrThrow({
        where: {
            title
        }
    });
    return categoryId;
}

export async function getPostCreatedAtById(db: AppLoadContext['db'], id: Post['id']): Promise<Post['createdAt']> {
    const { createdAt } = await db.post.findUniqueOrThrow({
        select: {
            createdAt: true
        },
        where: {
            id
        }
    });
    return createdAt;
}

export async function getPostCreatedAtByTitle(db: AppLoadContext['db'], title: Post['title']): Promise<Post['createdAt']> {
    const { createdAt } = await db.post.findUniqueOrThrow({
        select: {
            createdAt: true
        },
        where: {
            title
        }
    });
    return createdAt;
}

export async function getPostIdByTitle(db: AppLoadContext['db'], title: Post['title']): Promise<Post['id']> {
    const { id } = await db.post.findUniqueOrThrow({
        select: {
            id: true
        },
        where: {
            title
        }
    });
    return id;
}

export async function getPostTagsById(db: AppLoadContext['db'], id: Post['id']): Promise<Tag[]> {
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
    return getTags(db, tags);
}

export async function getPostTagsByTitle(db: AppLoadContext['db'], title: Post['title']): Promise<Tag[]> {
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
    return getTags(db, tags);
}

export async function getPostTitleById(db: AppLoadContext['db'], id: Post['id']): Promise<Post['title']> {
    const { title } = await db.post.findUniqueOrThrow({
        select: {
            title: true
        },
        where: {
            id
        }
    });
    return title;
}

export async function getPostUpdatedAtById(db: AppLoadContext['db'], id: Post['id']): Promise<Post['updatedAt']> {
    const { updatedAt } = await db.post.findUniqueOrThrow({
        select: {
            updatedAt: true
        },
        where: {
            id
        }
    });
    return updatedAt;
}

export async function getPostUpdatedAtByTitle(db: AppLoadContext['db'], title: Post['title']): Promise<Post['updatedAt']> {
    const { updatedAt } = await db.post.findUniqueOrThrow({
        select: {
            updatedAt: true
        },
        where: {
            title
        }
    });
    return updatedAt;
}

export async function getPosts(db: AppLoadContext['db'], count: number = 0, page: number = 1): Promise<Post[]> {
    return db.post.findMany({
        skip: count === -1 ? undefined : count * (page - 1),
        take: count === -1 ? undefined : count
    });
}
