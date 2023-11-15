import { RouteDataFuncArgs } from "@solidjs/router";

import { createReplaysQuery } from "~/client/state/api";

export default function BrowseData({ location }: RouteDataFuncArgs) {
  return createReplaysQuery(() => {
    const uiParams = new URLSearchParams(location.search);
    const reqParams = new URLSearchParams();
    reqParams.set("limit", "2");
    reqParams.set("page", String(Number(uiParams.get("page") ?? "1") - 1));
    if (uiParams.has("types")) {
      reqParams.set("types", uiParams.get("types")!);
    }
    if (uiParams.has("stages")) {
      reqParams.set("stages", uiParams.get("stages")!);
    }
    if (uiParams.has("characters")) {
      reqParams.set("characters", uiParams.get("characters")!);
    }
    if (uiParams.has("connectCodes")) {
      reqParams.set("connectCodes", uiParams.get("connectCodes")!);
    }
    return reqParams;
  });
}
