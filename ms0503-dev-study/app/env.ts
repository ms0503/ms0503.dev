'use strict';

import type { PlatformProxy } from 'wrangler';

type Cloudflare = Omit<PlatformProxy<Env>, 'dispose'>;

declare module 'react-router' {
    interface AppLoadContext {
        cloudflare: Pick<Cloudflare, 'ctx' | 'env'>;
        db: D1Database;
    }
}

export {};
