'use strict';

import {
    useEffect, useState
} from 'react';
import { NavLink } from 'react-router';
import { useDebounce } from 'use-debounce';
import type { Post } from 'ms0503-dev-db';
import type { ChangeEvent } from 'react';
import type { PropsWithClassName } from '~/lib/types';

export type SearchBoxProps = PropsWithClassName<object, HTMLDivElement>;

export default function Search({ className }: SearchBoxProps) {
    const [queryInput, setQueryInput] = useState('');
    const [query] = useDebounce(queryInput, 500);
    const [posts, setPosts] = useState<Post[]>([]);

    function handleQueryChange(event: ChangeEvent<HTMLInputElement>) {
        setQueryInput(event.target.value);
    }

    useEffect(() => {
        (
            async () => setPosts(await search(query))
        )();
    }, [
        query
    ]);
    return (
        <div
            className={`
                flex flex-col gap-4
                ${className}
            `}
        >
            <input
                className="
                    border grow-0 px-3 py-2 rounded-lg shrink text-xl w-full
                    bg-bg1 border-text
                    dark:bg-bg1-dark dark:border-text-dark
                "
                onChange={handleQueryChange}
                placeholder="記事名を検索..."
                type="text"
                value={queryInput}
            />
            <div className="flex flex-col gap-4 grow shrink">
                {posts.map(post => (
                    <NavLink
                        className={({ isActive }) => `
                            block border overflow-ellipsis px-3 py-2 text-xl w-full
                            text-text
                            hover:bg-bg1
                            dark:text-text-dark
                            dark:hover:bg-bg1-dark
                            ${isActive ? 'bg-bg1 dark:bg-bg1-dark' : ''}
                        `}
                        key={post.id}
                        to={`/posts/${post.id}/edit`}
                    >
                        {post.title}
                    </NavLink>
                ))}
            </div>
        </div>
    );
}

async function search(query: string): Promise<Post[]> {
    if(!query) {
        return [];
    }
    return fetch(`/search?t=posts&q=${query}`).then(res => res.json());
}
