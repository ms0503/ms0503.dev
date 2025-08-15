'use strict';

import {
    data, redirect, useFetcher
} from 'react-router';
import { sessionStorage } from '~/services/auth.server';
import type { Route } from './+types/posts-new';
import type {
    Category, Post, Tag
} from 'ms0503-dev-db';

export default function NewPosts({ loaderData: {
    categories,
    tags
} }: Route.ComponentProps) {
    const fetcher = useFetcher();
    return (
        <>
            <h1>記事を作成する</h1>
            <fetcher.Form className="flex flex-col gap-4 items-center" method="post">
                <div className="flex flex-col gap-2 w-full">
                    <label htmlFor="title">タイトル：</label>
                    <input
                        className="
                            border rounded-md
                            border-text
                            dark:border-text-dark
                        "
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
                            <option key={category.id} value={category.id}>
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
                            <option key={tag.id} value={tag.id}>
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
                    作成
                </button>
            </fetcher.Form>
        </>
    );
}

export async function loader({
    context: { cloudflare: { env: { db } } },
    request
}: Route.LoaderArgs) {
    const session = await sessionStorage.getSession(request.headers.get('cookie'));
    const user = session.get('user');
    if(!user) {
        throw redirect('/login');
    }
    const categories = db.prepare('select * from categories').all<Category>().then(result => result.results);
    const tags = db.prepare('select * from tags').all<Tag>().then(result => result.results);
    return {
        categories: await categories,
        tags: await tags
    };
}

export async function action({
    context: { cloudflare: { env: { db } } },
    request
}: Route.ActionArgs) {
    const session = await sessionStorage.getSession(request.headers.get('cookie'));
    const user = session.get('user');
    if(!user) {
        throw redirect('/login');
    }
    const errors = {
        category: false,
        title: false
    };
    const formData = await request.formData();
    const title = formData.get('title');
    const description = formData.get('description');
    const category = formData.get('category');
    const tags = formData.getAll('tags');
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
    const post = await db.prepare('insert into posts (body, category_id, description, title) values (?, ?, ?, ?)')
        .bind('', category, description ?? '', title)
        .run<Post>()
        .then(result => result.results[0]!);
    if(0 < tags.length) {
        const promises: Promise<unknown>[] = [];
        for(const tag of tags) {
            promises.push(db.prepare('insert into post_tags (post_id, tag_id) values (?, ?)').bind(post.id, tag).run());
        }
        await Promise.all(promises);
    }
    throw redirect(`/posts/${post.id}/edit`);
}
