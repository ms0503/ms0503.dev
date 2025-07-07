'use strict';

import { imageSize } from 'image-size';

export async function upload({ obj }: Env, name: string, file: File) {
    if(await obj.head(name)) {
        throw new Error('同名のファイルが既に存在します。');
    }
    const {
        height,
        width
    } = await file.bytes().then(bytes => imageSize(bytes));
    await obj.put(name, file, {
        customMetadata: {
            height: height.toString(10),
            width: width.toString(10)
        },
        httpMetadata: {
            contentType: file.type
        }
    });
}
