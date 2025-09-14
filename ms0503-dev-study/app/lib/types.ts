import type { HTMLAttributes } from 'react';

export type PropsWithClassName<TProps extends object = object, TElem extends HTMLElement = HTMLElement> = TProps & {
    className?: HTMLAttributes<TElem>['className']
};
