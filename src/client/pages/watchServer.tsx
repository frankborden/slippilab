import { useParams, useRouteData } from "@solidjs/router";
import { Show, onMount } from "solid-js";

import { Viewer } from "~/client/components/app/Viewer";
import { WatchServerData } from "~/client/pages/watchServer.data";
import { setLastWatched } from "~/client/state/watch";

export default function Watch() {
  const query = useRouteData<typeof WatchServerData>();
  const params = useParams();
  onMount(() => setLastWatched(params.slug));
  return (
    <Show when={query.data}>{(data) => <Viewer replay={data().replay} />}</Show>
  );
}
