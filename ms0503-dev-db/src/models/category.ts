'use strict';

import { categories } from '../schemas/categories';
import { postsWithoutBody } from '../schemas/posts';
import { eq } from 'drizzle-orm';
import type { Category, DB, PostWithoutBody } from './types';

export async function getCategories(db: DB, count: number = 0, page: number = 1): Promise<Category[]> {
    const base = db.select().from(categories);
    if(count === -1) {
        return base;
    }
    return base.limit(count).offset(count * (page - 1));
}

export async function getCategoryById(db: DB, id: Category['id']): Promise<Category> {
    return db.select().from(categories).where(eq(categories.id, id)).then(v => v[0]);
}

export async function getCategoryByName(db: DB, name: Category['name']): Promise<Category> {
    return db.select().from(categories).where(eq(categories.name, name)).then(v => v[0]);
}

export async function getCategoryIdByName(db: DB, name: Category['name']): Promise<Category['id']> {
    return db.select({
        id: categories.id
    }).from(categories).where(eq(categories.name, name)).then(v => v[0].id);
}

export async function getCategoryNameById(db: DB, id: Category['id']): Promise<Category['name']> {
    return db.select({
        name: categories.name
    }).from(categories).where(eq(categories.id, id)).then(v => v[0].name);
}

export async function getCategoryPostsById(db: DB, id: Category['id']): Promise<PostWithoutBody[]> {
    return db.select().from(postsWithoutBody).where(eq(postsWithoutBody.categoryId, id));
}

export async function getCategoryPostsByName(db: DB, name: Category['name']): Promise<PostWithoutBody[]> {
    return db.select().from(postsWithoutBody).where(eq(postsWithoutBody.categoryId, await getCategoryIdByName(db, name)));
}
