'use strict';

import { createCookieSessionStorage } from 'react-router';
import { Authenticator } from 'remix-auth';
import { FormStrategy } from 'remix-auth-form';

export const sessionStorage = createCookieSessionStorage({
    cookie: {
        httpOnly: true,
        name: '__session',
        path: '/',
        sameSite: 'lax',
        secrets: [
            process.env['SESSION_SECRET']!
        ],
        secure: process.env.NODE_ENV === 'production'
    }
});

const authenticator = new Authenticator<true>();

authenticator.use(new FormStrategy(async ({ form }): Promise<true> => {
    const token = form.get('token') as string;
    if(!token) {
        throw new Error('missing token');
    }
    if(token !== process.env['LOGIN_TOKEN']) {
        console.error('Invalid token:', `expected:"${process.env['LOGIN_TOKEN']}"`, `found:${token}`);
        throw new Error('Invalid token');
    }
    return true;
}), 'token');

export { authenticator };
