import { fetchAnimations } from "~/viewer/animationCache";
import { createDropzone } from "@solid-primitives/upload";
import { Show } from "solid-js";
import { Landing } from "~/Landing";
import { filterFiles } from "~/common/util";
import { ToastGroup } from "~/common/toaster";
import "@thisbeyond/solid-select/style.css";
import { createFileStore, FileStoreContext } from "~/state/fileStore";
import { TopBar } from "~/TopBar";
import { MainContent } from "~/MainContent";
import {
  createSelectionStore,
  SelectionStoreContext,
} from "~/state/selectionStore";
import { createReplayStore, ReplayStoreContext } from "~/state/replayStore";
import { downloadReplay } from "~/supabaseClient";

export function App() {
  // Get started fetching the most popular characters
  void fetchAnimations(20); // Falco
  void fetchAnimations(2); // Fox
  void fetchAnimations(0); // Falcon
  void fetchAnimations(9); // Marth

  const fileStore = createFileStore();
  const selectionStore = createSelectionStore(fileStore[0]);
  const replayStore = createReplayStore(selectionStore[0]);

  // Make the whole screen a dropzone
  const { setRef: dropzoneRef } = createDropzone({
    onDrop: async (uploads) => {
      const files = uploads.map((upload) => upload.file);
      const filteredFiles = await filterFiles(files);
      return await fileStore[1].load(filteredFiles);
    },
  });

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
        .then(async (file) => await fileStore[1].load([file]));
    } catch (e) {
      console.error("Error: could not load replay", url, e);
    }
  } else if (path !== "") {
    void downloadReplay(path).then(({ data, error }) => {
      if (data != null) {
        const file = new File([data], `${path}.slp`);
        return fileStore[1].load([file]);
      }
      if (error != null) {
        console.error("Error: could not load replay", error);
      }
    });
  }

  return (
    <FileStoreContext.Provider value={fileStore}>
      <SelectionStoreContext.Provider value={selectionStore}>
        <ReplayStoreContext.Provider value={replayStore}>
          <Show when={fileStore[0].files.length > 0} fallback={<Landing />}>
            <div
              class="flex flex-col lg:h-screen lg:w-screen"
              ref={dropzoneRef}
            >
              <TopBar />
              <MainContent />
            </div>
          </Show>
          <ToastGroup />
        </ReplayStoreContext.Provider>
      </SelectionStoreContext.Provider>
    </FileStoreContext.Provider>
  );
}
