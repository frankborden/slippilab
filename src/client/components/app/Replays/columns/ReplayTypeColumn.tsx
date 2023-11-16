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
    <div class={cn("flex flex-col items-center", "text-foreground/80")}>
      <div class={cn("text-xl", replayTypeIcons[props.replay.type])} />
      <div class="text-xs">{labels[props.replay.type]}</div>
    </div>
  );
}
