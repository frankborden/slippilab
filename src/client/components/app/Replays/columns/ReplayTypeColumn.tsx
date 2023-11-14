import type { ReplayStub } from "~/common/model/types";

export function ReplayTypeColumn(props: { replay: ReplayStub }) {
  return <div>{props.replay.type}</div>;
}
