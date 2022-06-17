import { inc } from "rambda";
import { batch, For } from "solid-js";
import { createStore } from "solid-js/store";
import { ProgressCircle } from "~/common/ProgressCircle";
import { createToast, dismissToast } from "~/common/toaster";
import { GameSettings } from "~/common/types";
import { send } from "~/workerClient";

/**
 * Holds the user's opened files and parses each file's game settings via web
 * worker. Unparseable files are discarded. Parse progress is surfaced in a
 * toast.
 */
export interface FileStore {
  files: File[];
  gameSettings: GameSettings[];
  parseProgress: number;
}

const [getStore, setStore] = createStore<FileStore>({
  files: [],
  gameSettings: [],
  parseProgress: 0,
});
export const fileStore = getStore;

export async function load(files: File[]): Promise<void> {
  const progressToast = createToast({
    title: "Parsing files",
    duration: Infinity,
    render: () => (
      <div class="flex items-center gap-3">
        <ProgressCircle
          percent={(fileStore.parseProgress * 100) / files.length}
        />
        {fileStore.parseProgress}/{files.length}
      </div>
    ),
    placement: "top-end",
  });

  const {
    goodFilesAndSettings,
    skipCount,
    failedFilenames,
  }: {
    goodFilesAndSettings: Array<[File, GameSettings]>;
    failedFilenames: string[];
    skipCount: number;
  } = await send(files, () => setStore("parseProgress", inc));

  // Save results to the store and show results toasts
  batch(() => {
    setStore(
      "gameSettings",
      goodFilesAndSettings.map(([, settings]) => settings)
    );
    setStore(
      "files",
      goodFilesAndSettings.map(([file]) => file)
    );
  });
  dismissToast(progressToast);
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
      placement: "top-end",
    });
  }
  if (skipCount > 0) {
    createToast({
      title: `Skipped ${skipCount} file(s) with CPUs or illegal stages`,
      duration: 2000,
      placement: "top-end",
    });
  }
}
