import { SlippiGame } from '@slippi/slippi-js';
import { Subject } from 'rxjs';
import { FramePredicates, Search, SearchSpec } from './search';
import { supportedCharactersById, supportedStagesById } from './viewer';
import type { DeepRequired, Replay } from './common';

export interface State {
  replay?: Replay;
  currentFileIndex?: number;
  files: File[];
  searches: SearchSpec[];
}

export class Model {
  private currentState: State = { files: [], searches: [] };
  private replay$: Subject<State> = new Subject<State>();
  replayOutput$ = this.replay$.asObservable();

  constructor() {
    this.replay$.next(this.currentState);
  }

  setFiles(files: File[]) {
    const newState = { ...this.currentState, files };
    this.currentState = newState;
    this.replay$.next(newState);
    this.next();
  }

  setSearches(searches: SearchSpec[]) {
    const newState = { ...this.currentState, searches };
    this.currentState = newState;
    this.replay$.next(newState);
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
    const newState = { ...this.currentState, replay, currentFileIndex: index };
    this.currentState = newState;
    this.replay$.next(newState);
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
        currentFileIndex,
      };
      this.currentState = newState;
      this.replay$.next(newState);
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
        currentFileIndex,
      };
      this.currentState = newState;
      this.replay$.next(newState);
    }
  }

  private async parseFile(file: File): Promise<Replay | undefined> {
    try {
      if (file.name.endsWith('.slp')) {
        const game = new SlippiGame(await file.arrayBuffer());
        if (this.isSupported(game)) {
          const highlights = this.currentState.searches
            .map((searchSpec) => new Search(searchSpec))
            .flatMap((search) => search.searchFile(game));
          return {
            fileName: file.name,
            game: game as DeepRequired<SlippiGame>,
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

  private isSupported(game: SlippiGame): boolean {
    const stageId = game.getSettings()?.stageId;
    const characterIds = game
      .getSettings()
      ?.players.map((player) => player.characterId);
    if (!stageId || !characterIds) {
      return false;
    }
    const stageSupported = Boolean(supportedStagesById[stageId]);
    const charactersSupported = characterIds.every(
      (characterId) =>
        characterId !== null && Boolean(supportedCharactersById[characterId]),
    );
    return stageSupported && charactersSupported;
  }
}

export const model = new Model();

const successfulEdgeguardSpec: SearchSpec = {
  permanentGroupSpec: {
    unitSpecs: [{ predicate: FramePredicates.isOffstage }],
  },
  groupSpecs: [
    {
      unitSpecs: [
        {
          options: { minimumLength: 30 },
          predicate: FramePredicates.isOffstage,
        },
      ],
    },
    {
      unitSpecs: [
        {
          predicate: (frame, game) =>
            !FramePredicates.isInHitstun(frame, game),
        },
      ],
    },
    { unitSpecs: [{ predicate: FramePredicates.isInHitstun }] },
    { unitSpecs: [{ predicate: FramePredicates.isDead }] },
  ],
};
model.setSearches([successfulEdgeguardSpec]);

