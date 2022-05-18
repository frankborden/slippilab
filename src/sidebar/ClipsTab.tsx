import { Badge, Box, Center, HStack, useColorModeValue } from "@hope-ui/solid";
import { createMemo } from "solid-js";
import { Picker } from "../common/Picker";
import { Highlight } from "../search/search";
import { setClip, state } from "../state";

export function ClipsTab() {
  const playerColors = useColorModeValue(
    ["red", "blue", "gold", "green"],
    ["darkred", "darkblue", "darkgoldenrod", "darkgreen"]
  );
  function renderClip([name, clip]: [string, Highlight]) {
    const index = Object.keys(state.clips()).indexOf(name);
    const nameColorScheme = (
      [
        "primary",
        "accent",
        "neutral",
        "success",
        "info",
        "warning",
        "danger",
      ] as const
    )[index % 7];
    return (
      <>
        <HStack width="$full">
          <HStack gap="$1">
            <Badge
              color="white"
              backgroundColor={playerColors()[clip.playerIndex]}
            >{`P${clip.playerIndex + 1}`}</Badge>
            <Badge colorScheme={nameColorScheme}>{name}</Badge>
          </HStack>
          <Center flexGrow="1">{`${clip.startFrame}-${clip.endFrame}`}</Center>
        </HStack>
      </>
    );
  }
  const entries = createMemo(() => {
    return Array.from(Object.entries(state.clips())).flatMap(([name, clips]) =>
      clips.map((clip): [string, Highlight] => [name, clip])
    );
  });
  return (
    <>
      <Box overflowY="auto">
        <Picker
          items={entries()}
          render={renderClip}
          onClick={(_, index) => setClip(index)}
          selected={state.currentClip()}
        />
      </Box>
    </>
  );
}
