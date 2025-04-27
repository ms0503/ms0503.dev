'use strict';

import dayjs from 'dayjs';
import {
    BLOG_POSTS_ROOT, FEED_MAX_ITEMS
} from '~/lib/constants';
import { generateJsonFeed } from '~/lib/feed';
import type { Route } from './+types/json-feed';
import type {
    Post, Tag
} from 'ms0503-dev-db';
import type { Item } from '~/lib/feed/json-feed';

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
    const tags = await (
        async () => {
            const tags: Promise<[ string, string[] ]>[] = [];
            for(const post of posts) {
                tags.push(
                    fetchFromDB(`/v1/post/${post.id}/tags`)
                        .then(res => res.json<Tag[]>())
                        .then(tags => tags.map(tag => tag.name))
                        .then<[ string, string[] ]>(tags => [
                            post.id,
                            tags
                        ])
                );
            }
            return Promise
                .all(tags)
                .then<{ [id: string]: string[] }>(tags => tags.reduce(
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
            date_modified: dayjs(post.updatedAt).toISOString(),
            date_published: dayjs(post.createdAt).toISOString(),
            id: post.id,
            tags: [
                categories[post.id]!,
                ...tags[post.id]!
            ],
            title: post.title,
            url: `${BLOG_POSTS_ROOT}/${post.id}`
        }
    ));
    return Response.json(generateJsonFeed(items), {
        headers: {
            'Content-Type': 'application/feed+json; charset=UTF-8'
        }
    });
}
