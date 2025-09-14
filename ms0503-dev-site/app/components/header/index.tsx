import Navigation from './navigation';
import type { PropsWithClassName } from '~/lib/types';

function SiteName({ className }: PropsWithClassName) {
    return (
        <div
            className={`
                font-bold font-mono p-4 text-3xl
                ${className ?? ''}
            `}
        >
            ms0503.dev
        </div>
    );
}

export default function Header({ className }: PropsWithClassName) {
    return (
        <header
            className={`
                flex flex-col
                bg-bg1
                dark:bg-bg1-dark
                ${className ?? ''}
            `}
        >
            <SiteName className="shrink" />
            <hr />
            <Navigation />
        </header>
    );
}
