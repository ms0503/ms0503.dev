'use strict';

import { cloudflare } from '@cloudflare/vite-plugin';
import { reactRouter } from '@react-router/dev/vite';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
    plugins: [
        cloudflare({
            viteEnvironment: {
                name: 'ssr'
            }
        }),
        reactRouter(),
        tailwindcss(),
        tsconfigPaths()
    ],
    resolve: {
        conditions: [
            '@ms0503-dev/condition-ts'
        ]
    },
    server: {
        cors: true,
        headers: {
            'Access-Control-Allow-Methods': 'GET, OPTIONS, POST',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Max-Age': '604800',
            'Content-Security-Policy': 'default-src \'self\'; connect-src \'self\'; font-src \'self\' https://fonts.gstatic.com',
            'Referrer-Policy': 'origin-when-crossorigin',
            'X-Content-Type-Options': 'nosniff',
            'X-DNS-Prefetch-Control': 'on',
            'X-UA-Compatible': 'IE=edge',
            'X-XSS-Protection': '1; mode=block'
        }
    }
});
