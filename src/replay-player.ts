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
      .container {
        width: 100%;
        height: 100%;
        position: relative;
      }
      canvas {
        background-color: white;
        width: 100%;
        height: 100%;
      }
      wired-slider {
        position: absolute;
        bottom: 10px;
        left: 25%;
        width: 50%;
        align-self: center;
        --wired-slider-knob-color: black;
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
          this.game?.setPause();
          this.game?.setFrame(
            Math.min(this.highestFrame, this.currentFrame + 1),
          );
          break;
        case ',':
          this.game?.setPause();
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

  firstUpdated() {
    const canvas = this.renderRoot.querySelector('canvas');
    const slider: WiredSlider | null =
      this.renderRoot.querySelector('wired-slider');
    if (!canvas || !slider) {
      return;
    }
    const resizeObserver = new ResizeObserver((entries) => {
      for (let entry of entries) {
        let newWidth: number, newHeight: number;
        if (entry.contentBoxSize) {
          // Firefox implements `contentBoxSize` as a single content rect,
          // rather than an array.
          const contentBoxSize: ResizeObserverSize = Array.isArray(
            entry.contentBoxSize,
          )
            ? entry.contentBoxSize[0]
            : entry.contentBoxSize;
          newWidth = contentBoxSize.inlineSize;
          newHeight = contentBoxSize.blockSize;
        } else {
          newWidth = entry.contentRect.width;
          newHeight = entry.contentRect.height;
        }
        this.game?.resize(newWidth, newHeight);
        slider.requestUpdate();
      }
    });

    resizeObserver.observe(canvas);
  }

  updated(oldValues: PropertyValues<ReplayPlayer>) {
    if (oldValues.has('replay')) {
      if (oldValues.get('replay')) {
        this.game?.stop();
      }
      this.setup();
    }
  }

  private async setup() {
    const canvas = this.renderRoot.querySelector('canvas');
    const context = this.renderRoot.querySelector('canvas')?.getContext('2d');
    const highestFrame = this.replay?.getLatestFrame()?.frame;
    if (!canvas || !context || !this.replay || highestFrame === undefined) {
      return;
    }
    this.highestFrame = highestFrame;
    this.game = await GameRenderer.create(this.replay, canvas);
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
      <div class="container">
        <canvas @click=${() => this.game?.togglePause()}></canvas>
        <wired-slider
          min="-123"
          knobradius="100"
          max=${this.highestFrame}
          .value=${this.currentFrame}
          @change=${this.clicked}
        ></wired-slider>
      </div>
    `;
  }
}
