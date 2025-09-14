import { createRequestHandler } from 'react-router';

// eslint-disable-next-line import-x/no-unresolved
const requestHandler = createRequestHandler(() => import('virtual:react-router/server-build'), import.meta.env.MODE);

export default {
    async fetch(req, env, ctx) {
        return requestHandler(req, {
            cloudflare: {
                ctx,
                env
            },
            db: env.db,
            img: env.img,
            obj: env.obj
        });
    }
} satisfies ExportedHandler<Env>;
