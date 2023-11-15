import { useRouteData } from "@solidjs/router";
import { Show } from "solid-js";

import { ServerReplays } from "~/client/components/app/ServerReplays";
import BrowseData from "~/client/pages/browse.data";

export default function Browse() {
  const query = useRouteData<typeof BrowseData>();
  return (
    <div class="w-full">
      <h1 class="text-lg font-medium text-foreground/80">
        Browse Public Replays
      </h1>
      <Show when={query.data}>
        {(replays) => <ServerReplays replays={replays()} />}
      </Show>
    </div>
  );
}
