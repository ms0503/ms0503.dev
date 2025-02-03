'use strict';

import tailwindcss from '@tailwindcss/postcss';
import cssnanoPlugin from 'cssnano';

/** @type {import('postcss-load-config').Config} */
const config = {
    plugins: [
        tailwindcss,
        process.env['NODE_ENV'] === 'production' && cssnanoPlugin
    ],
    syntax: 'postcss-scss'
};

export default config;
