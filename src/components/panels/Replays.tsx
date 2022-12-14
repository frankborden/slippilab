import { createOptions, Select } from "@thisbeyond/solid-select";
import { createMemo, For, Show } from "solid-js";
import { characterNameByExternalId, stageNameByExternalId } from "~/common/ids";
import { Picker } from "~/components/common/Picker";
import { StageBadge } from "~/components/common/Badge";
import { ReplayStub, SelectionStore } from "~/state/selectionStore";

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
export function Replays(props: { selectionStore: SelectionStore }) {
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
            initialValue={props.selectionStore.data.filters}
            onChange={props.selectionStore.setFilters}
          />
        </div>
        <Show
          when={props.selectionStore.data.filteredStubs.length > 0}
          fallback={<div>No matching results</div>}
        >
          <Picker
            items={props.selectionStore.data.filteredStubs}
            render={(stub) => <GameInfo replayStub={stub} />}
            onClick={(fileAndSettings) =>
              props.selectionStore.select(fileAndSettings)
            }
            selected={(stub) =>
              props.selectionStore.data.selectedFileAndStub?.[1] === stub
            }
            estimateSize={(stub) =>
              stub.playerSettings.filter(Boolean).length === 4 ? 56 : 32
            }
          />
        </Show>
      </div>
    </>
  );
}

function GameInfo(props: { replayStub: ReplayStub }) {
  function playerString(player: ReplayStub["playerSettings"][0]): string {
    const name = [player.displayName, player.connectCode, player.nametag].find(
      (s) => s?.length > 0
    );
    const character = characterNameByExternalId[player.externalCharacterId];
    return name !== undefined ? `${name}(${character})` : character;
  }

  const teams = createMemo(() => {
    const teams: ReplayStub["playerSettings"][0][][] = [[], [], []];
    props.replayStub.playerSettings
      .filter(Boolean)
      .forEach((player) => teams[player.teamId ?? 0].push(player));
    return teams.filter((team) => team.length > 0);
  });

  return (
    <>
      <div class="flex w-full items-center">
        <StageBadge stageId={props.replayStub.stageId} />
        <div class="flex flex-grow flex-col items-center">
          {props.replayStub.playerSettings.filter(Boolean).length === 4 ? (
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
