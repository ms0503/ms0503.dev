import { use } from 'react';
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
import type { SizeResponse } from '../routes/images';
import type {
    AnchorHTMLAttributes, ImgHTMLAttributes, JSX, PropsWithChildren
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
                a: LinkWrapper,
                img: ImgWrapper
            }
        })
        .process(mdx)
        .then((v: { result: JSX.Element }) => v.result);
}

// 画像用タグのリプレース
//
// 'obj:' 開始の場合: 自前のオブジェクトストレージ内の画像
//   'obj:a:' 開始の場合: アニメーション画像
//     aタグ+pictureタグへ書き換え
//     〜1023px: 横幅90%
//     1024px〜: 横幅50%
//   'obj:s:' 開始の場合: 静止画像
//     aタグ+pictureタグへ書き換え
//     〜1023px: 横幅90%
//     1024px〜: 横幅50%
//   それ以外の場合: 不正なURL
//     Errorをthrow
// それ以外の場合: 外部サイトの画像
//   aタグ+imgタグへ書き換え
function ImgWrapper({
    alt,
    src
}: ImgHTMLAttributes<HTMLImageElement>) {
    if(src?.startsWith('obj:')) {
        const partsOfSrc = src.match(/^obj:([as]):(.+)$/u);
        if(!partsOfSrc || partsOfSrc.length < 3) {
            throw new Error('src is not valid URI');
        }
        const imageType = partsOfSrc[1] as 'a' | 's';
        const name = partsOfSrc[2]!;
        const fallbackImageSuffix = imageType === 'a' ? 'gif' : 'png';
        const {
            height,
            type,
            width
        } = use(fetch(`/images/${name}?mode=size`).then(res => res.json<SizeResponse>()));
        return (
            <a
                className="
                    block w-9/10
                    lg:w-1/2
                "
                href={`/images/${name}`}
                rel="noreferrer"
                target="_blank"
                type={type}
            >
                <picture className="w-full">
                    <source
                        height={height}
                        media="(min-width: 1200px)"
                        srcSet={`/images/${name}.avif?width=512 1x,/images/${name}.avif?width=1024 2x`}
                        type="image/avif"
                        width={width}
                    />
                    <source
                        height={height}
                        media="(min-width: 1200px)"
                        srcSet={`/images/${name}.webp?width=512 1x,/images/${name}.webp?width=1024 2x`}
                        type="image/webp"
                        width={width}
                    />
                    <source
                        height={height}
                        media="(min-width: 1200px)"
                        srcSet={`/images/${name}.${fallbackImageSuffix}?width=512 1x,/images/${name}.${fallbackImageSuffix}?width=1024 2x`}
                        type={`image/${fallbackImageSuffix}`}
                        width={width}
                    />
                    <source
                        height={height}
                        srcSet={`/images/${name}.avif?width=256 1x,/images/${name}.avif?width=512 2x`}
                        type="image/avif"
                        width={width}
                    />
                    <source
                        height={height}
                        srcSet={`/images/${name}.webp?width=256 1x,/images/${name}.webp?width=512 2x`}
                        type="image/webp"
                        width={width}
                    />
                    <img
                        alt={alt}
                        decoding="async"
                        height={height}
                        loading="lazy"
                        src={`/images/${name}.${fallbackImageSuffix}`}
                        srcSet={`/images/${name}.${fallbackImageSuffix}?width=256 1x,/images/${name}.${fallbackImageSuffix}?width=512 2x`}
                        width={width}
                    />
                </picture>
            </a>
        );
    }
    return (
        <a
            className="
                block w-9/10
                lg:w-1/2
            "
            href={src}
            rel="noreferrer"
            target="_blank"
        >
            <img
                alt={alt}
                className="w-full"
                decoding="async"
                loading="lazy"
                src={src}
            />
        </a>
    );
}

// リンク用タグのリプレース
//
// 空文字・'/' 開始・'#' 開始の場合: このサイトへのリンク
//   Linkタグへ書き換え
// それ以外の場合: 外部サイトへのリンク
//   aタグへ書き換え
function LinkWrapper({
    children,
    href
}: PropsWithChildren<AnchorHTMLAttributes<HTMLAnchorElement>>) {
    return href === '' || href?.startsWith('/') || href?.startsWith('#') ? (
        <Link to={href}>
            {children}
        </Link>
    ) : (
        <a
            href={href}
            rel="external noopener noreferrer"
            target="_blank"
        >
            {children}
        </a>
    );
}
