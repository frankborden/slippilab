import { For } from "solid-js";
import { jump, state } from "../state";

export function ClipsTab() {
  return (
    <>
      <For each={state.clips()}>
        {clip => (
          <div onClick={() => jump(clip.startFrame)}>
            Player {clip.playerIndex + 1}: {clip.startFrame}-{clip.endFrame}
          </div>
        )}
      </For>
    </>
  );
}
