'use strict';

import type { PlatformProxy } from 'wrangler';

type Cloudflare = Omit<PlatformProxy<Cloudflare.Env>, 'dispose'>;

declare module 'react-router' {
    interface AppLoadContext {
        cloudflare: Cloudflare;
    }
}

export {};
