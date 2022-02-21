import { css, html, LitElement } from 'lit';
import { customElement, query, queryAll } from 'lit/decorators.js';
import '@spectrum-web-components/action-button/sp-action-button';
import type { ActionButton } from '@spectrum-web-components/action-button';
import { model } from './model';

@customElement('replay-select')
export class ReplaySelect extends LitElement {
  static get styles() {
    return css`
      input {
        display: none;
      }
      .container {
        display: flex;
        justify-content: center;
      }
    `;
  }

  @query('#replay-input-files')
  private filesInput?: HTMLInputElement;

  @query('#replay-input-dir')
  private dirInput?: HTMLInputElement;

  @queryAll('input')
  private inputs?: NodeListOf<HTMLInputElement>;

  @queryAll('sp-action-button')
  private actionButtons?: NodeListOf<ActionButton>;

  private async filesSelected() {
    if (!this.inputs) {
      return;
    }
    // TODO: clear selections. input.value='' did weird stuff.
    const files = Array.from(this.inputs)
      .map((input) => input.files)
      .filter((fileList): fileList is FileList => fileList !== null)
      .flatMap((fileList) => Array.from(fileList));
    this.inputs.forEach((input) => input.blur());
    this.actionButtons?.forEach((actionButton) => actionButton.blur());
    if (!files || files.length === 0) {
      return;
    }
    model.setFiles(files);
  }

  private openFile() {
    this.filesInput?.click();
  }

  private openFolder() {
    this.dirInput?.click();
  }

  render() {
    return html`
      <div class="container">
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
      </div>
    `;
  }
}
