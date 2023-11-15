import { useRouteData } from "@solidjs/router";
import { Show } from "solid-js";

import { LocalViewer } from "~/client/components/app/LocalViewer";
import { WatchLocalData } from "~/client/pages/watchLocal.data";

export default function Watch() {
  const data = useRouteData<typeof WatchLocalData>();
  return <Show when={data()}>{(data) => <LocalViewer replay={data()} />}</Show>;
}
