import type { D1Database, R2Bucket } from "@cloudflare/workers-types";
import type { ReplayStub } from "@slippilab/common";
import { Hono } from "hono";
export type Env = {
    Bindings: {
        DB: D1Database;
        BUCKET: R2Bucket;
    };
};
declare const app: Hono<Env, import("hono").ToSchema<"get", "/api/connectCodes", unknown, {
    connectCodes: string[];
}> & import("hono").ToSchema<"get", "/api/replays", unknown, {
    pageIndex: number;
    pageTotalCount: number;
    stubs: (ReplayStub & {
        slug: string;
    })[];
}> & import("hono").ToSchema<"get", "/api/replay/:slug", unknown, {
    replay: import("@slippilab/common").ReplayData;
}> & import("hono").ToSchema<"post", "/api/upload", unknown, {
    slug: string;
}>, "/api">;
export type Server = typeof app;
export default app;
//# sourceMappingURL=index.d.ts.map