export declare function connectToDB(db: D1Database): import("drizzle-orm/d1").DrizzleD1Database<Record<string, never>> & {
    $client: D1Database;
};
