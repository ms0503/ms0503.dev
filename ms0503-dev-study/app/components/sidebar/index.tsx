import Search from './search';
import { useState } from 'react';
import { MdAdd } from 'react-icons/md';
import {
    Link, NavLink
} from 'react-router';
import type { SearchType } from './search';
import type { PropsWithClassName } from '~/lib/types';

export type SidebarProps = PropsWithClassName<object, HTMLDivElement>;

export default function Sidebar({ className }: SidebarProps) {
    const [type, setType] = useState<SearchType>('posts');
    return (
        <div
            className={`
                flex flex-col gap-4
                ${className}
            `}
        >
            <NavLink
                className={({ isActive }) => `
                    block border overflow-ellipsis px-3 py-2 text-xl w-full
                    text-text
                    hover:bg-bg1
                    dark:text-text-dark
                    dark:hover:bg-bg1-dark
                    ${isActive ? 'bg-bg1 dark:bg-bg1-dark' : ''}
                `}
                onClick={() => setType('posts')}
                onKeyDown={() => setType('posts')}
                to="/"
            >
                ホーム
            </NavLink>
            <NavLink
                className={({ isActive }) => `
                    block border overflow-ellipsis px-3 py-2 text-xl w-full
                    text-text
                    hover:bg-bg1
                    dark:text-text-dark
                    dark:hover:bg-bg1-dark
                    ${isActive ? 'bg-bg1 dark:bg-bg1-dark' : ''}
                `}
                onClick={() => setType('images')}
                onKeyDown={() => setType('images')}
                to="/images"
            >
                画像
            </NavLink>
            <hr className="-mx-4" />
            <Search
                className="grow shrink"
                type={type}
            />
            <Link
                className="flex flex-col grow-0 shrink"
                to="/posts/new"
            >
                <button
                    className="
                        cursor-pointer flex flex-row gap-2 items-center justify-center px-5 py-3 rounded-3xl text-xl
                        bg-bg-dark text-text-dark
                        dark:bg-bg dark:text-text
                    "
                    type="button"
                >
                    <MdAdd className="inline text-3xl" />
                    新しい記事
                </button>
            </Link>
        </div>
    );
}
