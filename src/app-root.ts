import { LitElement, html, css } from 'lit';
import { customElement } from 'lit/decorators.js';
import { SlippiGame } from '@slippi/slippi-js';
@customElement('app-root')
export class AppRoot extends LitElement {
  static get styles() {
    return css`
      h1 {
        font-size: 4rem;
      }
      .wrapper {
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        height: 100vh;
        background-color: lightgreen;
        font-size: 24px;
      }
      .link {
        color: white;
      }
    `;
  }

  private async fileSelected() {
    const file = this.renderRoot.querySelector('input')?.files?.[0];
    if (!file) {
      return;
    }
    const buffer = await file.arrayBuffer();
    const game = new SlippiGame(buffer);
    console.log(game.getFrames()[0].players[0]?.post);
  }

  render() {
    return html`
      <div class="wrapper">
        <h1>Search</h1>
        <input type="file" @change="${this.fileSelected}" />
      </div>
    `;
  }
}
