import { defineConfig } from 'vite';

const host = process.env.TAURI_DEV_HOST;

export default defineConfig(async() => ({
    clearScreen: false,
    plugins: [],
    resolve: {
        conditions: [
            '@ms0503-dev/condition-ts'
        ]
    },
    server: {
        hmr: host ? {
            host,
            port: 1421,
            protocol: 'ws'
        } : undefined,
        host: host || false,
        port: 1420,
        strictPort: true,
        watch: {
            ignored: [
                '**/src-tauri/**'
            ]
        }
    }
}));
