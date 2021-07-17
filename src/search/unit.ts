import type { PostFrameUpdateType, SlippiGame } from '@slippi/slippi-js';
import type { FramePredicate } from './frame-predicate';

export interface Options {
  leniency?: number;
  minimumLength?: number;
}
export interface Spec {
  predicate: FramePredicate;
  options?: Options;
}
interface FullSpec {
  predicate: FramePredicate;
  options: Required<Options>;
}

// Terms:
//   value: The unmodified result of predicate(frame);
//   result: The overall status of the unit (value over time plus factors in
//           UnitOptions)
//   passing: true
export class Unit {
  public spec: FullSpec;
  // The latest overall result from the Unit
  public result = false;
  // The frame that the current inARow streak started
  public segmentStartFrame?: number;
  // The frame that was last stepped by the Unit
  public lastSeenFrame?: number;

  // The number of passing leniency-adjusted values currently seen in a row
  private inARow = 0;
  // If no more passing values are seen, the result will become false after
  // this many frames
  private leniencyRemaining = 0;

  constructor(spec: Spec) {
    this.spec = {
      predicate: spec.predicate,
      options: {
        minimumLength: spec.options?.minimumLength ?? 1,
        leniency: spec.options?.leniency ?? 0,
      },
    };
  }

  step(game: SlippiGame, frame: PostFrameUpdateType): void {
    if (this.spec.predicate(frame, game)) {
      // increment streak, maximize leniency
      this.inARow++;
      this.result = this.inARow >= this.spec.options.minimumLength;
      this.segmentStartFrame = this.segmentStartFrame ?? frame.frame!;
      this.lastSeenFrame = frame.frame!;
      this.leniencyRemaining = this.spec.options.leniency;
    } else if (this.leniencyRemaining > 0) {
      // leniency turns result true, still increases streak
      this.inARow++;
      this.result = this.inARow >= this.spec.options.minimumLength;
      this.segmentStartFrame = this.segmentStartFrame ?? frame.frame!;
      this.lastSeenFrame = frame.frame!;
      this.leniencyRemaining--;
    } else {
      // resets streak
      this.result = false;
      this.segmentStartFrame = undefined;
      this.lastSeenFrame = frame.frame!;
      this.inARow = 0;
      this.leniencyRemaining = 0;
    }
  }
}
