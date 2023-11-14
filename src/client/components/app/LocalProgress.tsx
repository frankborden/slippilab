import { Show } from "solid-js";

import { progress } from "~/client/state/personal";

export function LocalProgress() {
  return (
    <Show when={progress() > 0 && progress() < 100}>
      <div class="-mb-1 h-1">
        <div
          class="h-full w-full bg-indigo-400 dark:bg-indigo-500"
          style={`transform: translateX(${-100 + progress()}%)`}
        />
      </div>
    </Show>
  );
}
