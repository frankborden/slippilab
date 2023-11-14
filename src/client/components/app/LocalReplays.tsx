import { As } from "@kobalte/core";
import { navigate } from "astro:transitions/client";

import { Replays } from "~/client/components/app/Replays";
import { Button } from "~/client/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/client/components/ui/dropdown-menu";
import { addFiles, setSelected, stubs } from "~/client/state/personal";

export function LocalReplays() {
  return (
    <Replays
      replays={stubs().map(([replay]) => replay)}
      onSelect={(replay) => {
        setSelected(stubs().find(([r]) => r === replay)!);
        navigate("/watch/local");
      }}
    >
      <div slot="emptyState" class="flex flex-col items-center gap-2">
        <div class="i-game-icons-open-folder text-3xl"></div>
        <h1 class="mb-2 text-sm">No personal replays opened</h1>
        <OpenButton />
      </div>
    </Replays>
  );
}

function OpenButton() {
  let fileInput: HTMLInputElement | undefined;
  let folderInput: HTMLInputElement | undefined;

  return (
    <>
      <input
        ref={fileInput}
        type="file"
        multiple
        accept=".slp"
        class="hidden"
        onInput={(e) => addFiles([...e.currentTarget.files!])}
      />
      <input
        ref={folderInput}
        type="file"
        // @ts-expect-error webkit
        webkitDirectory
        class="hidden"
        onInput={(e) => addFiles([...e.currentTarget.files!])}
      />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <As component={Button} size="sm" class="gap-1">
            <div>Open</div>
            <div class="i-tabler-chevron-down text-lg" />
          </As>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onSelect={() => folderInput?.click()}>
            <span>Open folder</span>
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={() => fileInput?.click()}>
            <span>Open files</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
