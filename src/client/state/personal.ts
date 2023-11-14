import { createSignal } from "solid-js";

import ParserWorker from "~/client/state/worker?worker";
import { type ReplayStub } from "~/common/model/types";

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
