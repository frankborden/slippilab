import { css, html, LitElement, PropertyValues } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import type { Replay } from 'src/replay-select';

// slippi-visualiser/src/js/main.js
interface SlippiVisualiser extends Window {
  start(replay: Replay): void;
}
@customElement('replay-player')
export class ReplayPlayer extends LitElement {
  static get styles() {
    return css`
      iframe {
        width: 100%;
        height: 100%;
      }
    `;
  }

  @property({ type: Object })
  replay?: Replay;

  updated(oldValues: PropertyValues<ReplayPlayer>) {
    if (oldValues.has('replay')) {
      this.replayChanged(oldValues.get('replay') as Replay | undefined);
    }
  }

  private playerLoaded() {
    if (this.replay) {
      this.playReplay();
    }
  }

  private replayChanged(oldReplay?: Replay) {
    if (oldReplay) {
      // iframe load event handler will play the replay once it's ready
      this.resetPlayer();
    } else {
      this.playReplay();
    }
  }

  private playReplay() {
    const player = this.renderRoot.querySelector('iframe')
      ?.contentWindow as SlippiVisualiser;
    if (!player || !this.replay) {
      return;
    }
    player.start(this.replay);
  }

  private resetPlayer() {
    const frame = this.renderRoot.querySelector('iframe');
    if (!frame) {
      return;
    }
    // adjusting src string will trigger a reload
    frame.src += '';
  }

  render() {
    return html`<iframe
      src=slippi-visualiser/dist/index.html
      @load=${this.playerLoaded}
    ></iframe>`;
  }
}
