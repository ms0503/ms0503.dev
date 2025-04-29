'use strict';

import { drizzle } from 'drizzle-orm/sqlite-proxy';
import type { GetLoadContextFunction } from '@react-router/express';

declare global {

    namespace NodeJS {
        interface ProcessEnv {
            CLOUDFLARE_ACCOUNT_ID: string;
            CLOUDFLARE_D1_TOKEN: string;
            CLOUDFLARE_DATABASE_ID: string;
        }
    }
}

const D1_API_BASE_URL = `https://api.cloudflare.com/client/v4/accounts/${process.env.CLOUDFLARE_ACCOUNT_ID}/d1/database/${process.env.CLOUDFLARE_DATABASE_ID}`;

type D1ResponseInfo = {
    code: number,
    documentation_url?: string,
    message: string,
    source?: {
        pointer?: string
    }
};

type D1QueryResult = {
    meta?: {
        changed_db?: boolean,
        changes?: number,
        duration?: number,
        last_row_id?: number,
        rows_read?: number,
        rows_written?: number,
        served_by_primary?: boolean,
        served_by_region?: 'APAC' | 'EEUR' | 'ENAM' | 'OC' | 'WEUR' | 'WNAM',
        size_after?: number,
        timings?: {
            sql_duration_ms?: number
        }
    },
    results?: unknown[],
    success?: boolean
};

type D1ApiResponse = {
    errors: D1ResponseInfo[],
    messages: D1ResponseInfo[],
    result: D1QueryResult[],
    success: true
};

async function d1HttpDriver(sql: string, params: unknown[], method: 'all' | 'get' | 'run' | 'values') {
    if(method === 'values') {
        // noinspection TailRecursionJS
        return d1HttpDriver(sql, params, 'all');
    }
    const res = await fetch(`${D1_API_BASE_URL}/query`, {
        body: JSON.stringify({
            method,
            params,
            sql
        }),
        headers: {
            Authorization: `Bearer ${process.env.CLOUDFLARE_D1_TOKEN}`,
            'Content-Type': 'application/json'
        },
        method: 'POST'
    });
    const data = await res.json<D1ApiResponse>();
    if(0 < data.errors.length || !data.success) {
        throw new Error(`Error from sqlite proxy server: \n${JSON.stringify(data)}`);
    }
    const queryResult = data.result[0];
    if(!queryResult.success) {
        throw new Error(`Error from sqlite proxy server: \n${JSON.stringify(data)}`);
    }
    return {
        rows: queryResult.results.map(row => Object.values(row))
    };
}

type GetLoadContextArgs = Parameters<GetLoadContextFunction>;

export function getLoadContext(_req: GetLoadContextArgs[0], _res: GetLoadContextArgs[1]): ReturnType<GetLoadContextFunction> {
    return {
        db: drizzle(d1HttpDriver)
    };
}
