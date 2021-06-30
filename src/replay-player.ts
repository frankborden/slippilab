import type { SlippiGame } from '@slippi/slippi-js';
import { css, html, LitElement, PropertyValues } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { Game } from './newPlayer/game';

@customElement('new-replay-player')
export class ReplayPlayer extends LitElement {
  static get styles() {
    return css`
      canvas {
        background-color: darkblue;
        /* width: 100%;
        height: 100%; */
      }
    `;
  }
  @property({ type: Object })
  replay?: SlippiGame;

  private game?: Game;

  updated(oldValues: PropertyValues<ReplayPlayer>) {
    this.setup();
  }

  private setup() {
    const canvas = this.renderRoot.querySelector('canvas');
    if (!canvas) {
      return;
    }
    this.game = new Game(this.replay!, canvas);
    this.game.start();
  }

  render() {
    return html` <canvas width="1200" height="750"></canvas> `;
  }
}
