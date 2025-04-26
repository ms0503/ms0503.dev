'use strict';

import type { PlatformProxy } from 'wrangler';

type Cloudflare = Omit<PlatformProxy<Env>, 'dispose'>;

declare module 'react-router' {
    interface AppLoadContext {
        cloudflare: Cloudflare;
        fetchFromDB: (input: string, init?: RequestInit) => Promise<Response>;
    }
}

export {};
