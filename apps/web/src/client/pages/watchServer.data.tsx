import { RouteLoadFuncArgs, cache } from "@solidjs/router";

import { fetchReplay } from "~/client/state/api";

export const WatchServerData = cache(
  ({ params }: RouteLoadFuncArgs) => fetchReplay(params.slug),
  "replay",
);
