'use strict';

export type Category = {
    id: number,
    name: string
};

export type Post = {
    body: string,
    categoryId: Category['id'],
    createdAt: `${number}-${number}-${number}`,
    description: string,
    id: number,
    title: string,
    updatedAt: `${number}-${number}-${number}`
};

export type PostTag = {
    postId: Post['id'],
    tagId: Tag['id']
};

export type Tag = {
    id: number,
    name: string
};
