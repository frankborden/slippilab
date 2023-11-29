import { createResource } from "solid-js";

import { fetchSelf } from "~/client/state/api";

export function LayoutData() {
  const [data] = createResource(() => fetchSelf());
  return data;
}
