'use strict';

import { config as dotenvConfig } from 'dotenv';
import { defineConfig } from 'drizzle-kit';

dotenvConfig();

declare global {
    // eslint-disable-next-line @typescript-eslint/no-namespace
    namespace NodeJS {
        interface ProcessEnv {
            CLOUDFLARE_ACCOUNT_ID: string;
            CLOUDFLARE_D1_TOKEN: string;
            CLOUDFLARE_DATABASE_ID: string;
        }
    }
}

export default defineConfig({
    dbCredentials: {
        accountId: process.env.CLOUDFLARE_ACCOUNT_ID,
        databaseId: process.env.CLOUDFLARE_DATABASE_ID,
        token: process.env.CLOUDFLARE_D1_TOKEN
    },
    dialect: 'sqlite',
    driver: 'd1-http',
    out: './migrations',
    schema: './src/schemas'
});
