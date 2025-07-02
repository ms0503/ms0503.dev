'use strict';

import { redirect } from 'react-router';
import { sessionStorage } from '~/services/auth.server';
import type { Route } from './+types/top';

export const meta: Route.MetaFunction = () => {
    return [
        {
            title: '波打ち際の書斎'
        }
    ];
};

export default function Top() {
    return (
        <>
            <h1>波打ち際の書斎</h1>
            <p>いわゆる管理画面。仮完成。</p>
        </>
    );
}

export async function loader({ request }: Route.LoaderArgs) {
    const session = await sessionStorage.getSession(request.headers.get('cookie'));
    const user = session.get('user');
    if(!user) {
        throw redirect('/login');
    }
    return null;
}
