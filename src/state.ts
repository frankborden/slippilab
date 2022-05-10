import createRAF, { targetFPS } from "@solid-primitives/raf";
import { add, dec, pipe } from "rambda";
import { batch, createSignal } from "solid-js";
import { parseReplay } from "./parser/parser";
import { ReplayData } from "./common/types";
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
import { supabase } from "./supabaseClient";

const [replayData, setReplayData] = createSignal<ReplayData | undefined>();
const [frame, setFrame] = createSignal(0);
const [currentFile, setCurrentFile] = createSignal(0);
const [files, setFiles] = createSignal<File[]>([]);
const [clips, setClips] = createSignal<Record<string, Highlight[]>>({});
const [fps, setFps] = createSignal(60);
const [zoom, setZoom] = createSignal(1);
const [framesPerTick, setFramesPerTick] = createSignal(1);
const [isDebug, setIsDebug] = createSignal(false);

export const state = {
  replayData,
  frame,
  currentFile,
  files,
  clips,
  zoom,
  isDebug,
};

const [running, start, stop] = createRAF(targetFPS(tick, fps));

export async function load(files: File[]) {
  const replayData = parseReplay(await files[0].arrayBuffer());
  const clips = { killCombo: search(replayData, ...killComboQuery) };
  batch(() => {
    setFiles(files);
    setCurrentFile(0);
    setReplayData(replayData);
    setFrame(0);
    setClips(clips);
  });
  play();
}

export async function nextFile() {
  const nextIndex = wrap(files().length, currentFile() + 1);
  const replayData = parseReplay(await files()[nextIndex].arrayBuffer());
  batch(() => {
    setCurrentFile(nextIndex);
    setReplayData(replayData);
    setFrame(0);
  });
}

export async function previousFile() {
  const previousIndex = wrap(files().length, currentFile() - 1);
  const replayData = parseReplay(await files()[previousIndex].arrayBuffer());
  batch(() => {
    setCurrentFile(previousIndex);
    setReplayData(replayData);
    setFrame(0);
  });
}

export async function setFile(fileIndex: number) {
  const replayData = parseReplay(await files()[fileIndex].arrayBuffer());
  batch(() => {
    setCurrentFile(fileIndex);
    setReplayData(replayData);
    setFrame(0);
  });
}

export function play() {
  start();
}

export function pause() {
  stop();
}

export function togglePause() {
  running() ? stop() : start();
}

export function tick() {
  setFrame(
    pipe(add(framesPerTick()), (frame) =>
      wrap(replayData()!.frames.length, frame)
    )
  );
}

export function tickBack() {
  setFrame(pipe(dec, (frame) => wrap(replayData()!.frames.length, frame)));
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
  setZoom((z) => z * 1.01);
}

export function zoomOut() {
  setZoom((z) => z / 1.01);
}

export function toggleDebug() {
  setIsDebug((value) => !value);
}

export function jump(target: number) {
  setFrame(target);
}

// percent is [0,1]
export function jumpPercent(percent: number) {
  setFrame(Math.round(replayData()!.frames.length * percent));
}

export function adjust(delta: number) {
  setFrame(
    pipe(add(delta), (frame) => wrap(replayData()!.frames.length, frame))
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
  supabase.storage
    .from("public/replays")
    .download(`${path}.slp`)
    .then(({ data, error }) => {
      if (data) {
        const file = new File([data], "sample.slp");
        load([file]);
      }
      if (error) {
        console.error("Error: could not load replay", error);
      }
    });
}
