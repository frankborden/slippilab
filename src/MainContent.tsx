import { Show, useContext } from "solid-js";
import { ClipsTab } from "~/sidebar/ClipsTab";
import { NowPlaying } from "~/sidebar/NowPlaying";
import { ReplaysTab } from "~/sidebar/ReplaysTab";
import { ReplayStoreContext } from "~/state/replayStore";
import { Controls } from "~/viewer/Controls";
import { Viewer } from "~/viewer/Viewer";

export function MainContent() {
  const [replayState] = useContext(ReplayStoreContext);
  return (
    <div class="flex overflow-y-auto">
      <div class="box-border flex h-full flex-col divide-y overflow-y-auto p-5 pr-0">
        <ReplaysTab />
        <NowPlaying />
      </div>
      <div class="flex h-full flex-grow flex-col p-5">
        <Viewer />
        <Show when={replayState.replayData}>
          <Controls />
        </Show>
      </div>
      <div class="row-span-2 box-border h-full overflow-y-auto p-5 pl-0">
        <ClipsTab />
      </div>
    </div>
  );
}
