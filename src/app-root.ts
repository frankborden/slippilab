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
      .text {
        color: white;
      }
      .sidebar {
        position: absolute;
        top: 0;
        left: 0;
        width: calc(100vw - 160vh);
      }
      wired-button {
        background-color: #7fd17f;
        width: 100%;
      }
      h2 {
        width: 100%;
      }
      .hidden {
        position: absolute;
        left: -5000px;
      }
    `;
  }

  @state()
  private replays?: SlippiGame[];

  @state()
  private currentReplay?: SlippiGame;

  private playNextReplay(): void {
    if (!this.replays || !this.currentReplay) {
      return;
    }
    const currentIndex = this.replays.indexOf(this.currentReplay);
    const nextIndex = (currentIndex + 1) % this.replays.length;
    this.currentReplay = this.replays[nextIndex];
  }

  private async replaySelected(event: ReplaysSelectedEvent): Promise<void> {
    this.replays = event.detail;
    if (this.replays.length > 0) {
      this.currentReplay = this.replays[0];
    }
  }

  private getIndexText(): string {
    if (!this.currentReplay || !this.replays) {
      return '';
    }
    return `${this.replays.indexOf(this.currentReplay) + 1}/${
      this.replays.length
    }`;
  }

  render() {
    const playerClasses = { hidden: !this.currentReplay, player: true };
    return html`
      <div class="sidebar">
        <replay-select @replays-selected=${this.replaySelected}></replay-select>
        <wired-button class="label" @click=${this.playNextReplay} elevation="2">
          <h2>Start Next Replay</h2>
        </wired-button>
        <div class="text">${this.getIndexText()}</div>
      </div>
      ${this.currentReplay
        ? html` <new-replay-player
            .replay=${this.currentReplay}
            class=${classMap(playerClasses)}
          ></new-replay-player>`
        : ''}
    `;
  }
}
