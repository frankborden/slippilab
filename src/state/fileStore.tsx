import { inc } from "rambda";
import { batch, For } from "solid-js";
import { createStore } from "solid-js/store";
import { ProgressCircle } from "~/common/ProgressCircle";
import { createToast, dismissToast } from "~/common/toaster";
import { GameSettings } from "~/common/types";
import { downloadReplay } from "~/supabaseClient";
import { send } from "~/workerClient";

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

// load a file from query params if provided. Otherwise start playing the sample
// match.
const url = new URLSearchParams(location.search).get("replayUrl");
const path = location.pathname.slice(1);
// const frameParse = Number(location.hash.split("#").at(-1));
// const startFrame = Number.isNaN(frameParse) ? 0 : frameParse;
if (url !== null) {
  try {
    void fetch(url)
      .then(async (response) => await response.blob())
      .then((blob) => new File([blob], url.split("/").at(-1) ?? "url.slp"))
      .then(async (file) => await load([file]));
  } catch (e) {
    console.error("Error: could not load replay", url, e);
  }
} else if (path !== "") {
  void downloadReplay(path).then(({ data, error }) => {
    if (data != null) {
      const file = new File([data], `${path}.slp`);
      return load([file]);
    }
    if (error != null) {
      console.error("Error: could not load replay", error);
    }
  });
}
