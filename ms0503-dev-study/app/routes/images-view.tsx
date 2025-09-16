import { use } from 'react';
import {
    data, redirect
} from 'react-router';
import { sessionStorage } from '~/services/auth.server';
import type { Route } from './+types/images-view';

export default function ImagesView({ loaderData: {
    img: _img, name
} }: Route.ComponentProps) {
    const img = use(_img);
    return (
        <>
            <h1>{name}</h1>
            <img
                alt={name}
                src={img}
            />
        </>
    );
}

export async function loader({
    context: { cloudflare: { env: { obj } } },
    params: { name },
    request
}: Route.LoaderArgs) {
    const session = await sessionStorage.getSession(request.headers.get('cookie'));
    const user = session.get('user');
    if(!user) {
        throw redirect('/login');
    }
    if(!name) {
        throw data(null, 404);
    }
    const img = await obj.get(name);
    if(!img) {
        throw data(null, 404);
    }
    return {
        img: img.blob().then(blob => blob2DataURI(blob)),
        name
    };
}

async function blob2DataURI(blob: Blob) {
    const reader = new FileReader();
    const result = new Promise<string>(resolve => reader.addEventListener('load', () => resolve(reader.result as string)));
    reader.readAsDataURL(blob);
    return result;
}
