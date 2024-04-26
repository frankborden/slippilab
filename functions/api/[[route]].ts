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
    return c.json(
      await createClient(c.env.VITE_SUPABASE_URL, c.env.VITE_SUPABASE_ANON_KEY)
        .from("replays")
        .select("*")
    );
  })
  .get("/replay/:id", async (c) => {
    const res = await createClient(
      c.env.VITE_SUPABASE_URL,
      c.env.VITE_SUPABASE_ANON_KEY
    )
      .storage.from("replays")
      .download(c.req.param("id"));
    if (!res.data) {
      return c.notFound();
    }
    return c.body(await res.data.arrayBuffer());
  })
  .post("/replay", async (c) => {
    const { file } = await c.req.parseBody();
    const replay = parseReplay(
      new UbjsonDecoder().decode(
        new Uint8Array(await (file as File).arrayBuffer())
      )
    );
    const id: string = generateId();
    const supabase = createClient(
      c.env.VITE_SUPABASE_URL,
      c.env.VITE_SUPABASE_ANON_KEY
    );
    const { data, error } = await supabase.storage
      .from("replays")
      .upload(`${id}.slp`, file as File);
    if (data) {
      const row = {
        file_name: `${id}.slp`,
        played_on: replay.settings.startTimestamp,
        num_frames: replay.frames.length,
        external_stage_id: replay.settings.stageId,
        is_teams: replay.settings.isTeams,
        players: replay.settings.playerSettings.filter(Boolean).map((p) => ({
          player_index: p.playerIndex,
          connect_code: p.connectCode ?? "",
          display_name: p.displayName ?? "",
          nametag: p.nametag ?? "",
          external_character_id: p.externalCharacterId,
          team_id: p.teamId,
        })),
      };
      const insertResponse = await supabase.from("replays").insert(row);
      return c.json({
        id,
        data,
        error: insertResponse.error?.message,
      });
    } else {
      return c.json({
        id,
        data,
        error: error,
      });
    }
  });

export const onRequest = handle(app);
