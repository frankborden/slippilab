import { As } from "@kobalte/core";
import { useNavigate } from "@solidjs/router";
import { createMemo, createSignal } from "solid-js";

import { Filters, Replays } from "~/client/components/app/Replays";
import { filterCharacters } from "~/client/components/app/Replays/filters/Character";
import { filterConnectCodes } from "~/client/components/app/Replays/filters/ConnectCode";
import { filterReplayTypes } from "~/client/components/app/Replays/filters/ReplayType";
import { filterStages } from "~/client/components/app/Replays/filters/Stage";
import { Button } from "~/client/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/client/components/ui/dropdown-menu";
import { addFiles, setSelected, stubs } from "~/client/state/personal";

export function LocalReplays() {
  const navigate = useNavigate();

  const [filters, setFilters] = createSignal<Filters>({
    replayTypes: [],
    stageIds: [],
    characterIds: [],
    connectCodes: [],
  });

  const filteredReplays = createMemo(() =>
    stubs()
      .map(([replay]) => replay)
      .filter((replay) => {
        return (
          filterReplayTypes(replay, filters().replayTypes) &&
          filterStages(replay, filters().stageIds) &&
          filterCharacters(replay, filters().characterIds) &&
          filterConnectCodes(replay, filters().connectCodes)
        );
      }),
  );
  const [pageIndex, setPageIndex] = createSignal(0);
  const totalPages = createMemo(() => Math.ceil(filteredReplays().length / 10));

  const pageReplays = createMemo(() => {
    const start = pageIndex() * 10;
    return filteredReplays().slice(start, start + 10);
  });

  return (
    <Replays
      replays={pageReplays()}
      connectCodes={[
        ...new Set(
          stubs()
            .flatMap(([replay]) => replay.players.map((p) => p.connectCode))
            .filter((c): c is string => !!c),
        ),
      ].toSorted()}
      filters={filters()}
      onFiltersChanged={setFilters}
      pageIndex={pageIndex()}
      pageTotalCount={totalPages()}
      onPageChange={(pageIndex) => setPageIndex(pageIndex)}
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
