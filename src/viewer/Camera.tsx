import { filter, map, pipe, prop } from "rambda";
import { createEffect, createMemo, createSignal, ParentProps } from "solid-js";
import { PlayerUpdate } from "~/common/types";
import { replayStore } from "~/state/replayStore";

export function Camera(props: ParentProps) {
  const [center, setCenter] = createSignal<[number, number] | undefined>();
  const [scale, setScale] = createSignal<number | undefined>();

  createEffect(() => {
    const followSpeeds = [0.04, 0.04];
    const padding = [25, 25];
    const minimums = [100, 100];

    const currentFrame = replayStore.replayData!.frames[replayStore.frame];
    const focuses = pipe(
      filter((player: PlayerUpdate) => Boolean(player)),
      map((player: PlayerUpdate) => ({
        x: player.state.xPosition,
        y: player.state.yPosition,
      }))
    )(currentFrame.players);
    const xs = map(prop("x"), focuses);
    const ys = map(prop("y"), focuses);
    const xMin = Math.min(...xs) - padding[0];
    const xMax = Math.max(...xs) + padding[0];
    const yMin = Math.min(...ys) - padding[1];
    const yMax = Math.max(...ys) + padding[1];
    const newCenterX = (xMin + xMax) / 2;
    const newCenterY = (yMin + yMax) / 2;
    const xRange = Math.max(xMax - xMin, minimums[0]);
    const yRange = Math.max(yMax - yMin, minimums[1]);
    // scale both axes based on the most zoomed out one.
    const scaling = Math.min(640 / xRange, 480 / yRange);

    setCenter((oldCenter) => [
      smooth(oldCenter?.[0] ?? newCenterX, newCenterX, followSpeeds[0]),
      smooth(oldCenter?.[1] ?? newCenterY, newCenterY, followSpeeds[1]),
    ]);
    setScale(
      (oldScaling) =>
        replayStore.zoom *
        smooth(oldScaling ?? 5, scaling, Math.max(...followSpeeds))
    );
  });
  const transforms = createMemo(() =>
    [
      `scale(${scale() ?? 1})`,
      `translate(${(center()?.[0] ?? 0) * -1}, ${(center()?.[1] ?? 0) * -1})`,
    ].join(" ")
  );

  return <g transform={transforms()}>{props.children}</g>;
}

function smooth(from: number, to: number, byPercent: number): number {
  return from + (to - from) * byPercent;
}
