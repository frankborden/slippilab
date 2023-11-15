import type { D1Database, R2Bucket } from "@cloudflare/workers-types";
import { type InferInsertModel, eq, isNotNull } from "drizzle-orm";
import { drizzle } from "drizzle-orm/d1";
import { Hono } from "hono";
import { UbjsonDecoder } from "json-joy/esm/json-pack/ubjson/UbjsonDecoder";
import { generateSlug } from "random-word-slugs";
import {
  type Output,
  array,
  number,
  object,
  optional,
  parse,
  string,
} from "valibot";

import type { PlayerStub, ReplayStub, ReplayType } from "~/common/model/types";
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
  .get("/rank/:code", async (c) => {
    const code = c.req.param().code;
    let raw: Output<typeof RankSchema>;
    raw = await fetch(`http://slprank.com/rank/${code.replace("#", "-")}?raw`)
      .then((res) => res.json())
      .then((res) => parse(RankSchema, res));
    const result = {
      ...raw,
      characters: raw.characters
        .map((character) => ({
          ...character,
          id: slpRankNamesById.indexOf(character.characterName),
        }))
        .sort((a, b) => b.gameCount - a.gameCount),
    };
    return c.jsonT({ data: result });
  })
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
    const replays = await db.query.replays.findMany({
      limit: 10,
      with: {
        replayPlayers: true,
      },
    });
    return c.jsonT(
      replays.map((replay): [string, ReplayStub] => [
        replay.slug,
        {
          type: replay.type as ReplayType,
          stageId: replay.stageId,
          startTimestamp: replay.startTimestamp,
          matchId: replay.matchId ?? undefined,
          gameNumber: replay.gameNumber ?? undefined,
          tiebreakerNumber: replay.tiebreakerNumber ?? undefined,
          players: replay.replayPlayers.map(
            (player): PlayerStub => ({
              playerIndex: player.playerIndex,
              connectCode: player.connectCode ?? undefined,
              displayName: player.displayName ?? undefined,
              nametag: player.nametag ?? undefined,
              teamId: player.teamId ?? undefined,
              externalCharacterId: player.externalCharacterId,
              costumeIndex: player.costumeIndex,
            }),
          ),
        },
      ]),
    );
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

const RankSchema = object({
  displayName: string(),
  continent: optional(string()),
  rank: string(),
  rating: number(),
  leaderboardPlacement: optional(number()),
  leaderboardRegion: optional(string()),
  wins: number(),
  losses: number(),
  characters: array(
    object({
      characterName: string(),
      gameCount: number(),
    }),
  ),
  dailyGlobalPlacement: optional(number()),
  dailyRegionalPlacement: optional(number()),
});

export const slpRankNamesById = [
  "Captain Falcon",
  "Donkey Kong",
  "Fox",
  "Game And Watch",
  "Kirby",
  "Bowser",
  "Link",
  "Luigi",
  "Mario",
  "Marth",
  "Mewtwo",
  "Ness",
  "Peach",
  "Pikachu",
  "Ice Climbers",
  "Jigglypuff",
  "Samus",
  "Yoshi",
  "Zelda",
  "Sheik",
  "Falco",
  "Young Link",
  "Dr Mario",
  "Roy",
  "Pichu",
  "Ganondorf",
];

export type Server = typeof app;
export default app;
