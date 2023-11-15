import { For, type JSXElement, Show, createMemo, createSignal } from "solid-js";

import { DateColumn } from "~/client/components/app/Replays/columns/DateColumn";
import { PlayerColumn } from "~/client/components/app/Replays/columns/PlayerColumn";
import { ReplayTypeColumn } from "~/client/components/app/Replays/columns/ReplayTypeColumn";
import {
  CharacterChip,
  CharacterSelect,
  filterCharacters,
} from "~/client/components/app/Replays/filters/Character";
import {
  ConnectCodeChip,
  ConnectCodeSelect,
  filterConnectCodes,
} from "~/client/components/app/Replays/filters/ConnectCode";
import {
  ReplayTypeChip,
  ReplayTypeSelect,
  filterReplayTypes,
} from "~/client/components/app/Replays/filters/ReplayType";
import {
  StageChip,
  StageSelect,
  filterStages,
} from "~/client/components/app/Replays/filters/Stage";
import { Button } from "~/client/components/ui/button";
import type { ReplayStub, ReplayType } from "~/common/model/types";
import { stageUrl } from "~/common/util";

export function Replays(props: {
  replays: ReplayStub[];
  connectCodes: string[];
  onSelect: (replay: ReplayStub) => void;
  children?: JSXElement;
}) {
  const [filters, setFilters] = createSignal({
    replayTypes: [] as ReplayType[],
    stageIds: [] as number[],
    characterIds: [] as number[],
    connectCodes: [] as string[],
  });
  const filteredReplays = createMemo(() =>
    props.replays.filter((replay) => {
      return (
        filterReplayTypes(replay, filters().replayTypes) &&
        filterStages(replay, filters().stageIds) &&
        filterCharacters(replay, filters().characterIds) &&
        filterConnectCodes(replay, filters().connectCodes)
      );
    }),
  );
  const maxPlayers = createMemo(() =>
    Math.max(2, ...filteredReplays().map((r) => r.players.length)),
  );

  return (
    <div
      class="grid justify-center gap-x-8 gap-y-4 px-4"
      style={{ "grid-template-columns": `repeat(${3 + maxPlayers()}, auto)` }}
    >
      <div class="col-span-full -mx-4 flex flex-wrap items-center gap-4">
        <ReplayTypeSelect
          current={filters().replayTypes}
          onChange={(replayTypes) => setFilters({ ...filters(), replayTypes })}
        />
        <StageSelect
          current={filters().stageIds}
          onChange={(stageIds) => setFilters({ ...filters(), stageIds })}
        />
        <CharacterSelect
          current={filters().characterIds}
          onChange={(characterIds) =>
            setFilters({ ...filters(), characterIds })
          }
        />
        <ConnectCodeSelect
          allConnectCodes={props.connectCodes}
          current={filters().connectCodes}
          onChange={(connectCodes) =>
            setFilters({ ...filters(), connectCodes })
          }
        />
      </div>
      <Show when={Object.values(filters()).flat().length > 0}>
        <div class="col-span-full flex flex-wrap items-center gap-4">
          <For each={filters().replayTypes}>
            {(replayType) => (
              <ReplayTypeChip
                replayType={replayType}
                onRemove={() =>
                  setFilters({
                    ...filters(),
                    replayTypes: filters().replayTypes.filter(
                      (s) => s !== replayType,
                    ),
                  })
                }
              />
            )}
          </For>
          <For each={filters().stageIds}>
            {(stageId) => (
              <StageChip
                stageId={stageId}
                onRemove={() =>
                  setFilters({
                    ...filters(),
                    stageIds: filters().stageIds.filter((s) => s !== stageId),
                  })
                }
              />
            )}
          </For>
          <For each={filters().characterIds}>
            {(characterId) => (
              <CharacterChip
                characterId={characterId}
                onRemove={() =>
                  setFilters({
                    ...filters(),
                    characterIds: filters().characterIds.filter(
                      (s) => s !== characterId,
                    ),
                  })
                }
              />
            )}
          </For>
          <For each={filters().connectCodes}>
            {(connectCode) => (
              <ConnectCodeChip
                connectCode={connectCode}
                onRemove={() =>
                  setFilters({
                    ...filters(),
                    connectCodes: filters().connectCodes.filter(
                      (s) => s !== connectCode,
                    ),
                  })
                }
              />
            )}
          </For>
        </div>
      </Show>
      <div class="col-span-full -mx-4 grid grid-cols-[subgrid] border-b px-4 pb-2 [&>div]:text-center [&>div]:text-sm">
        <div>Type</div>
        <div>Date</div>
        <div>Stage</div>
        <div>Player 1</div>
        <div>Player 2</div>
        {maxPlayers() > 2 && <div>Player 3</div>}
        {maxPlayers() > 3 && <div>Player 4</div>}
      </div>
      <Show
        when={filteredReplays().length > 0}
        fallback={
          <div class="col-span-full mx-auto mt-8">{props.children}</div>
        }
      >
        <div class="col-span-full grid grid-cols-[subgrid]">
          <For each={filteredReplays()}>
            {(replay) => (
              <Button
                variant="ghost"
                class="col-span-full grid h-auto grid-cols-[subgrid] py-2"
                onClick={() => props.onSelect(replay)}
              >
                <ReplayTypeColumn replay={replay} />
                <DateColumn replay={replay} />
                <img src={stageUrl(replay.stageId)} class="h-12 rounded-sm" />
                <PlayerColumn player={replay.players[0]} />
                <PlayerColumn player={replay.players[1]} />
                {maxPlayers() > 2 && (
                  <PlayerColumn player={replay.players[2]} />
                )}
                {maxPlayers() > 3 && (
                  <PlayerColumn player={replay.players[3]} />
                )}
              </Button>
            )}
          </For>
        </div>
      </Show>
    </div>
  );
}
