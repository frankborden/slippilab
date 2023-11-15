import { useRouteData } from "@solidjs/router";
import { Show } from "solid-js";

import { LocalViewer } from "~/client/components/app/LocalViewer";
import { WatchData } from "~/client/pages/watch.data";

export default function Watch() {
  const data = useRouteData<typeof WatchData>();
  return <Show when={data()}>{(data) => <LocalViewer replay={data()} />}</Show>;
}