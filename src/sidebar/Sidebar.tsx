import { currentSidebar } from "~/state/navigationStore";
import { Motion, Presence } from "@motionone/solid";
import { Switch, Match } from "solid-js";
import { Replays } from "~/sidebar/Replays";
import { Clips } from "~/sidebar/Clips";
import { Inputs } from "~/sidebar/Inputs";

export function Sidebar() {
  return (
    <div class="h-full w-96 overflow-y-auto py-4">
      <Presence exitBeforeEnter>
        <Switch>
          <Match when={currentSidebar() === "replays"}>
            <Motion
              class="h-full"
              animate={{ opacity: 1 }}
              initial={{ opacity: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <Replays />
            </Motion>
          </Match>
          <Match when={currentSidebar() === "clips"}>
            <Motion
              class="h-full"
              animate={{ opacity: 1 }}
              initial={{ opacity: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <Clips />
            </Motion>
          </Match>
          <Match when={currentSidebar() === "inputs"}>
            <Motion
              class="h-full overflow-y-auto"
              animate={{ opacity: 1 }}
              initial={{ opacity: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <Inputs />
            </Motion>
          </Match>
        </Switch>
      </Presence>
    </div>
  );
}
