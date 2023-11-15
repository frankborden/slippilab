import { createQuery } from "@tanstack/solid-query";
import { hc } from "hono/client";
import { Accessor } from "solid-js";

import { type Server } from "~/server";

const client = hc<Server>("");

export function createRankQuery(code: Accessor<string>) {
  return createQuery(() => ({
    queryKey: ["rank", code()],
    queryFn: () =>
      client.api.rank[":code"]
        .$get({ param: { code: encodeURIComponent(code()) } })
        .then((res) => res.json()),
  }));
}

export function createReplaysQuery() {
  return createQuery(() => ({
    queryKey: ["replays"],
    queryFn: () => client.api.replays.$get().then((res) => res.json()),
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
