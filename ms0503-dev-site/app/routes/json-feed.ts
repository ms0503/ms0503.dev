'use strict';

import dayjs from 'dayjs';
import {
    BLOG_POSTS_ROOT, FEED_MAX_ITEMS
} from '~/lib/constants';
import { generateJsonFeed } from '~/lib/feed';
import type { Route } from './+types/json-feed';
import type {
    Category, Post, Tag
} from 'ms0503-dev-db';
import type { Item } from '~/lib/feed/json-feed';

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
    const tags = await (
        async () => {
            const tags: Promise<[ Post['id'], string[] ]>[] = [];
            for(const post of posts) {
                tags.push(
                    db.prepare(
                        'select tags.* from tags inner join posts_and_tags on tags.id = posts_and_tags.tag_id where posts_and_tags.post_id = ?')
                        .bind(post.id)
                        .all<Tag>()
                        .then<[ Post['id'], string[] ]>(result => [
                            post.id,
                            result.results.map(tag => tag.name)
                        ])
                );
            }
            return Promise
                .all(tags)
                .then<{ [id: Post['id']]: string[] }>(tags => tags.reduce(
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
            id: post.id.toString(10),
            tags: [
                categories[post.id]!.name,
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
