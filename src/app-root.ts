import { LitElement, html, css } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import './replay-select';
import './replay-player';
import type { ReplaysSelectedEvent } from './replay-select';
import type { SlippiGame } from '@slippi/slippi-js';
import { fetchAnimation } from './newPlayer/animations';
import { characterDataById } from './newPlayer/characters/character';

@customElement('app-root')
export class AppRoot extends LitElement {
  constructor() {
    super();
    Object.keys(characterDataById).forEach((characterId) =>
      fetchAnimation(Number(characterId)),
    );
  }

  static get styles() {
    return css`
      .grid {
        display: grid;
      }
      .topbar,
      .controls {
        z-index: 1;
      }
      .hidden {
        position: absolute;
        left: -5000px;
      }
      new-replay-player {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
      }
    `;
  }

  @state()
  private replays?: Map<string, SlippiGame>;

  @state()
  private currentReplay?: SlippiGame;

  private playPrevReplay(): void {
    if (!this.replays || !this.currentReplay) {
      return;
    }
    const replays = Array.from(this.replays.values());
    const currentIndex = replays.indexOf(this.currentReplay);
    // add length because -1 % 5 === -1 in javascript.
    const prevIndex = (currentIndex - 1 + replays.length) % replays.length;
    this.currentReplay = replays[prevIndex];
  }

  private playNextReplay(): void {
    if (!this.replays || !this.currentReplay) {
      return;
    }
    const replays = Array.from(this.replays.values());
    const currentIndex = replays.indexOf(this.currentReplay);
    const nextIndex = (currentIndex + 1) % replays.length;
    this.currentReplay = replays[nextIndex];
  }

  private async replaySelected(event: ReplaysSelectedEvent): Promise<void> {
    this.replays = event.detail;
    if (this.replays.size > 0) {
      this.currentReplay = Array.from(this.replays.values())[0];
    }
  }

  private getIndexText(): string {
    if (!this.currentReplay || !this.replays) {
      return '';
    }
    const fileName = Array.from(this.replays.entries()).filter(
      ([_fileName, replay]) => replay === this.currentReplay,
    )[0][0];
    return `Playing ${fileName}`;
  }

  render() {
    const playerClasses = { hidden: !this.currentReplay, player: true };
    return html`
      <div class="grid">
        <div class="topbar">
          <replay-select
            @replays-selected=${this.replaySelected}
          ></replay-select>
          ${this.replays && this.replays.size > 1
            ? html`
                <wired-button
                  class="label"
                  @click=${this.playPrevReplay}
                  elevation="2"
                >
                  Start Prev Replay
                </wired-button>

                <wired-button
                  class="label"
                  @click=${this.playNextReplay}
                  elevation="2"
                >
                  Start Next Replay
                </wired-button>
              `
            : ``}
          ${this.replays && this.replays.size > 0
            ? html` <span>${this.getIndexText()}</span> `
            : ''}
        </div>
        <div class="controls">
          Pause: Space or K or click<br />
          Rewind -2s: Left or J<br />
          Skip Ahead +2s: Right or L<br />
          Zoom In: + or =<br />
          Zoom Out: - or _<br />
          Frame Forward: .<br />
          Frame Backwards: ,
        </div>
        ${this.currentReplay
          ? html` <new-replay-player
              .replay=${this.currentReplay}
              class=${classMap(playerClasses)}
            ></new-replay-player>`
          : ''}
      </div>
    `;
  }
}
