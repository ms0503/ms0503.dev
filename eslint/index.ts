'use strict';

import { configs } from './configs';
import { ignores } from './ignores';
import { langOptions } from './langOptions';
import { plugins } from './plugins';
import { rules } from './rules';
import { settings } from './settings';
import type { FlatCompat } from '@eslint/eslintrc';
import type { InfiniteDepthConfigWithExtends } from 'typescript-eslint';

export default function ESLintConfig(compat: FlatCompat): InfiniteDepthConfigWithExtends[] {
    return [
        ...ignores(compat),
        ...langOptions(compat),
        ...plugins(compat),
        ...settings(compat),
        ...configs(compat),
        ...rules(compat)
    ];
}
