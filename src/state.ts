import createRAF, { targetFPS } from "@solid-primitives/raf";
import { add, dec, inc, pipe } from "rambda";
import { batch, createSignal } from "solid-js";
import { parseReplay } from "./parser/parser";
import { ReplayData } from "./common/types";

const [replayData, setReplayData] = createSignal<ReplayData | undefined>();
const [frame, setFrame] = createSignal(0);
const [currentFile, setCurrentFile] = createSignal(0);
const [files, setFiles] = createSignal<File[]>([]);

export const state = {
  replayData,
  frame,
  currentFile,
  files,
};

const [running, start, stop] = createRAF(targetFPS(tick, 60));

export async function load(files: File[]) {
  const replayData = parseReplay(await files[0].arrayBuffer());
  batch(() => {
    setFiles(files);
    setCurrentFile(0);
    setReplayData(replayData);
    setFrame(0);
  });
  play();
}

export async function nextFile() {
  const replayData = parseReplay(
    await files()[currentFile() + 1].arrayBuffer()
  );
  batch(() => {
    setCurrentFile(inc);
    setReplayData(replayData);
    setFrame(0);
  });
}

export async function previousFile() {
  const replayData = parseReplay(
    await files()[currentFile() - 1].arrayBuffer()
  );
  batch(() => {
    setCurrentFile(dec);
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

export function tick() {
  setFrame(pipe(inc, wrap));
}

export function tickBack() {
  setFrame(pipe(dec, wrap));
}

export function jump(target: number) {
  setFrame(target);
}

export function adjust(delta: number) {
  setFrame(pipe(add(delta), wrap));
}

function wrap(targetFrame: number) {
  const { frames } = replayData()!;
  return (targetFrame + frames.length) % frames.length;
}
