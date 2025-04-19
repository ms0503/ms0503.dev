'use strict';

import production from 'react/jsx-runtime';
import rehypeRaw from 'rehype-raw';
import rehypeReact from 'rehype-react';
import remarkBreaks from 'remark-breaks';
import remarkGfm from 'remark-gfm';
import remarkMdx from 'remark-mdx';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import { unified } from 'unified';
import type { JSX } from 'react';

export async function mdxToReact(mdx: string): Promise<JSX.Element> {
    return unified()
        .use(remarkParse)
        .use(remarkBreaks)
        .use(remarkMdx)
        .use(remarkGfm)
        .use(remarkRehype)
        .use(rehypeRaw)
        .use(rehypeReact, production)
        .process(mdx)
        .then((v: { result: JSX.Element }) => v.result);
}
