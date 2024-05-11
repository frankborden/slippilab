import { create } from "zustand";

import { ReplayStub } from "~/common/types";
import ParserWorker from "~/stores/fileWorker?worker";

interface Filter {
  type: "character" | "stage";
  value: string;
}

interface FileStore {
  page: number;
  filters: Filter[];
  stubs: [ReplayStub, File][];
  loadProgress?: number; // 0 - 100

  setPage: (page: number) => void;
  setFilters: (filters: Filter[]) => void;
  loadFiles: (files: File[]) => void;
}

export const useFileStore = create<FileStore>((set) => ({
  page: 0,
  stubs: [],
  loadProgress: undefined,
  filters: [],

  setPage: (page) => set({ page }),
  setFilters: (filters) => set({ filters }),
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
