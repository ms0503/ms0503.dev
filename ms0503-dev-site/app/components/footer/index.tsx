import type { PropsWithClassName } from '~/lib/types';

type AccessCounterProps = {
    count: number
};

function AccessCounter({ count }: AccessCounterProps) {
    return (
        <div className="text-right">
            あなたは
            {count}
            人目の人間かもね
        </div>
    );
}

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

export type Props = PropsWithClassName<AccessCounterProps>;

export default function Footer({
    className, count
}: Props) {
    return (
        <footer
            className={`
                flex flex-col
                bg-neutral-300
                dark:bg-neutral-900
                ${className ?? ''}
            `}
        >
            <AccessCounter count={count} />
            <Copyright />
        </footer>
    );
}
