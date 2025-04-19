import type { DB, PostWithoutBody, Tag } from './types';
export declare function getTagById(db: DB, id: Tag['id']): Promise<Tag>;
export declare function getTagByName(db: DB, name: Tag['name']): Promise<Tag>;
export declare function getTagIdByName(db: DB, name: Tag['name']): Promise<Tag['id']>;
export declare function getTagNameById(db: DB, id: Tag['id']): Promise<Tag['name']>;
export declare function getTagPostsById(db: DB, id: Tag['id']): Promise<PostWithoutBody[]>;
export declare function getTagPostsByName(db: DB, name: Tag['name']): Promise<PostWithoutBody[]>;
export declare function getTags(db: DB, count?: number, page?: number): Promise<Tag[]>;
