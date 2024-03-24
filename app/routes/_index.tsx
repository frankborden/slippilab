import {
  ArrowLeftIcon,
  ArrowRightIcon,
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  CounterClockwiseClockIcon,
  PauseIcon,
  PinLeftIcon,
  PinRightIcon,
  PlayIcon,
  ReloadIcon,
} from "@radix-ui/react-icons";
import { SelectValue } from "@radix-ui/react-select";
import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  json,
  redirect,
  unstable_createMemoryUploadHandler,
  unstable_parseMultipartFormData,
} from "@remix-run/cloudflare";
import {
  Form,
  useLoaderData,
  useNavigation,
  useSearchParams,
  useSubmit,
} from "@remix-run/react";
import { decode } from "@shelacek/ubjson";
import { InferInsertModel } from "drizzle-orm";
import { drizzle } from "drizzle-orm/d1";
import { generateSlug } from "random-word-slugs";
import { useEffect, useRef, useState } from "react";

import { shortCharactersExt } from "~/common/names";
import { PlayerStub, ReplayStub, ReplayType } from "~/common/types";
import { AspectRatio } from "~/components/ui/aspect-ratio";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { Progress } from "~/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
} from "~/components/ui/select";
import { Sheet, SheetContent, SheetTrigger } from "~/components/ui/sheet";
import { Slider } from "~/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { cn } from "~/lib/utils";
import { parseReplay } from "~/parser";
import * as schema from "~/schema";
import { useFileStore } from "~/stores/fileStore";
import { useReplayStore } from "~/stores/replayStore";
import { Replay } from "~/viewer/Replay";

export async function action({ context, request }: ActionFunctionArgs) {
  const { DB, BUCKET } = context.cloudflare.env;
  const db = drizzle(DB, { schema });
  const uploadHandler = unstable_createMemoryUploadHandler({
    maxPartSize: 20_000_000,
  });
  const form = await unstable_parseMultipartFormData(request, uploadHandler);

  const file = form.get("replay");
  if (!(file instanceof File)) {
    return new Response("No file found", { status: 400 });
  }
  const buffer = new Uint8Array(await file.arrayBuffer());
  const { raw, metadata } = decode(buffer, { useTypedArrays: true });
  const replay = parseReplay(metadata, raw);

  const id = crypto.randomUUID();
  const slug = generateSlug(3, { format: "camel" });
  const dbReplay: InferInsertModel<typeof schema.replays> = {
    id,
    slug,
    type: replay.type,
    stageId: replay.settings.stageId,
    startTimestamp: replay.settings.startTimestamp,
    matchId: replay.settings.matchId,
    gameNumber: replay.settings.gameNumber,
    tiebreakerNumber: replay.settings.tiebreakerNumber,
  };
  const dbPlayers: InferInsertModel<typeof schema.replayPlayers>[] =
    replay.settings.playerSettings.filter(Boolean).map((player) => ({
      replayId: id,
      playerIndex: player.playerIndex,
      connectCode: player.connectCode,
      displayName: player.displayName,
      nametag: player.nametag,
      teamId: player.teamId,
      externalCharacterId: player.externalCharacterId,
      costumeIndex: player.costumeIndex,
    }));

  await BUCKET.put(slug, buffer);
  await db.batch([
    db.insert(schema.replays).values(dbReplay),
    ...dbPlayers.map((dbPlayer) =>
      db.insert(schema.replayPlayers).values(dbPlayer),
    ),
  ]);

  return redirect(`/?watch=${slug}`);
}

export async function loader({ context }: LoaderFunctionArgs) {
  const { DB } = context.cloudflare.env;
  const db = drizzle(DB, { schema });
  const rows = await db.query.replays.findMany({
    with: {
      replayPlayers: true,
    },
  });
  const stubs: ReplayStub[] = rows.map((row) => ({
    slug: row.slug,
    type: row.type as ReplayType,
    startTimestamp: row.startTimestamp,
    stageId: row.stageId,
    players: row.replayPlayers.map((player) => ({
      playerIndex: player.playerIndex,
      connectCode: player.connectCode ?? undefined,
      displayName: player.displayName ?? undefined,
      externalCharacterId: player.externalCharacterId,
      costumeIndex: player.costumeIndex,
    })),
  }));
  return { stubs };
}

