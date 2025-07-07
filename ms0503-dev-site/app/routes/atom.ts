'use strict';

import dayjs from 'dayjs';
import {
    BLOG_POSTS_ROOT, FEED_MAX_ITEMS
} from '~/lib/constants';
import { generateAtom } from '~/lib/feed';
import type { Route } from './+types/atom';
import type {
    Category, Post
} from 'ms0503-dev-db';
import type { Entry } from '~/lib/feed/atom';

export async function loader({ context: { cloudflare: { env: { db } } } }: Route.LoaderArgs) {
    const posts = (
        await db.prepare('select * from posts limit ?').bind(FEED_MAX_ITEMS).all<Post>()
    ).results;
    const categories = await (
        async () => {
            const categories: Promise<[ Post['id'], Category ]>[] = [];
            for(const post of posts) {
                categories.push(
                    db.prepare('select * from categories where id = ?')
                        .bind(post.categoryId)
                        .first<Category>()
                        .then(cat => cat!)
                        .then<[ Post['id'], Category ]>(cat => [
                            post.id,
                            cat
                        ])
                );
            }
            return Promise
                .all(categories)
                .then<{ [id: Post['id']]: Category }>(categories => categories.reduce(
                    (acc, curr) => (
                        {
                            ...acc,
                            [curr[0]]: curr[1]
                        }
                    ),
                    {}
                ));
        }
    )();
    const entries = posts.map<Entry>(post => (
        {
            category: {
                '@_label': categories[post.id]!.name,
                '@_term': categories[post.id]!.id.toString(10)
            },
            id: `tag:ms0503.dev,${dayjs(post.updatedAt).format('YYYY-MM-DD')}:/blog/posts/${post.id}`,
            link: {
                '@_href': `${BLOG_POSTS_ROOT}/${post.id}`,
                '@_rel': 'alternate'
            },
            published: dayjs(post.createdAt).toISOString(),
            summary: post.description ?? undefined,
            title: post.title,
            updated: dayjs(post.updatedAt).toISOString()
        }
    ));
    return new Response(generateAtom(entries), {
        headers: {
            'Content-Type': 'application/atom+xml; charset=UTF-8'
        }
    });
}
