import { Box, Button, Center } from "@hope-ui/solid";
import { zip } from "rambda";
import { createMemo, Show } from "solid-js";
import { characterNameByInternalId } from "../common/ids";
import { Picker } from "../common/Picker";
import { Metadata } from "../common/types";
import { nextFile, previousFile, setFile, state } from "../state";
import { Upload } from "./Upload";

export function ReplaysTab() {
  const filesWithMetadatas = createMemo(() =>
    zip(
      state.files(),
      state.metadatas().length > 0
        ? state.metadatas()
        : Array(state.files().length).fill(undefined)
    )
  );
  return (
    <>
      <Box height="$full" display="flex" flexDirection="column">
        <Show when={state.files().length > 0}>
          <Center>
            <Button onClick={nextFile}>Next</Button>
            <Button onClick={previousFile}>Previous</Button>
          </Center>
          <Box overflowY="auto">
            <Picker
              items={filesWithMetadatas()}
              render={([file, metadata]) =>
                metadata ? getMetadataInfo(metadata) : file.name
              }
              onClick={(_, index) => {
                setFile(index);
              }}
              selected={state.currentFile()}
            />
          </Box>
        </Show>
        <Center>
          <Upload />
        </Center>
      </Box>
    </>
  );
}

function getMetadataInfo(metadata: Metadata) {
  if (!metadata.players || Object.keys(metadata.players).length === 0) {
    return `${metadata.consoleNick} ${metadata.startAt}`;
  }
  return Array.from(Array(4).keys())
    .filter(i => metadata.players![i])
    .map(i => {
      const name =
        metadata.players![i].names?.netplay ?? metadata.players![i].names?.code;
      const character =
        characterNameByInternalId[
          Number(Object.keys(metadata.players![i].characters)[0])
        ];
      console.log(name, character);
      if (name) return `${name}(${character})`;
      return `${character}`;
    })
    .join(", ");
}
