import { createOptions, Select } from "@thisbeyond/solid-select";
import { groupBy } from "rambda";
import { For } from "solid-js";
import { characterNameByExternalId, stageNameByExternalId } from "~/common/ids";
import { Picker } from "~/common/Picker";
import { GameSettings, PlayerSettings } from "~/common/types";
import { StageBadge } from "~/common/Badge";
import {
  nextFile,
  previousFile,
  select,
  selectionStore,
  setFilters,
} from "~/state/selectionStore";
import { PrimaryButton } from "~/common/Button";

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
  return (
    <>
      <div class="flex h-full flex-col items-center gap-2 overflow-y-auto">
        <div
          class="w-full"
          onkeydown={(e: Event) => e.stopPropagation()}
          onkeyup={(e: Event) => e.stopPropagation()}
        >
          <Select
            class="w-full rounded border border-slate-600 bg-white"
            placeholder="Filter"
            multiple
            {...filterProps}
            initialValue={selectionStore.filters}
            onChange={setFilters}
          />
        </div>
        <Picker
          items={selectionStore.filteredFilesAndSettings}
          render={([file, gameSettings]) => (
            <GameInfo gameSettings={gameSettings} />
          )}
          onClick={(fileAndSettings) => select(fileAndSettings)}
          selected={([file, gameSettings]) =>
            selectionStore.selectedFileAndSettings?.[0] === file &&
            selectionStore.selectedFileAndSettings?.[1] === gameSettings
          }
          estimateSize={([file, gameSettings]) =>
            gameSettings.isTeams ? 56 : 32
          }
        />
        <div class="flex w-full items-center justify-between gap-4">
          <PrimaryButton onClick={previousFile}>
            <div class="material-icons cursor-pointer">arrow_upward</div>
          </PrimaryButton>
          <PrimaryButton onClick={nextFile}>
            <div class="material-icons cursor-pointer">arrow_downward</div>
          </PrimaryButton>
        </div>
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
        <StageBadge stageId={props.gameSettings.stageId} />
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
