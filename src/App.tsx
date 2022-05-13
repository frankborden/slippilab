import { Viewer } from "./viewer/Viewer";
import { fetchAnimations } from "./viewer/animationCache";
import { Box, Flex } from "@hope-ui/solid";
import { Sidebar } from "./sidebar/Sidebar";
import { createDropzone } from "@solid-primitives/upload";
import { load } from "./state";
import { BlobReader, BlobWriter, ZipReader } from "@zip.js/zip.js";

export function App() {
  // Get started fetching the most popular characters
  fetchAnimations(20); // Falco
  fetchAnimations(2); // Fox
  fetchAnimations(0); // Falcon
  fetchAnimations(9); // Marth

  // Make the whole screen a dropzone
  const { setRef: dropzoneRef } = createDropzone({
    onDrop: async uploads => {
      const files = uploads.map(upload => upload.file);

      const slpFiles = files.filter(file => file.name.endsWith(".slp"));
      const zipFiles = files.filter(file => file.name.endsWith(".zip"));
      const blobsFromZips = (await Promise.all(zipFiles.map(unzip)))
        .flat()
        .filter(file => file.name.endsWith(".slp"));

      load([...slpFiles, ...blobsFromZips]);
    },
  });

  return (
    <>
      <Flex ref={dropzoneRef} width="$screenW" height="$screenH">
        <Box flexGrow="1">
          <Sidebar />
        </Box>
        <Box style={{ "aspect-ratio": "73/60" }}>
          <Viewer />
        </Box>
      </Flex>
    </>
  );
}

async function unzip(zipFile: File): Promise<File[]> {
  const entries = await new ZipReader(new BlobReader(zipFile)).getEntries();
  return Promise.all(
    entries
      .filter(entry => !entry.filename.split("/").at(-1)?.startsWith("."))
      .map(entry =>
        (entry.getData?.(new BlobWriter()) as Promise<Blob>).then(
          blob => new File([blob], entry.filename)
        )
      )
  );
}
