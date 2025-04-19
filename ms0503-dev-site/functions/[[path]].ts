/* eslint-disable */
'use strict';

// @ts-ignore
import * as build from '../build/server';
import { getLoadContext } from '../load-context';
import { createPagesFunctionHandler } from '@react-router/cloudflare';

export const onRequest = createPagesFunctionHandler<Env>({
    // @ts-ignore
    build,
    // @ts-ignore
    getLoadContext
});
