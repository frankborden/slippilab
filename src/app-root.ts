import { LitElement, html, css } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import './replay-select';
import './replay-player';
import type { ReplaySelectedEvent } from './replay-select';
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
      .wrapper {
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        height: 100vh;
        background-color: lightgreen;
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
    const selectClasses = { hidden: Boolean(this.replay) };
    return html`
      <div class="wrapper">
        <replay-select
          class=${classMap(selectClasses)}
          @replay-selected=${this.replaySelected}
        ></replay-select>
      </div>
      ${this.replay
        ? html` <new-replay-player
            .replay=${this.replay}
            class=${classMap(playerClasses)}
          ></new-replay-player>`
        : ''}
    `;
  }
}
