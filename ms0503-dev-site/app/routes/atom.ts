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

export async function loader({ context: { fetchFromDB } }: Route.LoaderArgs) {
    const posts = await fetchFromDB(`/v1/post?count=${FEED_MAX_ITEMS}`).then(res => res.json<Post[]>());
    const categories = await (
        async () => {
            const categories: Promise<[ string, Category ]>[] = [];
            for(const post of posts) {
                categories.push(
                    fetchFromDB(`/v1/category/${post.categoryId}`)
                        .then(res => res.json<Category>())
                        .then<[ string, Category ]>(category => [
                            post.id,
                            category
                        ])
                );
            }
            return Promise
                .all(categories)
                .then<{ [id: string]: Category }>(categories => categories.reduce(
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
                '@_term': categories[post.id]!.id
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
