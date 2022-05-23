import { stageNameByExternalId } from "./common/ids";
import { GameSettings, parseGameSettings } from "./parser/parser";

onmessage = async event => {
  const parsedSettings: [File, GameSettings | "skipped" | "failed"][] =
    await Promise.all(
      event.data.payload.map(async (file: File) => {
        try {
          const settings = parseGameSettings(await file.arrayBuffer());
          if (isLegalGameWithoutCPUs(settings)) {
            return [file, settings];
          } else {
            return [file, "skipped"];
          }
        } catch (e) {
          console.error(e);
          return [file, "failed"];
        } finally {
          // signal progress
          postMessage({
            id: event.data.id,
          });
        }
      })
    );
  const goodFilesAndSettings = parsedSettings
    .filter(
      (fileAndSettings): fileAndSettings is [File, GameSettings] =>
        fileAndSettings[1] !== "failed" && fileAndSettings[1] !== "skipped"
    )
    .sort(([, a], [, b]) =>
      a.startTimestamp > b.startTimestamp
        ? 1
        : a.startTimestamp === b.startTimestamp
        ? 0
        : -1
    );
  const failedFilenames = parsedSettings
    .filter(([, settings]) => settings === "failed")
    .map(([file]) => file.name);
  const skipCount = parsedSettings.filter(
    ([, settings]) => settings === "skipped"
  ).length;
  postMessage({
    id: event.data.id,
    payload: {
      goodFilesAndSettings,
      skipCount,
      failedFilenames,
    },
  });
};

function isLegalGameWithoutCPUs(gameSettings: GameSettings): boolean {
  const stageName = stageNameByExternalId[gameSettings.stageId];
  if (
    ![
      "Battlefield",
      "Fountain of Dreams",
      "Yoshi's Story",
      "Dream Land N64",
      "Pokémon Stadium",
      "Final Destination",
    ].includes(stageName)
  ) {
    return false;
  }
  if (
    gameSettings.playerSettings
      .filter(p => p)
      .some(p => p.playerType === 1 || p.externalCharacterId >= 26)
  ) {
    return false;
  }
  return true;
}
