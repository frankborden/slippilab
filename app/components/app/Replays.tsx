import {
  ArrowLeftIcon,
  ArrowRightIcon,
  ChevronDownIcon,
  PinLeftIcon,
  PinRightIcon,
  ReloadIcon,
} from "@radix-ui/react-icons";
import {
  useLoaderData,
  useNavigation,
  useSearchParams,
  useSubmit,
} from "@remix-run/react";
import { useRef, useState } from "react";

import { shortCharactersExt } from "~/common/names";
import { PlayerInputs, PlayerStub } from "~/common/types";
import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { Progress } from "~/components/ui/progress";
import { Sheet, SheetContent, SheetTrigger } from "~/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { cn } from "~/lib/utils";
import { loader } from "~/routes/_index";
import { useFileStore } from "~/stores/fileStore";
import { useReplayStore } from "~/stores/replayStore";

export function ReplaySelect() {
  const [searchParams] = useSearchParams();
  const slug = searchParams.get("watch");
  const { stubs } = useFileStore();
  const replay = useReplayStore((store) => store.replay);
  const submit = useSubmit();
  const navigation = useNavigation();
  const [open, setOpen] = useState(false);

  return (
    <div className="flex items-center justify-between">
      <Sheet open={open} onOpenChange={(o) => setOpen(o)}>
        <SheetTrigger asChild>
          <Button variant="secondary" className="gap-2">
            <div>Now playing:</div>
            <div>{slug?.replace("local-", "") ?? "None"}</div>
            <ChevronDownIcon className="size-4" />
          </Button>
        </SheetTrigger>
        <SheetContent
          side="left"
          className="flex w-[600px] flex-col sm:max-w-none"
        >
          <div className="flex grow flex-col">
            <ReplaySelectContent close={() => setOpen(false)} />
          </div>
        </SheetContent>
      </Sheet>
      {replay && (
        <div>{new Date(replay.settings.startTimestamp).toLocaleString()}</div>
      )}
      {slug?.startsWith("local-") && (
        <Button
          variant="secondary"
          disabled={Boolean(navigation.formAction)}
          onClick={() => {
            const formData = new FormData();
            const file = stubs.find(([stub]) => stub.slug === slug)?.[1];
            if (!file) {
              return;
            }
            formData.append("replay", file);
            submit(formData, {
              method: "POST",
              encType: "multipart/form-data",
            });
          }}
        >
          {navigation.formAction && (
            <ReloadIcon className="mr-2 size-4 animate-spin" />
          )}
          Upload
        </Button>
      )}
      {slug && !slug.startsWith("local-") && (
        <Button variant="secondary" asChild>
          <a href={`/${slug}.slp`}>Download</a>
        </Button>
      )}
    </div>
  );
}

