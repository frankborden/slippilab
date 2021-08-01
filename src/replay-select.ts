import { css, html, LitElement } from 'lit';
import { customElement } from 'lit/decorators.js';
import '@spectrum-web-components/action-button/sp-action-button';

@customElement('replay-select')
export class ReplaySelect extends LitElement {
  static get styles() {
    return css`
      input {
        display: none;
      }
    `;
  }

  private async filesSelected() {
    // TODO: clear selections and remove focus from buttons
    const inputs = Array.from(this.renderRoot.querySelectorAll('input'));
    const files = inputs
      .map((input) => input.files)
      .filter((fileList): fileList is FileList => fileList !== null)
      .flatMap((fileList) => Array.from(fileList));
    inputs.forEach((input) => input.blur());
    this.renderRoot.querySelectorAll('sp-action-button').forEach((actionButton) => actionButton.blur());
    if (!files || files.length === 0) {
      return;
    }
    const replaySelectedEvent = new CustomEvent<File[]>('replays-selected', {
      detail: files,
    });
    this.dispatchEvent(replaySelectedEvent);
  }

  private openFile() {
    this.renderRoot
      .querySelector<HTMLInputElement>('#replay-input-files')
      ?.click();
  }

  private openFolder() {
    this.renderRoot
      .querySelector<HTMLInputElement>('#replay-input-dir')
      ?.click();
  }
  render() {
    return html`
      <sp-action-button class="label" @click=${this.openFile}>
        Open File
      </sp-action-button>
      <input
        id="replay-input-files"
        name="replay-input-files"
        type="file"
        accept=".slp"
        multiple
        @change=${this.filesSelected}
      />
      <sp-action-button class="label" @click=${this.openFolder}>
        Open Folder
      </sp-action-button>
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
