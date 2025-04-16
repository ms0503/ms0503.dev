'use strict';

import { getPostBodyById, getPostById } from '~/models/post';
import type { Route } from './+types/blog-post';

export default function BlogPost({ loaderData: { body, post } }: Route.ComponentProps) {
    return (
        <>
            <h1>{post.title}</h1>
            {body}
        </>
    );
}

export async function loader({ params: { postId } }: Route.LoaderArgs) {
    const post = await getPostById(postId);
    const body = await getPostBodyById(postId);
    return {
        body,
        post
    };
}
