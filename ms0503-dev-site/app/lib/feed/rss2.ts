import type { Dayjs } from 'dayjs';

export interface Item {
    category: string;
    description?: string;
    link: `http://${string}` | `https://${string}`;
    pubDate: Dayjs | string;
    title: string;
}

export interface Channel {
    copyright: string;
    description: string;
    docs: string;
    item: Item[];
    language: string;
    lastBuildDate: string;
    link: `http://${string}` | `https://${string}`;
    managingEditor: string;
    pubDate: string;
    title: string;
    webMaster: string;
}

export interface Rss2 {
    '@_version': '2.0';
    channel: Channel;
}

export interface Rss2Document {
    '?xml': {
        '@_encoding': 'UTF-8',
        '@_version': '1.0'
    };
    rss: Rss2;
}
