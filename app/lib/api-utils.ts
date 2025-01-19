'use strict';

import type { ActionFunction, ActionFunctionArgs } from '@remix-run/cloudflare';

export type ActionArgs = {
    DELETE?: ActionFunction,
    PATCH?: ActionFunction,
    POST?: ActionFunction,
    PUT?: ActionFunction,
    args: ActionFunctionArgs
};

export function action({ DELETE, PATCH, POST, PUT, args }: ActionArgs): ReturnType<ActionFunction> {
    switch(args.request.method) {
        case 'DELETE':
            if(DELETE) {
                return DELETE(args);
            }
            break;
        case 'PATCH':
            if(PATCH) {
                return PATCH(args);
            }
            break;
        case 'POST':
            if(POST) {
                return POST(args);
            }
            break;
        case 'PUT':
            if(PUT) {
                return PUT(args);
            }
            break;
        default:
            break;
    }
    return new Response(null, {
        status: 405,
        statusText: 'Method Not Allowed'
    });
}
