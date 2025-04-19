export declare const postsAndTags: import("drizzle-orm/sqlite-core").SQLiteTableWithColumns<{
    name: "posts_and_tags";
    schema: undefined;
    columns: {
        postId: import("drizzle-orm/sqlite-core").SQLiteColumn<{
            name: "post_id";
            tableName: "posts_and_tags";
            dataType: "string";
            columnType: "SQLiteCuid2";
            data: string;
            driverParam: string;
            notNull: true;
            hasDefault: false;
            isPrimaryKey: false;
            isAutoincrement: false;
            hasRuntimeDefault: false;
            enumValues: undefined;
            baseColumn: never;
            identity: undefined;
            generated: undefined;
        }, {}, {}>;
        tagId: import("drizzle-orm/sqlite-core").SQLiteColumn<{
            name: "tag_id";
            tableName: "posts_and_tags";
            dataType: "string";
            columnType: "SQLiteCuid2";
            data: string;
            driverParam: string;
            notNull: true;
            hasDefault: false;
            isPrimaryKey: false;
            isAutoincrement: false;
            hasRuntimeDefault: false;
            enumValues: undefined;
            baseColumn: never;
            identity: undefined;
            generated: undefined;
        }, {}, {}>;
    };
    dialect: "sqlite";
}>;
