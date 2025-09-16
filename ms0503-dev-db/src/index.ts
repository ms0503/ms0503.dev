export namespace Raw {
    export type Category = {
        id: number,
        name: string
    };

    export type Post = {
        body: string,
        category_id: Category['id'],
        created_at: `${number}-${number}-${number}`,
        description: string,
        id: number,
        title: string,
        updated_at: `${number}-${number}-${number}`
    };

    export type PostTag = {
        post_id: Post['id'],
        tag_id: Tag['id']
    };

    export type Tag = {
        id: number,
        name: string
    };
}

export type Category = {
    id: Raw.Category['id'],
    name: Raw.Category['name']
};

export type Post = {
    body: Raw.Post['body'],
    categoryId: Raw.Post['category_id'],
    createdAt: Raw.Post['created_at'],
    description: Raw.Post['description'],
    id: Raw.Post['id'],
    title: Raw.Post['title'],
    updatedAt: Raw.Post['updated_at']
};

export type PostTag = {
    postId: Raw.PostTag['post_id'],
    tagId: Raw.PostTag['tag_id']
};

export type Tag = {
    id: Raw.Tag['id'],
    name: Raw.Tag['name']
};
