import { createQuery } from "@tanstack/solid-query";
import { hc } from "hono/client";

import { type Server } from "~/server";

const client = hc<Server>("");

export function createHomeQuery() {
  return createQuery(() => ({
    queryKey: ["home"],
    queryFn: () => client.api.$get().then((res) => res.json()),
  }));
}
