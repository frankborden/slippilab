import { createSignal, Match, Switch } from "solid-js";
import { ClipsTab } from "./ClipsTab";
import { ReplaysTab } from "./ReplaysTab";
import { SettingsTab } from "./SettingsTab";

export function Sidebar() {
  const [currentTab, setTab] = createSignal<number>(0);
  return (
    <>
      <nav class="mb-3 flex border-b-2 border-slate-200">
        <a
          class={`flex-grow cursor-pointer rounded-md py-2 px-10 text-center decoration-blue-600 underline-offset-8 hover:bg-blue-100 ${
            currentTab() === 0 ? "text-blue-600 underline" : ""
          }`}
          onClick={() => setTab(0)}
        >
          Replays
        </a>
        <a
          class={`flex-grow cursor-pointer rounded-md py-2  px-10 text-center decoration-blue-600 underline-offset-8 hover:bg-blue-100 ${
            currentTab() === 1 ? "text-blue-600 underline" : ""
          }`}
          onClick={() => setTab(1)}
        >
          Clips
        </a>
        <a
          class={`flex-grow cursor-pointer rounded-md py-2 px-10 text-center decoration-blue-600 underline-offset-8 hover:bg-blue-100 ${
            currentTab() === 2 ? "text-blue-600 underline" : ""
          }`}
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
    </>
  );
}
