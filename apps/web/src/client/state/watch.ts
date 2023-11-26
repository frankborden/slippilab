import { createRAF, targetFPS } from "@solid-primitives/raf";
import { createEffect, createMemo, createSignal, on } from "solid-js";

export const [lastWatched, setLastWatched] = createSignal<string | undefined>(
  undefined,
);

export const [frame, setFrame] = createSignal(0);
export const [speed, setSpeed] = createSignal<"0.5x" | "1x" | "2x">("1x");
export const ticksPerSecond = createMemo(() => (speed() === "0.5x" ? 30 : 60));
export const framesPerTick = createMemo(() => (speed() === "2x" ? 2 : 1));
export const [running, start, stop] = createRAF(
  targetFPS(() => setFrame((f) => f + framesPerTick()), ticksPerSecond),
);

createEffect(
  on(
    () => lastWatched(),
    () => {
      setFrame(0);
      start();
    },
  ),
);
