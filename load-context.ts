'use strict';

// noinspection ES6PreferShortImport
import { connectToDB } from './app/services/db.server';
import type { GetLoadContextFunction } from '@react-router/cloudflare';

type GetLoadContextArgs = Parameters<GetLoadContextFunction<Env>>[0];

export async function getLoadContext({ context }: GetLoadContextArgs) {
    return {
        ...context,
        db: await connectToDB(context.cloudflare.env.db)
    };
}
