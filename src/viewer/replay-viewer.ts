import GIF from 'gif.js';
import { css, html, LitElement, PropertyValues } from 'lit';
import { customElement, property, query, state } from 'lit/decorators.js';
import '@spectrum-web-components/slider/sp-slider';
import type { Slider } from '@spectrum-web-components/slider';

import type { Replay } from '../common';
import { Game } from './game';

@customElement('replay-viewer')
export class ReplayViewer extends LitElement {
  static get styles() {
    return css`
      .container {
        width: 100%;
        height: 100%;
        position: relative;
      }
      canvas {
        width: 100%;
        height: 100%;
      }
      .controls {
        position: absolute;
        bottom: 10px;
        left: 25%;
        width: 50%;
      }
      sp-slider {
        width: 100%;
      }
    `;
  }
  @property({ type: Object })
  replay?: Replay;

  @property({ type: Boolean })
  dark = false;

  @state()
  private currentFrame = -123;

  @state()
  private highestFrame = 400;

  @query('canvas')
  private canvas?: HTMLCanvasElement;

  @query('sp-slider')
  private slider?: Slider;

  private game?: Game;

  constructor() {
    super();
    window.addEventListener('keyup', (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp':
        case 'ArrowDown':
          this.game?.normalSpeed();
          break;
      }
    });
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
        case 'ArrowUp':
          this.game?.speedUp();
          break;
        case 'ArrowDown':
          this.game?.slowDown();
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
        case 'g':
          this.captureGif();
          break;
        case '0':
        case '1':
        case '2':
        case '3':
        case '4':
        case '5':
        case '6':
        case '7':
        case '8':
        case '9':
          const num = Number(e.key);
          if (!isNaN(num)) {
            const percent = (num * 10) / 100;
            const frame = Math.round((this.highestFrame + 123) * percent) - 123;
            this.game?.setFrame(frame);
          }
          break;
      }
    });
  }

  firstUpdated() {
    if (!this.canvas) {
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
        if (!this.canvas || !this.slider) {
          return;
        }
        this.canvas.width = newWidth;
        this.canvas.height = newHeight;
        this.game?.resize(newWidth, newHeight);
        this.slider.requestUpdate();
      }
    });

    resizeObserver.observe(this.canvas);
  }

  updated(oldValues: PropertyValues<ReplayViewer>) {
    if (oldValues.has('replay')) {
      if (oldValues.get('replay')) {
        this.game?.stop();
      }
      this.setup();
    }

    if (oldValues.has('dark')) {
      this.game?.setDarkMode(this.dark);
    }
  }

  private async setup() {
    const context = this.canvas?.getContext('2d');
    const highestFrame = this.replay?.game.getLatestFrame()?.frame;
    if (
      !this.canvas ||
      !context ||
      !this.replay ||
      highestFrame === undefined
    ) {
      return;
    }
    this.highestFrame = highestFrame;
    this.game = await Game.create(
      this.replay,
      this.canvas,
      this.dark,
      this.replay.highlights.length > 0
        ? this.replay.highlights[0].startFrame
        : -123,
    );
    this.game.resize(this.canvas.width, this.canvas.height);
    this.game.onTick(
      (currentFrameNumber: number) => (this.currentFrame = currentFrameNumber),
    );
  }

  private clicked() {
    if (this.slider) {
      this.game?.setFrame(this.slider.value);
    }
  }

  private captureGif() {
    const context = this.canvas?.getContext('2d');
    if (!context || !this.canvas || !this.game) {
      return;
    }
    this.game.setPause();
    this.game.resize(960, 720);
    const gif = new GIF({
      workers: 4,
      quality: 10,
      width: this.canvas.width,
      height: this.canvas.height,
      background: '#fff',
    });
    gif.on('finished', (blob: Blob, _data: Uint8Array) => {
      window.open(URL.createObjectURL(blob));
    });

    for (let i = 0; i < 600; i = i + 3) {
      // TODO: this is a little sped up. The GIF renders 2 frames in
      // 30ms while game advances 32ms, becausethe gif spec only stores
      // framerate in centiseconds, which doesn't line up =[
      gif.addFrame(context, { copy: true, delay: 33 });
      this.game.tick();
      this.game.tick();
      //this.game.tick();
    }
    gif.render();
  }

  render() {
    return html`
      <div class="container">
        <canvas
          width="1000"
          height="1000"
          @click=${() => this.game?.togglePause()}
        ></canvas>
        <div class="controls">
          <sp-slider
            hide-value-label
            label="${this.currentFrame}/${this.highestFrame}"
            variant="filled"
            min="-123"
            max=${this.highestFrame}
            .value=${this.currentFrame}
            @change=${this.clicked}
            @input=${this.clicked}
          ></sp-slider>
        </div>
      </div>
    `;
  }
}
