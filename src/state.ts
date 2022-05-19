import createRAF, { targetFPS } from "@solid-primitives/raf";
import { add, dec, groupBy, map, pipe } from "rambda";
import { batch, createEffect, createSignal } from "solid-js";
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
import { notificationService } from "@hope-ui/solid";
import {
  characterNameByExternalId,
  ExternalCharacterName,
  ExternalStageName,
  stageNameByExternalId,
} from "./common/ids";

interface Store {
  isDebug: boolean;
  zoom: number;
  currentFile: number;
  currentClip: number;
  files: File[];
  clips: Record<string, Highlight[]>;
  gameSettings: GameSettings[];
  replayData?: ReplayData;
  running: boolean;
  filters: Filter[];
  filteredIndexes: number[];
}

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
  gameSettings: [],
  running: false,
  filters: [],
  filteredIndexes: [],
}) as [Store, SetStoreFunction<Store>];
export const store = getStore;

const [getFrame, setFrame] = createSignal(0);
const [fps, setFps] = createSignal(60);
const [framesPerTick, setFramesPerTick] = createSignal(1);
const [running, start, stop] = createRAF(targetFPS(tick, fps));
createEffect(() => setStore("running", running()));

export const frame = getFrame;

export async function load(files: File[]) {
  notificationService.show({
    loading: true,
    persistent: true,
    title: `Parsing ${files.length} files`,
  });
  const allGameSettings: (GameSettings | undefined)[] = await send(files);
  function isLegalGameWithoutCPUs(
    gameSettings: GameSettings | undefined
  ): boolean {
    if (gameSettings === undefined) return false;
    const stageName = stageNameByExternalId[gameSettings.stageId];
    if (
      ![
        "Battlefield",
        "Fountain of Dreams",
        "Yoshi's Story",
        "Dream Land N64",
        "Pokémon Stadium",
        "Final Destination",
      ].includes(stageName)
    ) {
      return false;
    }
    if (
      gameSettings.playerSettings
        .filter((p) => p)
        .some((p) => p.playerType === 1 || p.externalCharacterId >= 26)
    ) {
      return false;
    }
    return true;
  }
  const workingIndexes = allGameSettings.flatMap((s, i) =>
    isLegalGameWithoutCPUs(s) ? [i] : []
  );
  const workingFiles = files.filter((_, i) => workingIndexes.includes(i));
  const workingGameSettings = allGameSettings.filter(
    (settings, i): settings is GameSettings => workingIndexes.includes(i)
  );
  const failingFiles = files.filter((_, i) => allGameSettings[i] === undefined);
  notificationService.clear();
  if (failingFiles.length > 0) {
    notificationService.show({
      status: "danger",
      persistent: true,
      title: "Failed to parse",
      description: failingFiles.map((file) => file.name).join("\n"),
    });
  }
  try {
    const replayData: ReplayData = parseReplay(
      await workingFiles[0].arrayBuffer()
    );
    const clips = {
      killCombo: search(replayData, ...killComboQuery),
      shieldGrab: search(replayData, ...shieldGrabQuery),
      crouchCancel: search(replayData, ...crouchCancelQuery),
      edgeguard: search(replayData, ...edgeguardQuery),
      grabPunish: search(replayData, ...grabPunishQuery),
    };
    batch(() => {
      setStore("files", workingFiles);
      setStore("currentFile", 0);
      setStore("replayData", replayData);
      setFrame(0);
      setStore("clips", clips);
      setStore("currentClip", -1);
      setStore("gameSettings", workingGameSettings);
    });
    play();
  } catch (e) {}
}

export async function nextFile() {
  const currentIndex =
    store.filteredIndexes.length > 0
      ? store.filteredIndexes.indexOf(store.currentFile)
      : store.currentFile;
  const nextIndex =
    store.filteredIndexes.length > 0
      ? store.filteredIndexes[
          wrap(store.filteredIndexes.length, currentIndex + 1)
        ]
      : wrap(store.files.length, currentIndex - 1);
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

export async function previousFile() {
  const currentIndex =
    store.filteredIndexes.length > 0
      ? store.filteredIndexes.indexOf(store.currentFile)
      : store.currentFile;
  const previousIndex =
    store.filteredIndexes.length > 0
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

export async function setFile(fileIndex: number) {
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

export function play() {
  start();
}

export function pause() {
  stop();
}

export function togglePause() {
  store.running ? stop() : start();
}

export function tick() {
  setFrame(
    pipe(add(framesPerTick()), (frame) =>
      wrap(store.replayData!.frames.length, frame)
    )
  );
}

export function tickBack() {
  setFrame(pipe(dec, (frame) => wrap(store.replayData!.frames.length, frame)));
}

export function speedNormal() {
  setFps(60);
  setFramesPerTick(1);
}

export function speedFast() {
  setFramesPerTick(2);
}

export function speedSlow() {
  setFps(30);
}

export function zoomIn() {
  setStore("zoom", (z) => z * 1.01);
}

export function zoomOut() {
  setStore("zoom", (z) => z / 1.01);
}

export function toggleDebug() {
  setStore("isDebug", (isDebug) => !isDebug);
}

export function nextClip() {
  const entries = Array.from(Object.entries(store.clips)).flatMap(
    ([name, clips]) => clips.map((clip): [string, Highlight] => [name, clip])
  );
  const newClipIndex = wrap(entries.length, store.currentClip + 1);
  const [_, newClip] = entries[newClipIndex];
  batch(() => {
    setStore("currentClip", newClipIndex);
    jump(wrap(store.replayData!.frames.length, newClip.startFrame - 30));
  });
}

export function previousClip() {
  const entries = Array.from(Object.entries(store.clips)).flatMap(
    ([name, clips]) => clips.map((clip): [string, Highlight] => [name, clip])
  );
  const newClipIndex = wrap(entries.length, store.currentClip - 1);
  const [_, newClip] = entries[newClipIndex];
  batch(() => {
    setStore("currentClip", newClipIndex);
    jump(wrap(store.replayData!.frames.length, newClip.startFrame - 30));
  });
}

export function setClip(newClipIndex: number) {
  const entries = Array.from(Object.entries(store.clips)).flatMap(
    ([name, clips]) => clips.map((clip): [string, Highlight] => [name, clip])
  );
  const [_, newClip] = entries[newClipIndex];
  batch(() => {
    setStore("currentClip", wrap(entries.length, newClipIndex));
    jump(wrap(store.replayData!.frames.length, newClip.startFrame - 30));
  });
}

export function jump(target: number) {
  setFrame(wrap(store.replayData!.frames.length, target));
}

// percent is [0,1]
export function jumpPercent(percent: number) {
  setFrame(Math.round(store.replayData!.frames.length * percent));
}

export function adjust(delta: number) {
  setFrame(
    pipe(add(delta), (frame) => wrap(store.replayData!.frames.length, frame))
  );
}

export function setFilters(filters: Filter[]) {
  setStore("filters", filters);
  const filterResults = store.gameSettings.filter((gameSettings) => {
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
        ).length == amountRequired
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
    filterResults.map((settings) => store.gameSettings.indexOf(settings))
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
if (url) {
  try {
    fetch(url)
      .then((response) => response.blob())
      .then((blob) => new File([blob], url.split("/").at(-1) ?? "url.slp"))
      .then((file) => load([file]));
  } catch (e) {
    console.error("Error: could not load replay", url, e);
  }
} else if (path !== "") {
  downloadReplay(path).then(({ data, error }) => {
    if (data) {
      const file = new File([data], `${path}.slp`);
      load([file]);
    }
    if (error) {
      console.error("Error: could not load replay", error);
    }
  });
}
