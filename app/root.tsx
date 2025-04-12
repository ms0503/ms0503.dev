'use strict';

import './styles/00-tailwind.css';
import './styles/10-base.css';
import { Links, Meta, Outlet, Scripts, ScrollRestoration } from 'react-router';
import type { Route } from './+types/root';
import type { PropsWithChildren } from 'react';

export const links: Route.LinksFunction = () => [
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
        href: 'https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@100..900&display=swap',
        rel: 'stylesheet'
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
                <ScrollRestoration />
                <Scripts />
            </body>
        </html>
    );
}

export default function App() {
    return <Outlet />;
}
