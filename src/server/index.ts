import type { D1Database, R2Bucket } from "@cloudflare/workers-types";
import { Hono } from "hono";

export type Env = {
  Bindings: {
    DB: D1Database;
    BUCKET: R2Bucket;
  };
};

const app = new Hono<Env>()
  .basePath("/api")
  .get("/", async (c) => {
    return c.jsonT({ message: "Home!" });
  })
  .get("/count", async (c) => {
    const DB = c.env.DB;
    const res = await DB.prepare(
      "SELECT COUNT(*) as nums FROM replays",
    ).first();
    return c.jsonT({ message: res!.nums as string });
  })
  .get(":abc", async (c) => {
    return c.jsonT({ abc: c.req.param("abc") });
  });

export type Server = typeof app;
export default app;
