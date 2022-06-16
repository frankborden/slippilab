import createRAF, { targetFPS } from "@solid-primitives/raf";
import { add, dec, groupBy, inc, map, pipe } from "rambda";
import { batch, createEffect, createSignal, For } from "solid-js";
import { createStore, SetStoreFunction } from "solid-js/store";
import { parseReplay } from "./parser/parser";
import { GameSettings, ReplayData } from "./common/types";
import { Highlight, Query, search } from "./search/search";
import {
  action,
  all,
  either,
  isCrouching,
  isDead,
  isGrabbed,
  isInGroundedControl,
  isInHitstun,
  isInShieldstun,
  isOffstage,
  not,
  opponent,
  Predicate,
} from "./search/framePredicates";
import { downloadReplay } from "./supabaseClient";
import { send } from "./workerClient";
import {
  characterNameByExternalId,
  ExternalCharacterName,
  ExternalStageName,
  stageNameByExternalId,
} from "./common/ids";
import { createToast, dismissToast } from "./common/toaster";
import { ProgressCircle } from "./common/ProgressCircle";

export interface Store {
  isDebug: boolean;
  zoom: number;
  currentFile: number;
  currentClip: number;
  files: File[];
  clips: Record<string, Highlight[]>;
  replayData?: ReplayData;
  running: boolean;
  filters: Filter[];
  filteredIndexes?: number[];
}

export type StoreWithReplay = Store & Required<Pick<Store, "replayData">>;

export type Filter =
  | { type: "character"; label: ExternalCharacterName }
  | { type: "stage"; label: ExternalStageName }
  | { type: "codeOrName"; label: string };

const [getStore, setStore] = createStore<Store>({
  isDebug: false,
  zoom: 1,
  currentFile: -1,
  currentClip: -1,
  files: [],
  clips: {},
  running: false,
  filters: [],
}) as [Store, SetStoreFunction<Store>];
export const store = getStore;

const [getGameSettings, setGameSettings] = createSignal<GameSettings[]>([]);
const [getFrame, setFrame] = createSignal(0);
const [fps, setFps] = createSignal(60);
const [framesPerTick, setFramesPerTick] = createSignal(1);
const [running, start, stop] = createRAF(targetFPS(tick, fps));
createEffect(() => setStore("running", running()));
export const frame = getFrame;
export const gameSettings = getGameSettings;

export async function load(
  files: File[],
  startFrame: number = 0
): Promise<void> {
  const [progress, setProgress] = createSignal(0);
  const toastId = createToast({
    title: "Parsing files",
    duration: Infinity,
    render: () => (
      <div class="flex gap-3 items-center">
        <ProgressCircle percent={(progress() * 100) / files.length} />
        {progress()}/{files.length}
      </div>
    ),
    placement: "bottom-end",
  });
  stop();
  const {
    goodFilesAndSettings,
    skipCount,
    failedFilenames,
  }: {
    goodFilesAndSettings: Array<[File, GameSettings]>;
    failedFilenames: string[];
    skipCount: number;
  } = await send(files, () => setProgress(inc));
  batch(() => {
    setGameSettings(goodFilesAndSettings.map(([, settings]) => settings));
    setStore(
      "files",
      goodFilesAndSettings.map(([file]) => file)
    );
  });
  try {
    if (store.files.length > 0) {
      const replayData: ReplayData = parseReplay(
        await store.files[0].arrayBuffer()
      );
      const clips = {
        killCombo: search(replayData, ...killComboQuery),
        shieldGrab: search(replayData, ...shieldGrabQuery),
        crouchCancel: search(replayData, ...crouchCancelQuery),
        edgeguard: search(replayData, ...edgeguardQuery),
        grabPunish: search(replayData, ...grabPunishQuery),
      };
      batch(() => {
        setStore("replayData", replayData);
        setStore("clips", clips);
        setStore("currentFile", 0);
        setStore("currentClip", -1);
        setFrame(Math.max(0, startFrame - 60));
      });
      play();
    }
  } catch (e) {
    console.error(e);
  }
  dismissToast(toastId);
  if (failedFilenames.length > 0) {
    createToast({
      title: `Failed to parse ${failedFilenames.length} file(s)`,
      duration: 2000,
      render: () => (
        <div class="flex flex-col">
          <For each={failedFilenames}>
            {(failedFilename) => <div>{failedFilename}</div>}
          </For>
        </div>
      ),
      placement: "bottom-end",
    });
  }
  if (skipCount > 0) {
    createToast({
      title: `Skipped ${skipCount} file(s) with CPUs or illegal stages`,
      duration: 2000,
      placement: "bottom-end",
    });
  }
}