export default function Page() {
  return (
    <div className="flex h-screen gap-8 overflow-y-auto p-4">
      <div className="flex shrink grow flex-col">
        <div className="mb-2">
          <ReplaySelect />
        </div>
        <Replay />
        <Controls />
        <div className="mx-auto grid w-full grid-cols-4 gap-4">
          <Controller playerIndex={0} />
          <Controller playerIndex={1} />
          <Controller playerIndex={2} />
          <Controller playerIndex={3} />
        </div>
      </div>
      <div className="w-[200px]">
        <HighlightList />
      </div>
    </div>
  );
}

function Controls() {
  const { replay, frame, setFrame, paused, setPaused, speed, setSpeed } =
    useReplayStore();

  let current = "0:00";
  let total = "0:00";
  if (replay) {
    const currentMinutes = Math.floor(frame / 60 / 60);
    const currentSeconds = Math.floor((frame % 3600) / 60);
    current = `${currentMinutes}:${String(currentSeconds).padStart(2, "0")}`;
    const totalMinutes = Math.floor(replay.frames.length / 60 / 60);
    const totalSeconds = Math.floor((replay.frames.length % 3600) / 60);
    total = `${totalMinutes}:${String(totalSeconds).padStart(2, "0")}`;
  }

  function handleKeyPress(event: KeyboardEvent) {
    switch (event.key) {
      case "ArrowLeft":
      case "j":
        setFrame(Math.max(frame - 120, 0));
        break;
      case "ArrowRight":
      case "l":
        setFrame(Math.min(frame + 120, (replay?.frames.length ?? 1) - 1));
        break;
      case " ":
      case "k":
        setPaused(!paused);
        break;
      case ",":
        setPaused(true);
        setFrame(Math.max(0, frame - 1));
        break;
      case ".":
        setPaused(true);
        setFrame(Math.min((replay?.frames.length ?? 1) - 1, frame + 1));
        break;
      case "0":
      case "1":
      case "2":
      case "3":
      case "4":
      case "5":
      case "6":
      case "7":
      case "8":
      case "9":
        const num = parseInt(event.key);
        setFrame(Math.round((replay?.frames.length ?? 0) * (num / 10)));
        break;
    }
  }

  useEffect(() => {
    document.addEventListener("keydown", handleKeyPress);
    return () => {
      document.removeEventListener("keydown", handleKeyPress);
    };
  }, [handleKeyPress]);

  return (
    <>
      <Slider
        value={[frame]}
        min={0}
        max={replay?.frames.length ?? 10}
        onValueChange={(value) => setFrame(value[0])}
      />
      <div className="mt-2 flex items-center justify-between">
        <div className="text-sm font-medium leading-none">
          {current} / {total}
        </div>
        <div className="flex items-center gap-2">
          <Button
            size="icon"
            variant="ghost"
            className="size-6"
            onClick={() => {
              setFrame(Math.max(frame - 120, 0));
              setPaused(true);
            }}
          >
            <CounterClockwiseClockIcon />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            className="size-6"
            onClick={() => {
              setFrame(Math.max(frame - 1, 0));
              setPaused(true);
            }}
          >
            <ChevronLeftIcon />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            className="size-6"
            onClick={() => setPaused(!paused)}
          >
            {paused ? <PlayIcon /> : <PauseIcon />}
          </Button>
          <Button
            size="icon"
            variant="ghost"
            className="size-6"
            onClick={() => {
              setFrame(Math.min(frame + 1, (replay?.frames.length ?? 1) - 1));
              setPaused(true);
            }}
          >
            <ChevronRightIcon />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            className="size-6"
            onClick={() => {
              setFrame(Math.min(frame + 120, (replay?.frames.length ?? 1) - 1));
              setPaused(true);
            }}
          >
            <CounterClockwiseClockIcon className=" -scale-x-100" />
          </Button>
        </div>
      </div>
    </>
  );
}

