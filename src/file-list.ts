import { css, html, LitElement } from 'lit';
import { customElement, state } from 'lit/decorators.js';

import { model } from './model';

@customElement('file-list')
export class FileList extends LitElement {
  @state()
  private files: File[] = [];

  @state()
  private currentFileIndex? = -1;

  constructor() {
    super();
    model.replayOutput$.subscribe((state) => {
      this.files = state.files;
      this.currentFileIndex = state.currentFileIndex;
    });
  }
  static get styles() {
    return css`
      select {
        width: 100%;
        height: 100%;
      }
    `;
  }
  render() {
    return html`
      <select multiple>
        ${this.files.map(
          (file, index) =>
            html`<option ?selected=${this.currentFileIndex === index}>
              ${file.name}
            </option>`,
        )}
      </select>
    `;
  }
}
