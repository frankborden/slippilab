import { css, html, LitElement } from 'lit';
import { customElement } from 'lit/decorators.js';
import {
  FramesType,
  GameStartType,
  MetadataType,
  SlippiGame,
} from '@slippi/slippi-js';
import 'wired-elements';
import { supportedCharacters } from './player/animations';
import { characters } from './player/characters/character';
import { stagesById } from './player/stages/stage';

// expected by player library
export interface Replay {
  // data: {
  settings: GameStartType;
  metadata: MetadataType;
  frames: FramesType;
  // };
}
export type ReplaysSelectedEvent = CustomEvent<Map<string, SlippiGame>>;

@customElement('replay-select')
export class ReplaySelect extends LitElement {
  static get styles() {
    return css`
      input {
        display: none;
      }
      .label {
        display: inline-block;
        cursor: pointer;
      }
    `;
  }

  private async filesSelected() {
    const inputs = Array.from(this.renderRoot.querySelectorAll('input'));
    const files = inputs
      .map((input) => input.files)
      .filter((fileList): fileList is FileList => fileList !== null)
      .flatMap((fileList) => Array.from(fileList));
    if (!files || files.length === 0) {
      return;
    }
    inputs.forEach((input) => (input.value = ''));
    const replaysMap = new Map(
      (
        await Promise.all(
          files.map((file) =>
            this.createReplay(file).then((replay): [string, SlippiGame] => [
              file.name,
              replay!,
            ]),
          ),
        )
      )
        .filter(
          ([_fileName, replay]) =>
            replay
              ?.getSettings()
              ?.players.every((player) =>
                supportedCharacters.includes(characters[player.characterId!]),
              ) ?? false,
        )
        .filter(([_fileName, replay]) =>
          Object.keys(stagesById).includes(
            replay.getSettings()?.stageId?.toString()!,
          ),
        ),
    );
    const replaySelectedEvent = new CustomEvent<Map<string, SlippiGame>>(
      'replays-selected',
      {
        detail: replaysMap,
      },
    );
    this.dispatchEvent(replaySelectedEvent);
  }

  private async createReplay(file: File): Promise<SlippiGame | undefined> {
    const buffer = await file.arrayBuffer();
    const game = new SlippiGame(buffer);
    return game;
  }

  render() {
    return html`
      <label for="replay-input-files">
        <wired-button class="label" elevation="2" disabled>
          Open File
        </wired-button>
      </label>
      <input
        id="replay-input-files"
        name="replay-input-files"
        type="file"
        accept=".slp"
        multiple
        @change=${this.filesSelected}
      />
      <label for="replay-input-dir">
        <wired-button class="label" elevation="2" disabled>
          Open Folder
        </wired-button>
      </label>
      <input
        id="replay-input-dir"
        name="replay-input-dir"
        type="file"
        webkitdirectory
        @change=${this.filesSelected}
      />
    `;
  }
}
