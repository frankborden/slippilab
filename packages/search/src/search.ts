import { Group } from './group';
import type { Spec as GroupSpec } from './group';
import type { GamePredicate } from './game-predicate';
import type { ReplayData, PlayerSettings } from '@slippilab/common';

// type Predicate = (
//   playerIndex: number,
//   frameNumber: number,
//   replay: ReplayData,
// ) => boolean;
// interface QueryPart {
//   predicate: Predicate;
//   minimumLength: number;
// }
// type Query = QueryPart[];
// type Bounds = [number, number];
// type Streak = [number, number, number];

// // Array.prototype.forEach except it will start from index -123 instead of 0.
// function framesLoop<T, U>(framesLike: T[], fn: (t: T, i: number) => U): void {
//   for (let i = -123; i < framesLike.length; i++) {
//     fn(framesLike[i], i);
//   }
// }

// // Array.prototype.map except it will start from index -123 instead of 0.
// function framesMap<T, U>(framesLike: T[], map: (t: T, i: number) => U): U[] {
//   const mapped: U[] = [];
//   framesLoop(framesLike, (f, i) => (mapped[i] = map(f, i)));
//   return mapped;
// }

// // [start, minimumReached, failed]
// function getStreaks(framesLike: boolean[], minimumLength: number): Streak[] {
//   const streaks: Streak[] = [];
//   let startAt: number | undefined;
//   let minimumReachedAt: number | undefined;
//   framesLoop(framesLike, (value, i) => {
//     if (value) {
//       startAt = startAt !== undefined ? startAt : i;
//       if (i - startAt + 1 >= minimumLength) {
//         minimumReachedAt =
//           minimumReachedAt !== undefined ? minimumReachedAt : i;
//       }
//     } else if (startAt !== undefined) {
//       if (minimumReachedAt !== undefined) {
//         streaks.push([startAt, minimumReachedAt, i]);
//       }
//       startAt = undefined;
//       minimumReachedAt = undefined;
//     }
//   });
//   if (minimumReachedAt !== undefined && startAt !== undefined) {
//     streaks.push([startAt, minimumReachedAt, framesLike.length]);
//   }
//   return streaks;
// }

// function combineStreaks(
//   firstStreakSet: Streak[],
//   secondStreakSet: Streak[],
// ): Streak[] {
//   return (
//     firstStreakSet
//       // cross product
//       .flatMap((f) => secondStreakSet.map((s): [Streak, Streak] => [f, s]))
//       // second streak must start during (or immediately after) first streak
//       .filter(
//         ([[_, aMinimum, aFail], [bStart, _1, _2]]) =>
//           bStart > aMinimum && bStart <= aFail,
//       )
//       // combined streak lasts from first streak to end of second streak
//       .map(([[aStart, _1, _2], [_3, bMinimum, bFail]]) => [
//         aStart,
//         bMinimum,
//         bFail,
//       ])
//   );
// }

// export function run(replay: ReplayData, query: Query): Bounds[] {
//   const playerIndex = 0;
//   const predicateResults = query.map((queryPart) =>
//     framesMap(replay.frames, (frame) =>
//       queryPart.predicate(playerIndex, frame.frameNumber, replay),
//     ),
//   );
//   const streaks = predicateResults.map((resultSequence, i) =>
//     getStreaks(resultSequence, query[i].minimumLength),
//   );
//   const matches = streaks.reduce(combineStreaks);
//   return matches.map(([start, _, end]) => [start, end]);
// }

export interface Highlight {
  startFrame: number;
  endFrame: number;
}

export interface Spec {
  gamePredicates?: GamePredicate[];
  permanentGroupSpec?: GroupSpec;
  groupSpecs: GroupSpec[];
}

export class Search {
  private spec: Spec;
  private playerIndex = 0;
  private game?: ReplayData;
  private clipBuilder?: Highlight;
  private groupStack: Group[] = [];
  private permanentGroup?: Group;
  // - replays start at -123,
  // - player control starts at -39 (GO!)
  // - timer starts counting down at 0
  private currentFrameIndex = -39;

