import { Show, useContext } from "solid-js";
import { Clips } from "~/sidebar/Clips";
import { Replays } from "~/sidebar/Replays";
import { ReplayStoreContext } from "~/state/replayStore";
import { Controls } from "~/viewer/Controls";
import { Viewer } from "~/viewer/Viewer";

export function MainContent() {
  const [replayState] = useContext(ReplayStoreContext);
  return (
    <div class="box-border flex w-full flex-col-reverse gap-5 p-5 lg:h-full lg:flex-row lg:overflow-y-auto">
      <div class="w-full lg:h-full lg:w-auto lg:overflow-y-auto">
        <Replays />
      </div>
      <div class="w-full lg:h-full lg:w-auto lg:overflow-y-auto">
        <Clips />
      </div>
      <div class="flex w-full flex-grow flex-col justify-between overflow-y-auto lg:h-full lg:w-auto">
        <Viewer />
        <Show when={replayState.replayData}>
          <Controls />
        </Show>
      </div>
    </div>
  );
}
