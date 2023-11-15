import { decode } from "@shelacek/ubjson";
import { RouteDataFuncArgs } from "@solidjs/router";
import { createResource } from "solid-js";

import { selected } from "~/client/state/personal";
import { parseReplay } from "~/common/parser";

export function WatchData({ params, navigate }: RouteDataFuncArgs) {
  const [data] = createResource(
    () => params.id,
    async (id) => {
      if (id === "local") {
        const file = selected()?.[1];
        if (!file) {
          navigate("/personal");
          return undefined;
        }
        const { metadata, raw } = decode(await file.arrayBuffer(), {
          useTypedArrays: true,
        });
        return parseReplay(metadata, raw);
      }
    },
  );
  return data;
}
