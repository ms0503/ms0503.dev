'use strict';

import { db } from '~/services/db.server';
import type { Category, Post } from '~/generated/client';

export async function getCategories(count: number = 0, page: number = 1): Promise<Category[]> {
    try {
        await db.$connect();
        return db.category.findMany({
            skip: count === -1 ? undefined : count * (page - 1),
            take: count === -1 ? undefined : count
        });
    } finally {
        await db.$disconnect();
    }
}

export async function getCategoryById(id: Category['id']): Promise<Category> {
    try {
        await db.$connect();
        return db.category.findUniqueOrThrow({
            where: {
                id
            }
        });
    } finally {
        await db.$disconnect();
    }
}

export async function getCategoryByName(name: Category['name']): Promise<Category> {
    try {
        await db.$connect();
        return db.category.findUniqueOrThrow({
            where: {
                name
            }
        });
    } finally {
        await db.$disconnect();
    }
}

export async function getCategoryIdByName(name: Category['name']): Promise<Category['id']> {
    try {
        await db.$connect();
        const { id } = await db.category.findUniqueOrThrow({
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

export async function getCategoryNameById(id: Category['id']): Promise<Category['name']> {
    try {
        await db.$connect();
        const { name } = await db.category.findUniqueOrThrow({
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

export async function getCategoryPostsById(id: Category['id']): Promise<Post[]> {
    try {
        await db.$connect();
        const { posts } = await db.category.findUniqueOrThrow({
            select: {
                posts: true
            },
            where: {
                id
            }
        });
        return posts;
    } finally {
        await db.$disconnect();
    }
}

export async function getCategoryPostsByName(name: Category['name']): Promise<Post[]> {
    try {
        await db.$connect();
        const { posts } = await db.category.findUniqueOrThrow({
            select: {
                posts: true
            },
            where: {
                name
            }
        });
        return posts;
    } finally {
        await db.$disconnect();
    }
}
