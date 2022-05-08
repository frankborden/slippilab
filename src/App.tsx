import { Viewer } from "./viewer/Viewer";
import { fetchAnimations } from "./viewer/animationCache";
import { Box, Flex } from "@hope-ui/solid";
import { Sidebar } from "./sidebar/Sidebar";
import { createDropzone } from "@solid-primitives/upload";
import { load } from "./state";

export function App() {
  // Get started fetching the most popular characters
  fetchAnimations(20); // Falco
  fetchAnimations(2); // Fox
  fetchAnimations(0); // Falcon
  fetchAnimations(9); // Marth

  // Make the whole screen a dropzone
  const { setRef: dropzoneRef } = createDropzone({
    onDrop: async uploads => {
      load(uploads.map(upload => upload.file));
    },
  });

  return (
    <>
      <Flex ref={dropzoneRef} width={"$screenW"}>
        <Box flexGrow={1}>
          <Sidebar />
        </Box>
        <Box
          height={"$screenH"}
          overflow={"hidden"}
          style={{ "aspect-ratio": "73/60" }}
        >
          <Viewer />
        </Box>
      </Flex>
    </>
  );
}
