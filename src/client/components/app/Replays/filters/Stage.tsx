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
import { stages } from "~/common/model/names";
import type { ReplayStub } from "~/common/model/types";
import { stageUrl } from "~/common/util";

export function filterStages(replay: ReplayStub, stageIds: number[]) {
  return stageIds.length === 0 || stageIds.includes(replay.stageId);
}

export function StageSelect(props: {
  current: number[];
  onChange: (stageIds: number[]) => void;
}) {
  const [open, setOpen] = createSignal(false);
  const [selected, setSelected] = createSignal<number[]>(props.current);

  createEffect(() => setSelected(props.current));

  return (
    <Dialog open={open()} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <As component={Button} variant="ghost" size="sm">
          <div class="i-tabler-plus" />
          <div>Stage</div>
        </As>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Stage Select</DialogTitle>
          <DialogDescription>
            Filter results for replays matching any of the selected stages.
          </DialogDescription>
        </DialogHeader>
        <div class="mx-auto grid grid-cols-3 gap-8">
          {[8, 2, 3, 31, 32, 28].map((stageId) => (
            <button
              class={cn(
                "rounded-sm border-4",
                !selected().includes(stageId) && "hover:border-foreground/30",
                selected().includes(Number(stageId)) && "border-primary",
              )}
              onClick={() =>
                setSelected(
                  selected().includes(Number(stageId))
                    ? selected().filter((s) => s !== Number(stageId))
                    : [...selected(), Number(stageId)],
                )
              }
            >
              <img src={stageUrl(Number(stageId))} />
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

export function StageChip(props: { stageId: number; onRemove: () => void }) {
  return (
    <Badge
      variant="secondary"
      role="button"
      class="gap-1"
      onClick={() => props.onRemove()}
    >
      <div>{stages[props.stageId]}</div>
      <div class="i-tabler-x -mr-1" />
    </Badge>
  );
}
