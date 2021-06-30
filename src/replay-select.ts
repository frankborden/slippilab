import { css, html, LitElement } from 'lit';
import { customElement } from 'lit/decorators.js';
import {
  FrameEntryType,
  FramesType,
  GameStartType,
  MetadataType,
  SlippiGame,
} from '@slippi/slippi-js';
import 'wired-elements';

// expected by player library
export interface Replay {
  // data: {
  settings: GameStartType;
  metadata: MetadataType;
  frames: FramesType;
  // };
}
export type ReplaySelectedEvent = CustomEvent<SlippiGame>;

@customElement('replay-select')
export class ReplaySelect extends LitElement {
  static get styles() {
    return css`
      h1 {
        font-size: 4rem;
      }
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
    const file = this.renderRoot.querySelector('input')?.files?.[0];
    if (!file) {
      return;
    }
    const replay = await this.createReplay(file);
    const replaySelectedEvent = new CustomEvent<SlippiGame>('replay-selected', {
      detail: replay,
    });
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
        <wired-button class="label" disabled>Load</wired-button>
      </label>
      <input
        id="replay-input"
        name="replay-input"
        type="file"
        accept=".slp"
        webkitdirectory
        @change=${this.filesSelected}
      />
    `;
  }
}
