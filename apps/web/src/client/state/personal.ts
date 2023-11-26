import { type ReplayStub } from "@slippilab/common";
import { createSignal } from "solid-js";

import ParserWorker from "~/client/state/worker?worker";

export const [stubs, setStubs] = createSignal<[ReplayStub, File][]>([]);
export const [progress, setProgress] = createSignal(0);
export const [selected, setSelected] = createSignal<
  [ReplayStub, File] | undefined
>();

const worker = new ParserWorker();
worker.onmessage = (event) => {
  if (event.data.progress !== undefined) {
    setProgress(event.data.progress);
  } else {
    setStubs(event.data.stubs);
  }
};

export function addFiles(files: File[]) {
  worker.postMessage(files);
}
