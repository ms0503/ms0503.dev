'use strict';

import { Fragment } from 'react';
import { FaJava } from 'react-icons/fa6';
import {
    SiC,
    SiCloudflareworkers,
    SiCplusplus,
    SiDotnet,
    SiGnubash,
    SiGo,
    SiGodotengine,
    SiHaskell,
    SiKotlin,
    SiLua,
    SiNextdotjs,
    SiNixos,
    SiPython,
    SiReact,
    SiReactrouter,
    SiRust,
    SiTypescript,
    SiUnity
} from 'react-icons/si';
import type { Route } from './+types/top';
import type { IconType } from 'react-icons';

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

/* eslint-disable @stylistic/quote-props, perfectionist/sort-objects */
const aboutMe = {
    '名前': [
        (
            <>
                <ruby>
                    渡波 空
                    <rp>(</rp>
                    <rt>となみ そら</rt>
                    <rp>)</rp>
                </ruby>
                (メイン名義)
            </>
        ),
        'ms0503(メインハンドルネーム)',
        'mihal1073(VRChat向け名義・ハンドルネーム)'
    ],
    '趣味': [
        'Hoi4',
        'VRChat(ギミック制作・ワールド制作)',
        'Webサイト制作(ここ)',
        'ゲーム開発'
    ],
    '私が大大大大大好きな1つのdistro': aboutTextWithIcon(SiNixos, 'NixOS', '#5277c3'),
    '好きなもの': 'お茶',
    'めっちゃ好きな言語たち': [
        aboutTextWithIcon(SiGnubash, 'Bash(スクリプト)'),
        aboutTextWithIcon(SiDotnet, 'C#', '#512bd4'),
        aboutTextWithIcon(SiNixos, 'Nix', '#5277c3'),
        aboutTextWithIcon(SiRust, 'Rust'),
        aboutTextWithIcon(SiTypescript, 'TypeScript', '#3178c6')
    ],
    'そこそこ好きな言語たち': [
        aboutTextWithIcon(SiC, 'C', '#abb9cc'),
        aboutTextWithIcon(SiCplusplus, 'C++', '#00599c'),
        aboutTextWithIcon(FaJava, 'Java'),
        aboutTextWithIcon(SiKotlin, 'Kotlin', '#7f52ff'),
        aboutTextWithIcon(SiLua, 'Lua', '#2c2d72')
    ],
    '使えなくはない言語たち': [
        aboutTextWithIcon(SiPython, 'Python', '#3776ab')
    ],
    '使ってみたい言語たち': [
        aboutTextWithIcon(SiGo, 'Go', '#00add8'),
        aboutTextWithIcon(SiHaskell, 'Haskell', '#5d4f85')
    ],
    '使えるフレームワークとかインフラとか': [
        aboutTextWithIcon(SiCloudflareworkers, 'Cloudflare Workers', '#f38020'),
        aboutTextWithIcon(SiGodotengine, 'Godot Engine', '#478cbf'),
        aboutTextWithIcon(SiNextdotjs, 'Next.js'),
        aboutTextWithIcon(SiReact, 'React', '#61dafb'),
        aboutTextWithIcon(SiReactrouter, 'React Router v7', '#ca4245'),
        aboutTextWithIcon(SiUnity, 'Unity')
    ]
} as const;
/* eslint-enable @stylistic/quote-props, perfectionist/sort-objects */

export default function Top() {
    return (
        <>
            <h1>ms0503.dev ― 波打ち際のガラクタ小屋</h1>
            <p>ここは渡波 空が作った色んな物と技術記事を置いておく場所。ただいま絶賛工事中。</p>
            <p>
                <span
                    aria-hidden
                    className="hidden"
                >
                    これぞ突貫工事
                </span>
                <span className="text-red-500">Λ</span>
                <span className="text-yellow-300">-</span>
                <span className="text-black">-</span>
                <span className="text-yellow-300">-</span>
                <span className="text-black">-</span>
                <span className="text-yellow-300">-</span>
                [工事中]
                <span className="text-black">-</span>
                <span className="text-yellow-300">-</span>
                <span className="text-black">-</span>
                <span className="text-yellow-300">-</span>
                <span className="text-black">-</span>
                <span className="text-red-500">Λ</span>
            </p>
            <h2>About me</h2>
            <div>
                {Object.entries(aboutMe).map(([key, value], i) => (
                    <Fragment key={i}>
                        <h3>{key}</h3>
                        {Array.isArray(value) ? (
                            <ul className="flex flex-row flex-wrap gap-8 items-end mb-2">
                                {value.map((v, i) => (
                                    <li key={i}>
                                        <p>{v}</p>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p>{value}</p>
                        )}
                    </Fragment>
                ))}
            </div>
        </>
    );
}

function aboutTextWithIcon(Icon: IconType, name: string, color?: `#${string}`) {
    return (
        <>
            <Icon
                aria-hidden
                className="inline mr-1"
                {...(color ? {
                    style: {
                        color
                    }
                } : {})}
            />
            {name}
        </>
    );
}
