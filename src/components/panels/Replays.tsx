import { createOptions, Select } from "@thisbeyond/solid-select";
import { createMemo, For, Show } from "solid-js";
import { characterNameByExternalId, stageNameByExternalId } from "~/common/ids";
import { Picker } from "~/components/common/Picker";
import { PlayerSettings } from "~/common/types";
import { StageBadge } from "~/components/common/Badge";
// import { selectionStore, setFilters, select } from "~/state/selectionStore";
import { Library } from "~/state/library";
import { ReplayStub } from "~/state/sources";

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
export function Replays(props: { library: Library<ReplayStub> }) {
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
            initialValue={selectionStore.filters}
            onChange={setFilters}
          />
        </div>
        <Show
          when={selectionStore.filteredFilesAndSettings.length > 0}
          fallback={<div>No matching results</div>}
        >
          <Picker
            items={selectionStore.filteredFilesAndSettings}
            render={([file, gameSettings]) => (
              <GameInfo replayStub={gameSettings} />
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
        </Show>
      </div>
    </>
  );
}

function GameInfo(props: { replayStub: ReplayStub }) {
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
