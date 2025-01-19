'use strict';

import type { Config } from 'tailwindcss';

export default {
    content: ['./app/**/{**,.client,.server}/**/*.{js,jsx,ts,tsx}'],
    theme: {
        extend: {
            fontFamily: {
                sans: [
                    'Noto Sans JP',
                    'Noto Sans CJK JP',
                    'Helvetica Neue',
                    'Helvetica',
                    'Arial',
                    'Hiragino Sans',
                    'Hiragino Kaku Gothic ProN',
                    'Yu Gothic',
                    'Meiryo',
                    'ui-sans-serif',
                    'system-ui',
                    'sans-serif',
                    'Noto Color Emoji',
                    'Apple Color Emoji',
                    'Segoe UI Emoji',
                    'Segoe UI Symbol'
                ]
            }
        }
    },
    plugins: []
} satisfies Config;
