'use strict';

import type { Route } from './+types/top';

export const meta: Route.MetaFunction = () => {
    return [
        {
            content: '渡波 空の個人サイトです。',
            name: 'description'
        },
        {
            title: '波打ち際のガラクタ小屋'
        }
    ];
};

export default function Top() {
    return (
        <>
            <h1>ms0503.dev ― 波打ち際のガラクタ小屋</h1>
            <p>ここは渡波 空が作った色んな物と技術記事を置いておく場所。ただいま絶賛工事中。</p>
            <p>Λ-----[工事中]-----Λ</p>
        </>
    );
}
