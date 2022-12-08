/* @refresh reload */
import { createDropzone } from "@solid-primitives/upload";
import "@thisbeyond/solid-select/style.css";
import { Show } from "solid-js";
import { filterFiles } from "~/common/util";
import { ToastGroup } from "~/components/common/toaster";
import { Landing } from "~/components/Landing";
import { Navigation } from "~/components/panels/Navigation";
import { Sidebar } from "~/components/panels/Sidebar";
import { TopBar } from "~/components/panels/TopBar";
import { Viewer } from "~/components/viewer/Viewer";
import { fileStore, load } from "~/stores/fileStore";
import { replayStore } from "~/stores/replayStore";
import { downloadReplay } from "~/supabaseClient";
import { fetchAnimations } from "~/viewer/animationCache";
import "~/stores/fileStore";
import "~/stores/replayStore";
import "~/stores/selectionStore";

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
    <>
      <Show when={fileStore.files.length > 0} fallback={<Landing />}>
        <Show
          when={!replayStore.isFullscreen}
          fallback={
            <div class="flex h-screen flex-col justify-between overflow-y-auto">
              <Viewer />
            </div>
          }
        >
          <div
            class="flex h-full flex-col-reverse gap-4 lg:h-screen lg:flex-row"
            ref={dropzoneRef}
          >
            <Navigation />
            <Sidebar />
            <div class="flex max-h-screen flex-grow flex-col gap-2 pt-2 pr-4 pl-4 lg:pl-0">
              <TopBar />
              <Viewer />
            </div>
          </div>
        </Show>
      </Show>
      <ToastGroup />
    </>
  );
}
