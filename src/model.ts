import { SlippiGame } from '@slippi/slippi-js';
import { Subject } from 'rxjs';
import type { Search } from './search';
import { supportedCharactersById, supportedStagesById } from './viewer';
import type { DeepRequired, Replay } from './common';

export class Model {
  files: File[] = [];
  searches: Search[] = [];
  currentFileIndex = -1;
  replay$: Subject<Replay> = new Subject<Replay>();
  replayOutput$ = this.replay$.asObservable();

  constructor() {}

  setFiles(...files: File[]) {
    this.files = files;
    this.currentFileIndex = -1;
    this.next();
  }

  setSearches(...searches: Search[]) {
    this.searches = searches;
  }

  async next() {
    const initialFileIndex = this.currentFileIndex;
    let replay: Replay | undefined;
    do {
      this.currentFileIndex = (this.currentFileIndex + 1) % this.files.length;
      replay = await this.parseFile(this.files[this.currentFileIndex]);
    } while (
      replay === undefined &&
      this.currentFileIndex !== initialFileIndex
    );
    if (replay !== undefined) {
      this.replay$.next(replay);
    }
  }

  async prev() {
    const initialFileIndex = this.currentFileIndex;
    let replay: Replay | undefined;
    do {
      this.currentFileIndex =
        (this.currentFileIndex - 1 + this.files.length) % this.files.length;
      replay = await this.parseFile(this.files[this.currentFileIndex]);
    } while (
      replay === undefined &&
      this.currentFileIndex !== initialFileIndex
    );
    if (replay !== undefined) {
      this.replay$.next(replay);
    }
  }

  async parseFile(file: File): Promise<Replay | undefined> {
    try {
      if (file.name.endsWith('.slp')) {
        const game = new SlippiGame(await file.arrayBuffer());
        if (this.isSupported(game)) {
          const highlights = this.searches.flatMap((search) =>
            search.searchFile(game, ''),
          );
          return {
            fileName: file.name,
            game: game as DeepRequired<SlippiGame>,
            highlights,
          };
        }
      }
    } catch (e) {
      console.error(`cannot parse file ${file.name}`);
      return undefined;
    }
    return undefined;
  }

  isSupported(game: SlippiGame): boolean {
    return true;
    /*
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
    */
  }
}
