import { Show, useContext } from "solid-js";
import { Clips } from "~/sidebar/Clips";
import { Replays } from "~/sidebar/Replays";
import { ReplayStoreContext } from "~/state/replayStore";
import { Controls } from "~/viewer/Controls";
import { Viewer } from "~/viewer/Viewer";

export function MainContent() {
  const [replayState] = useContext(ReplayStoreContext);
  return (
    <div class="box-border flex h-full gap-5 overflow-y-auto p-5">
      <div class="h-full overflow-y-auto">
        <Replays />
      </div>
      <div class="h-full overflow-y-auto">
        <Clips />
      </div>
      <div class="flex h-full flex-grow flex-col justify-between overflow-y-auto">
        <Viewer />
        <Show when={replayState.replayData}>
          <Controls />
        </Show>
      </div>
    </div>
  );
}
