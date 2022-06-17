import { createOptions, Select } from "@thisbeyond/solid-select";
import { groupBy } from "rambda";
import { createMemo, For } from "solid-js";
import {
  characterNameByExternalId,
  ExternalStageName,
  stageNameByExternalId,
} from "~/common/ids";
import { Picker } from "~/common/Picker";
import { GameSettings, PlayerSettings } from "~/common/types";
import { setFile, setFilters, store } from "~/state/state";
import { Upload } from "~/sidebar/Upload";
import { NowPlaying } from "~/sidebar/NowPlaying";
import { Badge } from "~/common/Badge";

const filterProps = createOptions(
  [
    ...characterNameByExternalId.map((name) => ({
      type: "character",
      label: name,
    })),
    ...stageNameByExternalId.map((name) => ({ type: "stage", label: name })),
  ],
  {
    key: "label",
    createable: (code) => ({ type: "codeOrName", label: code }),
  }
);
export function ReplaysTab() {
  const filteredGameSettings = createMemo(() =>
    store.filteredIndexes === undefined
      ? store.gameSettings
      : store.filteredIndexes.map((i) => store.gameSettings[i])
  );
  return (
    <>
      <div class="flex h-full flex-col items-center gap-2 overflow-y-auto">
        <Upload />
        <div
          class="w-full"
          onkeydown={(e: Event) => e.stopPropagation()}
          onkeyup={(e: Event) => e.stopPropagation()}
        >
          <Select
            class="w-full rounded border border-blue-600 bg-white"
            placeholder="Filter"
            multiple
            {...filterProps}
            initialValue={store.filters}
            onChange={setFilters}
          />
        </div>
        <div class="w-full overflow-y-auto">
          <Picker
            items={filteredGameSettings()}
            render={(gameSettings: GameSettings) => (
              <GameInfo gameSettings={gameSettings} />
            )}
            onClick={async (_, index) =>
              await setFile(
                store.gameSettings.indexOf(filteredGameSettings()[index])
              )
            }
            selected={(settings) =>
              store.gameSettings.indexOf(settings) === store.currentFile
            }
          />
        </div>
        <NowPlaying />
      </div>
    </>
  );
}

function GameInfo(props: { gameSettings: GameSettings }) {
  function playerString(player: PlayerSettings): string {
    const name = [player.displayName, player.connectCode, player.nametag].find(
      (s) => s?.length > 0
    );
    const character = characterNameByExternalId[player.externalCharacterId];
    return name !== undefined ? `${name}(${character})` : character;
  }

  return (
    <>
      <div class="flex w-full items-center">
        <StageBadge stage={stageNameByExternalId[props.gameSettings.stageId]} />
        <div class="flex flex-grow flex-col items-center">
          {props.gameSettings.isTeams ? (
            <For
              each={Object.values(
                groupBy(
                  (p) => String(p.teamId),
                  props.gameSettings.playerSettings.filter((s) => s)
                )
              )}
            >
              {(team) => <div>{team.map(playerString).join(" + ")}</div>}
            </For>
          ) : (
            props.gameSettings.playerSettings
              .filter((s) => s)
              .map(playerString)
              .join(" vs ")
          )}
        </div>
      </div>
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
    "Final Destination": "bg-fuchsia-600 text-fuchsia-100",
    "Pokémon Stadium": "bg-blue-700 text-blue-100",
    Battlefield: "bg-slate-600 text-slate-100",
    "Fountain of Dreams": "bg-purple-700 text-purple-100",
    "Yoshi's Story": "bg-green-700 text-green-100",
    "Dream Land N64": "bg-orange-600 text-orange-100",
  };
  return (
    <Badge class={colors[props.stage] ?? "bg-white text-black"}>
      {abbreviations[props.stage] ?? "??"}
    </Badge>
  );
}
