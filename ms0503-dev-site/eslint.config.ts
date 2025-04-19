'use strict';

import { includeIgnoreFile } from '@eslint/compat';
import { FlatCompat } from '@eslint/eslintrc';
import config from 'ms0503-dev-eslint';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
    baseDirectory: __dirname
});

const gitignore = resolve(__dirname, '.gitignore');

export default config(compat, [
    includeIgnoreFile(gitignore)
]);
