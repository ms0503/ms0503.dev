'use strict';

import type { GetLoadContextFunction } from '@react-router/cloudflare';

type GetLoadContextArgs = Parameters<GetLoadContextFunction<Env>>[0];

export async function getLoadContext({ context }: GetLoadContextArgs) {
    return {
        ...context,
        fetchFromDB: async (
            input: string,
            init?: RequestInit
        ): Promise<Response> => context.cloudflare.env.db.fetch(`https://db.api.ms0503.dev${input}`, init)
    };
}