  public constructor(spec: Spec) {
    this.spec = spec;
  }

  public searchFile(game: ReplayData): Highlight[] {
    this.game = game;
    return this.game.settings.playerSettings
      .map((player: PlayerSettings) => player.playerIndex)
      .flatMap((playerIndex) => this.searchPlayer(playerIndex))
      .filter(
        (clip, index, clips) =>
          clips.map((c) => c.endFrame).indexOf(clip.endFrame) === index,
      );
  }

  private searchPlayer(playerIndex: number): Highlight[] {
    if (
      this.spec.gamePredicates &&
      this.spec.gamePredicates.some(
        (predicate) => !predicate(this.game!, playerIndex),
      )
    ) {
      return [];
    }

    this.playerIndex = playerIndex;
    this.clipBuilder = undefined;
    this.groupStack = [];
    this.permanentGroup = this.spec.permanentGroupSpec
      ? new Group(this.spec.permanentGroupSpec)
      : undefined;
    this.currentFrameIndex = -39;
    const clips: Highlight[] = [];
    this.pushGroup();
    while (this.groupStack.length > 0) {
      while (this.game!.frames[this.currentFrameIndex]) {
        this.sendFrame();
        clips.push(...this.handleResult());
      }
      // If we reach end of game with a clip, save it.
      if (this.clipBuilder !== undefined) {
        clips.push(this.clipBuilder);
        this.clipBuilder = undefined;
      }
      // reached end of game, go back to previous group
      if (this.groupStack.length > 1) {
        this.popGroup();
      } else {
        return clips;
      }
    }
    return clips;
  }

  private sendFrame(): void {
    const frame =
      this.game!.frames[this.currentFrameIndex].players[this.playerIndex]
        ?.state; // TODO: Nana
    if (frame) {
      const group = this.groupStack[this.groupStack.length - 1];
      group.step(this.game!, frame);
      if (this.permanentGroup) {
        this.permanentGroup.step(this.game!, frame);
      }
    }
    this.currentFrameIndex++;
  }

  private handleResult(): Highlight[] {
    const currentGroup = this.groupStack[this.groupStack.length - 1];
    const currentPermanentGroupResult = this.permanentGroup
      ? this.permanentGroup.result
      : true;
    const currentResult = currentGroup.result && currentPermanentGroupResult;
    if (currentResult) {
      if (this.groupStack.length === this.spec.groupSpecs.length) {
        // clip complete
        this.buildClip();
      } else {
        // start next group
        this.pushGroup();
      }
    } else if (
      currentGroup.segmentStartFrame !== undefined &&
      currentPermanentGroupResult
    ) {
      // wait
    } else if (
      currentGroup.spec.options.allowDelayed &&
      currentPermanentGroupResult
    ) {
      // wait
      if (this.clipBuilder !== undefined) {
        const clip = this.clipBuilder;
        this.clipBuilder = undefined;
        return [clip];
      }
    } else {
      // failed, go back to previous group (or all the way if permanent group
      // failed)
      this.popGroup();
      if (this.clipBuilder !== undefined) {
        const clip = this.clipBuilder;
        this.clipBuilder = undefined;
        return [clip];
      }
    }
    return [];
  }

  private popGroup(): void {
    if (this.groupStack.length === 1) {
      return;
    }
    this.groupStack.pop();
    this.currentFrameIndex =
      this.groupStack[this.groupStack.length - 1].lastSeenFrame! + 1;
  }

  private pushGroup(): void {
    const nextGroupIndex = this.groupStack.length;
    const groupSpec = this.spec.groupSpecs[nextGroupIndex];
    const group = new Group(groupSpec);
    this.groupStack.push(group);
  }

  private buildClip(): void {
    if (this.clipBuilder !== undefined) {
      // don't need to compare, current frame will always be later
      this.clipBuilder.endFrame = this.currentFrameIndex - 1;
    } else {
      this.clipBuilder = {
        startFrame: this.groupStack[0].segmentStartFrame!,
        endFrame: this.currentFrameIndex - 1,
      };
    }
  }
}
