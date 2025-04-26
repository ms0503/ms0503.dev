'use strict';

export type Category = {
    id: string,
    name: string
};

export type Post = {
    categoryId: Category['id'],
    createdAt: string,
    description?: null | string,
    id: string,
    title: string,
    updatedAt: string
};

export type PostAndTag = {
    postId: Post['id'],
    tagId: Tag['id']
};

export type PostBody = {
    body: string,
    id: string
};

export type Tag = {
    id: string,
    name: string
};
