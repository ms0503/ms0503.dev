'use strict';

import {
    data, redirect, useFetcher
} from 'react-router';
import { sessionStorage } from '~/services/auth.server';
import type { PropsWithClassName } from '../lib/types';
import type { Route } from './+types/posts-edit';
import type {
    Category, Post, PostTag, Tag
} from 'ms0503-dev-db';

export default function EditPost({ loaderData }: Route.ComponentProps) {
    return (
        <div className="-m-6 flex flex-row h-screen">
            <BodyEditor className="grow h-full p-6 shrink" loaderData={loaderData} />
            <MetadataEditor
                className="
                    border-l grow-0 h-full p-6 shrink w-1/4
                    border-text
                    dark:border-text-dark
                "
                loaderData={loaderData}
            />
        </div>
    );
}

function BodyEditor({
    className,
    loaderData: { post }
}: PropsWithClassName<Pick<Route.ComponentProps, 'loaderData'>, HTMLDivElement>) {
    const fetcher = useFetcher();
    return (
        <div
            className={`
                flex flex-col
                ${className}
            `}
        >
            <h1>
                <span className="overflow-ellipsis">{post.title}</span>
                を編集中
            </h1>
            <fetcher.Form className="flex flex-col gap-4 h-full items-center" method="post">
                <input name="type" type="hidden" value="body" />
                <div className="flex flex-col gap-2 h-full w-full">
                    <textarea
                        className="
                            border h-full overflow-x-clip overflow-y-scroll px-3 py-2 rounded-md text-lg
                            border-text
                            dark:border-text-dark
                        "
                        defaultValue={post.body}
                        name="body"
                    />
                </div>
                <button
                    className="
                        px-8 py-2 rounded-xl text-lg transition-colors w-fit
                        bg-bg-dark text-text-dark
                        hover:bg-bg2-dark
                        dark:bg-bg dark:text-text
                        dark:hover:bg-bg2
                    "
                    type="submit"
                >
                    公開
                </button>
            </fetcher.Form>
        </div>
    );
}

