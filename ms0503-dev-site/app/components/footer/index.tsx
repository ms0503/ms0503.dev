'use strict';

import type { PropsWithClassName } from '~/lib/types';

function Copyright({ className }: PropsWithClassName) {
    return (
        <div
            className={`
                text-center text-sm
                ${className ?? ''}
            `}
        >
            Copyright © 2025 Sora Tonami. All rights reserved.
        </div>
    );
}

export default function Footer({ className }: PropsWithClassName) {
    return (
        <footer
            className={`
                flex flex-col
                bg-neutral-300
                dark:bg-neutral-900
                ${className ?? ''}
            `}
        >
            <Copyright />
        </footer>
    );
}
