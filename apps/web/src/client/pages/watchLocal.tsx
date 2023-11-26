import { useRouteData } from "@solidjs/router";
import { Show, onMount } from "solid-js";

import { LocalViewer } from "~/client/components/app/LocalViewer";
import { WatchLocalData } from "~/client/pages/watchLocal.data";
import { setLastWatched } from "~/client/state/watch";

export default function Watch() {
  const data = useRouteData<typeof WatchLocalData>();
  onMount(() => setLastWatched("local"));
  return <Show when={data()}>{(data) => <LocalViewer replay={data()} />}</Show>;
}
