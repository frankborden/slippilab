import { ReplayData } from "@slippilab/common";
import { charactersExt } from "@slippilab/common";

import { Falco } from "~/client/viewer/models/Falco";
import { Falcon } from "~/client/viewer/models/Falcon";
import { Fox } from "~/client/viewer/models/Fox";
import { Jigglypuff } from "~/client/viewer/models/Jigglypuff";
import { Marth } from "~/client/viewer/models/Marth";
import { Peach } from "~/client/viewer/models/Peach";
import { Sheik } from "~/client/viewer/models/Sheik";

export function Character({
  replay,
  playerIndex,
}: {
  replay: ReplayData;
  playerIndex: number;
}) {
  switch (
    charactersExt[
      replay.settings.playerSettings.find((p) => p.playerIndex === playerIndex)!
        .externalCharacterId
    ]
  ) {
    case "Fox":
      return (
        <Fox
          position={[
            0,
            replay.frames[0].players.find((p) => p.playerIndex === playerIndex)!
              .state.yPosition,
            replay.frames[0].players.find((p) => p.playerIndex === playerIndex)!
              .state.xPosition,
          ]}
        />
      );
    case "Falco":
      return <Falco />;
    case "Captain Falcon":
      return (
        <Falcon
          position={[
            0,
            replay.frames[0].players.find((p) => p.playerIndex === playerIndex)!
              .state.yPosition,
            replay.frames[0].players.find((p) => p.playerIndex === playerIndex)!
              .state.xPosition,
          ]}
        />
      );
    case "Marth":
      return <Marth />;
    case "Sheik":
      return <Sheik />;
    case "Peach":
      return <Peach />;
    case "Jigglypuff":
      return <Jigglypuff />;
    default:
      return null;
  }
}
