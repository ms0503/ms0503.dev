'use strict';

export async function count(kv: KVNamespace) {
    const counter = await getCount(kv);
    if(!counter) {
        await kv.put('counter', '1');
        return 1;
    }
    await kv.put('counter', `${counter + 1}`);
    return counter + 1;
}

export async function getCount(kv: KVNamespace) {
    return kv.get('counter').then(v => v ? parseInt(v, 10) : null);
}
