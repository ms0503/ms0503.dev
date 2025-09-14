import { data } from 'react-router';
import type { Route } from './+types/search';
import type {
    Category, Tag
} from 'ms0503-dev-db';

const MAX_ITEMS = 100;

export async function loader({
    context: { cloudflare: { env: {
        db,
        obj
    } } },
    request
}: Route.LoaderArgs) {
    const session = await sessionStorage.getSession(request.headers.get('cookie'));
    const user = session.get('user');
    if(!user) {
        throw data(null, 401);
    }
    const params = new URL(request.url).searchParams;
    const query = params.get('q');
    const target = params.get('t') ?? 'posts';
    if(!query) {
        return Response.json([]);
    }
    switch(target) {
        case 'categories':
            return db.prepare('select * from categories where name like ? limit ?')
                .bind(`${query}%`, MAX_ITEMS)
                .all<Category>()
                .then(result => result.results)
                .then(results => Response.json(results));
        case 'images':
            return obj.list({
                limit: MAX_ITEMS,
                prefix: query
            }).then(objects => Response.json(objects.objects.map(object => object.key)));
        case 'posts':
            return db.prepare('select * from posts where title like ? limit ?')
                .bind(`${query}%`, MAX_ITEMS)
                .all<Category>()
                .then(result => result.results)
                .then(results => Response.json(results));
        case 'tags':
            return db.prepare('select * from tags where name like ? limit ?')
                .bind(`${query}%`, MAX_ITEMS)
                .all<Tag>()
                .then(result => result.results)
                .then(results => Response.json(results));
        default:
            throw data('Invalid search target', 400);
    }
}
