import type { Category, DB, PostWithoutBody } from './types';
export declare function getCategories(db: DB, count?: number, page?: number): Promise<Category[]>;
export declare function getCategoryById(db: DB, id: Category['id']): Promise<Category>;
export declare function getCategoryByName(db: DB, name: Category['name']): Promise<Category>;
export declare function getCategoryIdByName(db: DB, name: Category['name']): Promise<Category['id']>;
export declare function getCategoryNameById(db: DB, id: Category['id']): Promise<Category['name']>;
export declare function getCategoryPostsById(db: DB, id: Category['id']): Promise<PostWithoutBody[]>;
export declare function getCategoryPostsByName(db: DB, name: Category['name']): Promise<PostWithoutBody[]>;
