import { Badge, Box, Button, hope, HStack, VStack } from "@hope-ui/solid";
import { createOptions, Select } from "@thisbeyond/solid-select";
import { groupBy, zip } from "rambda";
import {
  Accessor,
  createEffect,
  createMemo,
  createSignal,
  Show,
} from "solid-js";
import {
  characterNameByExternalId,
  ExternalCharacterName,
  ExternalStageName,
  stageNameByExternalId,
} from "../common/ids";
import { Picker } from "../common/Picker";
import { GameSettings, PlayerSettings } from "../common/types";
import { nextFile, previousFile, setFile, state } from "../state";
import { Upload } from "./Upload";
import "./select.css";
import { ArrowLeft, ArrowRight } from "phosphor-solid";

type Filter =
  | { type: "character"; label: ExternalCharacterName }
  | { type: "stage"; label: ExternalStageName }
  | { type: "codeOrName"; label: string };

export function ReplaysTab() {
  const filesWithGameSettings = createMemo(() =>
    zip(
      state.files(),
      state.gameSettings().length > 0
        ? state.gameSettings()
        : Array(state.files().length).fill(undefined)
    )
  ) as Accessor<[File, GameSettings | undefined][]>;
  const [filters, setFilters] = createSignal<Filter[]>([]);
  const filteredFilesWithGameSettings = createMemo(() => {
    if (filters().length === 0) return filesWithGameSettings();
    return filesWithGameSettings().filter(([_, gameSettings]) =>
      filters().every(filter => {
        if (!gameSettings) return true;
        switch (filter.type) {
          case "character":
            const numTimesCharacterInFilter = filters().filter(
              f => f.type === "character" && f.label === filter.label
            ).length;
            return (
              gameSettings.playerSettings.filter(
                p =>
                  filter.label ===
                  characterNameByExternalId[p.externalCharacterId]
              ).length == numTimesCharacterInFilter
            );
          case "stage":
            return stageNameByExternalId[gameSettings.stageId] === filter.label;
          case "codeOrName":
            return gameSettings.playerSettings.some(p =>
              [
                p.connectCode?.toLowerCase(),
                p.displayName?.toLowerCase(),
                p.nametag?.toLowerCase(),
              ].includes(filter.label.toLowerCase())
            );
        }
      })
    );
  });
  const filterProps = createOptions(
    [
      ...characterNameByExternalId.map(name => ({
        type: "character",
        label: name,
      })),
      ...stageNameByExternalId.map(name => ({ type: "stage", label: name })),
    ],
    {
      key: "label",
      createable: code => ({ type: "codeOrName", label: code }),
    }
  );
  const HopeSelect = hope(Select);
  return (
    <>
      <VStack height="$full" gap="$2">
        <HStack width="$full" justifyContent="space-between">
          <Upload />
          <HStack gap="$2">
            <Show when={state.files().length > 0}>
              <Button
                onClick={previousFile}
                variant="subtle"
                leftIcon={<ArrowLeft size="24" />}
              >
                Previous
              </Button>
              <Button
                onClick={nextFile}
                variant="subtle"
                rightIcon={<ArrowRight size="24" />}
              >
                Next
              </Button>
            </Show>
          </HStack>
        </HStack>
        <Show when={state.files().length > 0}>
          <Box
            width="$full"
            onkeydown={(e: Event) => e.stopPropagation()}
            onkeyup={(e: Event) => e.stopPropagation()}
          >
            <HopeSelect
              class="custom"
              width="$full"
              placeholder="Filter"
              multiple
              {...filterProps}
              onChange={setFilters}
            />
          </Box>
          <Box width="$full" overflowY="auto">
            <Picker
              items={filteredFilesWithGameSettings()}
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
              onClick={(_, index) =>
                setFile(
                  filesWithGameSettings().indexOf(
                    filteredFilesWithGameSettings()[index]
                  )
                )
              }
              selected={state.currentFile()}
            />
          </Box>
        </Show>
      </VStack>
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
        <VStack flexGrow="1">
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
        </VStack>
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
    "Pokémon Stadium": "blue",
    Battlefield: "dimgray",
    "Fountain of Dreams": "darkviolet",
    "Yoshi's Story": "green",
    "Dream Land N64": "chocolate",
  };
  return (
    <Badge backgroundColor={colors[props.stage] ?? "black"} color="white">
      {abbreviations[props.stage] ?? "??"}
    </Badge>
  );
}
