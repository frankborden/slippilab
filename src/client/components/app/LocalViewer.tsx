import { decode } from "@shelacek/ubjson";
import { useNavigate } from "@solidjs/router";
import { Show, createEffect, createResource } from "solid-js";

import { Viewer } from "~/client/components/app/Viewer";
import { Button } from "~/client/components/ui/button";
import { selected } from "~/client/state/personal";
import { parseReplay } from "~/common/parser";

export function LocalViewer() {
  const navigate = useNavigate();
  const [replay] = createResource(
    () => selected(),
    async ([, file]) => {
      const { metadata, raw } = decode(await file.arrayBuffer(), {
        useTypedArrays: true,
      }) as {
        metadata: any;
        raw: Uint8Array;
      };
      return parseReplay(metadata, raw);
    },
  );

  createEffect(() => {
    if (selected() === undefined) {
      navigate("/personal");
    }
  });

  return (
    <Show when={replay()} fallback={<div>Loading...</div>}>
      {(replay) => (
        <>
          <Button
            onClick={() => {
              const form = new FormData();
              form.set("file", selected()![1]);
              fetch("/api/replay", {
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
