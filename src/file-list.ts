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
    model.state$.subscribe((state) => {
      this.files = state.files;
      this.currentFileIndex = state.currentFileIndex;
    });
  }

  private selected(e: Event) {
    const select = e.currentTarget as HTMLSelectElement;
    model.jumpTo(this.files[Number(select.value)]);
    select.blur();
  }

  static get styles() {
    return css`
      .container {
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
      }
    `;
  }

  render() {
    return html`
      <div class="container">
        <select size="30" @change=${this.selected}>
          ${this.files.map(
            (file, index) =>
              html`<option
                value=${index}
                ?selected=${this.currentFileIndex === index}
              >
                ${
                  // @ts-expect-error
                  file.webkitRelativePath
                    ?? file.name}
              </option>`,
          )}
        </select>
      </div>
    `;
  }
}