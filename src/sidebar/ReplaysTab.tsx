import { Badge, Box, Button, Center, HStack } from "@hope-ui/solid";
import { groupBy, zip } from "rambda";
import { Accessor, createMemo, Show } from "solid-js";
import {
  characterNameByExternalId,
  ExternalStageName,
  stageNameByExternalId,
} from "../common/ids";
import { Picker } from "../common/Picker";
import { GameSettings, PlayerSettings } from "../common/types";
import { nextFile, previousFile, setFile, state } from "../state";
import { Upload } from "./Upload";

export function ReplaysTab() {
  const filesWithGameSettings = createMemo(() =>
    zip(
      state.files(),
      state.gameSettings().length > 0
        ? state.gameSettings()
        : Array(state.files().length).fill(undefined)
    )
  ) as Accessor<[File, GameSettings | undefined][]>;
  return (
    <>
      <Box height="$full" display="flex" flexDirection="column">
        <Show when={state.files().length > 0}>
          <Center>
            <Button onClick={nextFile}>Next</Button>
            <Button onClick={previousFile}>Previous</Button>
          </Center>
          <Box overflowY="auto">
            <Picker
              items={filesWithGameSettings()}
              render={([file, gameSettings]: [
                File,
                GameSettings | undefined
              ]) =>
                gameSettings ? (
                  <GameInfo gameSettings={gameSettings} />
                ) : (
                  file.name
                )
              }
              onClick={(_, index) => {
                setFile(index);
              }}
              selected={state.currentFile()}
            />
          </Box>
        </Show>
        <Center>
          <Upload />
        </Center>
      </Box>
    </>
  );
}

function GameInfo(props: { gameSettings: GameSettings }) {
  function playerString(player: PlayerSettings) {
    const name = [player.displayName, player.connectCode, player.nametag].find(
      s => s?.length > 0
    );
    const character = characterNameByExternalId[player.externalCharacterId];
    return name ? `${name}(${character})` : character;
  }

  return (
    <>
      <HStack width="$full">
        <StageBadge stage={stageNameByExternalId[props.gameSettings.stageId]} />
        <Box flexGrow="1" display="flex" flexDirection="column">
          {props.gameSettings.isTeams
            ? Object.values(
                groupBy(
                  p => String(p.teamId),
                  props.gameSettings.playerSettings.filter(s => s)
                )
              ).map(team => (
                <Box color={["red", "blue", "green"][team[0].teamId]}>
                  {team.map(playerString).join(" + ")}
                </Box>
              ))
            : props.gameSettings.playerSettings
                .filter(s => s)
                .map(playerString)
                .join(" vs ")}
        </Box>
      </HStack>
    </>
  );
}

function StageBadge(props: { stage: ExternalStageName }) {
  const abbreviations: Partial<{ [key in ExternalStageName]: string }> = {
    "Final Destination": "FD",
    "Pokémon Stadium": "PS",
    Battlefield: "BF",
    "Fountain of Dreams": "FoD",
    "Yoshi's Story": "YS",
    "Dream Land N64": "DL",
  };
  const colors: Partial<{ [key in ExternalStageName]: string }> = {
    "Final Destination": "fuchsia",
    "Pokémon Stadium": "darkolivegreen",
    Battlefield: "dimgray",
    "Fountain of Dreams": "darkviolet",
    "Yoshi's Story": "green",
    "Dream Land N64": "chocolate",
  };
  return (
    <Badge backgroundColor={colors[props.stage] ?? "black"}>
      {abbreviations[props.stage] ?? "??"}
    </Badge>
  );
}
