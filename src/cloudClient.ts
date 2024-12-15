import { ReplayData } from "~/common/types";
import { ReplayStub } from "~/state/selectionStore";

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
  try {
    const res = await fetch(`/api/replay/${name}`);
    const data = await res.blob();
    return { data, error: null };
  } catch (e) {
    return { data: null, error: new Error(`failed to fetch ${name}`) };
  }
}

export async function uploadReplay(
  file: File,
  replay: ReplayData
): Promise<{
  id: string;
  data: { path: string } | null;
  error: Error | null;
}> {
  const res = await fetch("/api/replay", {
    method: "POST",
    body: file,
  });
  return await res.json();
}

export async function loadFromCloud(
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
  const res = await fetch("/api/replays");
  const { data, error } = await res.json();
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
