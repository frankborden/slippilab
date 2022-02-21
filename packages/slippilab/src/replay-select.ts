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

  @queryAll('sp-action-button')
  private actionButtons?: NodeListOf<ActionButton>;

  private async directorySelected() {
    this.selectFiles(this.dirInput);
  }

  private async filesSelected() {
    this.selectFiles(this.filesInput);
  }

  private async selectFiles(input?: HTMLInputElement) {
    if (!input?.files) {
      return;
    }
    if (input.files.length > 0) {
      model.setFiles(Array.from(input.files));
    }
    this.actionButtons?.forEach((actionButton) => actionButton.blur());
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
          accept=".slp,.zip"
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
          @change=${this.directorySelected}
        />
      </div>
    `;
  }
}
