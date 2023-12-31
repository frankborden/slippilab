import { RouteLoadFuncArgs, cache } from "@solidjs/router";

import { fetchReplays } from "~/client/state/api";

export const BrowseData = cache(
  ({ location }: RouteLoadFuncArgs) => fetchReplays(location.search),
  "replays",
);
