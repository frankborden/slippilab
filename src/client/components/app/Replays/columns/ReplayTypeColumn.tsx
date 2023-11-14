import { replayType } from "~/client/components/utils";
import type { ReplayStub } from "~/common/model/types";

export function ReplayTypeColumn(props: { replay: ReplayStub }) {
  return <div>{replayType(props.replay)}</div>;
}
