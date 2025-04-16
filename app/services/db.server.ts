'use strict';

// noinspection ES6PreferShortImport
import { PrismaD1 } from '@prisma/adapter-d1';
import { PrismaClient } from '@prisma/client/edge';

// eslint-disable-next-line @typescript-eslint/no-namespace
declare namespace global {
    let prisma: PrismaClient | undefined;
}

export async function connectToDB(db: D1Database) {
    const adapter = new PrismaD1(db);
    if(process.env['NODE_ENV'] === 'production') {
        return new PrismaClient({
            adapter
        });
    }
    if(!global.prisma) {
        global.prisma = new PrismaClient({
            adapter
        });
    }
    return global.prisma;
}
