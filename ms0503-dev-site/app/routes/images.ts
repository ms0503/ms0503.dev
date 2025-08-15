'use strict';

import { data } from 'react-router';
import type { Route } from './+types/images';

const SUPPORTED_FILE_TYPE = [
    'image/avif' as const,
    'image/gif' as const,
    'image/jpeg' as const,
    'image/png' as const,
    'image/webp' as const
];

type SupportedFileType = (typeof SUPPORTED_FILE_TYPE) extends (infer T)[] ? T : never;

const MODE = [
    'get' as const,
    'size' as const
];

export type Mode = (typeof MODE) extends (infer T)[] ? T : never;

export type SizeResponse = {
    height: number,
    type: `image/${string}`,
    width: number
};

// URL形式: /images/<NAME>[.<FILE TYPE>][?[mode=<MODE>]&[width=<WIDTH>]]
//
// パラメータ:
//   NAME       画像名
//   FILE TYPE  要求する形式
//              値: 'avif', 'gif', 'jpeg', 'jpg', 'png', 'webp'
//   MODE       モード (デフォルト: 'get')
//              値: 'get', 'size'
//   WIDTH      要求する幅 [px]
//              getモードのみ対応
//
// モード:
//   'get'   画像を取得
//   'size'  オリジナルの画像サイズ・形式を取得
export async function loader({
    context: { cloudflare: { env: {
        img,
        obj
    } } },
    params: { name },
    request
}: Route.LoaderArgs) {
    const { searchParams } = new URL(request.url);
    const mode = (() => {
        const mode = searchParams.get('mode') ?? 'get';
        if(!isModeValid(mode)) {
            throw data(null, 400);
        }
        return mode;
    })();
    const width = (() => {
        const width = (() => {
            const width = searchParams.get('width');
            return width ? parseInt(width, 10) : null;
        })();
        if(Number.isNaN(width) || (width && width <= 0)) {
            return null;
        }
        return width;
    })();
    const partsOfName = name.match(/^(.*)\.([^.]*)$/u);
    if(!partsOfName) {
        throw data(null, 404);
    }
    const [base, fileType] = (() => {
        const [base, suffix] = partsOfName;
        const fileType = suffix === 'jpg' ? 'image/jpeg' : `image/${suffix}`;
        return [
            base,
            fileType
        ];
    })();
    if(mode === 'size') {
        const img = await obj.head(base);
        if(!img) {
            throw data(null, 404);
        }
        if(!img.httpMetadata?.contentType?.startsWith('image/')) {
            throw data(null, 400);
        }
        if(!img.customMetadata?.height || !img.customMetadata?.width) {
            throw data(null, 500);
        }
        return Response.json({
            height: parseInt(img.customMetadata.height, 10),
            type: img.httpMetadata.contentType,
            width: parseInt(img.customMetadata.width, 10)
        });
    }
    const origImg = await obj.get(base);
    if(!origImg || !isFileTypeSupported(fileType)) {
        throw data(null, 404);
    }
    if(!origImg.customMetadata?.height || !origImg.customMetadata?.width) {
        throw data(null, 500);
    }
    const result = await (() => {
        const transformer = img.input(origImg.body);
        if(width) {
            return transformer.transform({
                height: parseInt(origImg.customMetadata.height, 10) * width / parseInt(origImg.customMetadata.width, 10),
                width
            });
        }
        return transformer;
    })().output({
        format: fileType
    });
    return result.response();
}

function isFileTypeSupported(fileType: string): fileType is SupportedFileType {
    return (SUPPORTED_FILE_TYPE as string[]).includes(fileType);
}

function isModeValid(mode: string): mode is Mode {
    return (MODE as string[]).includes(mode);
}
