'use strict';

import dayjs from 'dayjs';
import { XMLBuilder } from 'fast-xml-parser';
import {
    DOCUMENT_ROOT, JSON_FEED_URL, RFC822_DATETIME_FORMAT, SITE_DESCRIPTION, SITE_NAME
} from '~/lib/constants';
import type {
    AtomDocument, Entry as AtomEntry
} from './atom';
import type {
    JsonFeed, Item as JsonFeedItem
} from './json-feed';
import type {
    Rss2Document, Item as Rss2Item
} from './rss2';

export function generateAtom(entries: AtomEntry[]) {
    entries.sort((a, b) => dayjs(b.published).unix() - dayjs(a.published).unix());
    const builder = new XMLBuilder({
        ignoreAttributes: false
    });
    return builder.build({
        '?xml': {
            '@_encoding': 'UTF-8',
            '@_version': '1.0'
        },
        feed: {
            '@_xmlns': 'http://www.w3.org/2005/Atom',
            author: {
                email: 'ms0503@outlook.com',
                name: 'Sora Tonami',
                uri: DOCUMENT_ROOT
            },
            entry: entries,
            icon: `${DOCUMENT_ROOT}/icon-192.png`,
            id: `tag:ms0503.dev,${(
                0 < entries.length ? dayjs(entries[0]!.updated) : dayjs()
            ).format('YYYY-MM-DD')}:/`,
            link: {
                '@_href': DOCUMENT_ROOT,
                '@_rel': 'alternate'
            },
            rights: 'Copyright (C) 2025 Sora Tonami',
            title: SITE_NAME,
            updated: (
                0 < entries.length ? dayjs(entries[0]!.updated) : dayjs()
            ).toISOString()
        }
    } satisfies AtomDocument);
}

export function generateJsonFeed(items: JsonFeedItem[]): JsonFeed {
    items.sort((a, b) => dayjs(b.date_published).unix() - dayjs(a.date_published).unix());
    return {
        authors: [
            {
                name: 'Sora Tonami',
                url: DOCUMENT_ROOT
            }
        ],
        description: SITE_DESCRIPTION,
        favicon: `${DOCUMENT_ROOT}/favicon.ico`,
        feed_url: JSON_FEED_URL,
        home_page_url: DOCUMENT_ROOT,
        icon: `${DOCUMENT_ROOT}/icon-512.png`,
        items,
        language: 'ja',
        title: SITE_NAME,
        version: 'https://jsonfeed.org/version/1.1'
    };
}

export function generateRss2(items: Rss2Item[]) {
    items.sort((a, b) => dayjs(b.pubDate).unix() - dayjs(a.pubDate).unix());
    const builder = new XMLBuilder({
        ignoreAttributes: false
    });
    return builder.build({
        '?xml': {
            '@_encoding': 'UTF-8',
            '@_version': '1.0'
        },
        rss: {
            '@_version': '2.0',
            channel: {
                copyright: 'Copyright (C) 2025 Sora Tonami',
                description: SITE_DESCRIPTION,
                docs: 'https://cyber.harvard.edu/rss',
                item: items,
                language: 'ja',
                lastBuildDate: dayjs().format(RFC822_DATETIME_FORMAT),
                link: DOCUMENT_ROOT,
                managingEditor: 'ms0503@outlook.com (Sora Tonami)',
                pubDate: (
                    0 < items.length ? dayjs(items[0]!.pubDate) : dayjs()
                ).format(RFC822_DATETIME_FORMAT),
                title: SITE_NAME,
                webMaster: 'ms0503@outlook.com (Sora Tonami)'
            }
        }
    } satisfies Rss2Document);
}
