'use strict';

import type { GetLoadContextFunction } from '@react-router/cloudflare';

type GetLoadContextArgs = Parameters<GetLoadContextFunction<Env>>[0];

export async function getLoadContext({ context }: GetLoadContextArgs) {
    return {
        ...context
    };
}
