import {
    Suspense, use
} from 'react';
import { mdxToReact } from '~/services/doc-convert.server';
import type { Route } from './+types/blog-post';
import type { Post } from 'ms0503-dev-db';

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

function Body({ body: _body }: Pick<Route.ComponentProps['loaderData'], 'body'>) {
    const body = use(_body);
    if(!body) {
        return '-';
    }
    return body;
}

function Title({ post: _post }: Pick<Route.ComponentProps['loaderData'], 'post'>) {
    const post = use(_post);
    if(!post) {
        return '指定の記事は見つかりませんでした。';
    }
    return post.title;
}

export async function loader({
    context: { cloudflare: { env: { db } } },
    params: { postId }
}: Route.LoaderArgs) {
    const post = db.prepare('select * from posts where id = ?')
        .bind(postId)
        .first<Post>();
    const body = post.then(post => post === null ? null : post.body)
        .then(body => body === null ? null : mdxToReact(body));
    return {
        body,
        post
    };
}
