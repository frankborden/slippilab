import { type Server } from "@slippilab/server";
import { createQuery } from "@tanstack/solid-query";
import { hc } from "hono/client";
import { Accessor } from "solid-js";

const client = hc<Server>("");

export function fetchSelf() {
  return client.api.self.$get().then((res) => res.json());
}

export function fetchReplays(search: string) {
  const uiParams = new URLSearchParams(search);
  const reqParams = new URLSearchParams();
  reqParams.set("limit", "10");
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
  return client.api.replays
    .$get({
      query: Object.fromEntries(reqParams.entries()),
    })
    .then((res) => res.json());
}

export function createConnectCodesQuery() {
  return createQuery(() => ({
    queryKey: ["connectCodes"],
    queryFn: () => client.api.connectCodes.$get().then((res) => res.json()),
  }));
}

export function fetchReplay(slug: string) {
  return client.api.replay[":slug"]
    .$get({ param: { slug } })
    .then((res) => res.json());
}
