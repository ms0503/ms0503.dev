'use strict';

import { redirect } from 'react-router';
import type { Route } from './+types/images-top';

export default function ImagesTop() {
    return (
        <>
            <h1>画像置き場</h1>
            <p>トップページって何書いたらいいか分かんないよね。</p>
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
