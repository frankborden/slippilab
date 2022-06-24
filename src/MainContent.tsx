import { ClipsTab } from "~/sidebar/ClipsTab";
import { NowPlaying } from "~/sidebar/NowPlaying";
import { ReplaysTab } from "~/sidebar/ReplaysTab";
import { Viewer } from "~/viewer/Viewer";

export function MainContent() {
  return (
    <div class="flex overflow-y-auto">
      <div class="row-span-2 h-full overflow-y-auto box-border p-5">
        <ReplaysTab />
      </div>
      <div class="flex flex-col flex-grow h-full">
        <Viewer />
        <NowPlaying />
      </div>
      <div class="row-span-2 h-full overflow-y-auto box-border p-5">
        <ClipsTab />
      </div>
    </div>
  );
}
