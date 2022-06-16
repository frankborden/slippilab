import { createSignal, Match, Switch } from "solid-js";
import { ClipsTab } from "./ClipsTab";
import { ReplaysTab } from "./ReplaysTab";
import { SettingsTab } from "./SettingsTab";

export function Sidebar() {
  const [currentTab, setTab] = createSignal<number>(0);
  return (
    <>
      <div class="flex h-full flex-col overflow-y-auto">
        <nav class="mb-3 flex border-b-2 border-slate-200">
          <a
            class="flex-grow cursor-pointer rounded-md py-2 px-10 text-center decoration-blue-600 underline-offset-8 hover:bg-blue-100"
            classList={{ "text-blue-600 underline": currentTab() === 0 }}
            onClick={() => setTab(0)}
          >
            Replays
          </a>
          <a
            class="flex-grow cursor-pointer rounded-md py-2  px-10 text-center decoration-blue-600 underline-offset-8 hover:bg-blue-100"
            classList={{ "text-blue-600 underline": currentTab() === 1 }}
            onClick={() => setTab(1)}
          >
            Clips
          </a>
          <a
            class="flex-grow cursor-pointer rounded-md py-2 px-10 text-center decoration-blue-600 underline-offset-8 hover:bg-blue-100"
            classList={{ "text-blue-600 underline": currentTab() === 2 }}
            onClick={() => setTab(2)}
          >
            Settings
          </a>
        </nav>
        <Switch>
          <Match when={currentTab() === 0}>
            <ReplaysTab />
          </Match>
          <Match when={currentTab() === 1}>
            <ClipsTab />
          </Match>
          <Match when={currentTab() === 2}>
            <SettingsTab />
          </Match>
        </Switch>
      </div>
    </>
  );
}
