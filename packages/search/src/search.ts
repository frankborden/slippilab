import type { ReplayData } from '@slippilab/common';

/** */
export type Predicate = (
  playerIndex: number,
  frameNumber: number,
  replay: ReplayData,
) => boolean;

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

// Array.prototype.forEach except it will start from index -123 instead of 0.
function framesLoop<T, U>(framesLike: T[], fn: (t: T, i: number) => U): void {
  for (let i = -123; i < framesLike.length; i++) {
    fn(framesLike[i], i);
  }
}

// Array.prototype.map except it will start from index -123 instead of 0.
function framesMap<T, U>(framesLike: T[], map: (t: T, i: number) => U): U[] {
  const mapped: U[] = [];
  framesLoop(framesLike, (f, i) => (mapped[i] = map(f, i)));
  return mapped;
}

// [start, minimumReached, failed]
function getStreaks(
  framesLike: boolean[],
  minimumLength: number,
  alwaysSequence?: boolean[],
): Streak[] {
  const streaks: Streak[] = [];
  let startAt: number | undefined;
  let minimumReachedAt: number | undefined;
  framesLoop(framesLike, (value, i) => {
    if (value && (alwaysSequence === undefined || alwaysSequence[i])) {
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
  });
  if (minimumReachedAt !== undefined && startAt !== undefined) {
    streaks.push([startAt, minimumReachedAt, framesLike.length]);
  }
  return streaks;
}

function combineStreaks(
  firstStreakSet: Streak[],
  secondStreakSet: Streak[],
  delayed: boolean,
  alwaysStreakSet?: Streak[],
): Streak[] {
  return (
    firstStreakSet
      // cross product
      .flatMap((f) => secondStreakSet.map((s): [Streak, Streak] => [f, s]))
      // second streak must start during (or immediately after) first streak
      // unless delayed is true and always streak covers the difference or is
      // absent.
      .filter(
        ([[_, aMinimum, aFail], [bStart, _1, _2]]) =>
          bStart > aMinimum &&
          (bStart <= aFail ||
            (delayed &&
              (alwaysStreakSet === undefined ||
                alwaysStreakSet.some(
                  ([alwaysStart, _, alwaysFail]) =>
                    alwaysStart <= aFail && alwaysFail > bStart,
                )))),
      )
      // combined streak lasts from first streak to end of second streak
      .map(([[aStart, _1, _2], [_3, bMinimum, bFail]]) => [
        aStart,
        bMinimum,
        bFail,
      ])
  );
}

/** */
export function run(
  replay: ReplayData,
  query: Query,
  always?: Predicate,
): Bounds[] {
  return replay.settings.playerSettings.flatMap((playerSettings) => {
    const alwaysSequence = always
      ? framesMap(replay.frames, (frame) =>
          always(playerSettings.playerIndex, frame.frameNumber, replay),
        )
      : undefined;
    const alwaysStreakSet = alwaysSequence
      ? getStreaks(alwaysSequence, 1)
      : undefined;
    return (
      query
        // apply all the predicates to every frame
        .map((queryPart) =>
          framesMap(replay.frames, (frame) =>
            queryPart.predicate(
              playerSettings.playerIndex,
              frame.frameNumber,
              replay,
            ),
          ),
        )
        // collect the streaks from each query part
        .map((resultSequence, i) =>
          getStreaks(
            resultSequence,
            query[i].minimumLength ?? 1,
            alwaysSequence,
          ),
        )
        // combine matching streaks across every query part
        .reduce((firstStreakSet, secondStreakSet, secondQueryPartIndex) =>
          combineStreaks(
            firstStreakSet,
            secondStreakSet,
            query[secondQueryPartIndex].delayed ?? false,
            alwaysStreakSet,
          ),
        )
        // toss the extra metadata
        .map(([start, _, end]): Bounds => [start, end])
    );
  });
}

export interface Highlight {
  startFrame: number;
  endFrame: number;
}
