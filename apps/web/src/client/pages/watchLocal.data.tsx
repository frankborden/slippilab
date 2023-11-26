import { decode } from "@shelacek/ubjson";
import { parseReplay } from "@slippilab/parser";
import { createResource } from "solid-js";

import { selected } from "~/client/state/personal";

export function WatchLocalData() {
  const [data] = createResource(
    () => selected(),
    async ([, file]) => {
      const { metadata, raw } = decode(await file.arrayBuffer(), {
        useTypedArrays: true,
      });
      return parseReplay(metadata, raw);
    },
  );
  return data;
}
