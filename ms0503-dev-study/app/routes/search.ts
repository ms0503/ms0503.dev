'use strict';

import type { Route } from './+types/search';
import type {
    Category, Post, Tag
} from 'ms0503-dev-db';

const MAX_ITEMS = 100;

export async function loader({
    context: { db },
    request: { url }
}: Route.LoaderArgs) {
    const params = new URL(url).searchParams;
    const query = params.get('q');
    const target = params.get('t') ?? 'posts';
    console.log('target:', target, 'query:', query);
    if(!query) {
        return [];
    }
    switch(target) {
        case 'categories':
            return Response.json((
                await db.prepare('select * from categories where name like ? limit ?')
                    .bind(`${query}%`, MAX_ITEMS)
                    .all<Category>()
            ).results);
        case 'posts':
            return Response.json((
                await db.prepare('select * from posts where title like ? limit ?')
                    .bind(`${query}%`, MAX_ITEMS)
                    .all<Post>()
            ).results);
        case 'tags':
            return Response.json((
                await db.prepare('select * from tags where name like ? limit ?').bind(`${query}%`, MAX_ITEMS).all<Tag>()
            ).results);
        default:
            throw new Response('Invalid search target', {
                status: 400
            });
    }
}
