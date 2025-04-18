'use strict';

// noinspection
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
// eslint-disable-next-line import-x/no-namespace, import-x/no-unresolved
import * as build from '../build/server';
import { getLoadContext } from '../load-context';
import { createPagesFunctionHandler } from '@react-router/cloudflare';

export const onRequest = createPagesFunctionHandler<Env>({
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    build,
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    getLoadContext
});
