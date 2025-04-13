'use strict';

import { PrismaD1HTTP } from '@prisma/adapter-d1';
import { config as dotenvConfig } from 'dotenv';
import { join } from 'node:path';
import type { PrismaConfig } from 'prisma';

dotenvConfig();

type Env = {
    CLOUDFLARE_ACCOUNT_ID: string,
    CLOUDFLARE_D1_TOKEN: string,
    CLOUDFLARE_DATABASE_ID: string
};

export default {
    earlyAccess: true,
    migrate: {
        async adapter(env) {
            return new PrismaD1HTTP({
                CLOUDFLARE_ACCOUNT_ID: env.CLOUDFLARE_ACCOUNT_ID,
                CLOUDFLARE_D1_TOKEN: env.CLOUDFLARE_D1_TOKEN,
                CLOUDFLARE_DATABASE_ID: env.CLOUDFLARE_DATABASE_ID
            });
        }
    },
    schema: join('prisma', 'schema.prisma')
} satisfies PrismaConfig<Env>;