function ReplaySelectContent({ close }: { close: () => void }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const slug = searchParams.get("watch");
  const { stubs: localStubs, loadFiles, loadProgress } = useFileStore();
  const cloudStubs = useLoaderData<typeof loader>().stubs;
  const [tab, setTab] = useState(
    slug && !slug.startsWith("local-") ? "cloud" : "local",
  );

  const fileInput = useRef<HTMLInputElement>(null);
  const folderInput = useRef<HTMLInputElement>(null);

  const { page, setPage, filters } = useFileStore();
  const pageSize = 10;

  const filteredStubs = (
    tab === "local" ? localStubs.map(([stub]) => stub) : cloudStubs
  ).filter((stub) => {
    const allowedStages = filters
      .filter((filter) => filter.type === "stage")
      .map(Number);
    if (allowedStages.length > 0 && !allowedStages.includes(stub.stageId)) {
      return false;
    }
    const neededCharacterCounts: Record<number, number> = {};
    for (const filter of filters
      .filter((filter) => filter.type === "character")
      .map(Number)) {
      neededCharacterCounts[filter] = (neededCharacterCounts[filter] ?? 0) + 1;
    }
    for (const player of stub.players) {
      if (neededCharacterCounts[player.externalCharacterId] > 0) {
        neededCharacterCounts[player.externalCharacterId]--;
      }
    }
    if (Object.values(neededCharacterCounts).some((count) => count > 0)) {
      return false;
    }
    return true;
  });

  return (
    <>
      <Tabs
        value={tab}
        onValueChange={setTab}
        className="mt-4 flex items-center justify-between"
      >
        <TabsList>
          <TabsTrigger value="local">Local</TabsTrigger>
          <TabsTrigger value="cloud">Cloud</TabsTrigger>
        </TabsList>
        <TabsContent value="local" className="mt-0">
          <input
            type="file"
            ref={fileInput}
            className="hidden"
            onInput={(event) =>
              loadFiles([...((event.target as HTMLInputElement).files ?? [])])
            }
          />
          <input
            type="file"
            ref={folderInput}
            // @ts-ignore webkit
            webkitdirectory=""
            className="hidden"
            onInput={(event) =>
              loadFiles([...((event.target as HTMLInputElement).files ?? [])])
            }
          />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">Open files</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onSelect={() => folderInput.current?.click()}>
                Open folder
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => fileInput.current?.click()}>
                Open file
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </TabsContent>
      </Tabs>
      {loadProgress !== undefined && (
        <Progress className="mt-2" value={loadProgress} />
      )}
      <div className="mt-2 grid grow auto-rows-max grid-cols-[repeat(5,auto)] gap-x-4 text-sm">
        {filteredStubs
          .slice(page * pageSize, page * pageSize + pageSize)
          .map((stub) => (
            <button
              key={stub.slug}
              className={cn(
                "col-span-full grid grid-cols-subgrid items-center rounded border-2 px-4 py-1",
                stub.slug === searchParams.get("watch")
                  ? "border-primary bg-primary/10"
                  : "border-transparent hover:border-border hover:bg-foreground/10",
              )}
              onClick={() => {
                searchParams.set("watch", stub.slug);
                searchParams.delete("start");
                setSearchParams(searchParams);
                close();
              }}
            >
              <div className="capitalize">{stub.type}</div>
              <div>
                <div>
                  {new Date(stub.startTimestamp).toLocaleDateString(undefined, {
                    month: "short",
                    day: "numeric",
                  })}
                </div>
                <div>
                  {new Date(stub.startTimestamp).toLocaleTimeString(undefined, {
                    hour: "numeric",
                    minute: "2-digit",
                  })}
                </div>
              </div>

              <img
                src={`/stages/${stub.stageId}.png`}
                className="h-12 rounded border"
              />
              {Object.entries(
                stub.players.reduce(
                  (acc: Record<number, PlayerStub[]>, player: PlayerStub) => {
                    const key =
                      stub.players.length > 2
                        ? player.teamId ?? player.playerIndex
                        : player.playerIndex;
                    acc[key] ??= [];
                    acc[key].push(player);
                    return acc;
                  },
                  {} as Record<number, PlayerStub[]>,
                ),
              ).map(([id, playerGroup]) => (
                <div key={id}>
                  {playerGroup.map((player) => (
                    <div
                      key={player.playerIndex}
                      className="flex items-center gap-2"
                    >
                      <img
                        // using team id as the costume index for doubles is wrong
                        src={`/stockicons/${player.externalCharacterId}/${stub.players.length > 2 ? (player.teamId === 2 ? 3 : player.teamId) : player.costumeIndex}.png`}
                        className="h-6"
                      />
                      <div>
                        <div className="max-w-[8ch] overflow-hidden text-ellipsis whitespace-nowrap text-start">
                          {player.displayName ??
                            shortCharactersExt[player.externalCharacterId]}
                        </div>
                        {stub.players.length <= 2 && (
                          <div className="text-start text-xs text-foreground/70">
                            {player.connectCode ??
                              `Port ${player.playerIndex + 1}`}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </button>
          ))}
      </div>
      <div className="mt-auto flex items-center gap-4">
        <Button
          size="icon"
          variant="outline"
          disabled={page === 0}
          onClick={() => setPage(0)}
        >
          <PinLeftIcon />
        </Button>
        <Button
          size="icon"
          variant="outline"
          disabled={page === 0}
          onClick={() => setPage(page - 1)}
        >
          <ArrowLeftIcon />
        </Button>
        <div className="mx-auto text-sm">
          Page {page + 1} of {Math.ceil(filteredStubs.length / pageSize)}
        </div>
        <Button
          size="icon"
          variant="outline"
          disabled={page === Math.ceil(filteredStubs.length / pageSize) - 1}
          onClick={() => setPage(page + 1)}
        >
          <ArrowRightIcon />
        </Button>
        <Button
          size="icon"
          variant="outline"
          disabled={page === Math.ceil(filteredStubs.length / pageSize) - 1}
          onClick={() =>
            setPage(Math.ceil(filteredStubs.length / pageSize) - 1)
          }
        >
          <PinRightIcon />
        </Button>
      </div>
    </>
  );
}
