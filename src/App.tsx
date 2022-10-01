/* @refresh reload */
import { fetchAnimations } from "~/viewer/animationCache";
import { createDropzone } from "@solid-primitives/upload";
import { Show } from "solid-js";
import { Landing } from "~/Landing";
import { filterFiles } from "~/common/util";
import { ToastGroup } from "~/common/toaster";
import "@thisbeyond/solid-select/style.css";
import "~/state/fileStore";
import "~/state/selectionStore";
import "~/state/replayStore";
import { load } from "~/state/fileStore";
import { replayStore, toggleDebug } from "~/state/replayStore";
import { downloadReplay } from "~/supabaseClient";
import { Viewer } from "~/viewer/Viewer";
import { Sidebar } from "~/sidebar/Sidebar";
import { Navigation } from "~/sidebar/Navigation";
import { selectionStore } from "~/state/selectionStore";
import { UploadDialog } from "~/sidebar/UploadDialog";
import { ControllerIcon, ListUlIcon } from "~/common/icons";
import { TopBar } from "~/sidebar/TopBar";

export function App() {
  // Get started fetching the most popular characters
  void fetchAnimations(20); // Falco
  void fetchAnimations(2); // Fox
  void fetchAnimations(0); // Falcon
  void fetchAnimations(9); // Marth

  // Make the whole screen a dropzone
  const { setRef: dropzoneRef } = createDropzone({
    onDrop: async (uploads) => {
      const files = uploads.map((upload) => upload.file);
      const filteredFiles = await filterFiles(files);
      return await load(filteredFiles);
    },
  });

  // load a file from query params if provided. Otherwise start playing the
  // sample match.
  const url = new URLSearchParams(location.search).get("replayUrl");
  const path = location.pathname.slice(1);
  const frameParse = Number(location.hash.split("#").at(-1));
  const startFrame = Number.isNaN(frameParse) ? 0 : frameParse;
  if (url !== null) {
    try {
      void fetch(url)
        .then(async (response) => await response.blob())
        .then((blob) => new File([blob], url.split("/").at(-1) ?? "url.slp"))
        .then(async (file) => await load([file], startFrame));
    } catch (e) {
      console.error("Error: could not load replay", url, e);
    }
  } else if (path !== "") {
    void downloadReplay(path).then(({ data, error }) => {
      if (data != null) {
        const file = new File([data], `${path}.slp`);
        return load([file], startFrame);
      }
      if (error != null) {
        console.error("Error: could not load replay", error);
      }
    });
  }

  return (
    <div class="flex h-screen gap-4" ref={dropzoneRef}>
      <Navigation />
      <Sidebar />
      <div class="flex flex-grow flex-col gap-2 pt-2">
        <TopBar />
        <Viewer />
      </div>
      {/* <Show when={fileStore.files.length > 0} fallback={<Landing />}>
        <Show
          when={!replayStore.isFullscreen}
          fallback={
            <div class="flex h-screen flex-col justify-between overflow-y-auto">
              <Viewer />
            </div>
          }
        >
          <div class="flex flex-col md:h-screen md:w-screen" ref={dropzoneRef}>
            <TopBar />
            <MainContent />
          </div>
        </Show>
      </Show> */}
      <ToastGroup />
    </div>
  );
}
