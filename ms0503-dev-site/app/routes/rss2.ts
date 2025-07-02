'use strict';

import dayjs from 'dayjs';
import {
    BLOG_POSTS_ROOT, FEED_MAX_ITEMS
} from '~/lib/constants';
import { generateRss2 } from '~/lib/feed';
import type { Route } from './+types/rss2';
import type {
    Category, Post
} from 'ms0503-dev-db';
import type { Item } from '~/lib/feed/rss2';

export async function loader({ context: { db } }: Route.LoaderArgs) {
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
    const items = posts.map<Item>(post => (
        {
            category: categories[post.id]!.name,
            description: post.description ?? undefined,
            link: `${BLOG_POSTS_ROOT}/${post.id}`,
            pubDate: dayjs(post.createdAt).toString(),
            title: post.title
        }
    ));
    return new Response(generateRss2(items), {
        headers: {
            'Content-Type': 'application/rss+xml; charset=UTF-8'
        }
    });
}
