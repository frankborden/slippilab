import { useNavigate } from "@solidjs/router";

import { Replays } from "~/client/components/app/Replays";
import type { ReplayStub } from "~/common/model/types";

export function ServerReplays(props: { replays: [string, ReplayStub][] }) {
  const navigate = useNavigate();
  return (
    <Replays
      replays={props.replays.map(([, replay]) => replay)}
      connectCodes={props.replays
        .flatMap(([, replay]) => replay.players.map((p) => p.connectCode))
        .filter((c): c is string => !!c)}
      onSelect={(replay) =>
        navigate(`/watch/${props.replays.find(([, r]) => r === replay)![0]}`)
      }
    />
  );
}
