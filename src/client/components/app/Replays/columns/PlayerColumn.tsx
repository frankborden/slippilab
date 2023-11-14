import { Show } from "solid-js";

import type { PlayerStub } from "~/common/model/types";

export function PlayerColumn(props: { player?: PlayerStub }) {
  return (
    <Show when={props.player}>
      {(player) => <div>{player().connectCode}</div>}
    </Show>
  );
}
