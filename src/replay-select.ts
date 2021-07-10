import { css, html, LitElement } from 'lit';
import { customElement } from 'lit/decorators.js';
import 'wired-elements';

@customElement('replay-select')
export class ReplaySelect extends LitElement {
  static get styles() {
    return css`
      input {
        display: none;
      }
      .label {
        display: inline-block;
        cursor: pointer;
      }
    `;
  }

  private async filesSelected() {
    const inputs = Array.from(this.renderRoot.querySelectorAll('input'));
    const files = inputs
      .map((input) => input.files)
      .filter((fileList): fileList is FileList => fileList !== null)
      .flatMap((fileList) => Array.from(fileList));
    if (!files || files.length === 0) {
      return;
    }
    const replaySelectedEvent = new CustomEvent<File[]>('replays-selected', {
      detail: files,
    });
    this.dispatchEvent(replaySelectedEvent);
  }

  render() {
    return html`
      <label for="replay-input-files">
        <wired-button class="label" elevation="2" disabled>
          Open File
        </wired-button>
      </label>
      <input
        id="replay-input-files"
        name="replay-input-files"
        type="file"
        accept=".slp"
        multiple
        @change=${this.filesSelected}
      />
      <label for="replay-input-dir">
        <wired-button class="label" elevation="2" disabled>
          Open Folder
        </wired-button>
      </label>
      <input
        id="replay-input-dir"
        name="replay-input-dir"
        type="file"
        webkitdirectory
        @change=${this.filesSelected}
      />
    `;
  }
}
