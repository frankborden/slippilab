import { parseReplay } from '@slippilab/parser';
import { Subject } from 'rxjs';
import { FramePredicates, run } from '@slippilab/search';
import type { Highlight, Query } from '@slippilab/search';
import { supportedStagesById } from '@slippilab/viewer';
import type { ReplayData } from '@slippilab/common';

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
  searches: Query[];
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
    this.next();
  }

  setSearches(searches: Query[]) {
    const newState = { ...this.currentState, searches };
    this.currentState = newState;
    this.stateSubject$.next(newState);
  }

  async jumpTo(file: File) {
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

  async next() {
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

  async prev() {
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

  private async parseFile(file: File): Promise<Replay | undefined> {
    try {
      if (file.name.endsWith('.slp')) {
        const game = parseReplay(await file.arrayBuffer());
        if (this.isSupported(game)) {
          let highlights: Highlight[] = [];
          if (game.settings.playerSettings.filter((ps) => ps).length === 2) {
            highlights = this.currentState.searches.flatMap((query) =>
              run(
                game,
                query,
                FramePredicates.either(
                  FramePredicates.isOffstage,
                  FramePredicates.isInHitstun,
                  FramePredicates.isDead,
                ),
              ).map((bounds) => ({
                startFrame: bounds[0],
                endFrame: bounds[1],
              })),
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

const comboQuery: Query = [
  {
    predicate: FramePredicates.isInHitstun,
    minimumLength: 1,
  },
  { predicate: FramePredicates.isDead, minimumLength: 1, delayed: true },
];
model.setSearches([comboQuery]);
