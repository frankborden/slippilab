import { useRouteData } from "@solidjs/router";
import { Show } from "solid-js";

import { Viewer } from "~/client/components/app/Viewer";
import { WatchServerData } from "~/client/pages/watchServer.data";

export default function Watch() {
  const query = useRouteData<typeof WatchServerData>();
  return (
    <Show when={query.data}>{(data) => <Viewer replay={data().replay} />}</Show>
  );
}
