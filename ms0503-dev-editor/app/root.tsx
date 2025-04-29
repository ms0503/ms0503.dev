'use strict';

import './tailwind.css';
import {
    Links, Meta, Outlet, Scripts, ScrollRestoration
} from 'react-router';
import type { Route } from './+types/root';
import type { PropsWithChildren } from 'react';

export const links: Route.LinksFunction = () => [];

export function Layout({ children }: PropsWithChildren) {
    // noinspection HtmlRequiredTitleElement
    return (
        <html lang="ja">
            <head>
                <meta charSet="utf-8" />
                <meta content="width=device-width,initial-scale=1,viewport-fit=cover" name="viewport" />
                <Meta />
                <Links />
            </head>
            <body>
                <main>
                    {children}
                </main>
                <ScrollRestoration />
                <Scripts />
            </body>
        </html>
    );
}

export default function App() {
    return <Outlet />;
}
