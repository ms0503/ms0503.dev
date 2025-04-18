'use strict';

import { Fragment, createElement } from 'react';
import rehypeRaw from 'rehype-raw';
import rehypeReact from 'rehype-react';
import remarkBreaks from 'remark-breaks';
import remarkGfm from 'remark-gfm';
import remarkMdx from 'remark-mdx';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import { unified } from 'unified';
import type { JSX } from 'react';
import type { CompileResults } from 'unified';
import type { VFile, Value } from 'vfile';

type VFileWithOutput<Result extends CompileResults | undefined> = (Result extends Value | undefined ? VFile : VFile & {
    result: Result
});

export async function mdxToReact(mdx: string): Promise<JSX.Element> {
    return (
        unified()
            .use(remarkParse)
            .use(remarkBreaks)
            .use(remarkMdx)
            .use(remarkGfm)
            .use(remarkRehype)
            .use(rehypeRaw)
            .use(rehypeReact, {
                Fragment,
                createElement
            })
            .process(mdx) as Promise<VFileWithOutput<JSX.Element>>
    ).then(v => v.result);
}
