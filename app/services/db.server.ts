'use strict';

import { PrismaClient } from '~/generated/client';

// eslint-disable-next-line @typescript-eslint/no-namespace
declare namespace global {
    let prisma: PrismaClient | undefined;
}

export const db = (() => {
    if(process.env['NODE_ENV'] === 'production') {
        return new PrismaClient();
    }
    if(!global.prisma) {
        global.prisma = new PrismaClient();
    }
    return global.prisma;
})();
