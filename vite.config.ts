'use strict';

import { vitePlugin as remix, cloudflareDevProxyVitePlugin as remixCloudflareDevProxy } from '@remix-run/dev';
import { flatRoutes } from 'remix-flat-routes';
import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

declare module '@remix-run/cloudflare' {
    interface Future {
        v3_singleFetch: true;
    }
}

export default defineConfig({
    plugins: [
        remix({
            future: {
                v3_fetcherPersist: true,
                v3_lazyRouteDiscovery: true,
                v3_relativeSplatPath: true,
                v3_singleFetch: true,
                v3_throwAbortReason: true
            },
            ignoredRouteFiles: [
                '**/*'
            ],
            routes: async defineRoutes => flatRoutes('routes', defineRoutes, {
                ignoredRouteFiles: [
                    '**/.*'
                ]
            })
        }),
        remixCloudflareDevProxy(),
        tsconfigPaths()
    ]
});
