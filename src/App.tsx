import { Viewer } from "~/viewer/Viewer";
import { fetchAnimations } from "~/viewer/animationCache";
import { createDropzone } from "@solid-primitives/upload";
import { Show } from "solid-js";
import { Landing } from "~/Landing";
import { filterFiles } from "~/common/util";
import { ToastGroup } from "~/common/toaster";
import "@thisbeyond/solid-select/style.css";
import { fileStore, load } from "~/state/fileStore";
import "~/state/replayStore";
import { ClipsTab } from "~/sidebar/ClipsTab";
import { NowPlaying } from "~/sidebar/NowPlaying";
import { ReplaysTab } from "~/sidebar/ReplaysTab";

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

  return (
    <>
      <Show when={fileStore.files.length > 0} fallback={<Landing />}>
        <div class="h-screen w-screen flex" ref={dropzoneRef}>
          <div class="row-span-2 h-full overflow-y-auto box-border p-5">
            <ReplaysTab />
          </div>
          <div class="flex flex-col flex-grow h-full">
            <Viewer />
            <NowPlaying />
          </div>
          <div class="row-span-2 h-full overflow-y-auto box-border p-5">
            <ClipsTab />
          </div>
        </div>
      </Show>
      <ToastGroup />
    </>
  );
}
