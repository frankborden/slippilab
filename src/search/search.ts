import type { ReplayData } from "~/common/types";
import { Predicate } from "~/search/framePredicates";

export interface Highlight {
  playerIndex: number;
  startFrame: number;
  endFrame: number;
}

/** */
export interface QueryPart {
  predicate: Predicate;
  minimumLength?: number;
  delayed?: boolean;
}

/** */
export type Query = QueryPart[];

/** */
export type Bounds = [number, number];

type Streak = [number, number, number];

/** */
export function search(
  replay: ReplayData,
  query: Query,
  always?: Predicate
): Highlight[] {
  return replay.settings.playerSettings.flatMap((playerSettings) => {
    const alwaysSequence =
      always != null
        ? replay.frames.map((frame) =>
            always(playerSettings.playerIndex, frame.frameNumber, replay)
          )
        : undefined;
    const alwaysStreaks =
      alwaysSequence != null ? getStreaks(alwaysSequence, 1) : undefined;
    return (
      query
        // apply all the predicates to every frame
        .map((queryPart) =>
          replay.frames.map((frame) =>
            queryPart.predicate(
              playerSettings.playerIndex,
              frame.frameNumber,
              replay
            )
          )
        )
        // collect the streaks from each query part
        .map((resultSequence, i) =>
          getStreaks(
            resultSequence,
            query[i].minimumLength ?? 1,
            alwaysSequence
          )
        )
        // combine matching streaks across every query part
        .reduce((aStreaks, bStreaks, bIndex) =>
          combineStreaks(
            aStreaks,
            bStreaks,
            query[bIndex].delayed ?? false,
            alwaysStreaks
          )
        )
        // toss the extra metadata
        .map(
          ([start, _, end]): Highlight => ({
            playerIndex: playerSettings.playerIndex,
            startFrame: start,
            endFrame: end,
          })
        )
        // deduplicate by endFrame. Keep the first one because it's the longest.
        .filter(
          (highlight, index, highlights) =>
            index ===
            highlights.findIndex((h) => h.endFrame === highlight.endFrame)
        )
        // deduplicate by firstFrame. Keep the last one because it's the
        // longest.
        .filter(
          (highlight, index, highlights) =>
            index ===
            highlights.length -
              1 -
              [...highlights]
                .reverse()
                .findIndex((h) => h.startFrame === highlight.startFrame)
        )
    );
  });
}

// [start, minimumReached, failed]
function getStreaks(
  predicateSequence: boolean[],
  minimumLength: number,
  alwaysSequence?: boolean[]
): Streak[] {
  const streaks: Streak[] = [];
  let startAt: number | undefined;
  let minimumReachedAt: number | undefined;
  for (let i = 0; i < predicateSequence.length; i++) {
    if (
      predicateSequence[i] &&
      (alwaysSequence === undefined || alwaysSequence[i])
    ) {
      startAt = startAt ?? i;
      if (i - startAt + 1 >= minimumLength) {
        minimumReachedAt = minimumReachedAt ?? i;
      }
    } else if (startAt !== undefined) {
      if (minimumReachedAt !== undefined) {
        streaks.push([startAt, minimumReachedAt, i]);
      }
      startAt = undefined;
      minimumReachedAt = undefined;
    }
  }
  // check for final streak that wasn't terminated
  if (minimumReachedAt !== undefined && startAt !== undefined) {
    streaks.push([startAt, minimumReachedAt, predicateSequence.length]);
  }
  return streaks;
}

function combineStreaks(
  aStreaks: Streak[],
  bStreaks: Streak[],
  delayed: boolean,
  alwaysStreaks?: Streak[]
): Streak[] {
  return (
    aStreaks
      // cross product
      .flatMap((f) => bStreaks.map((s): [Streak, Streak] => [f, s]))
      // second streak must start during (or immediately after) first streak
      // unless delayed is true and always streak covers the difference or is
      // absent.
      .filter(
        ([[_1, aMinimum, aFail], [bStart, bMinimum, bFail]]) =>
          (bStart > aMinimum || aMinimum < bFail - (bMinimum - bStart)) &&
          (bStart <= aFail ||
            (delayed &&
              (alwaysStreaks === undefined ||
                alwaysStreaks.some(
                  ([alwaysStart, _, alwaysFail]) =>
                    alwaysStart <= aFail && alwaysFail > bStart
                ))))
      )
      // combined streak lasts from first streak to end of second streak
      .map(([[aStart, _1, _2], [_3, bMinimum, bFail]]) => [
        aStart,
        bMinimum,
        bFail,
      ])
  );
}
