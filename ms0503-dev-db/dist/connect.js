'use strict';
import { drizzle } from 'drizzle-orm/d1';
export function connectToDB(db) {
    return drizzle(db);
}
