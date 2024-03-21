import { create } from "zustand";

import { ReplayStub } from "~/common/types";
import ParserWorker from "~/stores/fileWorker?worker";

interface FileStore {
  stubs: [ReplayStub, File][];
  loadProgress?: number;

  loadFiles: (files: File[]) => void;
}

export const useFileStore = create<FileStore>((set) => ({
  stubs: [],
  loadProgress: undefined,

  loadFiles: (files) =>
    new Promise((resolve) => {
      const worker = new ParserWorker();
      worker.onmessage = (event) => {
        if (event.data.progress !== undefined) {
          set({ loadProgress: event.data.progress });
        } else {
          set({ stubs: event.data.stubs, loadProgress: undefined });
          resolve(undefined);
        }
      };
      worker.postMessage(files);
    }),
}));
