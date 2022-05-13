import { Box } from "@hope-ui/solid";
import { createMemo } from "solid-js";
import { Picker } from "../common/Picker";
import { Highlight } from "../search/search";
import { jump, state } from "../state";

export function ClipsTab() {
  function renderClip([name, clip]: [string, Highlight]) {
    return `${name} - Player ${clip.playerIndex + 1}: ${clip.startFrame}-${
      clip.endFrame
    }`;
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
          onClick={([_, clip]) => jump(clip.startFrame - 30)}
          selected={0}
        />
      </Box>
    </>
  );
}
