import { stageNameByExternalId } from "./common/ids";
import { GameSettings, parseGameSettings } from "./parser/parser";

onmessage = async event => {
  postMessage({
    id: event.data.id,
    payload: (
      await Promise.all(
        event.data.payload.map(async (file: File) => {
          try {
            const settings = parseGameSettings(await file.arrayBuffer());
            if (isLegalGameWithoutCPUs(settings)) {
              return [file, settings];
            } else {
              return [file, undefined];
            }
          } catch (e) {
            return [file, undefined];
          }
        })
      )
    )
      .filter(([, settings]) => settings !== undefined)
      .sort(([, a], [, b]) =>
        a.startTimestamp > b.startTimestamp
          ? 1
          : a.startTimestamp === b.startTimestamp
          ? 0
          : -1
      ),
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
