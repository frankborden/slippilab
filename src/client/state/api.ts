import { createQuery } from "@tanstack/solid-query";
import { hc } from "hono/client";
import { Accessor } from "solid-js";

import { type Server } from "~/server";

const client = hc<Server>("");

export function createReplaysQuery() {
  return createQuery(() => ({
    queryKey: ["replays"],
    queryFn: () => client.api.replays.$get().then((res) => res.json()),
  }));
}

export function createReplayQuery(slug: Accessor<string>) {
  return createQuery(() => ({
    queryKey: ["replay", slug()],
    queryFn: () =>
      client.api.replay[":slug"]
        .$get({ param: { slug: slug() } })
        .then((res) => res.json()),
  }));
}

export function createHomeQuery() {
  return createQuery(() => ({
    queryKey: ["home"],
    queryFn: () => client.api.$get().then((res) => res.json()),
  }));
}
