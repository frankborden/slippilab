import type { Game, PostFrameUpdateEvent } from '../parser/slp';
import { Unit } from './unit';
import type { Spec as UnitSpec } from './unit';

export interface Options {
  allowDelayed?: boolean;
  requiredUnits?: 'all' | 'any';
}
export interface Spec {
  unitSpecs: UnitSpec[];
  options?: Options;
}
interface FullSpec {
  unitSpecs: UnitSpec[];
  options: Required<Options>;
}

export class Group {
  public spec: FullSpec;
  // The latest overall result of the Group
  public result = false;
  // The first frame that any Unit segment started progressing
  public segmentStartFrame?: number;
  // The frame that was last stepped by this Group
  public lastSeenFrame?: number;

  // The Group is composed of these Units
  private units: Set<Unit> = new Set();

  constructor(spec: Spec) {
    this.spec = {
      unitSpecs: spec.unitSpecs,
      options: {
        allowDelayed: spec.options?.allowDelayed ?? false,
        requiredUnits: spec.options?.requiredUnits ?? 'all',
      },
    };
    spec.unitSpecs
      .map((unitSpec) => new Unit(unitSpec))
      .forEach((unit) => this.units.add(unit));
  }

  step(game: Game, frame: PostFrameUpdateEvent): void {
    this.units.forEach((unit) => unit.step(game, frame));
    this.result =
      this.spec.options.requiredUnits === 'all'
        ? Array.from(this.units.values()).every((unit) => unit.result)
        : Array.from(this.units.values()).some((unit) => unit.result);
    const unitSegmentStartFrames = Array.from(this.units.values())
      .map((unit) => unit.segmentStartFrame)
      .filter(
        (segmentStartFrame): segmentStartFrame is number =>
          segmentStartFrame !== undefined,
      );
    // Can't use .reduce(fn, undefined) to cover the empty case because the
    // single-element case would be broken: Math.min(-39, undefined) === NaN
    if (unitSegmentStartFrames.length === 0) {
      this.segmentStartFrame = undefined;
    } else {
      this.segmentStartFrame = unitSegmentStartFrames.reduce((a, b) =>
        Math.min(a, b),
      );
    }
    this.lastSeenFrame = frame.frameNumber!;
  }
}
