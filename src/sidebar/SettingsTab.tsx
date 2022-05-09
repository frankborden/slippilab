import {
  Kbd,
  Table,
  TableCaption,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@hope-ui/solid";

export function SettingsTab() {
  return (
    <>
      <Table>
        <TableCaption placement={"top"}>Playback Shortcuts</TableCaption>
        <Thead>
          <Tr>
            <Th>Shortcut</Th>
            <Th>Description</Th>
          </Tr>
        </Thead>
        <Tbody>
          <Tr>
            <Td>
              <Kbd>space</Kbd>/<Kbd>K</Kbd>
            </Td>
            <Td>Toggle pause</Td>
          </Tr>
          <Tr>
            <Td>
              <Kbd>LeftArrow</Kbd>/<Kbd>J</Kbd>
            </Td>
            <Td>Rewind 2 seconds</Td>
          </Tr>
          <Tr>
            <Td>
              <Kbd>RightArrow</Kbd>/<Kbd>L</Kbd>
            </Td>
            <Td>Skip ahead 2 seconds</Td>
          </Tr>

          <Tr>
            <Td>
              <Kbd>0</Kbd>-<Kbd>9</Kbd>
            </Td>
            <Td>
              Jump to xx%. For example, press <Kbd>3</Kbd> for 30%
            </Td>
          </Tr>
          <Tr>
            <Td>
              <Kbd>.</Kbd>
            </Td>
            <Td>Next frame (pauses if not paused)</Td>
          </Tr>
          <Tr>
            <Td>
              <Kbd>,</Kbd>
            </Td>
            <Td>Previous frame (pauses if not paused)</Td>
          </Tr>
          <Tr>
            <Td>
              <Kbd>UpArrow</Kbd>
            </Td>
            <Td>Slow speed</Td>
          </Tr>
          <Tr>
            <Td>
              <Kbd>DownArrow</Kbd>
            </Td>
            <Td>Fast speed</Td>
          </Tr>
          <Tr>
            <Td>
              <Kbd>+</Kbd>/<Kbd>=</Kbd>
            </Td>
            <Td>Zoom in</Td>
          </Tr>
          <Tr>
            <Td>
              <Kbd>-</Kbd>/<Kbd>_</Kbd>
            </Td>
            <Td>Zoom out</Td>
          </Tr>
          <Tr>
            <Td>
              <Kbd>[</Kbd>/<Kbd>{"{"}</Kbd>
            </Td>
            <Td>Play previous file</Td>
          </Tr>
          <Tr>
            <Td>
              <Kbd>]</Kbd>/<Kbd>{"}"}</Kbd>
            </Td>
            <Td>Play next file</Td>
          </Tr>
          <Tr>
            <Td>
              <Kbd>d</Kbd>
            </Td>
            <Td>Toggle debug output</Td>
          </Tr>
        </Tbody>
      </Table>
    </>
  );
}
