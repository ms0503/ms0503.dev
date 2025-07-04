'use strict';

import production from 'react/jsx-runtime';
import { Link } from 'react-router';
import rehypeRaw from 'rehype-raw';
import rehypeReact from 'rehype-react';
import remarkBreaks from 'remark-breaks';
import remarkGfm from 'remark-gfm';
import remarkMdx from 'remark-mdx';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import { unified } from 'unified';
import type {
    AnchorHTMLAttributes, JSX, PropsWithChildren
} from 'react';

export async function mdxToReact(mdx: string): Promise<JSX.Element> {
    return unified()
        .use(remarkParse)
        .use(remarkBreaks)
        .use(remarkMdx)
        .use(remarkGfm)
        .use(remarkRehype)
        .use(rehypeRaw)
        .use(rehypeReact, {
            ...production,
            components: {
                a: LinkWrapper
            }
        })
        .process(mdx)
        .then((v: { result: JSX.Element }) => v.result);
}

function LinkWrapper({
    children,
    href
}: PropsWithChildren<AnchorHTMLAttributes<HTMLAnchorElement>>) {
    return href === '' || href?.startsWith('/') || href?.startsWith('#') ? (
        <Link to={href}>
            {children}
        </Link>
    ) : (
        <a href={href} rel="noopener noreferrer" target="_blank">
            {children}
        </a>
    );
}
