'use strict';

export interface Item {
    date_modified: string;
    date_published: string;
    id: string;
    summary?: string;
    tags: string[];
    title: string;
    url: `http://${string}` | `https://${string}`;
}

export interface Author {
    name: string;
    url: `http://${string}` | `https://${string}`;
}

export interface JsonFeed {
    authors: Author[];
    description: string;
    favicon: `http://${string}` | `https://${string}`;
    feed_url: `http://${string}` | `https://${string}`;
    home_page_url: `http://${string}` | `https://${string}`;
    icon: `http://${string}` | `https://${string}`;
    items: Item[];
    language: string;
    title: string;
    version: 'https://jsonfeed.org/version/1.1';
}
