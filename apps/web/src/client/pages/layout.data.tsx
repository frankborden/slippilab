import { cache } from "@solidjs/router";

import { fetchSelf } from "~/client/state/api";

export const LayoutData = cache(() => fetchSelf(), "self");
