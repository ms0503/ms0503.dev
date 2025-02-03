'use strict';

import { RemixServer } from '@remix-run/react';
import { isbot } from 'isbot';
import { renderToReadableStream } from 'react-dom/server';
import type { AppLoadContext, EntryContext } from '@remix-run/cloudflare';

const ABORT_DELAY = 5000;

export default async function handleRequest(
    request: Request,
    responseStatusCode: number,
    responseHeaders: Headers,
    remixContext: EntryContext,
    _loadContext: AppLoadContext
) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), ABORT_DELAY);
    const body = await renderToReadableStream(
        <RemixServer
            abortDelay={ABORT_DELAY}
            context={remixContext}
            url={request.url}
        />,
        {
            onError(error: unknown) {
                if(!controller.signal.aborted) {
                    // Log streaming rendering errors from inside the shell
                    console.error(error);
                }
                responseStatusCode = 500;
            },
            signal: controller.signal
        }
    );
    body.allReady.then(() => clearTimeout(timeoutId));
    if(isbot(request.headers.get('user-agent') || '')) {
        await body.allReady;
    }
    responseHeaders.set('Content-Type', 'text/html');
    return new Response(body, {
        headers: responseHeaders,
        status: responseStatusCode
    });
}
