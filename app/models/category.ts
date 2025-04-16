'use strict';

import type { AppLoadContext } from 'react-router';
import type { Category, Post } from '~/generated/client';

export async function getCategories(db: AppLoadContext['db'], count: number = 0, page: number = 1): Promise<Category[]> {
    return db.category.findMany({
        skip: count === -1 ? undefined : count * (page - 1),
        take: count === -1 ? undefined : count
    });
}

export async function getCategoryById(db: AppLoadContext['db'], id: Category['id']): Promise<Category> {
    return db.category.findUniqueOrThrow({
        where: {
            id
        }
    });
}

export async function getCategoryByName(db: AppLoadContext['db'], name: Category['name']): Promise<Category> {
    return db.category.findUniqueOrThrow({
        where: {
            name
        }
    });
}

export async function getCategoryIdByName(db: AppLoadContext['db'], name: Category['name']): Promise<Category['id']> {
    const { id } = await db.category.findUniqueOrThrow({
        select: {
            id: true
        },
        where: {
            name
        }
    });
    return id;
}

export async function getCategoryNameById(db: AppLoadContext['db'], id: Category['id']): Promise<Category['name']> {
    const { name } = await db.category.findUniqueOrThrow({
        select: {
            name: true
        },
        where: {
            id
        }
    });
    return name;
}

export async function getCategoryPostsById(db: AppLoadContext['db'], id: Category['id']): Promise<Post[]> {
    const { posts } = await db.category.findUniqueOrThrow({
        select: {
            posts: true
        },
        where: {
            id
        }
    });
    return posts;
}

export async function getCategoryPostsByName(db: AppLoadContext['db'], name: Category['name']): Promise<Post[]> {
    const { posts } = await db.category.findUniqueOrThrow({
        select: {
            posts: true
        },
        where: {
            name
        }
    });
    return posts;
}
