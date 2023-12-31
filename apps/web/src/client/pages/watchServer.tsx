import { RouteSectionProps, createAsync, useParams } from "@solidjs/router";
import { Show, Suspense, onMount } from "solid-js";

import { Viewer } from "~/client/components/app/Viewer";
import { WatchServerData } from "~/client/pages/watchServer.data";
import { setLastWatched } from "~/client/state/watch";

export default function Watch(props: RouteSectionProps) {
  const data = createAsync(() =>
    WatchServerData({ ...props, intent: "initial" }),
  );
  const params = useParams();
  onMount(() => setLastWatched(params.slug));
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Viewer replay={data()!.replay} />
    </Suspense>
  );
}
