import { As } from "@kobalte/core";
import { createEffect, createSignal } from "solid-js";

import { Badge } from "~/client/components/ui/badge";
import { Button } from "~/client/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/client/components/ui/dialog";
import { cn } from "~/client/components/utils";
import { charactersExt } from "~/common/model/names";
import type { ReplayStub } from "~/common/model/types";
import { characterUrl } from "~/common/util";

export function filterCharacters(replay: ReplayStub, characterIds: number[]) {
  return (
    characterIds.length === 0 ||
    characterIds.every((id) =>
      replay.players.some((p) => p.externalCharacterId === id),
    )
  );
}

export function CharacterSelect(props: {
  current: number[];
  onChange: (characterIds: number[]) => void;
}) {
  const [open, setOpen] = createSignal(false);
  const [selected, setSelected] = createSignal<number[]>(props.current);

  createEffect(() => setSelected(props.current));

  return (
    <Dialog open={open()} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <As component={Button} variant="ghost" size="sm">
          <div class="i-tabler-plus" />
          <div>Character</div>
        </As>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Character Select</DialogTitle>
          <DialogDescription>
            Filter results for replays matching all of the selected characters.
          </DialogDescription>
        </DialogHeader>
        <div class="mx-auto grid grid-cols-9 gap-1">
          {[
            22, 8, 7, 5, 12, 17, 1, 0, 25, 20, 2, 11, 14, 4, 16, 19, 6, 21, 24,
            13, 15, 10, 9, 3, 23, 18,
          ].map((characterId) => (
            <button
              class={cn(
                "rounded-sm border-4 p-1",
                !selected().includes(characterId) &&
                  "hover:border-foreground/30",
                selected().includes(Number(characterId)) && "border-primary",
                characterId === 24 && "col-start-2",
              )}
              onClick={() =>
                setSelected(
                  selected().includes(Number(characterId))
                    ? selected().filter((s) => s !== Number(characterId))
                    : [...selected(), Number(characterId)],
                )
              }
            >
              <img
                src={characterUrl({
                  externalCharacterId: Number(characterId),
                  costumeIndex: 0,
                })}
                class="h-8"
              />
            </button>
          ))}
        </div>
        <DialogFooter>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => {
              setSelected(props.current);
              setOpen(false);
            }}
          >
            Cancel
          </Button>
          <Button
            size="sm"
            onClick={() => {
              props.onChange(selected());
              setOpen(false);
            }}
          >
            Apply
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function CharacterChip(props: {
  characterId: number;
  onRemove: () => void;
}) {
  return (
    <Badge
      variant="secondary"
      role="button"
      class="gap-1"
      onClick={() => props.onRemove()}
    >
      <div>{charactersExt[props.characterId]}</div>
      <div class="i-tabler-x -mr-1" />
    </Badge>
  );
}
