-- Migration number: 0001 	 2025-07-01T18:15:10.300Z

-- 記事
create table if not exists "posts"
(
    -- 記事ID。シーケンシャルな数値ID。
    "id"
    integer
    primary
    key
    autoincrement,
    -- 記事の題名。
    "title"
    text
    not
    null
    unique,
    -- 記事の概要。省略可。
    "description"
    text
    default
    null,
    -- 記事の内容。MDX形式で格納。
    "body"
    text
    not
    null,
    -- 記事の作成日。
    "created_at"
    text
    not
    null
    default (
    strftime
(
    '%Y-%m-%d',
    'now'
)),
    -- 記事の最終更新日。
    "updated_at" text not null default
(
    strftime
(
    '%Y-%m-%d',
    'now'
)),
    -- 記事のカテゴリーのID。
    "category_id" integer not null references "categories"
(
    "id"
)
    );

-- カテゴリー
create table if not exists "categories"
(
    -- カテゴリーID。シーケンシャルな数値ID。
    "id"
    integer
    primary
    key
    autoincrement,
    -- カテゴリー名。
    "name"
    text
    unique
);

-- タグ
create table if not exists "tags"
(
    -- タグID。シーケンシャルな数値ID。
    "id"
    integer
    primary
    key
    autoincrement,
    -- タグ名。
    "name"
    text
    unique
);

-- 記事のタグ
create table if not exists "post_tags"
(
    -- 記事のID。
    "post_id"
    integer
    references
    "posts"
(
    "id"
),
    -- タグのID。
    "tag_id" integer references "tags"
(
    "id"
),
    primary key
(
    "post_id",
    "tag_id"
)
    );
