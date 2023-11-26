import { As } from "@kobalte/core";
import type { ReplayStub, ReplayType } from "@slippilab/common";
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
import { replayTypeIcon } from "~/common/util";

export function filterReplayTypes(replay: ReplayStub, types: ReplayType[]) {
  return types.length === 0 || types.includes(replay.type);
}

export function ReplayTypeSelect(props: {
  current: ReplayType[];
  onChange: (types: ReplayType[]) => void;
}) {
  const [open, setOpen] = createSignal(false);
  const [selected, setSelected] = createSignal<ReplayType[]>(props.current);

  createEffect(() => setSelected(props.current));

  return (
    <Dialog open={open()} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <As component={Button} variant="ghost" size="sm">
          <div class="i-tabler-plus" />
          <div>Type</div>
        </As>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Replay Type Select</DialogTitle>
          <DialogDescription>
            Filter results for replays matching any of the selected types.
          </DialogDescription>
        </DialogHeader>
        <div class="mx-auto grid grid-cols-3 gap-2">
          {(
            [
              "ranked",
              "unranked",
              "direct",
              "offline",
              "old online",
            ] satisfies ReplayType[]
          ).map((replayType) => (
            <button
              class={cn(
                "rounded-sm border-2 p-2",
                !selected().includes(replayType) &&
                  "hover:border-foreground/30",
                selected().includes(replayType) && "border-primary",
              )}
              onClick={() =>
                setSelected(
                  selected().includes(replayType)
                    ? selected().filter((s) => s !== replayType)
                    : [...selected(), replayType],
                )
              }
            >
              <div class={cn("text-2xl", replayTypeIcon(replayType))} />
              <div class="text-center text-sm">{labels[replayType]}</div>
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

export function ReplayTypeChip(props: {
  replayType: ReplayType;
  onRemove: () => void;
}) {
  return (
    <Badge
      variant="secondary"
      role="button"
      class="gap-1"
      onClick={() => props.onRemove()}
    >
      <div>{labels[props.replayType]}</div>
      <div class="i-tabler-x -mr-1" />
    </Badge>
  );
}

const labels: Record<ReplayType, string> = {
  offline: "Offline",
  "old online": "Online (old)",
  unranked: "Unranked",
  direct: "Direct",
  ranked: "Ranked",
};
