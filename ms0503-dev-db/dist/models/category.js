"use strict";
import { categories } from "../schemas/categories.js";
import { postsWithoutBody } from "../schemas/posts.js";
import { eq } from "drizzle-orm";
export async function getCategories(db, count = 0, page = 1) {
    const base = db.select().from(categories);
    if (count === -1) {
        return base;
    }
    return base.limit(count).offset(count * (page - 1));
}
export async function getCategoryById(db, id) {
    return db.select().from(categories).where(eq(categories.id, id)).then(v => v[0]);
}
export async function getCategoryByName(db, name) {
    return db.select().from(categories).where(eq(categories.name, name)).then(v => v[0]);
}
export async function getCategoryIdByName(db, name) {
    return db.select({
        id: categories.id
    }).from(categories).where(eq(categories.name, name)).then(v => v[0].id);
}
export async function getCategoryNameById(db, id) {
    return db.select({
        name: categories.name
    }).from(categories).where(eq(categories.id, id)).then(v => v[0].name);
}
export async function getCategoryPostsById(db, id) {
    return db.select().from(postsWithoutBody).where(eq(postsWithoutBody.categoryId, id));
}
export async function getCategoryPostsByName(db, name) {
    return db.select().from(postsWithoutBody).where(eq(postsWithoutBody.categoryId, await getCategoryIdByName(db, name)));
}
