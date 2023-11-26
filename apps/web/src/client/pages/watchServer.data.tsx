import { RouteDataFuncArgs } from "@solidjs/router";

import { createReplayQuery } from "~/client/state/api";

export function WatchServerData({ params }: RouteDataFuncArgs) {
  return createReplayQuery(() => params.slug);
}
