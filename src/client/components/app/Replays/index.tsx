import { For, type JSXElement, Show, createMemo, createSignal } from "solid-js";

import { DateColumn } from "~/client/components/app/Replays/columns/DateColumn";
import { PlayerColumn } from "~/client/components/app/Replays/columns/PlayerColumn";
import { ReplayTypeColumn } from "~/client/components/app/Replays/columns/ReplayTypeColumn";
import {
  StageChip,
  StageSelect,
  filterStages,
} from "~/client/components/app/Replays/filters/Stage";
import { Button } from "~/client/components/ui/button";
import { stageUrl } from "~/client/components/utils";
import type { ReplayStub } from "~/common/model/types";

export function Replays(props: {
  replays: ReplayStub[];
  onSelect: (replay: ReplayStub) => void;
  children?: JSXElement;
}) {
  const [filters, setFilters] = createSignal({
    stageIds: [] as number[],
  });
  const filteredReplays = createMemo(() =>
    props.replays.filter((replay) => {
      return filterStages(replay, filters().stageIds);
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
        <StageSelect
          current={filters().stageIds}
          onChange={(stageIds) => setFilters({ ...filters(), stageIds })}
        />
      </div>
      <Show when={Object.values(filters()).flat().length > 0}>
        <div class="col-span-full flex flex-wrap items-center gap-4">
          <For each={filters().stageIds}>
            {(stageId) => (
              <StageChip
                stageId={stageId}
                onRemove={() =>
                  setFilters({
                    ...filters,
                    stageIds: filters().stageIds.filter((s) => s !== stageId),
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
