'use strict';

import { reactRouter } from '@react-router/dev/vite';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

declare global {
    namespace NodeJS {
        interface ProcessEnv {
            TAURI_DEV_HOST?: string;
            TAURI_ENV_DEBUG?: string;
            TAURI_ENV_PLATFORM?: string;
        }
    }
}

const host = process.env.TAURI_DEV_HOST;

export default defineConfig({
    build: {
        minify: process.env.TAURI_ENV_DEBUG ? false : 'esbuild',
        sourcemap: !!process.env.TAURI_ENV_DEBUG,
        target: process.env.TAURI_ENV_PLATFORM === 'windows' ? 'chrome105' : 'safari13'
    },
    clearScreen: false,
    envPrefix: [
        'TAURI_ENV_*',
        'VITE_'
    ],
    plugins: [
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
        hmr: host ? {
            host,
            port: 5174,
            protocol: 'ws'
        } : undefined,
        host: host || false,
        port: 5173,
        strictPort: true,
        watch: {
            ignored: [
                'Cargo.toml',
                'Tauri.toml',
                'build.rs',
                'capabilities',
                'gen',
                'icons',
                'rustfmt.toml',
                'src'
            ]
        }
    }
});
