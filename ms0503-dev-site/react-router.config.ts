'use strict';

import type { Config } from '@react-router/dev/config';

export default {
    future: {
        unstable_optimizeDeps: true,
        unstable_viteEnvironmentApi: true
    },
    ssr: true
} satisfies Config;
