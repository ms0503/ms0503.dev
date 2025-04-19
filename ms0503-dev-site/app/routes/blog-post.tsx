'use strict';

import { getPostBodyById, getPostById } from 'ms0503-dev-db';
import { Suspense, use } from 'react';
import { mdxToReact } from '~/services/doc-convert.server';
import type { Route } from './+types/blog-post';

function Body({ body: _body }: Pick<Route.ComponentProps['loaderData'], 'body'>) {
    return use(_body);
}

function Title({ post: _post }: Pick<Route.ComponentProps['loaderData'], 'post'>) {
    const post = use(_post);
    return post.title;
}

export default function BlogPost({ loaderData: { body, post } }: Route.ComponentProps) {
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

export async function loader({ context: { db }, params: { postId } }: Route.LoaderArgs) {
    const post = getPostById(db, postId);
    const body = getPostBodyById(db, postId).then(raw => mdxToReact(raw));
    return {
        body,
        post
    };
}
