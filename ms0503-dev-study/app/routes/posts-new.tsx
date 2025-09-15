import { MdError } from 'react-icons/md';
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
    const {
        data, ...fetcher
    } = useFetcher<Route.ComponentProps['actionData']>();
    return (
        <>
            <h1>記事を作成する</h1>
            {data && hasError(data.errors) && (
                <div className="flex flex-col my-4 w-full">
                    {data.errors.alreadyExists && (
                        <div
                            className="
                                border-2 flex flex-row gap-1 items-center px-3 py-2 rounded-lg
                                bg-red-950 border-red-700
                            "
                        >
                            <MdError
                                className="
                                    inline text-xl
                                    text-red-500
                                "
                            />
                            既に記事が存在しています。
                        </div>
                    )}
                    {data.errors.category && (
                        <div
                            className="
                                border-2 flex flex-row gap-1 items-center px-3 py-2 rounded-lg
                                bg-red-950 border-red-700
                            "
                        >
                            <MdError
                                className="
                                    inline text-xl
                                    text-red-500
                                "
                            />
                            カテゴリーを指定してください。
                        </div>
                    )}
                    {data.errors.title && (
                        <div
                            className="
                                border-2 flex flex-row gap-1 items-center px-3 py-2 rounded-lg
                                bg-red-950 border-red-600
                            "
                        >
                            <MdError
                                className="
                                    inline text-xl
                                    text-red-500
                                "
                            />
                            タイトルを追加してください。
                        </div>
                    )}
                </div>
            )}
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
        alreadyExists: false,
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
    if(hasError(errors)) {
        return data({
            errors
        }, 400);
    }
    try {
        const id = await db.prepare('insert into posts (body, category_id, description, title) values (?, ?, ?, ?)')
            .bind('', category, description ?? '', title)
            .run()
            .then(() =>
                db.prepare('select id from posts where rowid = last_insert_rowid()')
                    .first<Post['id']>('id')
            );
        if(0 < tags.length) {
            const promises: Promise<unknown>[] = [];
            for(const tag of tags) {
                promises.push(db.prepare('insert into post_tags (post_id, tag_id) values (?, ?)').bind(id, tag).run());
            }
            await Promise.all(promises);
        }
        // noinspection ExceptionCaughtLocallyJS
        throw redirect(`/posts/${id}/edit`);
    } catch(err) {
        // redirect
        if(err instanceof Response) {
            throw err;
        }
        if(err instanceof Error) {
            if(err.message.startsWith('D1_ERROR: UNIQUE constraint failed:')) {
                errors.alreadyExists = true;
                return data({
                    errors
                }, 400);
            }
        }
        throw new Error('Unexpected error');
    }
}

function hasError(errors: Record<string, boolean>) {
    return Object.values(errors).reduce((p, c) => p || c, false);
}
