import { batch, For } from "solid-js";
import { createStore } from "solid-js/store";
import { ProgressCircle } from "~/common/ProgressCircle";
import { createToast, dismissToast } from "~/common/toaster";
import { GameSettings } from "~/common/types";
import { send } from "~/workerClient";

export interface FileStore {
  files: File[];
  gameSettings: GameSettings[];
  parseProgress: number;
  urlStartFrame?: number;
}

const [state, setState] = createStore<FileStore>({
  files: [],
  gameSettings: [],
  parseProgress: 0,
});

export const fileStore = state;
export async function load(files: File[], startFrame?: number): Promise<void> {
  setState("parseProgress", 0);
  setState("urlStartFrame", startFrame);
  const progressToast = createToast({
    title: "Parsing files",
    duration: 999999,
    render: () => (
      <div class="flex items-center gap-3">
        <ProgressCircle percent={(state.parseProgress * 100) / files.length} />
        {state.parseProgress}/{files.length}
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
  } = await send(files, () => setState("parseProgress", (p) => p + 1));

  // Save results to the store and show results toasts
  batch(() => {
    setState(
      "gameSettings",
      goodFilesAndSettings.map(([, settings]) => settings)
    );
    setState(
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
