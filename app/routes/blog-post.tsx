'use strict';

import { getPostBodyById, getPostById } from '~/models/post';
import { mdxToReact } from '~/services/doc-convert.server';
import type { Route } from './+types/blog-post';

export default function BlogPost({ loaderData: { body, post } }: Route.ComponentProps) {
    return (
        <>
            <h1>{post.title}</h1>
            {body}
        </>
    );
}

export async function loader({ context: { db }, params: { postId } }: Route.LoaderArgs) {
    const post = await getPostById(db, postId);
    const body = await getPostBodyById(db, postId).then(raw => mdxToReact(raw));
    return {
        body,
        post
    };
}
