import { Viewer } from "~/viewer/Viewer";
import { fetchAnimations } from "~/viewer/animationCache";
import { Sidebar } from "~/sidebar/Sidebar";
import { createDropzone } from "@solid-primitives/upload";
import { load, store } from "~/state/state";
import { Show } from "solid-js";
import { Landing } from "~/Landing";
import { filterFiles } from "~/common/util";
import { ToastGroup } from "~/common/toaster";
import "@thisbeyond/solid-select/style.css";

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
      <div class="flex h-screen w-screen" ref={dropzoneRef}>
        <Show when={store.files.length > 0} fallback={<Landing />}>
          <div class="h-full flex-grow overflow-y-auto">
            <Sidebar />
          </div>
          <div>
            <Viewer />
          </div>
        </Show>
      </div>
      <ToastGroup />
    </>
  );
}
