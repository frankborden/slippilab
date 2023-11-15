import { As } from "@kobalte/core";
import { For, createEffect, createSignal } from "solid-js";

import { Badge } from "~/client/components/ui/badge";
import { Button } from "~/client/components/ui/button";
import {
  Combobox,
  ComboboxContent,
  ComboboxControl,
  ComboboxInput,
  ComboboxItem,
  ComboboxItemIndicator,
  ComboboxItemLabel,
  ComboboxTrigger,
} from "~/client/components/ui/combobox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/client/components/ui/dialog";
import type { ReplayStub } from "~/common/model/types";

export function filterConnectCodes(replay: ReplayStub, connectCodes: string[]) {
  return (
    connectCodes.length === 0 ||
    connectCodes.every((id) => replay.players.some((p) => p.connectCode === id))
  );
}

export function ConnectCodeSelect(props: {
  allConnectCodes: string[];
  current: string[];
  onChange: (connectCodes: string[]) => void;
}) {
  const [open, setOpen] = createSignal(false);
  const [comboOpen, setComboOpen] = createSignal(false);
  const [selected, setSelected] = createSignal<string[]>(props.current);

  createEffect(() => setSelected(props.current));

  return (
    <Dialog open={open()} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <As component={Button} variant="ghost" size="sm">
          <div class="i-tabler-plus" />
          <div>Connect Code</div>
        </As>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Connect Code Select</DialogTitle>
          <DialogDescription>
            Filter results for replays matching all of the selected connect
            codes.
          </DialogDescription>
        </DialogHeader>

        <Combobox<string>
          open={comboOpen()}
          onOpenChange={setComboOpen}
          options={props.allConnectCodes}
          multiple
          value={selected()}
          onChange={(selected) => {
            setComboOpen(false);
            setSelected(selected);
          }}
          placeholder="Search"
          itemComponent={(props) => (
            <ComboboxItem item={props.item}>
              <ComboboxItemLabel>{props.item.rawValue}</ComboboxItemLabel>
              <ComboboxItemIndicator />
            </ComboboxItem>
          )}
        >
          <ComboboxControl<string> aria-label="Connect Code">
            {(state) => (
              <>
                <For each={state.selectedOptions()}>
                  {(option) => (
                    <div
                      class="flex items-center border text-xs pl-2 pr-1 py-1 rounded-sm gap-0.5"
                      onPointerDown={(e) => e.stopPropagation()}
                    >
                      {option}
                      <button
                        onClick={() => state.remove(option)}
                        class="i-tabler-x"
                      ></button>
                    </div>
                  )}
                </For>
                <ComboboxInput />
                <ComboboxTrigger />
              </>
            )}
          </ComboboxControl>
          <ComboboxContent />
        </Combobox>
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

export function ConnectCodeChip(props: {
  connectCode: string;
  onRemove: () => void;
}) {
  return (
    <Badge
      variant="secondary"
      role="button"
      class="gap-1"
      onClick={() => props.onRemove()}
    >
      <div>{props.connectCode}</div>
      <div class="i-tabler-x -mr-1" />
    </Badge>
  );
}
