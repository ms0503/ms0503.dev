export declare const categoriesRelations: import("drizzle-orm").Relations<"categories", {
    posts: import("drizzle-orm").Many<"posts">;
}>;
export declare const postsAndTagsRelations: import("drizzle-orm").Relations<"posts_and_tags", {
    post: import("drizzle-orm").One<"posts", true>;
    tag: import("drizzle-orm").One<"tags", true>;
}>;
export declare const postsRelations: import("drizzle-orm").Relations<"posts", {
    category: import("drizzle-orm").One<"categories", true>;
    tags: import("drizzle-orm").Many<"posts_and_tags">;
}>;
export declare const tagsRelations: import("drizzle-orm").Relations<"tags", {
    posts: import("drizzle-orm").Many<"posts_and_tags">;
}>;