function HighlightList() {
  const { highlights, setFrame } = useReplayStore();
  const [selectedQuery, setSelectedQuery] = useState<string>(
    Object.keys(highlights)[0],
  );

  return (
    <>
      <Select value={selectedQuery} onValueChange={setSelectedQuery}>
        <SelectTrigger className="gap-2">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Category</SelectLabel>
            {Object.keys(highlights).map((name) => (
              <SelectItem key={name} value={name}>
                {name}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
      <div className="mt-2 grid grid-cols-[repeat(2,auto)] justify-center gap-x-4">
        {highlights[selectedQuery].map((highlight, i) => (
          <button
            key={i}
            className="col-span-full grid grid-cols-subgrid items-center rounded px-4 py-1 hover:bg-foreground/10"
            onClick={() => setFrame(Math.max(highlight.startFrame - 30, 0))}
          >
            <Badge
              variant="outline"
              className={cn(
                [
                  "bg-red-400/10 text-red-400",
                  "bg-blue-400/10 text-blue-400",
                  "bg-yellow-400/10 text-yellow-400",
                  "bg-green-400/10 text-green-400",
                ][highlight.playerIndex],
              )}
            >
              Player {highlight.playerIndex + 1}
            </Badge>
            <div>
              {Math.floor(highlight.startFrame / 60 / 60)}:
              {String(
                Math.floor(Math.floor(highlight.startFrame % 3600) / 60),
              ).padStart(2, "0")}
            </div>
          </button>
        ))}
        <div className="col-span-full hidden text-center text-sm only:block">
          No highlights
        </div>
      </div>
    </>
  );
}

function ReplaySelect() {
  const [searchParams] = useSearchParams();
  const slug = searchParams.get("watch");
  const { stubs } = useFileStore();
  const replay = useReplayStore((store) => store.replay);
  const submit = useSubmit();

  const navigation = useNavigation();

  return (
    <div className="flex items-center justify-between">
      <Sheet>
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
            <ReplaySelectContent />
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
          onClick={(e) => {
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

function ReplaySelectContent() {
  const [searchParams] = useSearchParams();
  const slug = searchParams.get("watch");
  const { stubs: localStubs, loadFiles, loadProgress } = useFileStore();
  const cloudStubs = useLoaderData<typeof loader>().stubs;
  const [tab, setTab] = useState(
    slug && !slug.startsWith("local-") ? "cloud" : "local",
  );

  const fileInput = useRef<HTMLInputElement>(null);
  const folderInput = useRef<HTMLInputElement>(null);

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
      <ReplayList
        stubs={tab === "local" ? localStubs.map(([stub]) => stub) : cloudStubs}
      />
    </>
  );
}

function ReplayList({ stubs }: { stubs: ReplayStub[] }) {
  const { page, setPage, filters, setFilters } = useFileStore();
  const pageSize = 10;

  const filteredStubs = stubs.filter((stub) => {
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
      <div className="mt-2 grid grow auto-rows-max grid-cols-[repeat(5,auto)] gap-x-4 text-sm">
        {filteredStubs
          .slice(page * pageSize, page * pageSize + pageSize)
          .map((stub) => (
            <ReplayRow key={stub.slug} stub={stub} />
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

function ReplayRow({ stub }: { stub: ReplayStub }) {
  const [searchParams, setSearchParams] = useSearchParams();

  const isDoubles = stub.players.length > 2;
  // @ts-expect-error groupBy is new-ish
  const playerGroups: Record<number, PlayerStub[]> = Object.groupBy(
    stub.players,
    (player: PlayerStub) => (isDoubles ? player.teamId : player.playerIndex),
  );

  return (
    <button
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
      {Object.values(playerGroups).map((playerGroup) => (
        <div>
          {playerGroup.map((player) => (
            <div key={player.playerIndex} className="flex items-center gap-2">
              <img
                // using team id as the costume index for doubles is wrong
                src={`/stockicons/${player.externalCharacterId}/${isDoubles ? (player.teamId === 2 ? 3 : player.teamId) : player.costumeIndex}.png`}
                className="h-6"
              />
              <div>
                <div className="max-w-[8ch] overflow-hidden text-ellipsis whitespace-nowrap text-start">
                  {player.displayName ??
                    shortCharactersExt[player.externalCharacterId]}
                </div>
                {!isDoubles && (
                  <div className="text-start text-xs text-foreground/70">
                    {player.connectCode ?? `Port ${player.playerIndex + 1}`}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      ))}
    </button>
  );
}

// https://www.svgrepo.com/svg/90779/nintendo-gamecube-control
function Controller({ playerIndex }: { playerIndex: number }) {
  const { renderData, frame } = useReplayStore();
  const player = renderData?.[frame].find(
    (rd) => rd.playerSettings.playerIndex === playerIndex,
  );

  if (!player) return <div />;

  const inputs = player.playerInputs;

  return (
    <div>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 585.781 585.782"
        className="p-2"
      >
        <path
          id="shell"
          fill={["red", "blue", "yellow", "green"][playerIndex]}
          d="M376.4 33.6c-6 0-11.9 3.9-11.1 11.8 1 11.8-2.6 21.8-12.6 28.8-10 7.2-24.4 4.3-35.2 10.2a53.6 53.6 0 0 0-28.1 40.6c-116.9 1.6-160.5 25.4-160.5 25.4-68.1-13.9-77.4 34-77.4 34-67.5 45-47.9 128.2-47.9 128.2-7 84.3-9.5 239.6 46.8 239.6s56-145.5 56-145.5 9.8 16.2 17.3 37.6c7.5 21.3 63.5 79.7 124.1 15.6 60.7-64.1-23-128.2-23-128.2v-10.2c20.2-5.6 68-6.6 68-6.6s48 1 68.2 6.6v10.2s-83.7 64-23 128.2c60.6 64 116.6 5.7 124-15.6 7.6-21.4 17.4-37.6 17.4-37.6s-.3 145.5 56 145.5 53.7-155.3 46.8-239.6c0 0 19.6-83.1-48-128.2 0 0-9.2-47.9-77.3-34 0 0-39.3-21.4-143-25 5-25.9 37.2-20 54.9-32.7a52.6 52.6 0 0 0 21-47.3c-.8-7.8-7.2-11.8-13.4-11.8z"
        />
        <path
          id="dPadCutout"
          fill="transparent"
          d="M178.6 361.5h20.8c4.8 0 8.8 4 8.8 8.9V392H230c4.8 0 8.8 4 8.8 8.9v20.8c0 4.8-4 8.8-8.8 8.8h-21.8v21.8c0 4.8-4 8.8-8.8 8.8h-20.8c-4.9 0-8.9-4-8.9-8.8v-21.8H148c-4.9 0-8.9-4-8.9-8.8V401a9 9 0 0 1 8.9-8.9h21.7v-21.7a9 9 0 0 1 8.9-8.9z"
        />
        <path
          id="dPad"
          fill="gray"
          stroke="black"
          strokeWidth={2.5}
          d="M202 370.4c0-1.5-1.2-2.7-2.6-2.7h-20.8a2.7 2.7 0 0 0-2.7 2.7v27.9h-28a2.7 2.7 0 0 0-2.6 2.7v20.8c0 1.5 1.2 2.7 2.7 2.7h27.9v27.9c0 1.5 1.2 2.7 2.7 2.7h20.8c1.5 0 2.7-1.2 2.7-2.7v-28H230c1.5 0 2.7-1.1 2.7-2.6V401c0-1.5-1.2-2.7-2.7-2.7h-28z"
        />
        <path
          id="startCutout"
          fill="transparent"
          d="M292.9 252a19.8 19.8 0 1 1 0 39.7 19.8 19.8 0 0 1 0-39.6zm-188.2-52.7a75.3 75.3 0 1 1-.2 150.6 75.3 75.3 0 0 1 .2-150.6z"
        />
        {/* here */}
        <path
          id="controlStickCutout"
          fill="transparent"
          d="m 104.65234,199.2793 c 41.488,0 75.23438,33.75128 75.23438,75.23828 0,41.487 -33.74638,75.24023 -75.23438,75.24023 -41.486996,0 -75.238278,-33.75323 -75.238278,-75.24023 0,-41.487 33.751282,-75.23828 75.238278,-75.23828 z"
        />
        <circle
          id="controlStickGate"
          fill="lightgray"
          stroke="black"
          strokeWidth={2.5}
          cx={104.7}
          cy={274.5}
          r={69.1}
        />
        <circle
          id="controlStick"
          fill="gray"
          stroke="black"
          strokeWidth={2.5}
          cx={104.7 + (inputs.processed.joystickX ?? 0) * 34}
          cy={274.5 - (inputs.processed.joystickY ?? 0) * 34}
          r={35.1}
        />
        <path
          id="cStickCutout"
          fill="transparent"
          d="M402 361.3c.4 0 .8.1 1.1.3l31.2 18a3 3 0 0 1 1.4 1.8l10.3 34.1a3 3 0 0 1-.3 2.4L427 451.2a3 3 0 0 1-1.9 1.5l-36.2 9.2a3 3 0 0 1-2.3-.3l-32.2-18.9a3 3 0 0 1-1.4-2l-8.7-37.1a3 3 0 0 1 .4-2.4l19.3-30a3 3 0 0 1 1.8-1.3l35-8.6h1.2z"
        />
        <circle
          id="cStickGate"
          fill="gold"
          stroke="black"
          strokeWidth={2.5}
          cx={395.2}
          cy={411.6}
          r={44.1}
        />
        <circle
          id="cStick"
          fill="yellow"
          stroke="black"
          strokeWidth={2.5}
          cx={395.2 + (inputs.processed.cStickX ?? 0) * 19.5}
          cy={411.6 - (inputs.processed.cStickY ?? 0) * 19.5}
          r={24.6}
        />
        <circle
          id="startButton"
          fill={inputs.processed.start ? "white" : "gray"}
          stroke="black"
          strokeWidth={2.5}
          cx="292.9"
          cy="271.9"
          r="13.7"
        />
        <path
          id="faceButtonsCutout"
          fill="transparent"
          d="M478.2 187.8a21.5 21.5 0 0 1 21.6 24.8 69 69 0 0 1 26.6 16 21.4 21.4 0 0 1 13.8-5c9.8 0 18.4 6.6 21 16l.2 1c5.7 18.8 5.7 18.8 9.7 36l.2.9a21.9 21.9 0 0 1-21 27.2 21 21 0 0 1-7.8-1.6 69 69 0 0 1-109.8 26.2 29 29 0 1 1-23.7-45.7h.8l-.2-5.6c0-16.5 5.8-31.6 15.5-43.5a21.6 21.6 0 0 1 10-35.9l1-.3c18.8-5.7 18.8-5.7 36-9.7l.8-.2c1.7-.4 3.5-.6 5.3-.6z"
        />
        <circle
          id="aButton"
          // Use physical A because processed A is bugged. processed A is true
          // whenever physical Z is pressed
          fill={inputs.physical.a ? "white" : "green"}
          stroke="black"
          strokeWidth={2.5}
          cx={479.4}
          cy={279.7}
          r={33.9}
        />
        <path
          id="bButton"
          fill={inputs.processed.b ? "white" : "red"}
          stroke="black"
          strokeWidth={2.5}
          d="M417.1 291.3c-2-.8-4.2-1.2-6.5-1.4l-1.6-.2a23 23 0 0 0 0 45.9 22.9 22.9 0 0 0 8.1-44.3z"
        />
        <path
          id="yButton"
          fill={inputs.processed.y ? "white" : "gray"}
          stroke="black"
          strokeWidth={2.5}
          d="M429.3 229.8a16 16 0 0 0 15.4 4.7c.5-.1 2.3-1 3.7-1.8 3.7-2.1 8.9-5 14.4-6.5 6.7-1.8 15.9-2 19.5-2h.6c3.8-1.1 7-3.6 9-7.1l.2-.3a15.4 15.4 0 0 0-13.9-22.9 17 17 0 0 0-3.9.5l-.8.1c-17 4-17 4-35.6 9.6l-1.2.4a15.6 15.6 0 0 0-11 19 15 15 0 0 0 3.6 6.3zM565.1 278c-4-17-4-17-9.6-35.7l-.3-1a15.8 15.8 0 0 0-19-11 15.5 15.5 0 0 0-9.6 7.5 15.5 15.5 0 0 0-1.4 11.5c.1.5 1.1 2.2 1.9 3.6 2 3.8 4.9 9 6.4 14.4 2 7.4 2 17.8 2 20.1a16 16 0 0 0 19 10.6c8-2.2 12.9-10.6 10.9-19.1zM130 150l-75 35v-10c0-55 55-55 75-35v10zm330 0 75 35v-10c0-55-55-55-75-35v10z"
        />
        <path
          id="xButton"
          fill={inputs.processed.x ? "white" : "gray"}
          stroke="black"
          strokeWidth={2.5}
          d="M565.1,278 c -4,-16.9 -4,-16.9 -9.6,-35.6 l -0.3,-1 c -2.2,-8.2 -10.9,-13.3 -19.1,-11.1 -2.1,0.6 -4,1.6 -5.6,2.8 -1.6,1.3 -3,2.9 -4,4.7 -1.9,3.4 -2.5,7.5 -1.4,11.5 0.1,0.5 1.1,2.2 1.9,3.6 2.1,3.8 4.9,8.9 6.4,14.4 2,7.4 2,17.8 2.0,20.1 0.7,2.4 2,4.4 3.7,6.1 1.5,1.6 3.3,2.8 5.4,3.7 3.1,1.3 6.5,1.7 9.9,0.8 8.1,-2.2 12.9,-10.6 10.9,-19.1 z"
        />
        <path
          id="lTrigger"
          fill={inputs.processed.lTriggerDigital ? "white" : "gray"}
          stroke="black"
          strokeWidth={2.5}
          d="m 130,150 l -75,35 l 0,-10 c 0,-55 55,-55 75,-35 l 0,10 z"
        />
        <path
          id="rTrigger"
          fill={inputs.processed.rTriggerDigital ? "white" : "gray"}
          stroke="black"
          strokeWidth={2.5}
          d="m 460,150 l 75,35 l 0,-10 c 0,-55 -55,-55 -75,-35 l 0,10 z"
        />
        <path
          id="zButton"
          fill={inputs.processed.z ? "white" : "purple"}
          stroke="black"
          strokeWidth={2.5}
          d="M460 155v-15l75 35v15z"
        />
      </svg>
      <div className="grid grid-cols-[auto_1fr] gap-x-2 text-sm">
        <div>{player.animationFrame}</div>
        <div>{player.animationName}</div>
        <div>
          {player.playerState.isInHitstun
            ? player.playerState.hitstunRemaining
            : 0}
        </div>
        <div>Hitstun</div>
        <div>{player.playerState.hitlagRemaining}</div>
        <div>Hitlag</div>
      </div>
    </div>
  );
}
