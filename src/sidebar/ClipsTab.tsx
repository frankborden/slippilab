import { Picker } from "../common/Picker";
import { Highlight } from "../search/search";
import { jump, state } from "../state";

export function ClipsTab() {
  function renderClip(clip: Highlight) {
    return `Player ${clip.playerIndex}: ${clip.startFrame}-${clip.endFrame}`;
  }
  return (
    <>
      <Picker
        items={state.clips()}
        render={renderClip}
        onClick={clip => jump(clip.startFrame)}
        selected={0}
      />
    </>
  );
}
