import { css, html, LitElement } from 'lit';
import { customElement } from 'lit/decorators.js';
import {
  FramesType,
  GameStartType,
  MetadataType,
  SlippiGame,
} from '@slippi/slippi-js';
import 'wired-elements';
import { supportedCharacters } from './newPlayer/animations';
import { characters } from './newPlayer/characters/character';
import { stagesById } from './newPlayer/stages/stage';

// expected by player library
export interface Replay {
  // data: {
  settings: GameStartType;
  metadata: MetadataType;
  frames: FramesType;
  // };
}
export type ReplaysSelectedEvent = CustomEvent<SlippiGame[]>;

@customElement('replay-select')
export class ReplaySelect extends LitElement {
  static get styles() {
    return css`
      h2 {
        width: 100%;
      }
      input {
        display: none;
      }
      .label {
        display: inline-block;
        cursor: pointer;
      }
      wired-button {
        width: 100%;
        background-color: #7fd17f;
      }
    `;
  }

  private async filesSelected() {
    const files = this.renderRoot.querySelector('input')?.files;
    if (!files || files.length === 0) {
      return;
    }

    const replays = (
      await Promise.all(
        Array.from(files).map((file) => this.createReplay(file)),
      )
    )
      .filter(
        (replay): replay is SlippiGame =>
          replay
            ?.getSettings()
            ?.players.every((player) =>
              supportedCharacters.includes(characters[player.characterId!]),
            ) ?? false,
      )
      .filter((replay) =>
        Object.keys(stagesById).includes(
          replay.getSettings()?.stageId?.toString()!,
        ),
      );
    const replaySelectedEvent = new CustomEvent<SlippiGame[]>(
      'replays-selected',
      {
        detail: replays,
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
      <label for="replay-input">
        <wired-button class="label" elevation="2" disabled>
          <h2>Load Replay Files</h2>
        </wired-button>
      </label>
      <input
        id="replay-input"
        name="replay-input"
        type="file"
        accept=".slp"
        multiple
        webkitdirectory
        @change=${this.filesSelected}
      />
    `;
  }
}
