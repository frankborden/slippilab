import { useNavigate } from "@solidjs/router";

import { Replays } from "~/client/components/app/Replays";
import type { ReplayStub } from "~/common/model/types";

export function ServerReplays(props: { replays: [ReplayStub, string][] }) {
  const navigate = useNavigate();
  return (
    <Replays
      replays={props.replays.map(([replay]) => replay)}
      onSelect={(replay) =>
        navigate(`/watch/${props.replays.find(([r]) => r === replay)![1]}`)
      }
    />
  );
}
