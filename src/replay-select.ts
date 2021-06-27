import { css, html, LitElement } from 'lit';
import { customElement } from 'lit/decorators.js';
import {
  FrameEntryType,
  FramesType,
  GameStartType,
  MetadataType,
  SlippiGame,
} from '@slippi/slippi-js';

// expected by player library
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
        background-color: #44a963;
        border-radius: 20%;
        display: inline-block;
        padding: 6px 12px;
        cursor: pointer;
      }
    `;
  }

  private async filesSelected() {
    const input = this.renderRoot.querySelector('input');
    console.log(input?.files);
    const file = input?.files?.[0];
    if (!file || !input) {
      return;
    }
    const replay = await this.createReplay(file);
    const replaySelectedEvent = new CustomEvent<Replay>('replay-selected', {
      detail: replay,
    });
    this.dispatchEvent(replaySelectedEvent);
  }

  private async createReplay(file: File): Promise<Replay | undefined> {
    const buffer = await file.arrayBuffer();
    const game = new SlippiGame(buffer);
    const settings = game.getSettings();
    const metadata = game.getMetadata();
    if (!settings || !metadata) {
      return;
    }
    const gameFrames: FrameEntryType[] = [];
    const startFrame = 30;
    const endFrame = 300;
    for (let i = startFrame; i < endFrame; i++) {
      gameFrames[-123 + i - startFrame] = game.getFrames()[i];
    }
    return {
      data: {
        settings: settings,
        metadata: metadata,
        frames: gameFrames,
      },
    };
  }

  render() {
    return html`
      <label for="replay-input" class="label">
        <h1>Watch</h1>
      </label>
      <input
        id="replay-input"
        name="replay-input"
        type="file"
        webkitdirectory
        @change=${this.filesSelected}
      />
    `;
  }
}
