'use strict';

import styles from './header.module.css';
import { NavLink } from 'react-router';
import type { PropsWithClassName } from '~/lib/types';

const navLinks: [string, string][] = [
    [
        '/',
        'Top'
    ]
];

function SiteName({ className }: PropsWithClassName) {
    return (
        <div
            className={`
                font-bold font-mono p-4 text-3xl
                ${className ?? ''}
            `}
        >
            ms0503.dev
        </div>
    );
}

function Navigation({ className }: PropsWithClassName) {
    return (
        <nav
            className={`
                flex flex-row flex-wrap
                ${className ?? ''}
            `}
        >
            {navLinks.map((navLink, i) => (
                <NavLink
                    className={({ isActive }) => `
                        duration-100 grow px-4 py-2 text-center text-inherit text-xl transition-colors
                        hover:bg-neutral-400
                        dark:hover:bg-neutral-700
                        ${isActive ? styles['active'] : ''}
                    `}
                    key={i}
                    to={navLink[0]}
                >
                    {navLink[1]}
                </NavLink>
            ))}
        </nav>
    );
}

export default function Header({ className }: PropsWithClassName) {
    return (
        <header
            className={`
                flex flex-col
                bg-neutral-300
                dark:bg-neutral-600
                ${className ?? ''}
            `}
        >
            <SiteName className="shrink" />
            <hr />
            <Navigation />
        </header>
    );
}
