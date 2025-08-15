'use strict';

import {
    useEffect, useState
} from 'react';
import { NavLink } from 'react-router';
import { useDebounce } from 'use-debounce';
import type { Post } from 'ms0503-dev-db';
import type { ChangeEvent } from 'react';
import type { PropsWithClassName } from '~/lib/types';

type ImageResponse = string;

export type SearchType = 'images' | 'posts';

export type SearchBoxProps = PropsWithClassName<{
    type: SearchType
}, HTMLDivElement>;

export default function Search({
    className,
    type
}: SearchBoxProps) {
    const [queryInput, setQueryInput] = useState('');
    const [query] = useDebounce(queryInput, 500);
    const [results, setResults] = useState<(ImageResponse | Post)[]>([]);

    function handleQueryChange(event: ChangeEvent<HTMLInputElement>) {
        setQueryInput(event.target.value);
    }

    useEffect(() => {
        search(type, query).then(results => setResults(results));
    }, [
        query,
        type
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
                {results.map((result, i) => (
                    <NavLink
                        className={({ isActive }) => `
                            block border overflow-ellipsis px-3 py-2 text-xl w-full
                            text-text
                            hover:bg-bg1
                            dark:text-text-dark
                            dark:hover:bg-bg1-dark
                            ${isActive ? 'bg-bg1 dark:bg-bg1-dark' : ''}
                        `}
                        key={i}
                        to={getItemLink(type, result)}
                    >
                        {getItemName(type, result)}
                    </NavLink>
                ))}
            </div>
        </div>
    );
}

function getItemLink(type: SearchType, item: ImageResponse | Post) {
    switch(type) {
        case 'images':
            return `/images/${item as ImageResponse}`;
        case 'posts':
            return `/posts/${(item as Post).id}/edit`;
        default:
            throw new Error('typeパラメータが正しくありません。');
    }
}

function getItemName(type: SearchType, item: ImageResponse | Post) {
    switch(type) {
        case 'images':
            return item as string;
        case 'posts':
            return (item as Post).title;
        default:
            throw new Error('typeパラメータが正しくありません。');
    }
}

async function search(type: SearchType, query: string): Promise<(ImageResponse | Post)[]> {
    if(!query) {
        return [];
    }
    return fetch(`/search?t=${type}&q=${query}`).then(res => res.json());
}
