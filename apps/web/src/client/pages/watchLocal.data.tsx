import { decode } from "@shelacek/ubjson";
import { parseReplay } from "@slippilab/parser";
import { RouteDataFuncArgs } from "@solidjs/router";
import { createResource } from "solid-js";

import { selected } from "~/client/state/personal";

export function WatchLocalData({ navigate }: RouteDataFuncArgs) {
  const [data] = createResource(
    () => selected(),
    async ([, file]) => {
      if (!file) {
        navigate("/personal");
        return undefined;
      }
      const { metadata, raw } = decode(await file.arrayBuffer(), {
        useTypedArrays: true,
      });
      return parseReplay(metadata, raw);
    },
  );
  return data;
}
