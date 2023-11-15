import cn from "clsx";
import { ComponentProps, For, Show, createMemo, splitProps } from "solid-js";

import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "~/client/components/ui/hovercard";
import { createRankQuery } from "~/client/state/api";
import type { PlayerStub } from "~/common/model/types";

export function PlayerColumn(props: { player?: PlayerStub }) {
  return (
    <Show when={props.player} fallback="N/A">
      {(player) => (
        <HoverCard>
          <HoverCardTrigger
            class="flex gap-3 items-center"
            disabled={!player().connectCode}
          >
            <CharacterIcon
              externalCharacterId={player().externalCharacterId}
              costumeIndex={player().costumeIndex}
              class="h-6"
            />
            <Show
              when={player().connectCode}
              fallback={
                <div class="text-base">Player {player().playerIndex + 1}</div>
              }
            >
              <div>
                <div class="text-start text-sm">{player().displayName}</div>
                <div class="flex gap-1 items-center">
                  <RankIcon connectCode={player().connectCode} />
                  <div
                    class={cn("text-xs", "text-zinc-500", "dark:text-zinc-400")}
                  >
                    {player().connectCode}
                  </div>
                </div>
              </div>
            </Show>
          </HoverCardTrigger>
          <HoverCardContent>
            <RankCard connectCode={player().connectCode} />
          </HoverCardContent>
        </HoverCard>
      )}
    </Show>
  );
}

function RankCard(props: { connectCode?: string }) {
  const rankQuery = createMemo(() =>
    props.connectCode ? createRankQuery(() => props.connectCode!) : undefined,
  );
  const totalGames = createMemo(() =>
    !rankQuery()?.isSuccess
      ? 0
      : rankQuery()!.data!.data.characters.reduce(
          (acc, c) => acc + c.gameCount,
          0,
        ) ?? 100,
  );
  return (
    <Show
      when={rankQuery() && rankQuery()!.isSuccess && rankQuery()!.data?.data}
      fallback={<div class="h-4 w-4" />}
    >
      {(result) => (
        <>
          <div class="flex justify-between items-center gap-6">
            <div class="flex flex-col items-center">
              <img
                src={`/ranks/${result().rank.replace(" ", "_")}.svg`}
                title={`${result().rank} (${Math.round(result().rating)})`}
                class="h-10"
              />
              <Show when={result().leaderboardRegion}>
                <div class="text-sm">
                  {result().leaderboardRegion} #{result().leaderboardPlacement}
                </div>
              </Show>
            </div>
            <div>
              <div class="text-lg font-medium">{result().displayName}</div>
              <div class="text-sm">{props.connectCode}</div>
              <div class="text-sm">{result().continent}</div>
            </div>

            <div>
              <div class="text-lg">{result().rank}</div>
              <div class="text-sm">{result().rating.toFixed(2)}</div>
              <div class="text-sm">
                {result().wins}W - {result().losses}L
              </div>
            </div>
          </div>
          <Show when={result().characters.length > 0}>
            <div class="mt-4 flex flex-col gap-2">
              <div class="font-medium">Usage</div>
              <For
                each={result().characters.filter(
                  (c) => c.gameCount / totalGames() > 0.05,
                )}
              >
                {({ characterName, gameCount, id }) => (
                  <div class="ml-2 flex items-center gap-2">
                    <img
                      src={`/stockicons/${id}/0.png`}
                      title={characterName}
                      class="h-6 w-6"
                    />
                    <div class="grow">
                      <div
                        class={cn(
                          "h-4 border rounded-sm",
                          "bg-indigo-400 border-indigo-700",
                          "dark:bg-indigo-500 dark:border-indigo-700",
                        )}
                        style={{
                          width: `${(gameCount / totalGames()) * 100}%`,
                        }}
                      ></div>
                    </div>
                  </div>
                )}
              </For>
            </div>
          </Show>
        </>
      )}
    </Show>
  );
}

export function CharacterIcon(
  props: {
    externalCharacterId: number;
    costumeIndex: number;
  } & ComponentProps<"img">,
) {
  const [ids, others] = splitProps(props, [
    "externalCharacterId",
    "costumeIndex",
  ]);
  return (
    <img
      src={`/stockicons/${ids.externalCharacterId}/${ids.costumeIndex}.png`}
      {...others}
    />
  );
}

export function RankIcon(props: { connectCode?: string }) {
  const query = createMemo(() =>
    props.connectCode ? createRankQuery(() => props.connectCode!) : undefined,
  );

  return (
    <Show
      when={query() && query()!.isSuccess && query()!.data?.data}
      fallback={<div class="h-4 w-4" />}
    >
      {(result) => (
        <img
          src={`/ranks/${result().rank.replace(" ", "_")}.svg`}
          title={`${result().rank} (${Math.round(result().rating)})`}
          class="h-4"
        />
      )}
    </Show>
  );
}
