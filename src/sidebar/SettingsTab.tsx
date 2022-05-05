import {
  Box,
  Grid,
  Heading,
  Kbd,
  Table,
  TableCaption,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  VStack,
} from "@hope-ui/solid";

export function SettingsTab() {
  /* Colors, Debug */
  return (
    <>
      {/* <VStack> */}
      {/* <Heading>Playback</Heading> */}
      <Table>
        <TableCaption placement={"top"}>Playback</TableCaption>
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
        </Tbody>
        {/* <Grid gridTemplateColumns={"auto auto"} gap={"$2 $4"}>
            <Box justifySelf={"end"}>
              <Kbd>.</Kbd>
            </Box>
            <Box>Next frame</Box>

            <Box justifySelf={"end"}>
              <Kbd>,</Kbd>
            </Box>
            <Box>Previous frame</Box>
          </Grid> */}
      </Table>
      {/* </VStack> */}
    </>
  );
}
