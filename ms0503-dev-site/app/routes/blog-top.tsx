'use strict';

import { use } from 'react';
import { Link } from 'react-router';
import type { Route } from './+types/blog-top';
import type { Post } from 'ms0503-dev-db';

const MAX_RECENT_POSTS = 10;

export default function BlogTop({ loaderData: { recentPosts: _recentPosts } }: Route.ComponentProps) {
    const recentPosts = use(_recentPosts);
    return (
        <>
            <h1>技術ブログ</h1>
            <h2>最近の投稿</h2>
            <div className="flex flex-row flex-wrap gap-4">
                {recentPosts.map(post => (
                    <Link
                        className="
                            border flex flex-col gap-2 px-4 py-3 rounded-xl text-inherit transition-colors
                            border-text
                            hover:bg-bg1
                            dark:border-text-dark
                            dark:hover:bg-bg1-dark
                        "
                        key={post.id}
                        to={`/blog/posts/${post.id}`}
                    >
                        <div className="text-2xl">
                            {post.title}
                        </div>
                        <div>
                            {post.description ? post.description : '(説明文はありません)'}
                        </div>
                    </Link>
                ))}
            </div>
        </>
    );
}

export async function loader({ context: { db } }: Route.LoaderArgs) {
    const recentPosts = db.prepare('select description, id, title from posts order by updated_at desc limit ?')
        .bind(MAX_RECENT_POSTS)
        .all<Pick<Post, 'description' | 'id' | 'title'>>()
        .then(result => result.results);
    return {
        recentPosts
    };
}
