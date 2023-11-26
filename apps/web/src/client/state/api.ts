import { createQuery } from "@tanstack/solid-query";
import { hc } from "hono/client";
import { Accessor } from "solid-js";

import { type Server } from "~/server";

const client = hc<Server>("");

export function createReplaysQuery(query: Accessor<URLSearchParams>) {
  return createQuery(() => ({
    queryKey: ["replays", query().toString()],
    queryFn: () =>
      client.api.replays
        .$get({
          query: Object.fromEntries(query().entries()),
        })
        .then((res) => res.json()),
  }));
}

export function createConnectCodesQuery() {
  return createQuery(() => ({
    queryKey: ["connectCodes"],
    queryFn: () => client.api.connectCodes.$get().then((res) => res.json()),
  }));
}

export function createReplayQuery(slug: Accessor<string>) {
  return createQuery(() => ({
    queryKey: ["replay", slug()],
    staleTime: Infinity,
    queryFn: () =>
      client.api.replay[":slug"]
        .$get({ param: { slug: slug() } })
        .then((res) => res.json()),
  }));
}
