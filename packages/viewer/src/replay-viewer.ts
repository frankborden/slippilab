import { css, html, LitElement } from 'lit';
import type { PropertyValues } from 'lit';
import { customElement, property, query, state } from 'lit/decorators.js';
import '@spectrum-web-components/slider/sp-slider';
import type { Slider } from '@spectrum-web-components/slider';
import type { ReplayData } from '@slippilab/common';
import type { Highlight } from '@slippilab/search';
import { parseReplay } from '@slippilab/parser';
import { Game } from './game';

@customElement('replay-viewer')
export class ReplayViewer extends LitElement {
  static get styles() {
    return css`
      .container {
        position: relative;
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: center;
      }
      div {
        align-self: center;
      }
      canvas {
        flex-grow: 1;
      }
      sp-slider {
        position: absolute;
        left: 0;
        bottom: 0;
        width: 100%;
      }
    `;
  }
  @property({ type: Object })
  replayData?: ReplayData;

  @property({ type: Object })
  replayFile?: File;

  @property({ type: String })
  replayUrl?: string;

  @property({ type: Object })
  highlight?: Highlight;

  @property({ type: Boolean })
  dark = false;

  @property({ type: Boolean })
  debug = false;

  @state()
  private currentFrame = 123;

  @query('canvas')
  private canvas?: HTMLCanvasElement;

  @query('sp-slider')
  private slider?: Slider;

  private game?: Game;
  private keyUpListener?: (e: KeyboardEvent) => void;
  private keyDownListener?: (e: KeyboardEvent) => void;

  private onKeyUp(e: KeyboardEvent): void {
    switch (e.key) {
      case 'ArrowUp':
      case 'ArrowDown':
        this.game?.setNormalSpeed();
        break;
    }
  }

  private onKeyDown(e: KeyboardEvent): void {
    if (!this.replayData) {
      return;
    }
    switch (e.key) {
      case ' ':
        this.game?.togglePause();
        break;
      case 'ArrowLeft':
        this.game?.setFrame(Math.max(0, this.currentFrame - 120));
        break;
      case 'ArrowRight':
        this.game?.setFrame(
          Math.min(this.replayData.frames.length - 1, this.currentFrame + 120),
        );
        break;
      case 'ArrowUp':
        this.game?.setFastSpeed();
        break;
      case 'ArrowDown':
        this.game?.setSlowSpeed();
        break;
      case '.':
        this.game?.setPause();
        this.game?.setFrame(
          Math.min(this.replayData.frames.length - 1, this.currentFrame + 1),
        );
        break;
      case ',':
        this.game?.setPause();
        this.game?.setFrame(Math.max(0, this.currentFrame - 1));
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
  }

  override connectedCallback(): void {
    super.connectedCallback();
    window.addEventListener(
      'keyup',
      (this.keyUpListener = (e) => this.onKeyUp(e)),
    );
    window.addEventListener(
      'keydown',
      (this.keyDownListener = (e) => this.onKeyDown(e)),
    );
  }

  override disconnectedCallback(): void {
    this.game?.stop();
    this.game = undefined;
    if (this.keyUpListener) {
      window.removeEventListener('keyup', this.keyUpListener);
    }
    if (this.keyDownListener) {
      window.removeEventListener('keydown', this.keyDownListener);
    }
    super.disconnectedCallback();
  }

  override firstUpdated() {
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
        const baseContext = this.canvas.getContext('2d');
        if (baseContext) {
          baseContext.save();
          baseContext.fillStyle = 'black';
          baseContext.font = `${this.canvas.height / 80}px Verdana`;
          baseContext.textAlign = 'center';
          baseContext?.fillText(
            'Loading and caching animations',
            this.canvas.width / 2,
            this.canvas.height / 2,
          );
          baseContext.restore();
        }
      }
    });

    resizeObserver.observe(this.canvas);
  }

  async updated(oldValues: PropertyValues<ReplayViewer>) {
    if (oldValues.has('dark')) {
      this.game?.setDarkMode(this.dark);
    }
    if (oldValues.has('debug')) {
      this.game?.setDebugMode(this.debug);
    }
    if (
      oldValues.has('replayData') ||
      oldValues.has('replayFile') ||
      oldValues.has('replayUrl')
    ) {
      await this.setup();
    }
    if (oldValues.has('highlight')) {
      if (this.highlight) {
        // Start 30 frames early for context
        this.game?.setFrame(Math.max(0, this.highlight.startFrame - 30));
      }
    }
  }

  private async setup() {
    if (
      !this.canvas ||
      (!this.replayData && !this.replayUrl && !this.replayFile)
    ) {
      return;
    }
    if (!this.replayData) {
      if (this.replayFile) {
        this.replayData = parseReplay(await this.replayFile.arrayBuffer());
      } else if (this.replayUrl) {
        const response = await fetch(this.replayUrl);
        this.replayData = parseReplay(
          await (await response.blob()).arrayBuffer(),
        );
      } else {
        return;
      }
    }
    this.currentFrame = 0;
    if (!this.game) {
      this.game = new Game(this.canvas, this.dark, this.debug);
      this.game.resize(this.canvas.width, this.canvas.height);
      this.game.onTick(
        (currentFrameNumber) => (this.currentFrame = currentFrameNumber),
      );
    }
    this.game.loadReplay(this.replayData, 0);
  }

  private clicked() {
    if (this.slider) {
      this.game?.setFrame(this.slider.value + 123);
    }
  }

  render() {
    const currentFrame = `${this.currentFrame - 123}`;
    const lastFrame = (this.replayData?.frames?.length ?? 124) - 1 - 123;
    const progress = `${currentFrame}/${lastFrame}`;
    return html`
      <div class="container">
        <canvas
          width="400"
          height="200"
          ?hidden="${!this.replayData}"
          @click=${() => this.game?.togglePause()}
        ></canvas>
        <sp-slider
          hide-value-label
          label="${progress}"
          ?hidden="${!this.replayData}"
          variant="filled"
          min="0"
          max=${lastFrame}
          .value=${currentFrame}
          @change=${this.clicked}
          @input=${this.clicked}
        ></sp-slider>
        <div ?hidden="${Boolean(this.replayData)}">Waiting for game...</div>
      </div>
    `;
  }
}
