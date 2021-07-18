import { Group, Spec as GroupSpec } from './group';
import { Observable, Subject } from 'rxjs';
import type { PlayerType, SlippiGame } from '@slippi/slippi-js';
import { distinct } from 'rxjs/operators';
//import { sync as globSync } from 'glob';
import type { GamePredicate } from './game-predicate';
//import { createSameLineOutput } from './platform';

export interface Clip {
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
  public clips$: Observable<Clip>;
  private spec: Spec;
  private playerIndex = 0;

  private clipSource: Subject<Clip> = new Subject();
  private game?: SlippiGame;
  private replayFilePath?: string;
  private clipBuilder?: Clip;
  private groupStack: Group[] = [];
  private permanentGroup?: Group;
  // - replays start at -123,
  // - player control starts at -39 (GO!)
  // - timer starts counting down at 0
  private currentFrameIndex = -39;

  public constructor(spec: Spec) {
    this.spec = spec;
    // TODO: remove distinct once search algorithm is better
    this.clips$ = this.clipSource.pipe(distinct((clip) => clip.endFrame));
  }

  public done(): void {
    this.clipSource.complete();
  }

  //public async searchDirectory(replayFolder: string): Promise<void> {
  //const files = globSync(replayFolder + '**/*.slp');
  //const output = createSameLineOutput();
  //for (const file of files) {
  //output.output(
  //`File #${files.indexOf(file) + 1}/${files.length}: ${file
  //.split('/')
  //.pop()}`,
  //);
  //this.searchFile(file);
  //// Hack to give breaks so that playback can buffer clips
  //await new Promise((resolve) => {
  //setTimeout(resolve, 1);
  //});
  //}
  //}

  // TODO: change to web File instead of file path
  public searchFile(game: SlippiGame, path: string): void {
    this.game = game;
    this.replayFilePath = path;
    this.game!.getSettings()!
      .players.map((player: PlayerType) => player.port - 1)
      .forEach((playerIndex) => this.searchPlayer(playerIndex));
  }

  private searchPlayer(playerIndex: number): void {
    if (
      this.spec.gamePredicates &&
      this.spec.gamePredicates.some(
        (predicate) => !predicate(this.game!, playerIndex),
      )
    ) {
      return;
    }

    this.playerIndex = playerIndex;
    this.clipBuilder = undefined;
    this.groupStack = [];
    this.permanentGroup = this.spec.permanentGroupSpec
      ? new Group(this.spec.permanentGroupSpec)
      : undefined;
    this.currentFrameIndex = -39;

    this.pushGroup();
    while (this.groupStack.length > 0) {
      while (this.game!.getFrames()[this.currentFrameIndex]) {
        this.sendFrame();
        this.handleResult();
      }
      this.saveClip();
      // reached end of game, go back to previous group
      if (this.groupStack.length > 1) {
        this.popGroup();
      } else {
        return;
      }
    }
  }

  private sendFrame(): void {
    const frame =
      this.game!.getFrames()[this.currentFrameIndex].players[this.playerIndex]!
        .post;
    const group = this.groupStack[this.groupStack.length - 1];
    group.step(this.game!, frame);
    if (this.permanentGroup) {
      this.permanentGroup.step(this.game!, frame);
    }
    this.currentFrameIndex++;
  }

  private handleResult(): void {
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
      this.saveClip();
    } else {
      // failed, go back to previous group (or all the way if permanent group
      // failed)
      this.saveClip();
      this.popGroup();
    }
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
        path: this.replayFilePath!,
        startFrame: this.groupStack[0].segmentStartFrame!,
        endFrame: this.currentFrameIndex - 1,
      };
    }
  }

  private saveClip(): void {
    if (this.clipBuilder !== undefined) {
      this.clipSource.next(this.clipBuilder);
      this.clipBuilder = undefined;
    }
  }
}
