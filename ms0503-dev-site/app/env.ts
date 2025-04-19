'use strict';

import type { connectToDB } from 'ms0503-dev-db';
import type { PlatformProxy } from 'wrangler';

type Cloudflare = Omit<PlatformProxy<Env>, 'dispose'>;

declare module 'react-router' {
    interface AppLoadContext {
        cloudflare: Cloudflare;
        db: ReturnType<typeof connectToDB>;
    }
}

export {};
