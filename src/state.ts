import createRAF, { targetFPS } from "@solid-primitives/raf";
import { add, dec, inc, pipe } from "rambda";
import { batch, createSignal } from "solid-js";
import { parseReplay } from "./parser/parser";
import { ReplayData } from "./common/types";
import { Highlight, Query, search } from "./search/search";
import {
  isDead,
  isInGroundedControl,
  isInHitstun,
  not,
  opponent,
  Predicate,
} from "./search/framePredicates";

const [replayData, setReplayData] = createSignal<ReplayData | undefined>();
const [frame, setFrame] = createSignal(0);
const [currentFile, setCurrentFile] = createSignal(0);
const [files, setFiles] = createSignal<File[]>([]);
const [clips, setClips] = createSignal<Record<string, Highlight[]>>({});
const [fps, setFps] = createSignal(60);
const [zoom, setZoom] = createSignal(1);

export const state = {
  replayData,
  frame,
  currentFile,
  files,
  clips,
  zoom,
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
  setFrame(pipe(inc, frame => wrap(replayData()!.frames.length, frame)));
}

export function tickBack() {
  setFrame(pipe(dec, frame => wrap(replayData()!.frames.length, frame)));
}

export function speedNormal() {
  setFps(60);
}

export function speedFast() {
  setFps(120);
}

export function speedSlow() {
  setFps(30);
}

export function zoomIn() {
  setZoom(z => z * 1.01);
}

export function zoomOut() {
  setZoom(z => z / 1.01);
}

export function jump(target: number) {
  setFrame(target);
}

// percent is [0,1]
export function jumpPercent(percent: number) {
  setFrame(Math.round(replayData()!.frames.length * percent));
}

export function adjust(delta: number) {
  setFrame(pipe(add(delta), frame => wrap(replayData()!.frames.length, frame)));
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
