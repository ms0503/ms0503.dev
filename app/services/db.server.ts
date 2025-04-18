'use strict';

import { drizzle } from 'drizzle-orm/d1';

// eslint-disable-next-line @typescript-eslint/no-namespace
declare namespace global {
    let client: ReturnType<typeof drizzle>;
}

export async function connectToDB(db: D1Database) {
    if(process.env['NODE_ENV'] === 'production') {
        return drizzle(db);
    }
    if(!global.client) {
        global.client = drizzle(db);
    }
    return global.client;
}
