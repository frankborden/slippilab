import { createClient } from "@supabase/supabase-js";
import { parseReplay } from "./parser.mjs";

const url = "";
const key = "";
const supabase = createClient(url, key);

console.log("fetching files");
const listResponse = await supabase.storage.from("replays").list("", {
  limit: 99999,
});
const fileMetas = [...listResponse.data].sort((a, b) =>
  a.created_at > b.created_at ? 1 : a.created_at === b.created_at ? 0 : -1
);

console.log(fileMetas.length, "files found");

for (let i = 0; i < fileMetas.length; i++) {
  const fileMeta = fileMetas[i];
  console.log(`${i + 1}/${fileMetas.length}`, fileMeta.name);
  const fileResponse = await supabase.storage
    .from("replays")
    .download(fileMeta.name);
  const blob = fileResponse.data;
  const buffer = await blob.arrayBuffer();
  try {
    const replay = parseReplay(buffer);
    const row = {
      file_name: fileMeta.name,
      is_teams: replay.settings.isTeams,
      played_on: replay.settings.startTimestamp,
      num_frames: replay.frames.length,
      external_stage_id: replay.settings.stageId,
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
    if (insertResponse.error !== null) {
      console.log("Error: insert failed");
    }
  } catch (e) {
    console.log("Error: ", e);
  }
}

console.log("Done");

// Errors seen:

// "Game end event not found":
// AdventurousThornyDogfish
// CalculatingFumblingRaven.slp
// DearestComplicatedSardine.slp
// ForkedOfficialSheep.slp
// GratefulFragrantKookabura.slp
// IncredibleDigitalOctopus.slp
// LostGiftedGerbil.slp
// LuxuriousColossalLouse.slp
// MistyIgnorantSwan.slp
// PrettyStarryWeasel.slp
// SympatheticEasyGnat.slp
// TightJauntyLobster.slp
// TrustyTrimBuffalo.slp
// WatchfulSpottedLoris.slp

// "Offset is outside the bounds of the DataView":
// UnfortunateHilariousGnat.slp
