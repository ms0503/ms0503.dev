'use strict';

export interface Category {
    '@_label': string;
    '@_term': string;
}

export interface Link {
    '@_href': `http://${string}` | `https://${string}`;
    '@_rel': 'alternate' | 'related' | 'self';
}

export interface Entry {
    category: Category;
    id: string;
    link: Link;
    published: string;
    summary?: string;
    title: string;
    updated: string;
}

export interface Author {
    email: `${string}@${string}.${string}`;
    name: string;
    uri: `http://${string}` | `https://${string}`;
}

export interface Feed {
    '@_xmlns': 'http://www.w3.org/2005/Atom';
    author: Author;
    entry: Entry[];
    icon: `http://${string}` | `https://${string}`;
    id: string;
    link: Link;
    rights: string;
    title: string;
    updated: string;
}

export interface AtomDocument {
    '?xml': {
        '@_encoding': 'UTF-8',
        '@_version': '1.0'
    };
    feed: Feed;
}
