import { decode } from "@shelacek/ubjson";
import { parseReplay } from "@slippilab/parser";
import { createAsync, useNavigate } from "@solidjs/router";
import { Show, onMount } from "solid-js";

import { Viewer } from "~/client/components/app/Viewer";
import { Button } from "~/client/components/ui/button";
import { selected } from "~/client/state/personal";
import { setLastWatched } from "~/client/state/watch";

export default function Watch() {
  const navigate = useNavigate();
  const replay = createAsync(async () => {
    if (!selected()) return;
    const [, file] = selected()!;
    const { metadata, raw } = decode(await file.arrayBuffer(), {
      useTypedArrays: true,
    });
    return parseReplay(metadata, raw);
  });
  onMount(() => {
    if (selected() === undefined) {
      navigate("/personal");
    } else {
      setLastWatched("local");
    }
  });
  return (
    <Show when={replay()}>
      {(replay) => (
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
          <Viewer replay={replay()} />
        </>
      )}
    </Show>
  );
}
