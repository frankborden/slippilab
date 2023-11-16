import { For, type JSXElement, Show, createMemo, createSignal } from "solid-js";

import { DateColumn } from "~/client/components/app/Replays/columns/DateColumn";
import { PlayerColumn } from "~/client/components/app/Replays/columns/PlayerColumn";
import { ReplayTypeColumn } from "~/client/components/app/Replays/columns/ReplayTypeColumn";
import {
  CharacterChip,
  CharacterSelect,
} from "~/client/components/app/Replays/filters/Character";
import {
  ConnectCodeChip,
  ConnectCodeSelect,
} from "~/client/components/app/Replays/filters/ConnectCode";
import {
  ReplayTypeChip,
  ReplayTypeSelect,
} from "~/client/components/app/Replays/filters/ReplayType";
import {
  StageChip,
  StageSelect,
} from "~/client/components/app/Replays/filters/Stage";
import { Button } from "~/client/components/ui/button";
import { cn } from "~/client/components/utils";
import type { ReplayStub, ReplayType } from "~/common/model/types";
import { stageUrl } from "~/common/util";

export interface Filters {
  replayTypes: ReplayType[];
  stageIds: number[];
  characterIds: number[];
  connectCodes: string[];
}

export function Replays(props: {
  replays: ReplayStub[];
  connectCodes: string[];
  filters: Filters;
  onFiltersChanged: (filters: Filters) => void;
  pageIndex: number;
  pageTotalCount: number;
  onPageChange: (pageIndex: number) => void;
  onSelect: (replay: ReplayStub) => void;
  children?: JSXElement;
}) {
  const maxPlayers = createMemo(() =>
    Math.max(2, ...props.replays.map((r) => r.players.length)),
  );

  return (
    <div
      class="grid justify-center gap-x-8 gap-y-4 px-4"
      style={{ "grid-template-columns": `repeat(${3 + maxPlayers()}, auto)` }}
    >
      <div class="col-span-full -mx-4 flex flex-wrap items-center gap-4">
        <ReplayTypeSelect
          current={props.filters.replayTypes}
          onChange={(replayTypes) =>
            props.onFiltersChanged({ ...props.filters, replayTypes })
          }
        />
        <StageSelect
          current={props.filters.stageIds}
          onChange={(stageIds) =>
            props.onFiltersChanged({ ...props.filters, stageIds })
          }
        />
        <CharacterSelect
          current={props.filters.characterIds}
          onChange={(characterIds) =>
            props.onFiltersChanged({ ...props.filters, characterIds })
          }
        />
        <ConnectCodeSelect
          allConnectCodes={props.connectCodes}
          current={props.filters.connectCodes}
          onChange={(connectCodes) =>
            props.onFiltersChanged({ ...props.filters, connectCodes })
          }
        />
      </div>
      <Show when={Object.values(props.filters).flat().length > 0}>
        <div class="col-span-full flex flex-wrap items-center gap-4">
          <For each={props.filters.replayTypes}>
            {(replayType) => (
              <ReplayTypeChip
                replayType={replayType}
                onRemove={() =>
                  props.onFiltersChanged({
                    ...props.filters,
                    replayTypes: props.filters.replayTypes.filter(
                      (s) => s !== replayType,
                    ),
                  })
                }
              />
            )}
          </For>
          <For each={props.filters.stageIds}>
            {(stageId) => (
              <StageChip
                stageId={stageId}
                onRemove={() =>
                  props.onFiltersChanged({
                    ...props.filters,
                    stageIds: props.filters.stageIds.filter(
                      (s) => s !== stageId,
                    ),
                  })
                }
              />
            )}
          </For>
          <For each={props.filters.characterIds}>
            {(characterId) => (
              <CharacterChip
                characterId={characterId}
                onRemove={() =>
                  props.onFiltersChanged({
                    ...props.filters,
                    characterIds: props.filters.characterIds.filter(
                      (s) => s !== characterId,
                    ),
                  })
                }
              />
            )}
          </For>
          <For each={props.filters.connectCodes}>
            {(connectCode) => (
              <ConnectCodeChip
                connectCode={connectCode}
                onRemove={() =>
                  props.onFiltersChanged({
                    ...props.filters,
                    connectCodes: props.filters.connectCodes.filter(
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
        when={props.replays.length > 0}
        fallback={
          <div class="col-span-full mx-auto mt-8">{props.children}</div>
        }
      >
        <div class="col-span-full grid grid-cols-[subgrid]">
          <For each={props.replays}>
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
        <div class="col-span-full flex items-center justify-end">
          <div class="col-span-full flex items-center justify-between gap-8">
            <div class="text-sm">
              Page {props.pageIndex + 1} of {props.pageTotalCount}
            </div>
            <div
              class={cn(
                "flex items-center gap-1",
                "[&>button]:text-2xl",
                "[&>button:disabled]:text-foreground/40",
              )}
            >
              <button
                class={cn("i-tabler-chevron-left-pipe")}
                disabled={props.pageIndex === 0}
                onClick={() => props.onPageChange(0)}
              ></button>
              <button
                class={cn("i-tabler-chevron-left")}
                disabled={props.pageIndex === 0}
                onClick={() => props.onPageChange(props.pageIndex - 1)}
              ></button>
              <button
                class={cn("i-tabler-chevron-right")}
                disabled={props.pageIndex === props.pageTotalCount - 1}
                onClick={() => props.onPageChange(props.pageIndex + 1)}
              ></button>
              <button
                class={cn("i-tabler-chevron-right-pipe")}
                disabled={props.pageIndex === props.pageTotalCount - 1}
                onClick={() => props.onPageChange(props.pageTotalCount - 1)}
              ></button>
            </div>
          </div>
        </div>
      </Show>
    </div>
  );
}
