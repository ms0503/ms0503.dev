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
                    block border overflow-ellipsis px-3 py-2 text-text text-xl w-full
                    hover:bg-bg1
                    ${isActive ? 'bg-bg1' : ''}
                `}
                onClick={() => setType('posts')}
                onKeyDown={() => setType('posts')}
                to="/"
            >
                ホーム
            </NavLink>
            <NavLink
                className={({ isActive }) => `
                    block border overflow-ellipsis px-3 py-2 text-text text-xl w-full
                    hover:bg-bg1
                    ${isActive ? 'bg-bg1' : ''}
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
                    className="bg-text cursor-pointer flex flex-row gap-2 items-center justify-center px-5 py-3 rounded-3xl text-bg text-xl"
                    type="button"
                >
                    <MdAdd className="inline text-3xl" />
                    新しい記事
                </button>
            </Link>
        </div>
    );
}
