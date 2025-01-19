'use strict';

import type { ESLintConfigParts } from './types';

export const rules: ESLintConfigParts = (_) => [
    {
        rules: {
            '@typescript-eslint/no-unused-vars': [
                'error',
                {
                    args: 'all',
                    argsIgnorePattern: '^_',
                    caughtErrors: 'all',
                    caughtErrorsIgnorePattern: '^_',
                    destructuredArrayIgnorePattern: '^_',
                    ignoreRestSiblings: true,
                    varsIgnorePattern: '^_'
                }
            ],
            'import-x/consistent-type-specifier-style': [
                'error',
                'prefer-top-level'
            ],
            'import-x/exports-last': 'error',
            'import-x/first': 'error',
            'import-x/newline-after-import': [
                'error',
                {
                    considerComments: true,
                    count: 1,
                    exactCount: true
                }
            ],
            'import-x/no-absolute-path': 'error',
            'import-x/no-amd': 'error',
            'import-x/no-commonjs': 'error',
            'import-x/no-cycle': [
                'error',
                {
                    ignoreExternal: true
                }
            ],
            'import-x/no-deprecated': 'error',
            'import-x/no-dynamic-require': 'error',
            'import-x/no-empty-named-blocks': 'error',
            'import-x/no-mutable-exports': 'error',
            'import-x/no-namespace': 'error',
            'import-x/no-self-import': 'error',
            'import-x/no-useless-path-segments': [
                'error',
                {
                    noUselessIndex: true
                }
            ],
            'import-x/order': [
                'error',
                {
                    alphabetize: {
                        caseInsensitive: false,
                        order: 'asc',
                        orderImportKind: 'asc'
                    },
                    groups: [
                        [
                            'builtin',
                            'external',
                            'index',
                            'internal',
                            'object',
                            'parent',
                            'sibling',
                            'type',
                            'unknown'
                        ]
                    ],
                    'newlines-between': 'never',
                    warnOnUnassignedImports: true
                }
            ],
            quotes: [
                'error',
                'single'
            ]
        }
    }
];
