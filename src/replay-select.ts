import { css, html, LitElement } from 'lit';
import { customElement } from 'lit/decorators.js';
import {
  FramesType,
  GameStartType,
  MetadataType,
  SlippiGame,
} from '@slippi/slippi-js';

export interface Replay {
  data: {
    settings: GameStartType;
    metadata: MetadataType;
    frames: FramesType;
  };
}
export type ReplaySelectedEvent = CustomEvent<Replay>;

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
        background-color: purple;
        border-radius: 20%;
        display: inline-block;
        padding: 6px 12px;
        cursor: pointer;
      }
    `;
  }
  private async fileSelected(): Promise<void> {
    const file = this.renderRoot.querySelector('input')?.files?.[0];
    if (!file) {
      return;
    }
    const buffer = await file.arrayBuffer();
    const game = new SlippiGame(buffer);
    const settings = game.getSettings();
    const metadata = game.getMetadata();

    if (!settings || !metadata) {
      return;
    }

    const gameFrames = game.getFrames();
    const replay: Replay = {
      data: {
        settings: settings,
        metadata: metadata,
        frames: gameFrames,
      },
    };
    const replaySelectedEvent = new CustomEvent<Replay>('replay-selected', {
      detail: replay,
    });
    this.dispatchEvent(replaySelectedEvent);
  }
  render() {
    return html`
      <label for="replay-input" class="label">
        <h1>Watch</h1>
      </label>
      <input id="replay-input" type="file" @change="${this.fileSelected}" />
    `;
  }
}
