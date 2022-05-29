import { Viewer } from "./viewer/Viewer";
import { fetchAnimations } from "./viewer/animationCache";
import { Box, Flex } from "@hope-ui/solid";
import { Sidebar } from "./sidebar/Sidebar";
import { createDropzone } from "@solid-primitives/upload";
import { load, store } from "./state";
import "@thisbeyond/solid-select/style.css";
import { Show, JSX } from "solid-js";
import { Landing } from "./Landing";
import { filterFiles } from "./common/util";

export function App(): JSX.Element {
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
      <Flex ref={dropzoneRef} width="$screenW" height="$screenH">
        <Show when={store.files.length > 0} fallback={<Landing />}>
          <Box flexGrow="1">
            <Sidebar />
          </Box>
          <Box>
            <Viewer />
          </Box>
        </Show>
      </Flex>
    </>
  );
}
