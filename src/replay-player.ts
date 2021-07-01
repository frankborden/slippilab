import type { SlippiGame } from '@slippi/slippi-js';
import { css, html, LitElement, PropertyValues } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { Game } from './newPlayer/game';

@customElement('new-replay-player')
export class ReplayPlayer extends LitElement {
  static get styles() {
    return css`
      canvas {
        background-color: black;
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

  private async setup() {
    const context = this.renderRoot.querySelector('canvas')?.getContext('2d');
    if (!context || !this.replay) {
      return;
    }
    this.game = await Game.create(this.replay, context);
  }

  render() {
    return html` <canvas width="1200" height="750"></canvas> `;
  }
}
