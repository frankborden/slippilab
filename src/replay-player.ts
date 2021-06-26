import { css, html, LitElement, PropertyValues } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import type { Replay } from 'src/replay-select';

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

  updated(changes: PropertyValues<ReplayPlayer>) {
    if (changes.has('replay')) {
      this.replayChanged();
    }
  }

  replayChanged() {
    const player = this.renderRoot.querySelector('iframe')?.contentWindow;
    if (!player) {
      return;
    }
    // @ts-ignore
    player.start(this.replay);
  }

  render() {
    return html` <iframe src="slippi-visualiser/dist/index.html"></iframe>`;
  }
}
