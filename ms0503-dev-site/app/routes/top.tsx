'use strict';

import type { Route } from './+types/top';

export const meta: Route.MetaFunction = () => {
    return [
        {
            content: '渡波 空の個人サイトです。',
            name: 'description'
        },
        {
            title: 'ms0503.dev'
        }
    ];
};

export default function Top() {
    return (
        <>
            <h1>ms0503.dev</h1>
            <p>Λ-----[工事中]-----Λ</p>
        </>
    );
}
