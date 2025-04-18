'use strict';

import { categories } from '../../drizzle/schemas/categories';
import { postsWithoutBody } from '../../drizzle/schemas/posts';
import { eq } from 'drizzle-orm';
import type { AppLoadContext } from 'react-router';
import type { Category, PostWithoutBody } from '~/models/types';

export async function getCategories(db: AppLoadContext['db'], count: number = 0, page: number = 1): Promise<Category[]> {
    const base = db.select().from(categories);
    if(count === -1) {
        return base;
    }
    return base.limit(count).offset(count * (page - 1));
}

export async function getCategoryById(db: AppLoadContext['db'], id: Category['id']): Promise<Category> {
    return db.select().from(categories).where(eq(categories.id, id)).then(v => v[0]);
}

export async function getCategoryByName(db: AppLoadContext['db'], name: Category['name']): Promise<Category> {
    return db.select().from(categories).where(eq(categories.name, name)).then(v => v[0]);
}

export async function getCategoryIdByName(db: AppLoadContext['db'], name: Category['name']): Promise<Category['id']> {
    return db.select({
        id: categories.id
    }).from(categories).where(eq(categories.name, name)).then(v => v[0].id);
}

export async function getCategoryNameById(db: AppLoadContext['db'], id: Category['id']): Promise<Category['name']> {
    return db.select({
        name: categories.name
    }).from(categories).where(eq(categories.id, id)).then(v => v[0].name);
}

export async function getCategoryPostsById(db: AppLoadContext['db'], id: Category['id']): Promise<PostWithoutBody[]> {
    return db.select().from(postsWithoutBody).where(eq(postsWithoutBody.categoryId, id));
}

export async function getCategoryPostsByName(db: AppLoadContext['db'], name: Category['name']): Promise<PostWithoutBody[]> {
    return db.select().from(postsWithoutBody).where(eq(postsWithoutBody.categoryId, await getCategoryIdByName(db, name)));
}
