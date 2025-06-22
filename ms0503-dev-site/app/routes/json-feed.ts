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

export async function loader({ context: { db } }: Route.LoaderArgs) {
    const posts = (
        await db.prepare('select * from posts limit ?').bind(FEED_MAX_ITEMS).all<Post>()
    ).results;
    const categories = await (
        async () => {
            const categories: Promise<[ string, Category ]>[] = [];
            for(const post of posts) {
                categories.push(
                    db.prepare('select * from categories where id = ?')
                        .bind(post.categoryId)
                        .first<Category>()
                        .then(cat => cat!)
                        .then<[ string, Category ]>(cat => [
                            post.id,
                            cat
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
    const tags = await (
        async () => {
            const tags: Promise<[ string, string[] ]>[] = [];
            for(const post of posts) {
                tags.push(
                    db.prepare(
                        'select tags.* from tags inner join posts_and_tags on tags.id = posts_and_tags.tag_id where posts_and_tags.post_id = ?')
                        .bind(post.id)
                        .all<Tag>()
                        .then<[ string, string[] ]>(result => [
                            post.id,
                            result.results.map(tag => tag.name)
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
