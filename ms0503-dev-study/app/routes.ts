import {
    index, layout, route
} from '@react-router/dev/routes';
import type { RouteConfig } from '@react-router/dev/routes';

export default [
    layout('./layouts/app.tsx', [
        index('./routes/top.tsx'),
        route('images', './routes/images-top.tsx'),
        route('images/:name', './routes/images-view.tsx'),
        route('posts/:id/edit', './routes/posts-edit.tsx'),
        route('posts/new', './routes/posts-new.tsx')
    ]),
    layout('./layouts/auth.tsx', [
        route('login', './routes/login.tsx')
    ]),
    route('search', './routes/search.ts')
] satisfies RouteConfig;
