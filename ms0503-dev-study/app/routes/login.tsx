import {
    Form, redirect
} from 'react-router';
import {
    authenticator, sessionStorage
} from '~/services/auth.server';
import type { Route } from './+types/login';

export default function Login() {
    return (
        <>
            <h1>汝、真に渡波 空であるか？</h1>
            <p>真にお前が渡波 空であるならば合言葉を述べよ。</p>
            <Form
                className="flex flex-col"
                method="post"
            >
                <div>
                    <label htmlFor="token">合言葉</label>
                    <input
                        autoComplete="current-password"
                        id="token"
                        name="token"
                        required
                        type="password"
                    />
                </div>
                <button
                    className="self-end"
                    type="submit"
                >
                    ...と言う
                </button>
            </Form>
        </>
    );
}

export async function loader({ request }: Route.LoaderArgs) {
    const session = await sessionStorage.getSession(request.headers.get('cookie'));
    const user = session.get('user');
    if(user) {
        return redirect('/');
    }
    return null;
}

export async function action({ request }: Route.ActionArgs) {
    const user = await authenticator.authenticate('token', request);
    const session = await sessionStorage.getSession(request.headers.get('cookie'));
    session.set('user', user);
    return redirect('/', {
        headers: {
            'Set-Cookie': await sessionStorage.commitSession(session)
        }
    });
}