export async function nextFile(): Promise<void> {
  const currentIndex =
    store.filteredIndexes != null && store.filteredIndexes.length > 0
      ? store.filteredIndexes.indexOf(store.currentFile)
      : store.currentFile;
  const nextIndex =
    store.filteredIndexes != null && store.filteredIndexes.length > 0
      ? store.filteredIndexes[
          wrap(store.filteredIndexes.length, currentIndex + 1)
        ]
      : wrap(store.files.length, currentIndex + 1);
  const replayData = parseReplay(await store.files[nextIndex].arrayBuffer());
  const clips = {
    killCombo: search(replayData, ...killComboQuery),
    shieldGrab: search(replayData, ...shieldGrabQuery),
    crouchCancel: search(replayData, ...crouchCancelQuery),
    edgeguard: search(replayData, ...edgeguardQuery),
    grabPunish: search(replayData, ...grabPunishQuery),
  };
  batch(() => {
    setStore("currentFile", nextIndex);
    setStore("replayData", replayData);
    setFrame(0);
    setStore("clips", clips);
    setStore("currentClip", -1);
  });
}

export async function previousFile(): Promise<void> {
  const currentIndex =
    store.filteredIndexes != null && store.filteredIndexes.length > 0
      ? store.filteredIndexes.indexOf(store.currentFile)
      : store.currentFile;
  const previousIndex =
    store.filteredIndexes != null && store.filteredIndexes.length > 0
      ? store.filteredIndexes[
          wrap(store.filteredIndexes.length, currentIndex - 1)
        ]
      : wrap(store.files.length, currentIndex - 1);
  const replayData = parseReplay(
    await store.files[previousIndex].arrayBuffer()
  );
  const clips = {
    killCombo: search(replayData, ...killComboQuery),
    shieldGrab: search(replayData, ...shieldGrabQuery),
    crouchCancel: search(replayData, ...crouchCancelQuery),
    edgeguard: search(replayData, ...edgeguardQuery),
    grabPunish: search(replayData, ...grabPunishQuery),
  };
  batch(() => {
    setStore("currentFile", previousIndex);
    setStore("replayData", replayData);
    setFrame(0);
    setStore("clips", clips);
    setStore("currentClip", -1);
  });
}

export async function setFile(fileIndex: number): Promise<void> {
  const replayData = parseReplay(await store.files[fileIndex].arrayBuffer());
  const clips = {
    killCombo: search(replayData, ...killComboQuery),
    shieldGrab: search(replayData, ...shieldGrabQuery),
    crouchCancel: search(replayData, ...crouchCancelQuery),
    edgeguard: search(replayData, ...edgeguardQuery),
    grabPunish: search(replayData, ...grabPunishQuery),
  };
  batch(() => {
    setStore("currentFile", fileIndex);
    setStore("replayData", replayData);
    setFrame(0);
    setStore("clips", clips);
    setStore("currentClip", -1);
  });
}

export function play(): void {
  start();
}

export function pause(): void {
  stop();
}

export function togglePause(): void {
  store.running ? stop() : start();
}

export function tick(): void {
  setFrame(
    pipe(add(framesPerTick()), (frame) =>
      wrap((store as StoreWithReplay).replayData.frames.length, frame)
    )
  );
}

export function tickBack(): void {
  setFrame(
    pipe(dec, (frame) =>
      wrap((store as StoreWithReplay).replayData.frames.length, frame)
    )
  );
}

export function speedNormal(): void {
  setFps(60);
  setFramesPerTick(1);
}

export function speedFast(): void {
  setFramesPerTick(2);
}

export function speedSlow(): void {
  setFps(30);
}

export function zoomIn(): void {
  setStore("zoom", (z) => z * 1.01);
}

export function zoomOut(): void {
  setStore("zoom", (z) => z / 1.01);
}

export function toggleDebug(): void {
  setStore("isDebug", (isDebug) => !isDebug);
}

export function nextClip(): void {
  const entries = Array.from(Object.entries(store.clips)).flatMap(
    ([name, clips]) => clips.map((clip): [string, Highlight] => [name, clip])
  );
  const newClipIndex = wrap(entries.length, store.currentClip + 1);
  const [, newClip] = entries[newClipIndex];
  batch(() => {
    setStore("currentClip", newClipIndex);
    jump(
      wrap(
        (store as StoreWithReplay).replayData.frames.length,
        newClip.startFrame - 30
      )
    );
  });
}

export function previousClip(): void {
  const entries = Array.from(Object.entries(store.clips)).flatMap(
    ([name, clips]) => clips.map((clip): [string, Highlight] => [name, clip])
  );
  const newClipIndex = wrap(entries.length, store.currentClip - 1);
  const [, newClip] = entries[newClipIndex];
  batch(() => {
    setStore("currentClip", newClipIndex);
    jump(
      wrap(
        (store as StoreWithReplay).replayData.frames.length,
        newClip.startFrame - 30
      )
    );
  });
}

