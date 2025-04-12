'use strict';

import type { ActionFunction, ActionFunctionArgs } from 'react-router';

export type ActionArgs<TArgs extends ActionFunctionArgs = ActionFunctionArgs, TFunc extends ActionFunction = ActionFunction> = {
    DELETE?: TFunc,
    PATCH?: TFunc,
    POST?: TFunc,
    PUT?: TFunc,
    args: TArgs
};

export function action<TArgs extends ActionFunctionArgs = ActionFunctionArgs, TFunc extends ActionFunction = ActionFunction>({ DELETE,
    PATCH,
    POST,
    PUT,
    args }: ActionArgs<TArgs, TFunc>): ReturnType<TFunc> {
    switch(args.request.method) {
        case 'DELETE':
            if(DELETE) {
                return DELETE(args) as ReturnType<TFunc>;
            }
            break;
        case 'PATCH':
            if(PATCH) {
                return PATCH(args) as ReturnType<TFunc>;
            }
            break;
        case 'POST':
            if(POST) {
                return POST(args) as ReturnType<TFunc>;
            }
            break;
        case 'PUT':
            if(PUT) {
                return PUT(args) as ReturnType<TFunc>;
            }
            break;
        default:
            break;
    }
    return new Response(null, {
        status: 405,
        statusText: 'Method Not Allowed'
    }) as ReturnType<TFunc>;
}
