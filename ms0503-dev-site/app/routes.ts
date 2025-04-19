import { index, prefix, route } from '@react-router/dev/routes';
import type { RouteConfig } from '@react-router/dev/routes';

export default [
    index('./routes/top.tsx'),
    ...prefix('blog', [
        index('./routes/blog-top.tsx'),
        route('posts/:postId', './routes/blog-post.tsx')
    ])
] satisfies RouteConfig;
