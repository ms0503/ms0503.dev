import styles from './header.module.css';
import { NavLink } from 'react-router';
import type { PropsWithClassName } from '~/lib/types';

const navLinks = {
    '/': 'Top',
    '/blog': 'Blog',
    'https://github.com/ms0503': 'GitHub',
    // eslint-disable-next-line perfectionist/sort-objects
    '/social': 'Social'
};

export default function Navigation({ className }: PropsWithClassName) {
    return (
        <nav
            className={`
                flex flex-row flex-wrap
                ${className ?? ''}
            `}
        >
            {Object.keys(navLinks).map(path => path.startsWith('http') ? (
                <a
                    className="
                        duration-100 grow px-4 py-2 text-center text-inherit text-xl transition-colors
                        hover:no-underline
                        bg-bg1
                        hover:bg-bg
                        dark:bg-bg1-dark
                        dark:hover:bg-bg-dark
                    "
                    href={path}
                    key={path}
                >
                    {navLinks[path as keyof typeof navLinks]}
                </a>
            ) : (
                <NavLink
                    className={({ isActive }) => `
                        duration-100 grow px-4 py-2 text-center text-inherit text-xl transition-colors
                        hover:no-underline
                        bg-bg1
                        hover:bg-bg
                        dark:bg-bg1-dark
                        dark:hover:bg-bg-dark
                        ${isActive ? styles['active'] : ''}
                    `}
                    key={path}
                    to={path}
                >
                    {navLinks[path as keyof typeof navLinks]}
                </NavLink>
            ))}
        </nav>
    );
}
