import { createSignal } from "solid-js";

export const [lastWatched, setLastWatched] = createSignal<string | undefined>(
  undefined,
);
