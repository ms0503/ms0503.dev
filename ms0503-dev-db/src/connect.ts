'use strict';

import { drizzle } from 'drizzle-orm/d1';

export function connectToDB(db: D1Database) {
    return drizzle(db);
}