export function setClip(newClipIndex: number): void {
  const entries = Array.from(Object.entries(store.clips)).flatMap(
    ([name, clips]) => clips.map((clip): [string, Highlight] => [name, clip])
  );
  const [, newClip] = entries[newClipIndex];
  batch(() => {
    setStore("currentClip", wrap(entries.length, newClipIndex));
    jump(
      wrap(
        (store as StoreWithReplay).replayData.frames.length,
        newClip.startFrame - 30
      )
    );
  });
}

export function jump(target: number): void {
  setFrame(wrap((store as StoreWithReplay).replayData.frames.length, target));
}

// percent is [0,1]
export function jumpPercent(percent: number): void {
  setFrame(
    Math.round((store as StoreWithReplay).replayData.frames.length * percent)
  );
}

export function adjust(delta: number): void {
  setFrame(
    pipe(add(delta), (frame) =>
      wrap((store as StoreWithReplay).replayData.frames.length, frame)
    )
  );
}

export function setFilters(filters: Filter[]): void {
  setStore("filters", filters);
  const filterResults = gameSettings().filter((gameSettings) => {
    const charactersNeeded = map(
      (filters: Filter[]) => filters.length,
      groupBy(
        (filter) => filter.label,
        filters.filter((filter) => filter.type === "character")
      )
    );
    const charactersPass = Object.entries(charactersNeeded).every(
      ([character, amountRequired]) =>
        gameSettings.playerSettings.filter(
          (p) => character === characterNameByExternalId[p.externalCharacterId]
        ).length === amountRequired
    );
    const stagesToShow = filters
      .filter((filter) => filter.type === "stage")
      .map((filter) => filter.label);
    const stagePass =
      stagesToShow.length === 0 ||
      stagesToShow.includes(stageNameByExternalId[gameSettings.stageId]);
    const namesNeeded = filters
      .filter((filter) => filter.type === "codeOrName")
      .map((filter) => filter.label);
    const namesPass = namesNeeded.every((name) =>
      gameSettings.playerSettings.some((p) =>
        [
          p.connectCode?.toLowerCase(),
          p.displayName?.toLowerCase(),
          p.nametag?.toLowerCase(),
        ].includes(name.toLowerCase())
      )
    );
    return stagePass && charactersPass && namesPass;
  });
  setStore(
    "filteredIndexes",
    filters.length === 0
      ? undefined
      : filterResults.map((settings) => gameSettings().indexOf(settings))
  );
}

function wrap(max: number, targetFrame: number): number {
  return (targetFrame + max) % max;
}

const killComboQuery: [Query, Predicate?] = [
  [
    { predicate: opponent(isInHitstun) },
    { predicate: opponent(isDead), delayed: true },
  ],
  not(opponent(isInGroundedControl)),
];
const grabPunishQuery: [Query, Predicate?] = [
  [
    { predicate: opponent(isGrabbed) },
    {
      predicate: all(
        not(opponent(isDead)),
        either(not(opponent(isInGroundedControl)), opponent(isOffstage))
      ),
    },
  ],
];
const edgeguardQuery: [Query, Predicate?] = [
  [
    { predicate: opponent(isOffstage) },
    { predicate: not(opponent(isInHitstun)), delayed: true },
    { predicate: opponent(isInHitstun), delayed: true },
  ],
  not(opponent(isInGroundedControl)),
];
const crouchCancelQuery: [Query, Predicate?] = [
  [{ predicate: isCrouching }, { predicate: isInHitstun }],
];
const shieldGrabQuery: [Query, Predicate?] = [
  [
    { predicate: isInShieldstun },
    { predicate: action("Catch"), delayed: true },
  ],
  either(action("Guard"), action("Catch"), action("GuardSetOff")),
];

// load a file from query params if provided. Otherwise start playing the sample
// match.
const url = new URLSearchParams(location.search).get("replayUrl");
const path = location.pathname.slice(1);
const frameParse = Number(location.hash.split("#").at(-1));
const startFrame = Number.isNaN(frameParse) ? 0 : frameParse;
if (url !== null) {
  try {
    void fetch(url)
      .then(async (response) => await response.blob())
      .then((blob) => new File([blob], url.split("/").at(-1) ?? "url.slp"))
      .then(async (file) => await load([file], startFrame));
  } catch (e) {
    console.error("Error: could not load replay", url, e);
  }
} else if (path !== "") {
  void downloadReplay(path).then(({ data, error }) => {
    if (data != null) {
      const file = new File([data], `${path}.slp`);
      return load([file], startFrame);
    }
    if (error != null) {
      console.error("Error: could not load replay", error);
    }
  });
}
