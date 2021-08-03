import { Group, Spec as GroupSpec } from './group';
import type { PlayerType, SlippiGame } from '@slippi/slippi-js';
import type { GamePredicate } from './game-predicate';
import type { Highlight } from '../common';

export interface ClipBuilder {
  path: string;
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
  private game?: SlippiGame;
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

  public searchFile(game: SlippiGame): Highlight[] {
    this.game = game;
    return this.game!.getSettings()!
      .players.map((player: PlayerType) => player.port - 1)
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
      while (this.game!.getFrames()[this.currentFrameIndex]) {
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
      this.game!.getFrames()[this.currentFrameIndex].players[this.playerIndex]
        ?.post;
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
      //this.saveClip();
      if (this.clipBuilder !== undefined) {
        const clip = this.clipBuilder;
        this.clipBuilder = undefined;
        return [clip];
      }
    } else {
      // failed, go back to previous group (or all the way if permanent group
      // failed)
      //this.saveClip();
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
