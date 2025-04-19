'use strict';

import { connectToDB } from 'ms0503-dev-db';
import type { GetLoadContextFunction } from '@react-router/cloudflare';

type GetLoadContextArgs = Parameters<GetLoadContextFunction<Env>>[0];

export async function getLoadContext({ context }: GetLoadContextArgs) {
    return {
        ...context,
        db: connectToDB(context.cloudflare.env.db)
    };
}
