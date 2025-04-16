'use strict';

import { NavLink } from 'react-router';
import styles from '~/components/header/header.module.css';
import type { PropsWithClassName } from '~/lib/types';

const navLinks: [string, string][] = [
    [
        '/',
        'Top'
    ]
];

export default function Navigation({ className }: PropsWithClassName) {
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
