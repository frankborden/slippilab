import { replayTypeIcons } from "~/client/components/app/icons";
import { cn } from "~/client/components/utils";
import type { ReplayStub, ReplayType } from "~/common/model/types";

const labels: Record<ReplayType, string> = {
  offline: "Offline",
  "old online": "Online",
  unranked: "Unranked",
  direct: "Direct",
  ranked: "Ranked",
};

export function ReplayTypeColumn(props: { replay: ReplayStub }) {
  return (
    <div
      class={cn(
        "flex flex-col items-center",
        "light:text-zinc-600",
        "dark:text-zinc-300",
      )}
    >
      <div class={cn("text-5", replayTypeIcons[props.replay.type])} />
      <div class="text-xs">{labels[props.replay.type]}</div>
    </div>
  );
}
