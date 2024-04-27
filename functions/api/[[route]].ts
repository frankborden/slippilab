import { Hono } from "hono";
import { handle } from "hono/cloudflare-pages";
import { D1Database, R2Bucket } from "@cloudflare/workers-types";
import { createClient } from "@supabase/supabase-js";
import { parseReplay } from "~/parser/parser";
import { UbjsonDecoder } from "@jsonjoy.com/json-pack/lib/ubjson";
// @ts-ignore: zoo-ids doesn't ship it's types apparently
import { generateId } from "zoo-ids";

interface Env {
  Bindings: {
    BUCKET: R2Bucket;
    DB: D1Database;
    VITE_SUPABASE_ANON_KEY: string;
    VITE_SUPABASE_URL: string;
  };
}

const app = new Hono<Env>()
  .basePath("/api")
  .get("/replays", async (c) => {
    const { DB, VITE_SUPABASE_ANON_KEY, VITE_SUPABASE_URL } = c.env;
    const cfRes = DB.prepare("SELECT * FROM replays").all();
    const sbRes = createClient(VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY)
      .from("replays")
      .select("*");

    const [cf, sb] = await Promise.all([cfRes, sbRes]);
    const merged = cf.results
      .map((r) => ({
        ...r,
        players: JSON.parse(r.players as string),
      }))
      .concat(sb.data!);

    return c.json({ data: merged });
  })
  .get("/replay/:id", async (c) => {
    const { BUCKET, VITE_SUPABASE_ANON_KEY, VITE_SUPABASE_URL } = c.env;
    const cfRes = await BUCKET.get(c.req.param("id"));
    if (cfRes) {
      return c.body(await cfRes.arrayBuffer());
    }

    const sbRes = await createClient(VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY)
      .storage.from("replays")
      .download(c.req.param("id"));
    if (!sbRes.data) {
      return c.notFound();
    }
    return c.body(await sbRes.data.arrayBuffer());
  })
  .post("/replay", async (c) => {
    const { BUCKET, DB } = c.env;
    const { file } = await c.req.parseBody();
    const replay = parseReplay(
      new UbjsonDecoder().decode(
        new Uint8Array(await (file as File).arrayBuffer())
      )
    );
    const id: string = generateId();

    await BUCKET.put(`${id}.slp`, await (file as File).arrayBuffer());
    await DB.prepare(
      "INSERT INTO replays (file_name, created_at, played_on, num_frames, external_stage_id, is_teams, players) VALUES (?, ?, ?, ?, ?, ?, ?)"
    )
      .bind(
        `${id}.slp`,
        new Date().toISOString(),
        replay.settings.startTimestamp,
        replay.frames.length,
        replay.settings.stageId,
        replay.settings.isTeams,
        JSON.stringify(
          replay.settings.playerSettings.filter(Boolean).map((p) => ({
            player_index: p.playerIndex,
            connect_code: p.connectCode ?? "",
            display_name: p.displayName ?? "",
            nametag: p.nametag ?? "",
            external_character_id: p.externalCharacterId,
            team_id: p.teamId,
          }))
        )
      )
      .run();
    return c.json({ id, data: id });
  });

export const onRequest = handle(app);
