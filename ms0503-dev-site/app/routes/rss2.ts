'use strict';

import dayjs from 'dayjs';
import {
    BLOG_POSTS_ROOT, FEED_MAX_ITEMS
} from '~/lib/constants';
import { generateRss2 } from '~/lib/feed';
import type { Route } from './+types/rss2';
import type { Post } from 'ms0503-dev-db';
import type { Item } from '~/lib/feed/rss2';

export async function loader({ context: { fetchFromDB } }: Route.LoaderArgs) {
    const posts = await fetchFromDB(`/v1/post?count=${FEED_MAX_ITEMS}`).then(res => res.json<Post[]>());
    const categories = await (
        async () => {
            const categories: Promise<[ string, string ]>[] = [];
            for(const post of posts) {
                categories.push(
                    fetchFromDB(`/v1/category/${post.categoryId}/name`)
                        .then(res => res.text())
                        .then<[ string, string ]>(name => [
                            post.id,
                            name
                        ])
                );
            }
            return Promise
                .all(categories)
                .then<{ [id: string]: string }>(categories => categories.reduce(
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
            category: categories[post.id]!,
            description: post.description ?? undefined,
            link: `${BLOG_POSTS_ROOT}/${post.id}`,
            pubDate: dayjs(post.createdAt),
            title: post.title
        }
    ));
    return new Response(generateRss2(items), {
        headers: {
            'Content-Type': 'application/rss+xml; charset=UTF-8'
        }
    });
}
