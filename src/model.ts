import { Game } from '@slippilab/parser';
import { Subject } from 'rxjs';
import { FramePredicates, Search } from '@slippilab/search';
import type { SearchSpec } from '@slippilab/search';
import {
  supportedCharactersById,
  supportedStagesById,
} from '@slippilab/viewer';
import type { Highlight, Replay } from '@slippilab/common';

export interface State {
  replay?: Replay;
  currentFileIndex?: number;
  currentHighlightIndex?: number;
  files: File[];
  searches: SearchSpec[];
}

export class Model {
  private currentState: State = { files: [], searches: [] };
  private stateSubject$: Subject<State> = new Subject<State>();
  state$ = this.stateSubject$.asObservable();

  constructor() {
    this.stateSubject$.next(this.currentState);
  }

  setFiles(files: File[]) {
    const newState = { ...this.currentState, files };
    this.currentState = newState;
    this.stateSubject$.next(newState);
    this.next();
  }

  setSearches(searches: SearchSpec[]) {
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
        const game = new Game(await file.arrayBuffer());
        if (this.isSupported(game)) {
          let highlights: Highlight[] = [];
          if (game.gameStart.playerSettings.length === 2) {
            highlights = this.currentState.searches
              .map((searchSpec) => new Search(searchSpec))
              .flatMap((search) => search.searchFile(game));
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

  private isSupported(game: Game): boolean {
    const stageId = game.gameStart.stageId;
    const characterIds = game.gameStart?.playerSettings.map(
      (player) => player.externalCharacterId,
    );
    if (!stageId || !characterIds) {
      return false;
    }
    const stageSupported = Boolean(supportedStagesById[stageId]);
    const charactersSupported = characterIds.every(
      (characterId) =>
        characterId !== null && Boolean(supportedCharactersById[characterId]),
    );
    return stageSupported && charactersSupported;
    return true;
  }
}

export const model = new Model();

// const successfulEdgeguardSpec: SearchSpec = {
//   permanentGroupSpec: {
//     unitSpecs: [{ predicate: FramePredicates.isOffstage }],
//   },
//   groupSpecs: [
//     {
//       unitSpecs: [
//         {
//           options: { minimumLength: 30 },
//           predicate: FramePredicates.isOffstage,
//         },
//       ],
//     },
//     {
//       unitSpecs: [
//         {
//           predicate: (frame, game) => !FramePredicates.isInHitstun(frame, game),
//         },
//       ],
//     },
//     { unitSpecs: [{ predicate: FramePredicates.isInHitstun }] },
//     { unitSpecs: [{ predicate: FramePredicates.isDead }] },
//   ],
// };
const successfulComboSpec: SearchSpec = {
  permanentGroupSpec: {
    unitSpecs: [{ predicate: FramePredicates.isNotInGroundedControl }],
  },
  groupSpecs: [
    { unitSpecs: [{ predicate: FramePredicates.isInBeginningOfHitstun }] },
    {
      unitSpecs: [{ predicate: FramePredicates.isInNotBeginningOfHitstun }],
    },
    {
      options: { allowDelayed: true },
      unitSpecs: [{ predicate: FramePredicates.isInBeginningOfHitstun }],
    },
    {
      unitSpecs: [{ predicate: FramePredicates.isInNotBeginningOfHitstun }],
    },
    {
      options: { allowDelayed: true },
      unitSpecs: [{ predicate: FramePredicates.isInBeginningOfHitstun }],
    },
    {
      unitSpecs: [{ predicate: FramePredicates.isInNotBeginningOfHitstun }],
    },
    {
      options: { allowDelayed: true },
      unitSpecs: [{ predicate: FramePredicates.isInBeginningOfHitstun }],
    },
    {
      options: { allowDelayed: true },
      unitSpecs: [{ predicate: FramePredicates.isDead }],
    },
  ],
};
model.setSearches([successfulComboSpec]);
