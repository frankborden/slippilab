import { parseReplay } from '@slippilab/parser';
import { Subject } from 'rxjs';
import { BlobReader, BlobWriter, ZipReader } from '@zip.js/zip.js';
import { run } from '@slippilab/search';
import type { Highlight, Query } from '@slippilab/search';
import { supportedStagesById } from '@slippilab/viewer';
import {
  all,
  either,
  isOffstage,
  isDead,
  isInHitstun,
  isGrabbed,
  isInGroundedControl,
  isCrouching,
  not,
  opponent,
  landsAttack,
  action,
  isInShieldstun,
} from '@slippilab/common';
import type { AttackName, Predicate, ReplayData } from '@slippilab/common';

export interface Replay {
  fileName: string;
  game: ReplayData;
  highlights: Map<string, Highlight[]>;
}

export interface State {
  darkMode: boolean;
  debugMode: boolean;
  replay?: Replay;
  currentFileIndex?: number;
  currentHighlightIndex?: number;
  files: File[];
  searches: Map<string, [Query, Predicate?]>;
}

export class Model {
  private currentState: State = {
    darkMode: false,
    debugMode: false,
    files: [],
    searches: new Map(),
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

  async setFiles(files: File[]) {
    const slps = files.filter((file) => file.name.endsWith('.slp'));
    const zips = files.filter((file) => file.name.endsWith('.zip'));
    const blobs = (await Promise.all(zips.map(this.unzip)))
      .flat()
      .filter((file) => file.name.endsWith('.slp'));
    const newState = {
      ...this.currentState,
      files: slps.concat(blobs),
      currentFileIndex: undefined,
      currentHighlightIndex: undefined,
    };
    this.currentState = newState;
    this.stateSubject$.next(newState);
    this.nextFile();
  }

  setSearches(searches: Map<string, [Query, Predicate?]>) {
    let newReplay: Replay | undefined;
    if (this.currentState.replay) {
      const highlights = this.runSearches(
        this.currentState.replay.game,
        searches,
      );
      newReplay = { ...this.currentState.replay, highlights };
    }
    const newState = { ...this.currentState, searches, replay: newReplay };
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

  jumpToHighlight(highlight: Highlight) {
    if (!this.currentState.replay?.highlights) {
      return;
    }
    const highlightsList = [
      ...this.currentState.replay.highlights.values(),
    ].flatMap((x) => x);
    const index = highlightsList.indexOf(highlight);
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

  nextHighlight() {
    if (!this.currentState.replay) {
      return;
    }
    const initialHighlightIndex = this.currentState.currentHighlightIndex ?? -1;
    const highlightsList = [
      ...this.currentState.replay.highlights.values(),
    ].flatMap((x) => x);
    this.jumpToHighlight(
      highlightsList[(initialHighlightIndex + 1) % highlightsList.length],
    );
  }

  prevHighlight() {
    if (!this.currentState.replay) {
      return;
    }
    const initialHighlightIndex = this.currentState.currentHighlightIndex ?? 0;
    const highlightsList = [
      ...this.currentState.replay.highlights.values(),
    ].flatMap((x) => x);
    this.jumpToHighlight(
      highlightsList[
        (initialHighlightIndex - 1 + highlightsList.length) %
          highlightsList.length
      ],
    );
  }

  setAttack(attack: AttackName) {
    const attackQuery: [Query, Predicate?] = [
      [{ predicate: landsAttack(attack) }],
    ];
    const searches = new Map(this.currentState.searches);
    searches.set('custom attack', attackQuery);
    this.setSearches(searches);
  }

  private async parseFile(file: File): Promise<Replay | undefined> {
    try {
      if (file.name.endsWith('.slp')) {
        const game = parseReplay(await file.arrayBuffer());
        if (supportedStagesById[game.settings.stageId]) {
          const highlights = this.runSearches(game, this.currentState.searches);
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

  private runSearches(
    game: ReplayData,
    searches: Map<string, [Query, Predicate?]>,
  ) {
    const highlights: Map<string, Highlight[]> = new Map();
    if (game.settings.playerSettings.filter((ps) => ps).length === 2) {
      [...searches.entries()].forEach(([name, queryParams]) =>
        highlights.set(name, run(game, ...queryParams)),
      );
    }
    return highlights;
  }

  private async unzip(zipFile: File): Promise<File[]> {
    const entries = await new ZipReader(new BlobReader(zipFile)).getEntries();
    return Promise.all(
      entries
        .filter((entry) => !entry.filename.split('/').at(-1)?.startsWith('.'))
        .map((entry) =>
          (entry.getData?.(new BlobWriter()) as Promise<Blob>).then(
            (blob) => new File([blob], entry.filename),
          ),
        ),
    );
  }
}

export const model = new Model();

const killComboQuery: [Query, Predicate?] = [
  [
    { predicate: opponent(isInHitstun) },
    { predicate: opponent(isDead), delayed: true },
  ],
  not(opponent(isInGroundedControl)),
];
const grabPunishQuery: [Query, Predicate?] = [
  [
    { predicate: opponent(isGrabbed) },
    {
      predicate: all(
        not(opponent(isDead)),
        either(not(opponent(isInGroundedControl)), opponent(isOffstage)),
      ),
    },
  ],
];
const edgeguardQuery: [Query, Predicate?] = [
  [
    { predicate: opponent(isOffstage) },
    { predicate: not(opponent(isInHitstun)), delayed: true },
    { predicate: opponent(isInHitstun), delayed: true },
  ],
  not(opponent(isInGroundedControl)),
];
const crouchCancelQuery: [Query, Predicate?] = [
  [{ predicate: isCrouching }, { predicate: isInHitstun }],
];
const shieldGrabQuery: [Query, Predicate?] = [
  [
    { predicate: isInShieldstun },
    { predicate: action('Catch'), delayed: true },
  ],
  either(action('Guard'), action('Catch'), action('GuardSetOff')),
];
const defaultCustomQuery: [Query, Predicate?] = [
  [{ predicate: landsAttack('Jab 1') }],
  not(opponent(isInGroundedControl)),
];
model.setSearches(
  new Map([
    ['kill', killComboQuery],
    ['grab followup', grabPunishQuery],
    ['edgeguard attempt', edgeguardQuery],
    ['shieldgrab attempt', shieldGrabQuery],
    ['crouch cancel', crouchCancelQuery],
    ['custom attack', defaultCustomQuery],
  ]),
);
