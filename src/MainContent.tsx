import { Show } from "solid-js";
import { ClipsTab } from "~/sidebar/ClipsTab";
import { NowPlaying } from "~/sidebar/NowPlaying";
import { ReplaysTab } from "~/sidebar/ReplaysTab";
import { replayStore } from "~/state/replayStore";
import { Controls } from "~/viewer/Controls";
import { Viewer } from "~/viewer/Viewer";

export function MainContent() {
  return (
    <div class="flex overflow-y-auto">
      <div class="box-border h-full overflow-y-auto p-5 pr-0 flex flex-col divide-y">
        <ReplaysTab />
        <NowPlaying />
      </div>
      <div class="flex h-full flex-grow flex-col p-5">
        <Viewer />
        <Show when={replayStore.replayData}>
          <Controls />
        </Show>
      </div>
      <div class="row-span-2 box-border h-full overflow-y-auto p-5 pl-0">
        <ClipsTab />
      </div>
    </div>
  );
}
