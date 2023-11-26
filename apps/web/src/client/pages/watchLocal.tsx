import { useRouteData } from "@solidjs/router";
import { Show, onMount } from "solid-js";

import { Viewer } from "~/client/components/app/Viewer";
import { Button } from "~/client/components/ui/button";
import { WatchLocalData } from "~/client/pages/watchLocal.data";
import { selected } from "~/client/state/personal";
import { setLastWatched } from "~/client/state/watch";

export default function Watch() {
  const data = useRouteData<typeof WatchLocalData>();
  onMount(() => setLastWatched("local"));
  return (
    <Show when={data()}>
      {(data) => (
        <>
          <Button
            onClick={() => {
              const form = new FormData();
              form.set("file", selected()![1]);
              fetch("/api/upload", {
                method: "POST",
                body: form,
              });
            }}
          >
            Upload
          </Button>
          <Viewer replay={data()} />
        </>
      )}
    </Show>
  );
}
