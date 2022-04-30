import { Show } from "solid-js";
import { ReplaySelect } from "./ReplaySelect";
import { ReplayView } from "./ReplayView";
import { state } from "./state";
import { fetchAnimations } from "./animationCache";
import { HopeProvider, Button } from "@hope-ui/solid";

export function App() {
  // Get started fetching the most popular characters
  fetchAnimations(20); // Falco
  fetchAnimations(2); // Fox
  fetchAnimations(0); // Falcon
  fetchAnimations(9); // Marth

  return (
    <>
      <HopeProvider>
        {/* TODO: ReplayPicker, Clip stuff, Settings */}
        <ReplaySelect />
        <Show when={state.replayData()}>
          <ReplayView />
        </Show>
      </HopeProvider>
    </>
  );
}
