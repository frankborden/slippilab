import { css, html, LitElement } from 'lit';
import { customElement, state } from 'lit/decorators.js';

import { model } from './model';

@customElement('file-list')
export class FileList extends LitElement {
  @state()
  private files: File[] = [];

  @state()
  private currentFileIndex?: number;

  constructor() {
    super();
    model.replayOutput$.subscribe((state) => {
      this.files = state.files;
      console.log(this.files);
      this.currentFileIndex = state.currentFileIndex;
      console.log(this.currentFileIndex);
    });
  }

  private selected(e: Event) {
    const select = e.currentTarget as HTMLSelectElement;
    model.jumpTo(this.files[Number(select.value)]);
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
      <select multiple @change=${this.selected}>
        ${this.files.map(
          (file, index) =>
            html`<option
              value=${index}
              ?selected=${this.currentFileIndex === index}
            >
              ${file.name}
            </option>`,
        )}
      </select>
    `;
  }
}
