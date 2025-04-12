'use strict';

// eslint-disable-next-line import-x/no-namespace
import * as build from '../build/server';
import { createPagesFunctionHandler } from '@react-router/cloudflare';

export const onRequest = createPagesFunctionHandler({
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    build
});
