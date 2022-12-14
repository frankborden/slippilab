import { currentSidebar } from "~/state/navigationStore";
import { Switch, Match } from "solid-js";
import { Replays } from "~/components/panels/Replays";
import { Clips } from "~/components/panels/Clips";
import { Inputs } from "~/components/panels/Inputs";
import { cloudLibrary, localLibrary } from "~/state/selectionStore";

export function Sidebar() {
  return (
    <>
      <div class="hidden h-full w-96 overflow-y-auto py-4 lg:block">
        <Switch>
          <Match when={currentSidebar() === "cloud replays"}>
            <Replays selectionStore={cloudLibrary} />
          </Match>
          <Match when={currentSidebar() === "local replays"}>
            <Replays selectionStore={localLibrary} />
          </Match>
          <Match when={currentSidebar() === "clips"}>
            <Clips />
          </Match>
          <Match when={currentSidebar() === "inputs"}>
            <Inputs />
          </Match>
        </Switch>
      </div>
      <div class="flex flex-col gap-8 px-4 sm:flex-row sm:gap-2 lg:hidden">
        <Replays selectionStore={localLibrary} />
        <Clips />
      </div>
    </>
  );
}
