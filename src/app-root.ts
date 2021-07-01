import { LitElement, html, css } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import './replay-select';
import './replay-player';
import type { ReplaySelectedEvent } from './replay-select';
import type { SlippiGame } from '@slippi/slippi-js';

@customElement('app-root')
export class AppRoot extends LitElement {
  static get styles() {
    return css`
      .wrapper {
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        height: 100vh;
        background-color: white;
      }
      .player {
        padding: 10px;
        align-self: stretch;
        flex-grow: 1;
      }
      .hidden {
        position: absolute;
        left: -5000px;
      }
    `;
  }

  @state()
  private replay?: SlippiGame;

  private async replaySelected(event: ReplaySelectedEvent) {
    this.replay = event.detail;
  }

  render() {
    const playerClasses = { hidden: !this.replay, player: true };
    return html`
      <div class="wrapper">
        ${this.replay
          ? html` <new-replay-player
              .replay=${this.replay}
              class=${classMap(playerClasses)}
            ></new-replay-player>`
          : ''}
        <replay-select @replay-selected=${this.replaySelected}></replay-select>
      </div>
    `;
  }
}
