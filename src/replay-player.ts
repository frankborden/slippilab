import type { SlippiGame } from '@slippi/slippi-js';
import { css, html, LitElement, PropertyValues } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { GameRenderer } from './newPlayer/gameRenderer';
import 'wired-elements';
import type { WiredSlider } from 'wired-elements';

@customElement('new-replay-player')
export class ReplayPlayer extends LitElement {
  static get styles() {
    return css`
      canvas {
        position: absolute;
        top: 0;
        left: calc((100vw - 160vh) / 2);
        width: 160vh;
        height: 100vh;
        background-color: lightgreen;
      }
      wired-slider {
        position: absolute;
        bottom: 10px;
        left: 25%;
        align-self: center;
        width: 50%;
        --wired-slider-knob-color: green;
        --wired-slider-bar-color: green;
      }
    `;
  }
  @property({ type: Object })
  replay?: SlippiGame;

  @state()
  private currentFrame = -123;

  @state()
  private highestFrame = 400;

  private game?: GameRenderer;

  constructor() {
    super();
    window.addEventListener('keydown', (e: KeyboardEvent) => {
      switch (e.key) {
        case ' ':
        case 'k':
          this.game?.togglePause();
          break;
        case 'j':
        case 'ArrowLeft':
          this.game?.setFrame(Math.max(-123, this.currentFrame - 120));
          break;
        case 'l':
        case 'ArrowRight':
          this.game?.setFrame(
            Math.min(this.highestFrame, this.currentFrame + 120),
          );
          break;
        case '.':
          this.game?.setFrame(
            Math.min(this.highestFrame, this.currentFrame + 1),
          );
          break;
        case ',':
          this.game?.setFrame(Math.max(-123, this.currentFrame - 1));
          break;
        case '+':
        case '=':
          this.game?.zoomIn();
          break;
        case '-':
        case '_':
          this.game?.zoomOut();
          break;
      }
    });
  }

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
    this.game = await GameRenderer.create(this.replay, context);
    this.game.onTick(
      (currentFrameNumber: number) => (this.currentFrame = currentFrameNumber),
    );
  }

  private clicked() {
    const slider = this.renderRoot.querySelector('wired-slider') as WiredSlider;
    this.game?.setFrame(slider.value);
  }

  render() {
    return html`
      <canvas width="1200" height="750"></canvas>
      <wired-slider
        min="-123"
        knobradius="100"
        max=${this.highestFrame}
        .value=${this.currentFrame}
        @change=${this.clicked}
      ></wired-slider>
    `;
  }
}
