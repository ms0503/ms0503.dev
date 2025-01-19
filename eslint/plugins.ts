'use strict';

import type { ESLintConfigParts } from './types';
import react from 'eslint-plugin-react';

export const plugins: ESLintConfigParts = (compat) => [
    {
        plugins: {
            react
        }
    },
    ...compat.plugins('react-hooks')
];
