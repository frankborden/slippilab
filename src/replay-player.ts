import type { SlippiGame } from '@slippi/slippi-js';
import { css, html, LitElement, PropertyValues } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { Game } from './newPlayer/game';
import 'wired-elements';
import type { WiredSlider } from 'wired-elements';

@customElement('new-replay-player')
export class ReplayPlayer extends LitElement {
  static get styles() {
    return css`
      canvas {
        background-color: black;
        /* width: 100%;
        height: 100%; */
      }
      wired-slider {
        width: 1200px;
      }
    `;
  }
  @property({ type: Object })
  replay?: SlippiGame;

  @state()
  private currentFrame = -123;

  @state()
  private highestFrame = 400;

  private game?: Game;

  updated(oldValues: PropertyValues<ReplayPlayer>) {
    if (oldValues.has('replay')) {
      this.setup();
    }
  }

  private async setup() {
    const context = this.renderRoot.querySelector('canvas')?.getContext('2d');
    const highestFrame = this.replay?.getLatestFrame()?.frame;
    if (!context || !this.replay || highestFrame === undefined) {
      return;
    }
    this.highestFrame = highestFrame;
    this.game = await Game.create(this.replay, context);
    this.game.onTick(
      (currentFrameNumber: number) => (this.currentFrame = currentFrameNumber),
    );
  }

  private clicked() {
    const slider = this.renderRoot.querySelector('wired-slider') as WiredSlider;
    this.game?.setFrame(slider.value);
  }

  render() {
    return html` <canvas width="1200" height="750"></canvas>
      <wired-slider
        min="-123"
        max=${this.highestFrame}
        .value=${this.currentFrame}
        @change=${this.clicked}
      ></wired-slider>`;
  }
}
