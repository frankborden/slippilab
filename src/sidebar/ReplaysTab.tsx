import { Button, Center } from "@hope-ui/solid";
import { Show } from "solid-js";
import { Picker } from "../common/Picker";
import { nextFile, previousFile, setFile, state } from "../state";
import { Upload } from "./Upload";

export function ReplaysTab() {
  return (
    <>
      <Show when={state.files().length > 0}>
        <Center>
          <Button onClick={nextFile}>Next</Button>
          <Button onClick={previousFile}>Previous</Button>
        </Center>
        <Picker
          items={state.files()}
          render={file => file.name}
          onClick={(_, index) => {
            setFile(index);
          }}
          selected={state.currentFile()}
        />
      </Show>
      <Center>
        <Upload />
      </Center>
    </>
  );
}