function MetadataEditor({
    className,
    loaderData: {
        categories,
        post,
        postTags,
        tags
    }
}: PropsWithClassName<Pick<Route.ComponentProps, 'loaderData'>, HTMLDivElement>) {
    const fetcher = useFetcher();
    return (
        <div className={className}>
            <fetcher.Form className="flex flex-col gap-4 items-center" method="post">
                <input name="type" type="hidden" value="meta" />
                <div className="flex flex-col gap-2 w-full">
                    <label htmlFor="title">タイトル：</label>
                    <input
                        className="
                            border rounded-md
                            border-text
                            dark:border-text-dark
                        "
                        defaultValue={post.title}
                        name="title"
                        type="text"
                    />
                </div>
                <div className="flex flex-col gap-2 w-full">
                    <label htmlFor="description">概要(省略可)：</label>
                    <input
                        className="
                            border rounded-md
                            border-text
                            dark:border-text-dark
                        "
                        defaultValue={post.description}
                        name="description"
                        type="text"
                    />
                </div>
                <div className="flex flex-col gap-2 w-full">
                    <label htmlFor="category">カテゴリー：</label>
                    <select
                        className="
                            appearance-none border px-3 py-2 rounded-md
                            border-text
                            dark:border-text-dark
                        "
                        name="category"
                    >
                        {categories.map(category => (
                            <option key={category.id} selected={post.categoryId === category.id} value={category.id}>
                                {category.name}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="flex flex-col gap-2 w-full">
                    <label htmlFor="tags">タグ：</label>
                    <select
                        className="
                            appearance-none border px-3 py-2 rounded-md
                            border-text
                            dark:border-text-dark
                        "
                        multiple
                        name="tags"
                    >
                        {tags.map(tag => (
                            <option key={tag.id} selected={postTags.includes(tag.id)} value={tag.id}>
                                {tag.name}
                            </option>
                        ))}
                    </select>
                </div>
                <button
                    className="
                        px-8 py-2 rounded-xl text-lg transition-colors w-fit
                        bg-bg-dark text-text-dark
                        hover:bg-bg2-dark
                        dark:bg-bg dark:text-text
                        dark:hover:bg-bg2
                    "
                    type="submit"
                >
                    公開
                </button>
            </fetcher.Form>
        </div>
    );
}

export async function loader({
    context: { cloudflare: { env: { db } } },
    params: { id },
    request
}: Route.LoaderArgs) {
    const session = await sessionStorage.getSession(request.headers.get('cookie'));
    const user = session.get('user');
    if(!user) {
        throw redirect('/login');
    }
    if(!id) {
        throw data(null, {
            status: 404
        });
    }
    const categories = db.prepare('select * from categories').all<Category>().then(result => result.results);
    const tags = db.prepare('select * from tags').all<Tag>().then(result => result.results);
    const postTags = db.prepare('select tag_id from post_tags where post_id = ?')
        .bind(id)
        .all<PostTag['tagId']>()
        .then(result => result.results);
    const post = await db.prepare('select * from posts where id = ?').bind(id).first<Post>();
    if(!post) {
        throw data(null, {
            status: 404
        });
    }
    return {
        categories: await categories,
        post,
        postTags: await postTags,
        tags: await tags
    };
}

export async function action({
    context: { cloudflare: { env: { db } } },
    params: { id },
    request
}: Route.ActionArgs) {
    const session = await sessionStorage.getSession(request.headers.get('cookie'));
    const user = session.get('user');
    if(!user) {
        throw redirect('/login');
    }
    if(!id) {
        throw data(null, 404);
    }
    const errors = {
        category: false,
        formType: false,
        title: false
    };
    const formData = await request.formData();
    const formType = formData.get('type') as string;
    const body = formData.get('body');
    const title = formData.get('title');
    const description = formData.get('description');
    const category = formData.get('category');
    const tags = (
        formData.getAll('tags') as string[]
    ).map(tag => parseInt(tag, 10)).sort();
    switch(formType) {
        case 'body':
            await db.prepare('update posts set body = ?, updated_at = (strftime(\'%Y-%m-%d\', \'now\')) where id = ?')
                .bind(body ?? '', id)
                .run();
            break;
        case 'meta': {
            if(!title) {
                errors.title = true;
            }
            if(!category) {
                errors.category = true;
            }
            if(Object.values(errors).reduce((p, c) => p || c, false)) {
                return data({
                    errors
                }, 400);
            }
            const promises: Promise<unknown>[] = [];
            promises.push(
                db.prepare(
                    'update posts set category_id = ?, description = ?, title = ?, updated_at = (strftime(\'%Y-%m-%d\', \'now\')) where id = ?')
                    .bind(category, description ?? '', title, id)
                    .run()
            );
            const oldTags = await db.prepare('select tag_id from post_tags where post_id = ? order by tag_id asc')
                .bind(id)
                .all<PostTag['tagId']>()
                .then(result => result.results);
            const tagsToDelete = oldTags.filter(tag => {
                if(tags.length === 0 || tag < tags[0]! || tags[tags.length - 1]! < tag) {
                    return true;
                }
                return !tags.includes(tag);
            });
            const tagsToInsert = tags.filter(tag => {
                if(oldTags.length === 0 || tag < oldTags[0]! || oldTags[oldTags.length - 1]! < tag) {
                    return true;
                }
                return !oldTags.includes(tag);
            });
            for(const tag of tagsToDelete) {
                promises.push(db.prepare('delete from post_tags where post_id = ? and tag_id = ?').bind(id, tag).run());
            }
            for(const tag of tagsToInsert) {
                promises.push(db.prepare('insert into post_tags (post_id, tag_id) values (?, ?)').bind(id, tag).run());
            }
            await Promise.all(promises);
            break;
        }
        default:
            errors.formType = true;
            return data({
                errors
            }, 400);
    }
    return null;
}
