'use strict';

import { isbot } from 'isbot';
import { renderToReadableStream } from 'react-dom/server';
import { ServerRouter } from 'react-router';
import type {
    AppLoadContext, EntryContext
} from 'react-router';

export default async function handleRequest(
    request: Request,
    responseStatusCode: number,
    responseHeaders: Headers,
    routerContext: EntryContext,
    _loadContext: AppLoadContext
) {
    const headers = responseHeaders;
    let status = responseStatusCode;
    let shellRendered = false;
    const userAgent = request.headers.get('user-agent');
    const body = await renderToReadableStream(
        <ServerRouter
            context={routerContext}
            url={request.url}
        />,
        {
            onError(error: unknown) {
                status = 500;
                if(shellRendered) {
                    console.error(error);
                }
            }
        }
    );
    // noinspection ReuseOfLocalVariableJS
    shellRendered = true;
    if((
        userAgent && isbot(userAgent)
    ) || routerContext.isSpaMode) {
        await body.allReady;
    }
    headers.set('Content-Type', 'text/html');
    return new Response(body, {
        headers,
        status
    });
}
