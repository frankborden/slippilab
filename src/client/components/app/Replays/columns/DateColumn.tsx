import { Show, createMemo } from "solid-js";

import { cn } from "~/client/components/utils";
import type { ReplayStub } from "~/common/model/types";

export function DateColumn(props: { replay: ReplayStub }) {
  const date = createMemo(() =>
    props.replay.startTimestamp
      ? new Date(props.replay.startTimestamp)
      : undefined,
  );

  return (
    <div class="flex flex-col items-center text-sm">
      <Show when={date()} fallback="Unknown">
        {(date) => (
          <>
            <div>
              {date().toLocaleDateString(undefined, {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </div>
            <div class={cn("light:text-zinc-500", "dark:text-zinc-400")}>
              {date().toLocaleTimeString(undefined, {
                hour: "numeric",
                hour12: true,
                minute: "numeric",
              })}
            </div>
          </>
        )}
      </Show>
    </div>
  );
}
