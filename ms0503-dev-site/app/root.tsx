import './tailwind.css';
import {
    Links, Meta, Outlet, Scripts, ScrollRestoration
} from 'react-router';
import Footer from '~/components/footer';
import Header from '~/components/header';
import {
    ATOM_URL, JSON_FEED_URL, RSS2_URL
} from '~/lib/constants';
import { count } from '~/services/access-counter.server';
import type { Route } from './+types/root';
import type { PropsWithChildren } from 'react';

export const links: Route.LinksFunction = () => [
    {
        href: '/apple-touch-icon.png',
        rel: 'apple-touch-icon',
        sizes: '180x180',
        type: 'image/png'
    },
    {
        href: '/favicon.ico',
        rel: 'icon',
        sizes: '32x32',
        type: 'image/vnd.microsoft.icon'
    },
    {
        href: '/icon-192.avif',
        rel: 'icon',
        sizes: '192x192',
        type: 'image/avif'
    },
    {
        href: '/icon-192.png',
        rel: 'icon',
        sizes: '192x192',
        type: 'image/png'
    },
    {
        href: '/icon-192.webp',
        rel: 'icon',
        sizes: '192x192',
        type: 'image/webp'
    },
    {
        href: '/icon-512.avif',
        rel: 'icon',
        sizes: '512x512',
        type: 'image/avif'
    },
    {
        href: '/icon-512.png',
        rel: 'icon',
        sizes: '512x512',
        type: 'image/png'
    },
    {
        href: '/icon-512.webp',
        rel: 'icon',
        sizes: '512x512',
        type: 'image/webp'
    },
    {
        href: 'https://fonts.googleapis.com',
        rel: 'preconnect'
    },
    {
        crossOrigin: 'anonymous',
        href: 'https://fonts.gstatic.com',
        rel: 'preconnect'
    },
    {
        href: 'https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@100..900&family=Noto+Sans+Mono:wght@100..900&display=swap',
        rel: 'stylesheet'
    },
    {
        href: '/fonts/NotoSansMonoCJKjp-Bold.css',
        rel: 'stylesheet'
    },
    {
        href: '/fonts/NotoSansMonoCJKjp-Regular.css',
        rel: 'stylesheet'
    },
    {
        href: ATOM_URL,
        rel: 'alternate',
        type: 'application/atom+xml'
    },
    {
        href: JSON_FEED_URL,
        rel: 'alternate',
        type: 'application/feed+json'
    },
    {
        href: RSS2_URL,
        rel: 'alternate',
        type: 'application/rss+xml'
    }
];

export function Layout({ children }: PropsWithChildren) {
    // noinspection HtmlRequiredTitleElement
    return (
        <html lang="ja">
            <head>
                <meta charSet="utf-8" />
                <meta
                    content="width=device-width,initial-scale=1,viewport-fit=cover"
                    name="viewport"
                />
                <Meta />
                <Links />
            </head>
            <body>
                {children}
            </body>
        </html>
    );
}

export default function App({ loaderData: { count } }: Route.ComponentProps) {
    return (
        <>
            <Header className="shrink" />
            <hr />
            <main className="flex flex-col grow items-center justify-center mx-32 my-24">
                <Outlet />
            </main>
            <hr />
            <Footer
                className="shrink"
                count={count}
            />
            <ScrollRestoration />
            <Scripts />
        </>
    );
}

export async function loader({ context: { cloudflare: { env: { kv } } } }: Route.LoaderArgs) {
    const nowCount = await count(kv);
    return {
        count: nowCount
    };
}
