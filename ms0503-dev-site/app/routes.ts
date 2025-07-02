import {
    index, prefix, route
} from '@react-router/dev/routes';
import type { RouteConfig } from '@react-router/dev/routes';

export default [
    index('./routes/top.tsx'),
    route('atom.xml', './routes/atom.ts'),
    route('feed.json', './routes/json-feed.ts'),
    route('rss2.xml', './routes/rss2.ts'),
    route('social', './routes/social.tsx'),
    ...prefix('blog', [
        index('./routes/blog-top.tsx'),
        route('posts/:postId', './routes/blog-post.tsx')
    ])
] satisfies RouteConfig;
