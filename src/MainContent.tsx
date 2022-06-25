import { ClipsTab } from "~/sidebar/ClipsTab";
import { NowPlaying } from "~/sidebar/NowPlaying";
import { ReplaysTab } from "~/sidebar/ReplaysTab";
import { Viewer } from "~/viewer/Viewer";

export function MainContent() {
  return (
    <div class="flex overflow-y-auto">
      <div class="row-span-2 box-border h-full overflow-y-auto p-5 pr-0">
        <ReplaysTab />
      </div>
      <div class="flex h-full flex-grow flex-col p-5">
        <Viewer />
        <NowPlaying />
      </div>
      <div class="row-span-2 box-border h-full overflow-y-auto p-5 pl-0">
        <ClipsTab />
      </div>
    </div>
  );
}
