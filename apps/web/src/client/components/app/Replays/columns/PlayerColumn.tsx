import type { PlayerStub } from "@slippilab/common";
import cn from "clsx";
import { ComponentProps, Show, splitProps } from "solid-js";

export function PlayerColumn(props: { player?: PlayerStub }) {
  return (
    <Show when={props.player} fallback="N/A">
      {(player) => (
        <div class="flex gap-3 items-center">
          <CharacterIcon
            externalCharacterId={player().externalCharacterId}
            costumeIndex={player().costumeIndex}
            class="h-6"
          />
          <Show
            when={player().connectCode}
            fallback={<div>Player {player().playerIndex + 1}</div>}
          >
            <div>
              <div class="text-start text-sm">{player().displayName}</div>

              <div class="text-xs text-foreground/60">
                {player().connectCode}
              </div>
            </div>
          </Show>
        </div>
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
