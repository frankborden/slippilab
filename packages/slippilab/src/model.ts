import { parseReplay } from '@slippilab/parser';
import { Subject } from 'rxjs';
import { run } from '@slippilab/search';
import type { Highlight, Query } from '@slippilab/search';
import { supportedStagesById } from '@slippilab/viewer';
import { framePredicates } from '@slippilab/common';
import type { Predicate, ReplayData } from '@slippilab/common';

export interface Replay {
  fileName: string;
  game: ReplayData;
  highlights: Highlight[];
}

export interface State {
  darkMode: boolean;
  debugMode: boolean;
  replay?: Replay;
  currentFileIndex?: number;
  currentHighlightIndex?: number;
  files: File[];
  searches: [Query, Predicate?][];
}

export class Model {
  private currentState: State = {
    darkMode: false,
    debugMode: false,
    files: [],
    searches: [],
  };
  private stateSubject$: Subject<State> = new Subject<State>();
  state$ = this.stateSubject$.asObservable();

  constructor() {
    this.stateSubject$.next(this.currentState);
  }

  setDarkMode(darkMode: boolean) {
    const newState = { ...this.currentState, darkMode };
    this.currentState = newState;
    this.stateSubject$.next(newState);
  }

  setDebugMode(debugMode: boolean) {
    const newState = { ...this.currentState, debugMode };
    this.currentState = newState;
    this.stateSubject$.next(newState);
  }

  setFiles(files: File[]) {
    const newState = { ...this.currentState, files };
    this.currentState = newState;
    this.stateSubject$.next(newState);
    this.nextFile();
  }

  setSearches(searches: [Query, Predicate?][]) {
    const newState = { ...this.currentState, searches };
    this.currentState = newState;
    this.stateSubject$.next(newState);
  }

  async jumpToFile(file: File) {
    const index = this.currentState.files.indexOf(file);
    if (this.currentState.currentFileIndex === index) {
      return;
    }
    const replay = await this.parseFile(file);
    if (replay === undefined) {
      return;
    }
    const newState = {
      ...this.currentState,
      replay,
      currentHighlightIndex: undefined,
      currentFileIndex: index,
    };
    this.currentState = newState;
    this.stateSubject$.next(newState);
  }

  async jumpToHighlight(highlight: Highlight) {
    const index = this.currentState.replay?.highlights.indexOf(highlight);
    if (index === undefined || index === -1) {
      return;
    }
    const newState = { ...this.currentState, currentHighlightIndex: index };
    this.currentState = newState;
    this.stateSubject$.next(newState);
  }

  async nextFile() {
    const initialFileIndex = this.currentState.currentFileIndex ?? -1;
    let currentFileIndex = initialFileIndex;
    let nextReplay: Replay | undefined;
    do {
      currentFileIndex =
        (currentFileIndex + 1) % this.currentState.files.length;
      nextReplay = await this.parseFile(
        this.currentState.files[currentFileIndex],
      );
    } while (nextReplay === undefined && currentFileIndex !== initialFileIndex);
    if (nextReplay !== undefined) {
      const newState = {
        ...this.currentState,
        replay: nextReplay,
        currentHighlightIndex: undefined,
        currentFileIndex,
      };
      this.currentState = newState;
      this.stateSubject$.next(newState);
    }
  }

  async prevFile() {
    const initialFileIndex = this.currentState.currentFileIndex ?? -1;
    let currentFileIndex = initialFileIndex;
    let prevReplay: Replay | undefined;
    do {
      currentFileIndex =
        (currentFileIndex - 1 + this.currentState.files.length) %
        this.currentState.files.length;
      prevReplay = await this.parseFile(
        this.currentState.files[currentFileIndex],
      );
    } while (prevReplay === undefined && currentFileIndex !== initialFileIndex);
    if (prevReplay !== undefined) {
      const newState = {
        ...this.currentState,
        replay: prevReplay,
        currentHighlightIndex: undefined,
        currentFileIndex,
      };
      this.currentState = newState;
      this.stateSubject$.next(newState);
    }
  }

  async nextHighlight() {
    if (!this.currentState.replay) {
      return;
    }
    const initialHighlightIndex = this.currentState.currentHighlightIndex ?? -1;
    this.jumpToHighlight(
      this.currentState.replay.highlights[
        (initialHighlightIndex + 1) % this.currentState.replay.highlights.length
      ],
    );
  }

  async prevHighlight() {
    if (!this.currentState.replay) {
      return;
    }
    const initialHighlightIndex = this.currentState.currentHighlightIndex ?? 0;
    this.jumpToHighlight(
      this.currentState.replay.highlights[
        (initialHighlightIndex -
          1 +
          this.currentState.replay.highlights.length) %
          this.currentState.replay.highlights.length
      ],
    );
  }

  private async parseFile(file: File): Promise<Replay | undefined> {
    try {
      if (file.name.endsWith('.slp')) {
        const game = parseReplay(await file.arrayBuffer());
        if (this.isSupported(game)) {
          let highlights: Highlight[] = [];
          if (game.settings.playerSettings.filter((ps) => ps).length === 2) {
            highlights = this.currentState.searches.flatMap((query) =>
              run(game, ...query),
            );
          }
          return {
            fileName: file.name,
            game: game,
            highlights,
          };
        }
      }
    } catch (e) {
      console.error(`cannot parse file ${file.name}`, e);
      return undefined;
    }
    return undefined;
  }

  private isSupported(game: ReplayData): boolean {
    const stageId = game.settings.stageId;
    if (!stageId) {
      return false;
    }
    return Boolean(supportedStagesById[stageId]);
  }
}

export const model = new Model();

// // In hitstun and then eventually dies without regaining grounded control.
// // It could be a 1 hit "combo" though... :(
// const comboQuery: [Query, Predicate] = [
//   [
//     { predicate: framePredicates.isInHitstun },
//     { predicate: framePredicates.isDead, delayed: true },
//   ],
//   framePredicates.not(framePredicates.isInGroundedControl),
// ];
// model.setSearches([comboQuery]);
const grabPunishQuery: [Query, Predicate?] = [
  [
    { predicate: framePredicates.isGrabbed },
    {
      predicate: framePredicates.not(framePredicates.isInGroundedControl),
      delayed: true,
    },
    { predicate: framePredicates.isInGroundedControl },
  ],
  // framePredicates.not(framePredicates.isInGroundedControl),
];
model.setSearches([grabPunishQuery]);
