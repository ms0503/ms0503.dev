'use strict';

import {
    Suspense, use
} from 'react';
import { mdxToReact } from '~/services/doc-convert.server';
import type { Route } from './+types/blog-post';
import type { Post } from 'ms0503-dev-db';

function Body({ body: _body }: Pick<Route.ComponentProps['loaderData'], 'body'>) {
    return use(_body);
}

function Title({ post: _post }: Pick<Route.ComponentProps['loaderData'], 'post'>) {
    const post = use(_post);
    return post.title;
}

export default function BlogPost({ loaderData: {
    body, post
} }: Route.ComponentProps) {
    return (
        <>
            <h1>
                <Suspense fallback="記事のタイトルを読み込み中...">
                    <Title post={post} />
                </Suspense>
            </h1>
            <Suspense fallback="記事を読み込み中...">
                <Body body={body} />
            </Suspense>
        </>
    );
}

export async function loader({
    context: { fetchFromDB }, params: { postId }
}: Route.LoaderArgs) {
    const post = fetchFromDB(`/v1/post/${postId}`).then(res => res.json<Post>());
    const body = fetchFromDB(`/v1/post/${postId}/body`)
        .then(res => res.text())
        .then(raw => mdxToReact(raw));
    return {
        body,
        post
    };
}
