import {
  Box,
  Button,
  Text,
  hope,
  HStack,
  Menu,
  MenuContent,
  MenuItem,
  MenuTrigger,
  VStack,
} from "@hope-ui/solid";
import { Flask, FolderOpen } from "phosphor-solid";
import { Links } from "./common/Links";
import { filterFiles } from "./common/util";
import { load } from "./state";
import { loadFromSupabase } from "./stateUtil";

export function Landing() {
  let fileInput!: HTMLInputElement;
  let folderInput!: HTMLInputElement;

  async function onFileSelected(e: Event) {
    const input = e.target as HTMLInputElement;

    if (!input.files?.length) {
      return;
    }
    const files = Array.from(input.files);
    const filteredFiles = await filterFiles(files);
    load(filteredFiles);
  }

  return (
    <Box width="$full" height="$full" padding="$4">
      <VStack
        width="$full"
        height="$full"
        alignContent="center"
        justifyContent="space-between"
      >
        <Box />
        <VStack alignContent="center" gap="$4">
          <HStack>
            <Flask size="64" color="var(--hope-colors-primary9)" />
            <Text>Slippi Lab</Text>
          </HStack>
          <Box>
            <Menu>
              <MenuTrigger
                as={Button}
                variant="subtle"
                rightIcon={<FolderOpen size="24" />}
              >
                Start
              </MenuTrigger>
              <MenuContent>
                <MenuItem disabled={false} onSelect={() => fileInput.click()}>
                  Open file(s)
                </MenuItem>
                <MenuItem disabled={false} onSelect={() => folderInput.click()}>
                  Open folder
                </MenuItem>
                <MenuItem
                  disabled={false}
                  onSelect={() => loadFromSupabase("sample")}
                >
                  Load demo
                </MenuItem>
              </MenuContent>
            </Menu>
          </Box>
        </VStack>
        <Box>
          <Links />
        </Box>
      </VStack>
      <hope.input
        display="none"
        type="file"
        accept=".slp,.zip"
        multiple
        ref={fileInput}
        onChange={onFileSelected}
      />
      <hope.input
        display="none"
        type="file"
        // @ts-ignore folder input is not standard, but is supported by all
        // modern browsers
        webkitDirectory
        ref={folderInput}
        onChange={onFileSelected}
      />
    </Box>
  );
}
