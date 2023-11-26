import type { D1Database, R2Bucket } from "@cloudflare/workers-types";
import type { ReplayStub, ReplayType } from "@slippilab/common";
import {
  type InferInsertModel,
  SQL,
  and,
  eq,
  inArray,
  isNotNull,
  isNull,
  like,
  or,
  sql,
} from "drizzle-orm";
import { drizzle } from "drizzle-orm/d1";
import { Hono } from "hono";
import { UbjsonDecoder } from "json-joy/esm/json-pack/ubjson/UbjsonDecoder";
import { generateSlug } from "random-word-slugs";

import { parseReplay } from "~/common/parser";
import * as schema from "~/server/schema";

export type Env = {
  Bindings: {
    DB: D1Database;
    BUCKET: R2Bucket;
  };
};

const app = new Hono<Env>()
  .basePath("/api")
  .get("/connectCodes", async (c) => {
    const { DB } = c.env;
    const db = drizzle(DB, { schema });
    const results = await db
      .selectDistinct({ code: schema.replayPlayers.connectCode })
      .from(schema.replayPlayers)
      .where(isNotNull(schema.replayPlayers.connectCode));
    return c.jsonT({ connectCodes: results.map((result) => result.code!) });
  })
  .get("/replays", async (c) => {
    const { DB } = c.env;
    const db = drizzle(DB, { schema });

    const limit = Number(c.req.query("limit") ?? 10);
    const page = Number(c.req.query("page") ?? 0);
    const types = c.req.query("types")?.split(",") ?? [];
    const stages = c.req.query("stages")?.split(",").map(Number) ?? [];
    const characters = c.req.query("characters")?.split(",").map(Number) ?? [];
    const connectCodes = c.req.query("connectCodes")?.split(",") ?? [];

    const filters: SQL[] = [];
    if (types.length > 0) {
      filters.push(
        or(
          ...types
            .filter((t): t is ReplayType =>
              (
                [
                  "direct",
                  "offline",
                  "old online",
                  "ranked",
                  "unranked",
                ] satisfies ReplayType[]
              ).includes(t as ReplayType),
            )
            .map((t) => {
              switch (t) {
                case "direct":
                  return like(schema.replays.matchId, "mode.direct%");
                case "ranked":
                  return like(schema.replays.matchId, "mode.ranked%");
                case "unranked":
                  return like(schema.replays.matchId, "mode.unranked%");
                case "offline":
                case "old online":
                  return isNull(schema.replays.matchId);
              }
            }),
        ) as SQL,
      );
    }
    if (stages.length > 0) {
      filters.push(inArray(schema.replays.stageId, stages));
    }
    if (characters.length > 0) {
      filters.push(
        ...characters.map(
          (character) =>
            // https://github.com/drizzle-team/drizzle-orm/issues/1235
            sql`exists ${db
              .select({ exists: sql<number>`1` })
              .from(schema.replayPlayers)
              .where(
                and(
                  eq(schema.replayPlayers.replayId, schema.replays.id),
                  eq(schema.replayPlayers.externalCharacterId, character),
                ),
              )}`,
        ),
      );
    }
    if (connectCodes.length > 0) {
      filters.push(
        ...connectCodes.map(
          (connectCode) =>
            // https://github.com/drizzle-team/drizzle-orm/issues/1235
            sql`exists ${db
              .select({ exists: sql<number>`1` })
              .from(schema.replayPlayers)
              .where(
                and(
                  eq(schema.replayPlayers.replayId, schema.replays.id),
                  eq(schema.replayPlayers.connectCode, connectCode),
                ),
              )}`,
        ),
      );
    }

    const replayCountResults = db
      .select({ count: sql<number>`count(*)` })
      .from(schema.replays)
      .where(and(...filters));
    const results = await db.query.replays.findMany({
      with: { replayPlayers: true },
      where: and(...filters),
      limit: limit,
      offset: limit * page,
    });
    const stubs: (ReplayStub & { slug: string })[] = results.map((replay) => ({
      type: replay.type as ReplayType,
      slug: replay.slug,
      stageId: replay.stageId,
      startTimestamp: replay.startTimestamp,
      matchId: replay.matchId ?? undefined,
      gameNumber: replay.gameNumber ?? undefined,
      tiebreakerNumber: replay.tiebreakerNumber ?? undefined,
      players: replay.replayPlayers.map((player) => ({
        replayId: replay.id,
        playerIndex: player.playerIndex,
        connectCode: player.connectCode ?? undefined,
        displayName: player.displayName ?? undefined,
        nametag: player.nametag ?? undefined,
        teamId: player.teamId ?? undefined,
        externalCharacterId: player.externalCharacterId,
        costumeIndex: player.costumeIndex,
      })),
    }));

    return c.jsonT({
      pageIndex: page,
      pageTotalCount: Math.ceil((await replayCountResults)[0].count / limit),
      stubs,
    });
  })
  .get("/replay/:slug", async (c) => {
    const { DB, BUCKET } = c.env;
    const slug = c.req.param("slug");
    const db = drizzle(DB, { schema });
    const serverReplay = await db.query.replays.findFirst({
      columns: { id: true },
      where: eq(schema.replays.slug, slug),
    });
    const object = await BUCKET.get(serverReplay!.id);
    const buffer = await object!.arrayBuffer();
    const { raw, metadata } = new UbjsonDecoder().read(
      new Uint8Array(buffer),
    ) as any;
    return c.jsonT({ replay: parseReplay(metadata, raw) });
  })
  .post("/upload", async (c) => {
    const { DB, BUCKET } = c.env;
    const db = drizzle(DB, { schema });
    const form = await c.req.formData();
    const file = form.get("file") as File;
    const buffer = new Uint8Array(await file.arrayBuffer());
    const { raw, metadata } = new UbjsonDecoder().read(buffer) as any;
    const replay = parseReplay(metadata, raw);

    const id = crypto.randomUUID();
    const slug = generateSlug(3, { format: "camel" });
    const dbReplay: InferInsertModel<typeof schema.replays> = {
      id,
      slug,
      type: replay.type,
      stageId: replay.settings.stageId,
      startTimestamp: replay.settings.startTimestamp,
      matchId: replay.settings.matchId,
      gameNumber: replay.settings.gameNumber,
      tiebreakerNumber: replay.settings.tiebreakerNumber,
    };
    const dbPlayers: InferInsertModel<typeof schema.replayPlayers>[] =
      replay.settings.playerSettings.filter(Boolean).map((player) => ({
        replayId: id,
        playerIndex: player.playerIndex,
        connectCode: player.connectCode,
        displayName: player.displayName,
        nametag: player.nametag,
        teamId: player.teamId,
        externalCharacterId: player.externalCharacterId,
        costumeIndex: player.costumeIndex,
      }));

    await BUCKET.put(id, buffer);
    await db.batch([
      db.insert(schema.replays).values(dbReplay),
      ...dbPlayers.map((dbPlayer) =>
        db.insert(schema.replayPlayers).values(dbPlayer),
      ),
    ]);

    return c.jsonT({ slug });
  });

export type Server = typeof app;
export default app;
