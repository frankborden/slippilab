import { createOptions, Select } from "@thisbeyond/solid-select";
import { createMemo, For, Show } from "solid-js";
import { characterNameByExternalId, stageNameByExternalId } from "~/common/ids";
import { Picker } from "~/components/common/Picker";
import { GameSettings, PlayerSettings } from "~/common/types";
import { StageBadge } from "~/components/common/Badge";
import { localLibrary } from "~/state/selectionStore";

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
export function Replays() {
  return (
    <>
      <div class="flex max-h-96 w-full flex-col items-center gap-2 overflow-y-auto sm:h-full md:max-h-screen">
        <div
          class="w-full"
          // don't trigger global shortcuts when typing in the filter box
          onkeydown={(e: Event) => e.stopPropagation()}
          onkeyup={(e: Event) => e.stopPropagation()}
        >
          <Select
            class="w-full rounded border border-slate-600 bg-white"
            placeholder="Filter"
            multiple
            {...filterProps}
            initialValue={localLibrary.data.filters}
            onChange={localLibrary.setFilters}
          />
        </div>
        <Show
          when={localLibrary.data.filteredFilesAndSettings.length > 0}
          fallback={<div>No matching results</div>}
        >
          <Picker
            items={localLibrary.data.filteredFilesAndSettings}
            render={([file, gameSettings]) => (
              <GameInfo replayStub={gameSettings} />
            )}
            onClick={(fileAndSettings) => localLibrary.select(fileAndSettings)}
            selected={([file, gameSettings]) =>
              localLibrary.data.selectedFileAndSettings?.[0] === file &&
              localLibrary.data.selectedFileAndSettings?.[1] === gameSettings
            }
            estimateSize={([file, gameSettings]) =>
              gameSettings.isTeams ? 56 : 32
            }
          />
        </Show>
      </div>
    </>
  );
}

function GameInfo(props: { replayStub: GameSettings }) {
  function playerString(player: PlayerSettings): string {
    const name = [player.displayName, player.connectCode, player.nametag].find(
      (s) => s?.length > 0
    );
    const character = characterNameByExternalId[player.externalCharacterId];
    return name !== undefined ? `${name}(${character})` : character;
  }

  const teams = createMemo(() => {
    const teams: PlayerSettings[][] = [[], [], []];
    props.replayStub.playerSettings
      .filter(Boolean)
      .forEach((player) => teams[player.teamId].push(player));
    return teams.filter((team) => team.length > 0);
  });

  return (
    <>
      <div class="flex w-full items-center">
        <StageBadge stageId={props.replayStub.stageId} />
        <div class="flex flex-grow flex-col items-center">
          {props.replayStub.isTeams ? (
            <For each={teams()}>
              {(team) => <div>{team.map(playerString).join(" + ")}</div>}
            </For>
          ) : (
            props.replayStub.playerSettings
              .filter((s) => s)
              .map(playerString)
              .join(" vs ")
          )}
        </div>
      </div>
    </>
  );
}
