import { css, html, LitElement } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import '@spectrum-web-components/action-button/sp-action-button';
import '@spectrum-web-components/icons/sp-icons-medium';
import '@spectrum-web-components/icon/sp-icon';

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
    model.jumpToFile(this.files[Number(select.value)]);
    select.blur();
  }

  private next(e: Event) {
    const arrow = e.currentTarget as HTMLElement;
    model.nextFile();
    arrow.blur();
  }

  private prev(e: Event) {
    const arrow = e.currentTarget as HTMLElement;
    model.prevFile();
    arrow.blur();
  }

  static get styles() {
    return css`
      .container {
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
      }
      .arrow-container {
        display: flex;
        justify-content: space-evenly;
      }
      .flipped {
        transform: scaleX(-1);
      }
    `;
  }

  render() {
    return html`
      <div class="container">
        <div class="arrow-container">
          <sp-icons-medium></sp-icons-medium>
          <sp-action-button quiet size="m" @click=${this.prev}>
            <sp-icon class="flipped" name="ui:Arrow100"></sp-icon>
          </sp-action-button>
          <sp-action-button quiet size="m" @click=${this.next}>
            <sp-icon name="ui:Arrow100"></sp-icon>
          </sp-action-button>
        </div>
        <select size="30" @change=${this.selected}>
          ${this.files.map(
            (file, index) =>
              html`
                <option
                  value=${index}
                  ?selected=${this.currentFileIndex === index}
                >
                  ${file.webkitRelativePath ?? file.name}
                </option>
              `,
          )}
        </select>
      </div>
    `;
  }
}
