import {
  Button,
  Center,
  Select,
  SelectContent,
  SelectIcon,
  SelectListbox,
  SelectOption,
  SelectOptionText,
  SelectPlaceholder,
  SelectTrigger,
  SelectValue,
} from "@hope-ui/solid";
import { For, Show } from "solid-js";
import { nextFile, previousFile, setFile, state } from "../state";
import { Upload } from "./Upload";

export function ReplaysTab() {
  return (
    <>
      <Center>
        <Upload />
      </Center>
      <Show when={state.files().length > 0}>
        <Center>
          <Button onClick={nextFile}>Next</Button>
          <Button onClick={previousFile}>Previous</Button>
        </Center>
        <Select onChange={setFile} value={state.currentFile()}>
          <SelectTrigger>
            {state.files()[state.currentFile()].name}
            <SelectIcon rotateOnOpen={true} />
          </SelectTrigger>
          <SelectContent>
            <SelectListbox>
              <For each={state.files()}>
                {(file, index) => (
                  <SelectOption value={index()}>
                    <SelectOptionText>{file.name}</SelectOptionText>
                  </SelectOption>
                )}
              </For>
            </SelectListbox>
          </SelectContent>
        </Select>
      </Show>
    </>
  );
}
