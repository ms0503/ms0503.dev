'use strict';

import type { PlatformProxy } from 'wrangler';
import type { connectToDB } from '~/services/db.server';

type Cloudflare = Omit<PlatformProxy<Env>, 'dispose'>;

declare module 'react-router' {
    interface AppLoadContext {
        cloudflare: Cloudflare;
        db: Awaited<ReturnType<typeof connectToDB>>;
    }
}

export {};
