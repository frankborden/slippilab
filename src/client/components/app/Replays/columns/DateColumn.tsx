import type { ReplayStub } from "~/common/model/types";

export function DateColumn(props: { replay: ReplayStub }) {
  return <div>{props.replay.startTimestamp}</div>;
}
