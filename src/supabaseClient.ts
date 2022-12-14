import { createClient } from "@supabase/supabase-js";
// @ts-ignore: zoo-ids doesn't ship it's types apparently
import { generateId } from "zoo-ids";
import { ReplayData } from "~/common/types";
import { ReplayStub } from "~/state/selectionStore";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

interface ReplayRow {
  id: number;
  created_at: string;
  file_name: string;
  played_on: string;
  num_frames: number;
  external_stage_id: number;
  is_teams: boolean;
  players: {
    player_index: number;
    connect_code: string;
    display_name: string;
    nametag: string;
    external_character_id: number;
    team_id: number;
  }[];
}

type InsertRow = Omit<ReplayRow, "created_at" | "id">;

export async function downloadReplay(
  name: string
): Promise<{ data: Blob | null; error: Error | null }> {
  return await supabase.storage.from("replays").download(name);
}

export async function uploadReplay(
  file: File,
  replay: ReplayData
): Promise<{
  id: string;
  data: { path: string } | null;
  error: Error | null;
}> {
  const id = generateId();
  // TODO: check if a duplicate id has been generated
  const { data, error } = await supabase.storage
    .from("replays")
    .upload(`${id}.slp`, file);
  if (data) {
    const row: InsertRow = {
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
    return {
      id,
      data,
      error: insertResponse.error
        ? new Error(insertResponse.error.message)
        : null,
    };
  } else {
    return {
      id,
      data,
      error: error,
    };
  }
}

export async function loadFromSupabase(
  name: string,
  load?: (files: File[]) => Promise<void>
): Promise<File> {
  const { data, error } = await downloadReplay(name);
  if (data != null) {
    const file = new File([data], name);
    if (load !== undefined) {
      await load([file]);
    }
    return file;
  } else {
    throw error;
  }
}

export async function listCloudReplays(): Promise<ReplayStub[]> {
  const { data, error } = await supabase.from("replays").select();
  if (error) {
    console.error(error);
    return [];
  }
  return (data as ReplayRow[])
    .sort((a, b) =>
      a.created_at < b.created_at ? 1 : a.created_at === b.created_at ? 0 : -1
    )
    .map((row) => ({
      createdAt: row.created_at,
      fileName: row.file_name,
      id: row.id,
      stageId: row.external_stage_id,
      numFrames: row.num_frames,
      playedOn: row.played_on,
      isTeams: row.is_teams,
      playerSettings: row.players.map((p) => ({
        playerIndex: p.player_index,
        connectCode: p.connect_code,
        displayName: p.display_name,
        nametag: p.nametag,
        externalCharacterId: p.external_character_id,
        teamId: p.team_id,
      })),
    }));
}
